import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromRegister = location.state?.email || "";
  const [email, setEmail] = useState(emailFromRegister);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

 const handleVerify = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    if (res.ok) {
      setMessageType("info");
      setMessage("Email confirmed successfully");
      navigate("/home");
    } else {
      setMessageType("error");
      setMessage("There was a problem verifying. Try again ");
    }
  } catch (err) {
    console.error(err);
    setMessageType("error");
    setMessage("A problem occurred. Try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160524] to-[#002E78] dark:from-[#C48EF1] dark:to-[#5076B4] transition-colors duration-500">
      <div className="bg-white/10 dark:bg-black/30 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-white text-center mb-4">Verify Your Email</h2>

<form onSubmit={handleVerify} className="space-y-4">
          {message && (
            <div className={`text-sm font-medium ${messageType === "error" ? "text-red-500" : "text-gray-300"}`}>
              {message}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            readOnly
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="text"
            placeholder="Enter Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
