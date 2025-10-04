import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaEdit, FaDownload } from "react-icons/fa";

import cloudLogo from "../../assets/icon.png";
import sunImg from "../../assets/2.png";
import cloudImg from "../../assets/4.png";
import rainImg from "../../assets/1.png";

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState(null);

  const [weather, setWeather] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/events/all`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data?.data?.events) {
        setEvents(data.data.events);
      } else {
        setEvents([]);
      }
      setShowEvents(true);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setError("Could not load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleShowEvents = () => {
    if (!showEvents) {
      fetchEvents();
    } else {
      setShowEvents(false);
      setError(null);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}/weather`);
  };

  const handleAddEvent = () => {
    navigate("/create");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ⭐ إضافة للمفضلة
  const handleAddToFavorites = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/events/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      alert("تمت الإضافة إلى المفضلة ✅");
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  // ✏️ تعديل الحدث
  const handleEditEvent = (eventId) => {
    navigate(`/events/${eventId}/edit`);
  };

  // ⬇️ تحميل CSV
  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/events/download-csv`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "events.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/user/predict-three-days`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.status === "success" && data.data?.forecastNext3Days_mm) {
          const forecast = data.data.forecastNext3Days_mm.map((val, i) => ({
            day: `Day ${i + 1}`,
            rain: Number(val).toFixed(2),
          }));
          setWeather(forecast);
        } else {
          setWeather([]);
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [API_URL]);

  const getWeatherIcon = (rain) => {
    if (rain < 1) return sunImg;
    if (rain < 5) return cloudImg;
    return rainImg;
  };

  return (
    <div
      className="min-h-screen font-sans p-6 
      bg-gradient-to-br from-[#5076B4] to-[#C48EF1] text-gray-900     
      dark:from-[#002E78] dark:to-[#160524] dark:text-white"
    >
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <img src={cloudLogo} alt="logo" className="h-12 drop-shadow-lg" />

          <button
            onClick={handleAddEvent}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md 
            px-6 py-2 rounded-full font-medium 
            text-white hover:bg-white/30 transition shadow-md"
          >
            + Add Event
          </button>

          <button
            onClick={handleShowEvents}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md 
            px-6 py-2 rounded-full font-medium 
            text-white hover:bg-white/30 transition shadow-md"
          >
            {showEvents ? "Hide Events" : "Show Events"}
          </button>

          <button
            onClick={handleDownloadCSV}
            className="bg-green-500 px-6 py-2 rounded-full font-medium 
            text-white hover:bg-green-600 transition shadow-md"
          >
            <FaDownload className="inline mr-2" /> Download CSV
          </button>
        </div>
      </div>

      <div className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-wide">
          Welcome to <span className="text-yellow-300">Know Before You Go</span>
        </h1>
        <p className="text-base text-gray-800 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Your smart assistant to check the weather, plan your events, and stay
          prepared 🌦️
        </p>
      </div>

      {showEvents && (
        <div className="mb-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-5 text-center">Your Events</h2>
          {loadingEvents && <p className="text-center">Loading events...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!loadingEvents && !error && events.length === 0 && (
            <p className="text-center text-gray-500">No events found.</p>
          )}
          {!loadingEvents && !error && events.length > 0 && (
            <ul className="space-y-4">
              {events.map((ev) => (
                <li
                  key={ev.eventId}
                  className="bg-white shadow-lg dark:bg-white/10 rounded-lg p-5 transition"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="cursor-pointer flex-1 text-center"
                      onClick={() => handleEventClick(ev.eventId)}
                    >
                      <h3 className="text-lg font-semibold">{ev.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(ev.date).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3 ml-4">
                      <button
                        onClick={() => handleAddToFavorites(ev.eventId)}
                        className="text-yellow-400 hover:text-yellow-500"
                      >
                        <FaStar size={20} />
                      </button>
                      <button
                        onClick={() => handleEditEvent(ev.eventId)}
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <FaEdit size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Weather Forecast (3 Days)
        </h2>
        {loadingWeather ? (
          <p className="text-center">Loading weather...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {weather.map((day, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-xl p-6 text-center hover:scale-105 
                transition transform dark:bg-white/10 backdrop-blur-md"
              >
                <h3 className="text-xl font-semibold mb-3">{day.day}</h3>
                <img
                  src={getWeatherIcon(day.rain)}
                  alt="weather-icon"
                  className="h-16 mx-auto mb-3"
                />
                <p className="text-lg font-bold">{day.rain} mm</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Rainfall prediction
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-16">
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
