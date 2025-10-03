import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import icon1 from "../../assets/1.png";
import icon2 from "../../assets/2.png";
import icon3 from "../../assets/3.png";
import icon4 from "../../assets/4.png";
import icon5 from "../../assets/5.png";
import cloudLogo from "../../assets/icon.png";

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://know-before-you-go-nasa-space-25.vercel.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchEvents = async () => {
  try {
    const res = await fetch('/api/events/all');
    const data = await res.json();
    if (data.data && data.data.events) {
      setEvents(data.data.events);
    } else {
      setEvents([]);
    }
    setShowEvents(true);
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
};


  const handleShowEvents = () => {
    if (!showEvents) {
      fetchEvents();
      setShowEvents(true);
    } else {
      setShowEvents(false);
      setError(null);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleAddEvent = () => {
    navigate("/create");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const cities = [
    { name: "Cairo", temp1: "+31.2°", temp2: "+30.22°", description: "Clear sky", icon: icon1 },
    { name: "London", temp1: "+30.22°", temp2: "+29.12°", description: "Cloudy sky", icon: icon2 },
    { name: "Sydney", temp1: "+30.22°", temp2: "+30.22°", description: "Clear sky", icon: icon3 },
    { name: "Tokyo", temp1: "+31.2°", temp2: "+30.22°", description: "Clear sky", icon: icon4 },
    { name: "Dubai", temp1: "+31.2°", temp2: "+30.22°", description: "Rainy street", icon: icon5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1F44] to-[#1E2A78] text-white font-sans p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <img src={cloudLogo} alt="logo" className="h-10" />
          <input
            type="button"
            value="Add Event"
            onClick={handleAddEvent}
            className="bg-[#274BDB] px-6 py-2 rounded-full text-white cursor-pointer hover:bg-[#3a5cfa] transition"
          />
          <input
            type="button"
            value={showEvents ? "Hide Events" : "Show Events"}
            onClick={handleShowEvents}
            className="bg-[#274BDB] px-6 py-2 rounded-full text-white cursor-pointer hover:bg-[#3a5cfa] transition ml-4"
          />
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>Sun, 18 May</span>
          <span>🌥️ Cloudy!</span>
          <span className="text-gray-300">
            The future looks <span className="text-white font-bold">bright</span> — stay tuned!
          </span>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="mb-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-sm text-gray-300">
          At SeifSkies, we believe weather shouldn't just be data, it should be clear, beautiful, and useful.
          <br />
          This app was created to help you stay prepared for your day with accurate forecasts, stunning visuals,
          and smart features that make checking the weather feel less like a chore and more like a glance at the sky.
        </p>
        <img src={cloudLogo} alt="logo" className="h-10" />
      </div>

      {/* Show Events Section */}
      {showEvents && (
        <div className="mb-10 max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Your Events</h2>
          {loadingEvents && <p>Loading events...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loadingEvents && !error && events.length === 0 && <p>No events found.</p>}
          {!loadingEvents && !error && events.length > 0 && (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li
                  key={ev._id}
                  className="cursor-pointer bg-white/10 p-4 rounded-md hover:bg-white/20 transition"
                  onClick={() => handleEventClick(ev._id)}
                >
                  <h3 className="text-lg font-semibold">{ev.title}</h3>
                  <p className="text-gray-300">{new Date(ev.date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Cities Weather */}
      <h2 className="text-2xl font-semibold mb-4">Major Cities Weather</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {cities.map((city, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center shadow-md"
          >
            <h3 className="text-xl font-medium mb-2">{city.name}</h3>
            <img src={city.icon} alt={city.description} className="mx-auto h-12 mb-2" />
            <p className="text-sm">
              {city.temp1} <span className="text-gray-300">|</span> {city.temp2}
            </p>
            <p className="text-gray-300 text-sm mt-1">{city.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="text-red-400 hover:text-red-500 transition text-xs mt-10"
      >
        Logout
      </button>
    </div>
  );
}
