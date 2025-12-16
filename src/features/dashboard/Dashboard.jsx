import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import LogsPreview from "./LogsPreview";
import FocusChart from "./FocusChart";
import DistractionsChart from "./DistractionsChart";
import DistractionWarningModal from "../../components/DistractionWarningModal";
import { useSessions } from "../../context/SessionContext";

export default function Dashboard() {
  const { addSession, sessions, user } = useSessions();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [currentDistraction, setCurrentDistraction] = useState("");
  const [warningCount, setWarningCount] = useState(0);
  const [distractions, setDistractions] = useState([]);
  const [warnings, setWarnings] = useState(0);
  const sessionStartTime = useRef(null);
  const lastCheckedSite = useRef(null);
  const distractionStartTime = useRef(null);

  useEffect(()=>{
    let t;
    if (running) t = setInterval(()=> setSeconds(s => s+1), 1000);
    return ()=> clearInterval(t);
  },[running]);

  // Tab visibility change detection for distractions
  useEffect(() => {
    if (!running) return;

    const handleVisibilityChange = () => {
      // When user switches to another tab
      if (document.hidden) {
        const currentHostname = window.location.hostname;
        lastCheckedSite.current = currentHostname;
      } else {
        // User comes back to the focus tracker tab
        // This is where we can detect if they were on an unproductive site
        // Since we can't directly access other tab URLs (security), we'll use the onblur event
      }
    };

    const handleWindowBlur = () => {
      if (!running) return;
      
      // Check if browser is trying to access other windows/tabs
      // We'll set up a warning system when the user leaves
      const currentHostname = window.location.hostname;
      lastCheckedSite.current = currentHostname;
    };

    const handleWindowFocus = () => {
      if (!running) return;
      // User is back on focus-tracker tab
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [running]);

  // Periodic check to warn about unproductive sites (simulated)
  useEffect(() => {
    if (!running) return;

    // Listen for messages from Chrome Extension
    const handleExtensionMessage = (event) => {
      // Only accept messages from the extension and from the same window
      if (event.source !== window) return;
      
      if (event.data.type === "DISTRACTION_WARNING" && event.data.source === "chrome-extension") {
        recordDistraction(event.data.siteName, event.data.duration, event.data.durationMs, event.data.warningCount);
      } else if (event.data.type === "TAB_CLOSED" && event.data.source === "chrome-extension") {
        // Tab was closed after too many warnings
        console.log("Unproductive tab closed:", event.data.siteName);
      }
    };

    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, [running]);

  const openModal = ()=> { setTitle(""); setShowModal(true); };
  const start = async ()=> {
    setShowModal(false);
    setRunning(true);
    sessionStartTime.current = new Date();
    setDistractions([]);
    setWarnings(0);
    setWarningCount(0);
    
    // Reset warnings in chrome extension for new session
    try {
      chrome.runtime.sendMessage({
        type: "RESET_WARNINGS"
      }, (response) => {
        console.log("Extension warnings reset");
      });
    } catch (e) {
      // Extension not available
    }
    
    // create minimal session object in frontend - saved on end
    const temp = {
      title: title || `Focus Session ${sessions.length+1}`,
      startTime: new Date().toISOString(),
      endTime: null,
      duration: 0,
      distractions: [],
      warnings: 0,
      date: new Date().toLocaleDateString()
    };
  };

  const recordDistraction = (siteName, duration, durationMs, warningCount) => {
    console.log("Recording distraction:", { siteName, duration, durationMs, warningCount });
    distractionStartTime.current = Date.now(); // Start timer when warning shows
    setCurrentDistraction(siteName);
    setWarnings(prev => prev + 1);
    setWarningCount(prev => prev + 1);
    setShowWarningModal(true);
    setDistractions(prev => [...prev, {
      time: new Date().toLocaleTimeString(),
      reason: siteName,
      duration: null,  // Will be calculated when dismissed
      durationMs: null,
      startTime: Date.now() // Store start time for later calculation
    }]);
  };

  const handleWarningDismiss = () => {
    // Calculate duration from when warning was shown to when dismissed
    if (distractionStartTime.current) {
      const endTime = Date.now();
      const durationMs = endTime - distractionStartTime.current;
      const durationStr = formatDurationString(durationMs);
      
      // Update the last distraction with calculated duration
      setDistractions(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].duration = durationStr;
          updated[updated.length - 1].durationMs = durationMs;
        }
        return updated;
      });
      
      console.log("Distraction dismissed. Duration on page:", durationStr);
      distractionStartTime.current = null;
    }
    setShowWarningModal(false);
  };

  const formatDurationString = (ms) => {
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const stop = async ()=> {
    if (!running) return;
    setRunning(false);
    const endTime = new Date();
    console.log("Distractions to save:", distractions);
    const sessionObj = {
      title: title || `Focus Session ${sessions.length+1}`,
      startTime: new Date(endTime.getTime() - seconds*1000).toISOString(),
      endTime: endTime.toISOString(),
      duration: seconds,
      distractions: distractions,
      warnings: warnings,
      date: endTime.toLocaleDateString()
    };
    // save to backend via context
    await addSession(sessionObj);
    setSeconds(0);
    setDistractions([]);
    setWarnings(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] px-6 py-10 text-white animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-slideInDown">
          <div>
            <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Focus tracking system</p>
          </div>
          <Link to="/profile" className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-semibold hover:bg-white/15 smooth-transition">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Link>
        </div>

        <p className="text-gray-500 mb-8 text-base">Monitor your focus sessions and productivity metrics.</p>

        {!running ? (
          <button 
            onClick={openModal} 
            className="w-full py-4 bg-green-600 hover:bg-green-700 border border-green-500/50 rounded-lg mb-6 font-semibold text-base smooth-transition shadow-lg shadow-green-500/20 active:scale-95"
          >
            Start Session
          </button>
        ) : (
          <button 
            onClick={stop} 
            className="w-full py-4 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 rounded-lg mb-6 font-semibold text-base smooth-transition hover:border-red-500/50 active:scale-95"
          >
            Stop Session
          </button>
        )}

        {running && (
          <div className="animate-slideInUp">
            <div className="text-center mb-6 p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg backdrop-blur-sm">
              <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Session Duration</p>
              <p className="text-5xl font-semibold font-mono bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {String(Math.floor(seconds/3600)).padStart(2,'0')}:{String(Math.floor((seconds%3600)/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}
              </p>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm mb-6 hover:border-red-500/30 smooth-transition">
              <p className="text-sm text-gray-400">
                <span className="text-red-400 font-semibold text-lg">{warnings}</span>
                <span className="text-gray-500 ml-2">Distraction{warnings !== 1 ? 's' : ''} Detected</span>
              </p>
            </div>
          </div>
        )}

        <FocusChart sessions={sessions} />

        <DistractionsChart sessions={sessions} />

        <LogsPreview sessions={sessions} />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 w-full max-w-sm border border-blue-500/20 animate-scaleIn shadow-2xl">
            <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Create Session</h3>
            <input 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="Session name (optional)" 
              className="w-full px-4 py-3 rounded-lg mb-6 bg-white/5 text-white placeholder-gray-600 border border-white/10 hover:border-blue-500/30 focus:border-blue-500/50 smooth-transition focus:bg-white/[0.08]" 
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={()=>setShowModal(false)} 
                className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg smooth-transition font-semibold text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={()=>{ setShowModal(false); setRunning(true); }} 
                className="px-6 py-2 bg-green-600 hover:bg-green-700 border border-green-500/50 rounded-lg smooth-transition font-semibold text-sm shadow-lg shadow-green-500/20"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      <DistractionWarningModal 
        isOpen={showWarningModal}
        siteName={currentDistraction}
        warningCount={warningCount}
        onDismiss={handleWarningDismiss}
      />
    </div>
  );
}
