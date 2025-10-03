import { useEffect, useState } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://know-before-you-go-nasa-space-25.vercel.app/api/events/favorite";

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchFavorites = async () => {
      try {
        const res = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFavorites(data.data.favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Your Favorite Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : favorites.length === 0 ? (
        <p>No favorite events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((event) => (
            <div key={event._id} className="bg-white/10 p-4 rounded shadow text-center">
              <h2 className="text-lg font-bold">{event.title}</h2>
              <p className="text-sm">{event.location?.lat}, {event.location?.lon}</p>
              <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
