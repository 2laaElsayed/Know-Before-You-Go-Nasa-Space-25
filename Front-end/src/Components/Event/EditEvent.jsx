import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({ position, onSelect }) {
  const [markerPos, setMarkerPos] = useState(position || null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPos({ lat, lng });
      onSelect({ lat, lng });
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

export default function EditEvent() {
const { eventId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch event");

        setTitle(data.data.title);
        setDate(data.data.date);
        setRecurrence(data.data.recurrence);
        setNotes(data.data.notes);
        setLocation({
          lat: data.data.location.lat,
          lng: data.data.location.lon,
        });
      } catch (err) {
        console.error(err);
        alert("Error loading event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!location?.lat || !location?.lng) {
      alert("Please select a location on the map.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      date,
      recurrence,
      notes,
      location: { lat: location.lat, lon: location.lng },
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update event");

      alert("Event updated successfully!");
      navigate(`/events/${eventId}/weather`);
    } catch (err) {
      console.error(err);
      alert("Error updating event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading event details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5076B4] to-[#C48EF1] dark:from-[#002E78] dark:to-[#160524] text-gray-900 dark:text-white flex flex-col items-center justify-center p-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold mb-10 drop-shadow-md text-center">
        Edit Event
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl bg-white/30 dark:bg-white/5 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 transition-all">
        {/* Left Side - Map */}
        <div className="w-full lg:w-1/2 h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <MapContainer
            center={
              location ? [location.lat, location.lng] : [30.0, 31.0]
            }
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker
              position={location}
              onSelect={(loc) => setLocation(loc)}
            />
          </MapContainer>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 flex flex-col gap-5 justify-between"
        >
          <div>
            <label className="block mb-1 text-sm font-semibold opacity-80">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-white/20 rounded-lg p-2 bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5076B4]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold opacity-80">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-white/20 rounded-lg p-2 bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5076B4]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold opacity-80">
              Recurrence
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="w-full border border-white/20 rounded-lg p-2 bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5076B4]"
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold opacity-80">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full border border-white/20 rounded-lg p-2 bg-white/40 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5076B4]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 py-2 bg-gradient-to-br from-[#5076B4] to-[#C48EF1] dark:from-[#002E78] dark:to-[#160524] text-gray-900 dark:text-white font-semibold hover:opacity-90 transition-all"
          >
            {submitting ? "Updating..." : "Update Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
