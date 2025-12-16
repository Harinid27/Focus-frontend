// List of unproductive/distracting websites
const UNPRODUCTIVE_SITES = {
  // Social Media
  instagram: ["instagram.com", "www.instagram.com"],
  facebook: ["facebook.com", "www.facebook.com"],
  twitter: ["twitter.com", "www.twitter.com", "x.com", "www.x.com"],
  tiktok: ["tiktok.com", "www.tiktok.com"],
  snapchat: ["snapchat.com", "www.snapchat.com"],
  reddit: ["reddit.com", "www.reddit.com"],
  
  // Video Streaming
  youtube: ["youtube.com", "www.youtube.com"],
  twitch: ["twitch.tv", "www.twitch.tv"],
  netflix: ["netflix.com", "www.netflix.com"],
  
  // Music Streaming
  spotify: ["spotify.com", "www.spotify.com"],
  soundcloud: ["soundcloud.com", "www.soundcloud.com"],
  
  // Gaming
  steam: ["steampowered.com", "www.steampowered.com"],
  epicgames: ["epicgames.com", "www.epicgames.com"],
  discord: ["discord.com", "www.discord.com"], // Often used for gaming
};

// List of productive websites/tools
const PRODUCTIVE_SITES = {
  // AI/ML Tools
  chatgpt: ["openai.com", "chat.openai.com", "www.openai.com"],
  claude: ["claude.ai", "www.claude.ai"],
  gemini: ["gemini.google.com", "www.gemini.google.com"],
  perplexity: ["perplexity.ai", "www.perplexity.ai"],
  
  // Learning Platforms
  coursera: ["coursera.org", "www.coursera.org"],
  udemy: ["udemy.com", "www.udemy.com"],
  edx: ["edx.org", "www.edx.org"],
  linkedin: ["linkedin.com", "www.linkedin.com"],
  
  // Documentation
  github: ["github.com", "www.github.com"],
  stackoverflow: ["stackoverflow.com", "www.stackoverflow.com"],
  mdn: ["developer.mozilla.org"],
  
  // Dev Tools
  vscode: ["vscode.dev", "www.vscode.dev"],
  replit: ["replit.com", "www.replit.com"],
  codepen: ["codepen.io", "www.codepen.io"],
  
  // Office/Productivity
  notion: ["notion.so", "www.notion.so"],
  google: ["google.com", "www.google.com", "drive.google.com"],
  microsoft: ["office.com", "outlook.office.com"]
};

export const getSiteCategory = (hostname) => {
  if (!hostname) return "unknown";
  
  // Check if it's a productive site
  for (const [category, domains] of Object.entries(PRODUCTIVE_SITES)) {
    if (domains.some(domain => hostname.includes(domain))) {
      return "productive";
    }
  }
  
  // Check if it's an unproductive site
  for (const [category, domains] of Object.entries(UNPRODUCTIVE_SITES)) {
    if (domains.some(domain => hostname.includes(domain))) {
      return "unproductive";
    }
  }
  
  return "neutral";
};

export const isUnproductiveSite = (hostname) => {
  return getSiteCategory(hostname) === "unproductive";
};

export const isProductiveSite = (hostname) => {
  return getSiteCategory(hostname) === "productive";
};
