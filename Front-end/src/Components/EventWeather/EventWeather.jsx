import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import sunImg from "../../assets/2.png";     
import cloudImg from "../../assets/4.png";  
import rainImg from "../../assets/1.png";    

export default function EventWeather() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://know-before-you-go-nasa-space-25.vercel.app";

  useEffect(() => {
    if (!eventId) {
      setError("No event id provided in route.");
      setLoading(false);
      return;
    }

    const fetchEventWeather = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const url = `${API_URL}/api/events/${encodeURIComponent(eventId)}/weather`;
        console.log("Fetching event weather URL:", url);

        const res = await fetch(url, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });

        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          throw new Error("Server returned non-JSON response");
        }

        if (!res.ok) {
          const serverMsg = data?.data?.message || data?.message || `HTTP ${res.status}`;
          throw new Error(serverMsg);
        }

        if (data?.status === "success" && data.data) {
          setWeather(data.data);
        } else {
          throw new Error(data?.message || "No weather data found for this event.");
        }
      } catch (err) {
        console.error("Error fetching event weather:", err);
        setError(err.message || "Failed to fetch event weather");
      } finally {
        setLoading(false);
      }
    };

    fetchEventWeather();
  }, [eventId, API_URL, navigate]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!weather) return <div className="p-6 text-gray-500">No weather available.</div>;

  const rainVal = weather.rawData?.predictedRain_mm_day ?? 0;
  const icon =
    rainVal < 1 ? sunImg : rainVal < 5 ? cloudImg : rainImg;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#5076B4] to-[#C48EF1] 
      dark:from-[#002E78] dark:to-[#160524] text-gray-900 dark:text-white flex flex-col items-center">
      
      <button
        onClick={() => navigate(-1)}
        className="mb-8 px-6 py-2 bg-[#274BDB] text-white rounded-full shadow hover:bg-[#3a5cfa] transition"
      >
        Back
      </button>

      <div className="bg-white/10 dark:bg-white/10 p-8 rounded-2xl shadow-lg text-center max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-4">{weather.title || "Event Weather"}</h2>
        <p className="mb-4 text-gray-200">
          📍 {weather.latitude}, {weather.longitude}
        </p>

        <img src={icon} alt="weather-icon" className="h-20 mx-auto mb-4" />

        <p><strong>Date:</strong> {new Date(weather.date).toLocaleString()}</p>
        <p><strong>Temperature:</strong> {weather.rawData?.temperature} °C</p>
        <p><strong>Wind Speed:</strong> {weather.rawData?.windSpeed} km/h</p>
        <p><strong>Rain Prediction:</strong> {rainVal} mm/day</p>
        <p><strong>Comfort:</strong> {weather.interpreted?.comfortCondition}</p>
        <p><strong>Recommendation:</strong> {weather.interpreted?.recommendation}</p>
      </div>
    </div>
  );
}
