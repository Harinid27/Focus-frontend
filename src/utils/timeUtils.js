// Utility function to format time in IST
export const formatTimeIST = (date) => {
  if (!date) return "N/A";
  
  const istTime = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  
  return istTime;
};

// Utility function to format time in IST (time only)
export const formatTimeOnlyIST = (date) => {
  if (!date) return "N/A";
  
  const istTime = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  
  return istTime;
};

// Utility function to format time intelligently - shows only significant parts
export const formatTimeSmartIST = (date) => {
  if (!date) return "N/A";
  
  const istTime = new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  
  // Extract hours, minutes, seconds
  const [timeStr, ampm] = istTime.split(" ");
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  
  // Format based on what's significant
  if (hours === 0 && minutes === 0) {
    return `${seconds}s ${ampm}`;
  } else if (hours === 0) {
    return `${minutes}m ${seconds}s ${ampm}`;
  } else {
    return `${hours}h ${minutes}m ${seconds}s ${ampm}`;
  }
};

