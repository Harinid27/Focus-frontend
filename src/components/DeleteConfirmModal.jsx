import React from "react";

export default function DeleteConfirmModal({ isOpen, itemTitle, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-white/10 to-white/5 border border-red-500/30 rounded-xl p-8 max-w-sm shadow-2xl animate-scaleIn">
        <h3 className="text-xl font-semibold text-red-300 mb-2">Delete Session</h3>
        <p className="text-gray-400 mb-6 text-sm">
          Are you sure you want to delete <span className="text-red-300 font-semibold">"{itemTitle}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-500/30 text-gray-300 hover:bg-gray-500/10 smooth-transition text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 border border-red-500/50 text-white smooth-transition font-semibold text-sm shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
