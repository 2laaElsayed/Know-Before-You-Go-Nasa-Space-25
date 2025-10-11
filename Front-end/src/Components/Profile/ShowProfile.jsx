import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowProfile() {
  const navigate = useNavigate();

  const [profile] = useState({
    username: "alaa elsayed",
    email: "alaaelssayed23@gmail.com",
    role: "user",
    province: "dakahlia",
    createdAt: "2025-10-03T17:31:44.378Z",
  });

  const handleEditProfile = () => navigate("/profile/edit");
  const handleDeleteProfile = () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    alert("Profile deleted successfully! (mock)");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5076B4] to-[#C48EF1] dark:from-[#002E78] dark:to-[#160524] text-gray-900 dark:text-white flex flex-col items-center justify-center p-8 transition-all duration-500">
      <h2 className="text-3xl font-extrabold mb-10 drop-shadow-md text-center">
        Your Profile
      </h2>

      <div className="flex flex-col gap-6 w-full max-w-3xl bg-white/30 dark:bg-white/5 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/10 transition-all">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Province:</strong> {profile.province}</p>
        <p><strong>Joined At:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 bg-gradient-to-br from-[#5076B4] to-[#C48EF1] dark:from-[#002E78] dark:to-[#160524] text-gray-900 dark:text-white font-semibold rounded hover:opacity-90 transition-all"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteProfile}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
