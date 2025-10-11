import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const navigate = useNavigate();

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setMessageType("error");
        setMessage("A problem occurred. Try again.");
        return;
      }

      setMessageType("info");
      setMessage("A verification code has been sent to your email.");
      navigate("/reset-password");
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("A problem occurred. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160524] to-[#002E78] dark:from-[#C48EF1] dark:to-[#5076B4] transition-colors duration-500">
      <div className="bg-white/10 dark:bg-black/30 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-serif text-white">Forgot Password</h1>
        </div>

        <form onSubmit={handleForgetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
