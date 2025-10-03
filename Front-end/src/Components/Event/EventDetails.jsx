import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const API_URL = "https://know-before-you-go-nasa-space-25.vercel.app"
  useEffect(() => {
    let isMounted = true; 

    const fetchEventWeather = async () => {
      if (!eventId || !API_URL) {
          if (isMounted) {
            setError("Configuration/ID Error. Check VITE_API_URL or event ID.");
            setLoading(false);
          }
          return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const url = `${API_URL}/api/events/${eventId}/weather`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log('Fetching URL:', url);
        const text = await res.text();
        
        let data = {};
        try {
            data = JSON.parse(text); 
        } catch (parseError) {
            if (isMounted) setError(`Non-JSON response from server: ${text}`);
            return;
        }
        
        console.log("Raw response (Object):", data); 

        if (!res.ok) {
          if (isMounted) {
            throw new Error(data.data?.message || data.message || `API Error: ${res.status}`);
          }
        }

        if (isMounted) {
          if (data.status === "success" && data.data) {
            setEventData(data.data);
          } else {
            setError(data.message || "Weather data structure is invalid.");
          }
        }

      } catch (err) {
        if (isMounted) setError(err.message || "Network error occurred."); 
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEventWeather();

    return () => {
      isMounted = false;
    };

  }, [eventId, API_URL]); 

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!eventData) return null;

  return (
    <div className="p-6 font-sans text-white"> 
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-[#274BDB] px-4 py-2 rounded text-white hover:bg-[#3a5cfa]"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-4">{eventData.title}</h1>
      <p className="mb-2">Date: {new Date(eventData.date).toLocaleString()}</p>
      <p className="mb-4">
        Location: Latitude {eventData.latitude}, Longitude {eventData.longitude}
      </p>

      <h2 className="text-2xl font-semibold mb-2">Weather Details</h2>
      <div className="bg-white/10 p-4 rounded-md max-w-md">
        <p>
          <strong>Temperature:</strong> {eventData.interpreted.temperature} ({eventData.rawData.temperature}°C)
        </p>
        <p>
          <strong>Wind:</strong> {eventData.interpreted.wind} ({eventData.rawData.windspeed || eventData.rawData.windSpeed} km/h)
        </p>
        <p>
          <strong>Rain Prediction:</strong> {eventData.interpreted.rain} ({eventData.rawData.predictedRain_mm_day} mm/day)
        </p>
        <p>
          <strong>ESI Score:</strong> {eventData.interpreted.esi}
        </p>
        <p>
          <strong>Comfort Condition:</strong> {eventData.interpreted.comfortCondition}
        </p>
        <p>
          <strong>Recommendation:</strong> {eventData.interpreted.recommendation}
        </p>
      </div>
    </div>
  );
}