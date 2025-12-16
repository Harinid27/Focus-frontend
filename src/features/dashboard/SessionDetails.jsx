import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessions } from "../../context/SessionContext";
import { formatTimeIST } from "../../utils/timeUtils";

export default function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessions } = useSessions();

  const session = sessions.find(s => (s._id || s.id) === id);
  console.log("SessionDetails - Session data:", session);
  if (!session) return (
    <div className="min-h-screen p-6 text-white">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-300 smooth-transition inline-block text-3xl cursor-pointer bg-none border-none p-0">←</button>
      <p className="text-gray-400 mt-6">Session not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] animate-fadeIn">
      <div className="max-w-3xl mx-auto animate-slideInUp">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-300 smooth-transition text-3xl mb-6 inline-block cursor-pointer bg-none border-none p-0">←</button>
        
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-8">{session.title}</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 smooth-transition">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Date</p>
              <p className="text-white font-semibold text-lg mt-2">{session.date}</p>
            </div>
            <div className="bg-cyan-500/10 rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 smooth-transition">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Duration</p>
              <p className="text-white font-semibold text-lg mt-2">{session.duration ? (() => {
                const totalSeconds = Math.round(session.duration);
                const hours = Math.floor(totalSeconds / 3600);
                const mins = Math.floor((totalSeconds % 3600) / 60);
                const secs = totalSeconds % 60;
                
                if (hours > 0) {
                  return `${hours}h ${mins}m ${secs}s`;
                } else if (mins > 0) {
                  return `${mins}m ${secs}s`;
                } else {
                  return `${secs}s`;
                }
              })() : "0s"}</p>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Session Timing</h3>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500">Start:</span> <span className="text-gray-300 font-semibold">{formatTimeIST(session.startTime)}</span></p>
              <p><span className="text-gray-500">End:</span> <span className="text-gray-300 font-semibold">{formatTimeIST(session.endTime)}</span></p>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold mb-6 text-white">Distractions Detected: <span className="text-red-400">{session.warnings || 0}</span></h3>
            {session.distractions && session.distractions.length > 0 ? (
              <div className="space-y-3">
                {session.distractions.map((distraction, idx) => (
                  <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 smooth-transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-semibold text-base">{distraction.reason}</span>
                      {distraction.duration && <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-xs font-semibold text-gray-300">{distraction.duration}</span>}
                    </div>
                    <p className="text-gray-500 text-sm">Time: {distraction.time}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-base">No distractions recorded. Excellent focus session.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
