import React, { useMemo } from "react";

export default function Analytics({ sessions }) {
  const analytics = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return {
        week: emptyStats(),
        month: emptyStats(),
        all: emptyStats(),
        mostDistractionSite: null,
        bestSession: null,
      };
    }

    const now = new Date();

    // ---------- WEEK START (Monday 00:00) ----------
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay(); // 0 = Sunday
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // ---------- MONTH START ----------
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const weekList = [];
    const monthList = [];
    const allList = sessions;

    sessions.forEach((s) => {
      const dateStr = s.startTime || s.date;
      if (!dateStr) return;

      const d = new Date(dateStr);

      if (d >= startOfWeek) weekList.push(s);
      if (d >= startOfMonth) monthList.push(s);
    });

    // Calculate most distracted site
    const mostDistractionSite = getMostDistractionSite(allList);
    
    // Calculate best session (most focus score)
    const bestSession = getBestSession(allList);

    return {
      week: calculateStats(weekList),
      month: calculateStats(monthList),
      all: calculateStats(allList),
      mostDistractionSite,
      bestSession,
    };
  }, [sessions]);

  if (!sessions || sessions.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-6 text-sm">
        No analytics yet. Create a session to start tracking.
      </p>
    );
  }

  return (
    <div className="space-y-6 w-full text-white">
      {/* Standard Analytics */}
      <AnalyticsCard title="This Week" stats={analytics.week} />
      <AnalyticsCard title="This Month" stats={analytics.month} />
      <AnalyticsCard title="All Time" stats={analytics.all} />

      {/* Motivational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {analytics.mostDistractionSite && (
          <MostDistractionCard site={analytics.mostDistractionSite} />
        )}
        {analytics.bestSession && (
          <BestSessionCard session={analytics.bestSession} />
        )}
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function emptyStats() {
  return { count: 0, total: 0, max: 0, avg: 0, distractions: 0 };
}

function calculateStats(list) {
  const count = list.length;
  const total = list.reduce((acc, s) => acc + Number(s.duration || 0), 0);
  const max = count ? Math.max(...list.map(s => Number(s.duration || 0))) : 0;
  const avg = count ? Math.round(total / count) : 0;
  const distractions = list.reduce(
    (acc, s) => acc + (s.distractions?.length || 0),
    0
  );

  return { count, total, max, avg, distractions };
}

function getMostDistractionSite(sessions) {
  const siteData = {};
  
  sessions.forEach((session) => {
    if (session.distractions && Array.isArray(session.distractions)) {
      session.distractions.forEach((distraction) => {
        const reason = distraction.reason || "Unknown";
        const durationMs = Number(distraction.durationMs || 0);
        
        if (!siteData[reason]) {
          siteData[reason] = { totalTime: 0, count: 0 };
        }
        siteData[reason].totalTime += durationMs;
        siteData[reason].count += 1;
      });
    }
  });

  if (Object.keys(siteData).length === 0) return null;

  // Find site with most total duration (not just count)
  let mostDistracting = { site: "", totalTime: 0, count: 0 };
  for (const [site, data] of Object.entries(siteData)) {
    if (data.totalTime > mostDistracting.totalTime) {
      mostDistracting = { site, totalTime: data.totalTime, count: data.count };
    }
  }

  return mostDistracting;
}

function getBestSession(sessions) {
  if (sessions.length === 0) return null;

  // Focus score: higher duration and fewer distractions = better score
  let bestSession = sessions[0];
  let bestScore = calculateFocusScore(sessions[0]);

  sessions.forEach((session) => {
    const score = calculateFocusScore(session);
    if (score > bestScore) {
      bestScore = score;
      bestSession = session;
    }
  });

  return bestSession;
}

function calculateFocusScore(session) {
  const duration = Number(session.duration || 0);
  const distractionCount = (session.distractions?.length || 0);
  const totalDistractionTime = (session.distractions || []).reduce((acc, d) => {
    const ms = Number(d.durationMs || 0);
    return acc + ms;
  }, 0) / 1000; // Convert to seconds

  // Score: duration - distractions penalty
  const score = duration - (distractionCount * 60) - (totalDistractionTime * 0.5);
  return Math.max(score, 0);
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

/* -------- MOTIVATIONAL CARDS -------- */

function MostDistractionCard({ site }) {
  const totalSeconds = Math.round(site.totalTime / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const timeDisplay = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm hover:border-red-500/50 smooth-transition">
      <div className="text-center">
        <p className="text-sm text-red-400 uppercase tracking-wider font-semibold mb-3">⚠️ Most Distracting Site</p>
        <h3 className="text-3xl font-bold text-white mb-4">{site.site}</h3>
        <div className="space-y-2 mb-4">
          <p className="text-lg text-gray-300"><span className="text-red-400 font-semibold">Total Time:</span> {timeDisplay}</p>
          <p className="text-lg text-gray-300"><span className="text-red-400 font-semibold">Times Distracted:</span> {site.count}x</p>
        </div>
        <p className="text-xs text-gray-400">You spent {timeDisplay} on {site.site}. Stay focused! 💪</p>
      </div>
    </div>
  );
}

function BestSessionCard({ session }) {
  const score = calculateFocusScore(session);
  const duration = Number(session.duration || 0);
  const distractionCount = (session.distractions?.length || 0);

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 p-6 rounded-xl border border-green-500/30 backdrop-blur-sm hover:border-green-500/50 smooth-transition">
      <div className="text-center">
        <p className="text-sm text-green-400 uppercase tracking-wider font-semibold mb-3">⭐ Best Focused Session</p>
        <h3 className="text-3xl font-bold text-white mb-4">{session.title}</h3>
        <div className="space-y-2 mb-4">
          <p className="text-lg text-gray-300"><span className="text-green-400 font-semibold">Duration:</span> {formatTime(duration)}</p>
          <p className="text-lg text-gray-300"><span className="text-green-400 font-semibold">Distractions:</span> {distractionCount}</p>
        </div>
        <p className="text-xs text-gray-400">This is your best focused session! Keep up the amazing work! 🎉</p>
      </div>
    </div>
  );
}

/* ---------------- UI CARD ---------------- */

function AnalyticsCard({ title, stats }) {
  return (
    <div className="bg-white/5 p-5 rounded-lg border border-white/10">
      <h4 className="text-base font-semibold mb-4 text-white">{title}</h4>

      <Row label="Total Sessions" value={stats.count} />
      <Row label="Total Focus Time" value={formatTime(stats.total)} />
      <Row label="Max Focus Session" value={formatTime(stats.max)} />
      <Row label="Average Focus Time" value={formatTime(stats.avg)} />
      <Row label="Total Distractions" value={stats.distractions} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-gray-400 text-sm py-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-300 font-semibold">{value}</span>
    </div>
  );
}
