import React, { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext();

export const useSessions = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [user, setUser] = useState(null); // {name,email,_id}
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:5000";

  // token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      // We can optionally decode token for user id — but server returns user on login/signup
      fetchSessions();
    }
  // eslint-disable-next-line
  }, [token]);

  const signup = async (name, email, password) => {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setUser({ name: data.name, email: data.email, _id: data._id });
      await fetchSessions();
    }
    return { ok: res.ok, data };
  };

  const login = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setUser({ name: data.name, email: data.email, _id: data._id });
      await fetchSessions();
    }
    return { ok: res.ok, data };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSessions([]);
  };

  const fetchSessions = async () => {
    if (!token) return;
    setLoading(true);
    const res = await fetch(`${API}/api/sessions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      setSessions(data);
    } else {
      // token invalid, logout
      logout();
    }
    setLoading(false);
  };

  const addSession = async (sessionObj) => {
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(sessionObj)
    });
    const data = await res.json();
    if (res.ok) {
      setSessions(prev => [data, ...prev]);
      return { ok: true, data };
    }
    return { ok: false, data };
  };

  const deleteSession = async (sessionId) => {
    if (!token) throw new Error("Not authenticated");
    const res = await fetch(`${API}/api/sessions/${sessionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      setSessions(prev => prev.filter(s => (s._id || s.id) !== sessionId));
      return { ok: true };
    }
    const data = await res.json();
    return { ok: false, data };
  };

  return (
    <SessionContext.Provider value={{
      sessions,
      setSessions,
      user,
      loading,
      signup,
      login,
      logout,
      addSession,
      deleteSession,
      fetchSessions
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext };
