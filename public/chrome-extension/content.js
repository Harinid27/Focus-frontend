console.log("Focus Tracker content script loaded");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  
  if (request.type === "DISTRACTION_DETECTED") {
    // Send message to the focus-tracker app via window.postMessage
    window.postMessage({
      type: "DISTRACTION_WARNING",
      siteName: request.siteName,
      warningCount: request.warningCount,
      duration: request.duration,
      durationMs: request.durationMs,
      source: "chrome-extension"
    }, "*");
    
    sendResponse({ status: "warning_sent" });
  } else if (request.type === "TAB_CLOSED") {
    window.postMessage({
      type: "TAB_CLOSED",
      siteName: request.siteName,
      source: "chrome-extension"
    }, "*");
    
    sendResponse({ status: "tab_close_notified" });
  }
});

