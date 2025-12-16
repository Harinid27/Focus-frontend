import React from "react";
import { useSessions } from "../../context/SessionContext";
import SessionCard from "./SessionCard";
import { Link } from "react-router-dom";

export default function AllSessions() {
  const { sessions } = useSessions();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="text-gray-400 mb-6 inline-block hover:text-gray-300 smooth-transition text-3xl">←</Link>
        <h2 className="text-2xl font-semibold mb-6">Sessions</h2>
        {sessions.length === 0 ? <p className="text-gray-500">No sessions yet.</p> : (
          <div className="space-y-4">
            {sessions.map(s => <SessionCard key={s._id} session={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}
