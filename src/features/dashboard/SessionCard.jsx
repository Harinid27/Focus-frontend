import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatTimeOnlyIST } from "../../utils/timeUtils";
import { useSessions } from "../../context/SessionContext";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

export default function SessionCard({ session }) {
  const { deleteSession } = useSessions();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    await deleteSession(session._id || session.id);
    setShowDeleteModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };
  // Convert duration (in seconds) to smart format
  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const totalSeconds = Math.round(seconds);
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
  };
  return (
    <>
      <Link 
        to={`/session/${session._id || session.id}`} 
        className="block bg-gradient-to-br from-white/5 to-white/[0.02] border border-blue-500/20 hover:border-blue-500/40 rounded-lg smooth-transition hover:shadow-lg hover:bg-white/[0.07] cursor-pointer hover:shadow-blue-500/20 p-6 group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 smooth-transition">{session.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{session.date}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDeleteClick();
            }}
            className="flex-shrink-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10 smooth-transition p-2 rounded-lg hover:border hover:border-red-500/20 ml-4"
            title="Delete session"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Duration</p>
            <p className="text-white font-semibold text-lg mt-2">{formatDuration(session.duration)}</p>
          </div>
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Distractions</p>
            <p className="text-red-400 font-semibold text-lg mt-2">{(session.distractions || []).length}</p>
          </div>
        </div>

        {session.startTime && session.endTime && (
          <div className="text-gray-500 text-xs space-y-1">
            <p><span className="text-gray-400">Start:</span> <span className="text-gray-300">{formatTimeOnlyIST(session.startTime)}</span></p>
            <p><span className="text-gray-400">End:</span> <span className="text-gray-300">{formatTimeOnlyIST(session.endTime)}</span></p>
          </div>
        )}
      </Link>
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        itemTitle={session.title}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
