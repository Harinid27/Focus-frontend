// List of unproductive websites
const UNPRODUCTIVE_SITES = {
  instagram: ["instagram.com", "www.instagram.com"],
  facebook: ["facebook.com", "www.facebook.com"],
  twitter: ["twitter.com", "www.twitter.com", "x.com", "www.x.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  snapchat: ["snapchat.com", "www.snapchat.com"],
  reddit: ["reddit.com", "www.reddit.com"],
  youtube: ["youtube.com", "www.youtube.com"],
  twitch: ["twitch.tv", "www.twitch.tv"],
  netflix: ["netflix.com", "www.netflix.com"],
  spotify: ["spotify.com", "www.spotify.com"],
  soundcloud: ["soundcloud.com", "www.soundcloud.com"],
  steam: ["steampowered.com", "www.steampowered.com"],
  epicgames: ["epicgames.com", "www.epicgames.com"],
  discord: ["discord.com", "www.discord.com"],
  "9gag": ["9gag.com", "www.9gag.com"],
  imgur: ["imgur.com", "www.imgur.com"]
};

// Track total warnings for the session (not per-site)
let totalWarnings = 0;
const tabActivationTimes = {}; // Track when each tab was activated

const isUnproductiveSite = (url) => {
  if (!url) return false;
  try {
    const hostname = new URL(url).hostname;
    for (const domains of Object.values(UNPRODUCTIVE_SITES)) {
      if (domains.some(domain => hostname.includes(domain))) {
        return true;
      }
    }
  } catch (e) {
    console.error("Error parsing URL:", e);
  }
  return false;
};

const getSiteName = (url) => {
  if (!url) return "Unknown Site";
  try {
    const hostname = new URL(url).hostname;
    for (const [name, domains] of Object.entries(UNPRODUCTIVE_SITES)) {
      if (domains.some(domain => hostname.includes(domain))) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
    return hostname.split('.')[0];
  } catch (e) {
    return "Unknown Site";
  }
};

let lastWarningTime = 0;
const WARNING_COOLDOWN = 3000;

// Reset warnings when a new session starts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "RESET_WARNINGS") {
    totalWarnings = 0;
    tabActivationTimes = {};
    sendResponse({ status: "warnings_reset" });
  }
});

const calculateDuration = (milliseconds) => {
  const seconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

const handleDistractionDetected = (tabId, tab) => {
  if (!tab || !tab.url) return;
  
  if (isUnproductiveSite(tab.url)) {
    const siteName = getSiteName(tab.url);
    const now = Date.now();
    
    if (now - lastWarningTime > WARNING_COOLDOWN) {
      lastWarningTime = now;
      
      // Track duration for this visit
      let duration = 0;
      if (tabActivationTimes[tabId]) {
        duration = now - tabActivationTimes[tabId];
      }
      
      // Increment total session warnings (not per-site)
      totalWarnings++;
      
      const durationStr = calculateDuration(duration);
      
      console.log(`[Extension] Distraction detected - Site: ${siteName}, Duration: ${durationStr} (${duration}ms)`);
      
      // Show notification on the unproductive tab itself
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><text x="50%" y="50%" font-size="80" text-anchor="middle" dy=".3em">⚠️</text></svg>',
        title: `Distraction Alert: ${siteName}`,
        message: `You've been on ${siteName} for ${durationStr}. Stay focused! ⏱️`,
        priority: 2
      });
      
      // Send message to app
      chrome.tabs.query({ url: "http://localhost:5173/*" }, (appTabs) => {
        appTabs.forEach(appTab => {
          try {
            chrome.tabs.sendMessage(appTab.id, {
              type: "DISTRACTION_DETECTED",
              siteName: siteName,
              warningCount: totalWarnings,
              duration: durationStr,
              durationMs: duration
            });
          } catch (e) {
            console.log("Could not send message to tab");
          }
        });
      });
    }
  }
};

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Only set activation time if not already set for this tab
    if (!tabActivationTimes[activeInfo.tabId]) {
      tabActivationTimes[activeInfo.tabId] = Date.now();
    }
    handleDistractionDetected(activeInfo.tabId, tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Only set activation time if not already set for this tab
    if (!tabActivationTimes[tabId]) {
      tabActivationTimes[tabId] = Date.now();
    }
    handleDistractionDetected(tabId, tab);
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabActivationTimes[tabId];
});


