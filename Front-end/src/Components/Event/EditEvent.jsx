import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaSync, FaPencilAlt, FaTimes } from "react-icons/fa";

// Alert Box Component
const AlertBox = ({ message, type, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const icon = type === "success" ? "✅" : "❌";
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white p-4 rounded-lg shadow-xl z-50 flex items-center gap-4`}>
      <span className="text-xl">{icon}</span>
      <p className="font-medium">{message}</p>
      <button onClick={onClose} className="text-white opacity-75 hover:opacity-100 transition">
        <FaTimes />
      </button>
    </div>
  );
};

export default function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    province: "Cairo",
    recurrence: "none",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "https://know-before-you-go-nasa-space-25.vercel.app/api/events";

  const provinces = ["Cairo", "Giza", "Alexandria", "Luxor", "Aswan"];
  const recurrenceOptions = ["none", "daily", "weekly", "monthly"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setAlert(null);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.title || !formData.date || !formData.province) {
      setError("Please fill in all required fields (Title, Date, Province).");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/edit/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === "success") {
        setAlert({ message: "تم تحديث الحدث بنجاح! ✅", type: "success" });
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setError(data.message || "فشل تحديث الحدث.");
        setAlert({ message: data.message || "فشل تحديث الحدث.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ في الشبكة.");
      setAlert({ message: "حدث خطأ في الشبكة.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-sans p-6 bg-gradient-to-br from-[#5076B4] to-[#C48EF1] text-gray-900 dark:from-[#002E78] dark:to-[#160524] dark:text-white">
      {alert && <AlertBox message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-[#5076B4] dark:text-white">
          <FaPencilAlt className="inline mr-3" /> Edit Event
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event Title"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaCalendarAlt className="inline mr-2 text-red-400" /> Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <FaMapMarkerAlt className="inline mr-2 text-green-400" /> Province
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200"
              >
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <FaSync className="inline mr-2 text-yellow-400" /> Recurrence
            </label>
            <select name="recurrence" value={formData.recurrence} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition duration-200">
              {recurrenceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Notes about the event..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none transition duration-200"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button type="button" onClick={() => navigate("/home")} className="flex-1 px-6 py-3 border rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 px-6 py-3 bg-[#5076B4] text-white rounded-full hover:bg-[#406090] transition disabled:opacity-50">
              {submitting ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
