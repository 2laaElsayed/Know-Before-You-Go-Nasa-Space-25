import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onSelect({ lat, lng });
    },
  });

  return position ? <Marker position={position}></Marker> : null;
}

export default function AddEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create an event.");
      navigate("/login");
      return;
    }

    if (!location?.lat || !location?.lng) {
      alert("Please select a location on the map.");
      return;
    }

    const payload = {
      title,
      date,
      location: {
        lat: location.lat,
        lon: location.lng,
      },
      recurrence,
      notes,
    };

    try {
      const res = await fetch(`${API_URL}/api/events/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error creating event");
      }

      const eventId = data?.data?.eventId;

      if (eventId) {
        navigate(`/events/${eventId}/weather`);
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      alert("There was a problem creating the event");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[#002E78] to-[#160524] dark:from-[#C48EF1] dark:to-[#5076B4]">
  <h2 className="text-2xl mb-4 text-white">Add Event</h2>

  <div className="mb-4 h-64">
    <MapContainer center={[30.0, 31.0]} zoom={6} style={{ height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker onSelect={(loc) => setLocation(loc)} />
    </MapContainer>
  </div>

  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="text-white">Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/20 dark:text-white dark:placeholder-gray-400"
        required
      />
    </div>
    <div>
      <label className="text-white">Date & Time:</label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border rounded p-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/20 dark:text-white dark:placeholder-gray-400"
        required
      />
    </div>
    <div>
      <label className="text-white">Recurrence:</label>
      <select
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value)}
        className="w-full border rounded p-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/20 dark:text-white dark:placeholder-gray-400"
      >
        <option value="none">None</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
    </div>
    <div>
      <label className="text-white">Notes:</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border rounded p-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-black/20 dark:text-white dark:placeholder-gray-400"
      />
    </div>
    <button
      type="submit"
      className="px-4 py-2 bg-gradient-to-r from-[#002E78] to-[#160524] text-white rounded hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:from-[#C48EF1] dark:to-[#5076B4]"
    >
      Create Event
    </button>
  </form>
</div>

  );
}
