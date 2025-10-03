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
 if (!location || !location.lat || !location.lng) {
  alert("Please select a location on the map.");
  return;
  }

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

    navigate("/home");
  } catch (err) {
    console.error(err);
    alert("There was a problem creating the event");
  }
};

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Add Event</h2>

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
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label>Date & Time:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label>Recurrence:</label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create Event
        </button>
      </form>

      <button
        onClick={() => navigate("/home")}
        className="mt-4 text-blue-500 underline"
      >
        Show Events
      </button>
    </div>
  );
}
