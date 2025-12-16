import React from "react";
import SessionCard from "./SessionCard";
import { Link } from "react-router-dom";

export default function LogsPreview({ sessions }) {
  const recent = (sessions || []).slice(0,3);
  if (recent.length === 0) return (
    <div className="mt-8">
      <p className="text-gray-500 text-sm">No sessions yet. Start a session to begin tracking.</p>
    </div>
  );
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
        <Link to="/sessions" className="text-gray-400 hover:text-gray-300 smooth-transition text-sm">View all →</Link>
      </div>
      <div className="space-y-4">
        {recent.map(s => <SessionCard key={s._id || s.id} session={s} />)}
      </div>
    </div>
  );
}
