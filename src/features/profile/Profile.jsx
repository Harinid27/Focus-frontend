import React from "react";
import { useSessions } from "../../context/SessionContext";
import UserInfo from "./UserInfo";
import Analytics from "./Analytics";
import { Link, useNavigate } from "react-router-dom";


export default function Profile() {
  const { sessions, user, logout } = useSessions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] text-white animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="text-gray-400 mb-6 inline-block hover:text-gray-300 smooth-transition text-3xl animate-slideInDown">
          ←
        </Link>

        <div className="animate-slideInUp">
          <UserInfo user={user} />

          <h2 className="text-2xl font-semibold mb-6 mt-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Analytics</h2>
          <div className="bg-white/5 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-sm">
            <Analytics sessions={sessions} />
          </div>

          <button
            onClick={handleLogout}
            className="mt-12 w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 border border-red-500/50 smooth-transition font-semibold text-base shadow-lg shadow-red-500/20 transform active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
