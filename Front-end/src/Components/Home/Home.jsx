import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#160524] to-[#002E78] dark:from-[#C48EF1] dark:to-[#5076B4] text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Home 🎉</h1>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 rounded-lg hover:opacity-90 transition"
      >
        Logout
      </button>
    </div>
  );
}
