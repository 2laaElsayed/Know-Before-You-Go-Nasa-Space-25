import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [province, setProvince] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const navigate = useNavigate();

  const provinces = [
    "Cairo", "Giza", "Alexandria", "Dakahlia", "Beheira",
    "Sharqia", "Monufia", "Gharbia", "Kafr El Sheikh",
    "Faiyum", "Beni Suef", "Minya", "Asyut", "Sohag",
    "Qena", "Luxor", "Aswan", "Red Sea", "New Valley",
    "Matrouh", "North Sinai", "South Sinai", "Port Said",
    "Ismailia", "Suez", "Damietta"
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, province }),
      });

      const data = await res.json();
      console.log(data); 

      if (!res.ok) {
        setMessageType("error");
        setMessage("A problem occurred. Try again.");
        return;
      }

      localStorage.setItem("token", data.data.token); 
      setMessageType("info");
      setMessage("Registration successful");
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("A problem occurred. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160524] to-[#002E78] dark:from-[#C48EF1] dark:to-[#5076B4] transition-colors duration-500">
      <div className="bg-white/10 dark:bg-black/30 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Create Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          {message && (
            <div className={`text-sm font-medium ${messageType === "error" ? "text-red-500" : "text-gray-300"} text-center`}>
              {message}
            </div>
          )}

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none"
          />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white focus:outline-none"
          >
            <option value="" disabled className="text-gray-700 bg-white">Select Province</option>
            {provinces.map((prov, idx) => (
              <option key={idx} value={prov} className="text-gray-700 bg-white">{prov}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <p className="text-gray-300 text-center mt-4">
          Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
