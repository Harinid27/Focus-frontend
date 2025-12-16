import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSessions } from "../../context/SessionContext";
import ErrorNotification from "../../components/ErrorNotification";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useSessions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handle=async(e)=> {
    e.preventDefault();
    setError("");
    const res = await login(email, password);
    if (res.ok) navigate("/dashboard");
    else setError(res.data.message || "Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-white bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] animate-fadeIn">
      <div className="max-w-md w-full animate-slideInUp">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-blue-500/20 backdrop-blur-xl shadow-2xl">
          <h2 className="text-3xl font-semibold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Sign In</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Access your focus tracking dashboard</p>

          <form className="space-y-5" onSubmit={handle}>
            <div className="animate-slideInDown" style={{animationDelay: '0.1s'}}>
              <label className="text-gray-300 text-xs font-semibold mb-2 block uppercase tracking-wider">Email Address</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg placeholder-gray-600 focus:outline-none focus:border-blue-500/50 hover:border-blue-500/30 smooth-transition" required />
            </div>
            <div className="animate-slideInDown" style={{animationDelay: '0.2s'}}>
              <label className="text-gray-300 text-xs font-semibold mb-2 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg placeholder-gray-600 focus:outline-none focus:border-blue-500/50 hover:border-blue-500/30 smooth-transition pr-12" required />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-400 smooth-transition text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 border border-blue-500/50 text-white font-semibold smooth-transition active:scale-95 shadow-lg shadow-blue-500/20 animate-slideInDown text-sm" style={{animationDelay: '0.3s'}}>Sign In</button>
          </form>

          <p className="text-gray-500 text-center mt-6 text-sm">New user? <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold smooth-transition">Create an account</Link></p>
        </div>
      </div>
      <ErrorNotification message={error} onClose={() => setError("")} />
    </div>
  );
}
