import React, { useEffect, useState } from "react";

export default function DistractionWarningModal({ isOpen, siteName, warningCount, onDismiss }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className={`bg-white/5 border border-red-500/20 rounded-2xl p-8 max-w-sm shadow-2xl shadow-red-500/10 transform smooth-transition backdrop-blur-md ${animate ? 'animate-scaleIn' : 'scale-0'}`}>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-red-400 mb-2">Distraction Detected</h3>
          <p className="text-gray-500 text-sm">Refocus on your primary task</p>
        </div>
        
        <div className="bg-red-500/10 rounded-lg p-4 mb-6 border border-red-500/20">
          <p className="text-gray-500 mb-1 text-xs uppercase tracking-wider">Current Site</p>
          <p className="text-red-300 text-lg font-semibold">{siteName}</p>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          You have recorded <span className="text-red-400 font-semibold">{warningCount}</span> distraction{warningCount !== 1 ? 's' : ''} during this session.
        </p>

        <button
          onClick={onDismiss}
          className="w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 border border-red-500/50 text-white font-semibold text-base smooth-transition shadow-lg shadow-red-500/20 transform active:scale-95"
        >
          Return to Focus
        </button>
      </div>
    </div>
  );
}
