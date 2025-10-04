import { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // جلب بيانات الحدث
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events/edit/${eventId}`);
        console.log("Fetch URL:", res.url);
        console.log("Status:", res.status);

        if (!res.ok) throw new Error("Failed to fetch event");

        const data = await res.json();
        const event = data.data?.event;

        if (event) {
          setTitle(event.title || "");
          setDate(event.date ? event.date.substring(0, 16) : "");
          setRecurrence(event.recurrence || "none");
          setNotes(event.notes || "");
          if (event.location?.lat && event.location?.lon) {
            setLocation({ lat: event.location.lat, lng: event.location.lon });
          }
        } else {
          alert("Event not found");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching event");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, API_URL, navigate]);

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
      const res = await fetch(`${API_URL}/api/events/edit/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("PUT URL:", res.url);
      console.log("PUT Status:", res.status);

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

  if (loading) return <p className="p-6 text-white">Loading event...</p>;

  return (
    <div className="p-6 bg-gradient-to-br from-[#002E78] to-[#160524] dark:from-[#C48EF1] dark:to-[#5076B4] min-h-screen">
      <h2 className="text-2xl mb-4 text-white">Edit Event</h2>

      <div className="mb-4 h-64">
        <MapContainer
          center={location ? [location.lat, location.lng] : [30.0, 31.0]}
          zoom={6}
          style={{ height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <LocationMarker position={location} onSelect={(loc) => setLocation(loc)} />
        </MapContainer>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-white">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2 bg-white/20 text-white"
            required
          />
        </div>

        <div>
          <label className="text-white">Date & Time:</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded p-2 bg-white/20 text-white"
            required
          />
        </div>

        <div>
          <label className="text-white">Recurrence:</label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="w-full border rounded p-2 bg-white/20 text-white"
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
            className="w-full border rounded p-2 bg-white/20 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-gradient-to-r from-[#002E78] to-[#160524] text-white rounded hover:opacity-90 transition"
        >
          {submitting ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
