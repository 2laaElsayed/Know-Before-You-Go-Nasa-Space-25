import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import logo from "../../assets/logo_light.png"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState("error"); 
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const API_URL = import.meta.env.VITE_API_URL;

    const res = await fetch(`${API_URL}/api/auth/login`,
       {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.data?.auth?.token) {
      setMessageType("error");
      setMessage("A problem occurred. Check your email and password and try again.");
      return;
    }

    login({
      token: data.data.auth.token,
      email: data.data.auth.email,
      username: data.data.auth.username,
    });

    setMessageType("info");
    setMessage("Login successful");

    navigate("/home");
  } catch (err) {
    console.error(err);
    setMessageType("error");
    setMessage("There was a problem connecting. Try again.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#160524] to-[#002E78] dark:from-[#C48EF1] dark:to-[#5076B4] transition-colors duration-500">
      <div className="bg-white/10 dark:bg-black/30 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="logo" className="w-30 h-auto mb-2" />
          <h1 className="text-2xl font-serif text-white">Know Before You Go</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className={`text-sm font-medium ${
                messageType === "error" ? "text-red-500" : "text-gray-300"
              }`}
            >
              {message}
            </div>
          )}

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-gray-300 text-center mt-4">
          New User?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Sign Up Now
          </Link>
        </p>
        <p className="text-gray-300 text-center mt-4">
          <Link to="/forget-password" className="text-purple-400 hover:underline">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
}