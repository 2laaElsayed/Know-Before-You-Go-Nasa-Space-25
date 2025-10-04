import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/events/favorites/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data?.data?.favorites) {
          setFavorites(data.data.favorites);
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFavorites();
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [API_URL, userId]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">⭐ Your Favorite Events</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && favorites.length === 0 && (
        <p className="text-center text-gray-500">You have no favorite events yet.</p>
      )}
      {!loading && favorites.length > 0 && (
        <ul className="max-w-3xl mx-auto space-y-4">
          {favorites.map((ev) => (
            <li
              key={ev.eventId}
              className="bg-white dark:bg-white/10 p-5 rounded-lg shadow"
            >
              <div
                onClick={() => navigate(`/events/${ev.eventId}/weather`)}
                className="cursor-pointer"
              >
                <h2 className="text-xl font-semibold">{ev.title}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(ev.date).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
