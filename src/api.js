// src/api.js
const API_URL = "http://localhost:5000";

// Helper function for API calls with timeout and better error handling
async function apiCall(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    console.log(`🔄 Making API call to: ${url}`);
    console.log('📤 Request options:', {
      method: options.method || 'GET',
      headers: options.headers || {},
      body: options.body ? '[BODY_PRESENT]' : '[NO_BODY]'
    });
    
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    console.log(`📥 Response received:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      headers: Object.fromEntries(res.headers.entries())
    });
    
    // Handle different content types
    let data;
    const contentType = res.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('📄 Raw response:', text);
        throw new Error(`Invalid JSON response from server: ${text.substring(0, 200)}`);
      }
    } else {
      const text = await res.text();
      console.log('📄 Non-JSON response:', text);
      throw new Error(`Server returned non-JSON response (${res.status}): ${text.substring(0, 200)}`);
    }
    
    console.log('📊 Response data:', data);
    
    if (!res.ok) {
      const errorMessage = data.message || data.error || `HTTP error! status: ${res.status}`;
      console.error('❌ API error response:', {
        status: res.status,
        message: errorMessage,
        data
      });
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('❌ Request timeout after 15 seconds');
      throw new Error('Request timeout - server is taking too long to respond');
    }
    
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('❌ Network error - cannot reach server');
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
    }
    
    console.error('❌ API call failed:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
}

// Test API connection
export async function testApi() {
  return apiCall(`${API_URL}/health`);
}

// AUTH
export async function loginApi(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  
  return apiCall(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email: email.trim(), password }),
  });
}

export async function signupApi(name, email, password) {
  if (!name || !email || !password) {
    throw new Error("Name, email, and password are required");
  }
  
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  
  return apiCall(`${API_URL}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify({ 
      name: name.trim(), 
      email: email.trim(), 
      password 
    }),
  });
}

// SESSIONS
export async function fetchSessionsApi() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/sessions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createSessionApi(sessionData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sessionData),
  });
}

export async function updateSessionApi(sessionId, updateData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/sessions/${sessionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
}

export async function getSessionByIdApi(sessionId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// EVENTS (for distraction tracking)
export async function createEventApi(eventData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
}

export async function getSessionEventsApi(sessionId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return apiCall(`${API_URL}/api/events/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
