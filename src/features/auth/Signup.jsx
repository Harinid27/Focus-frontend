import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSessions } from "../../context/SessionContext";
import ErrorNotification from "../../components/ErrorNotification";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useSessions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signup(name, email, password);
    if (res.ok) navigate("/dashboard");
    else setError(res.data.message || "Signup failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] px-4 animate-fadeIn">
      <div className="w-full max-w-md bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 shadow-2xl animate-slideInUp">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Create Account</h2>
          <p className="text-gray-500 text-sm">Get started with focus tracking</p>
        </div>
        <form className="space-y-5" onSubmit={handle}>
          <div className="animate-slideInDown" style={{animationDelay: '0.1s'}}>
            <label className="text-gray-300 text-xs font-semibold mb-2 block uppercase tracking-wider">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-blue-500/30 text-white rounded-lg focus:border-blue-500/50 focus:bg-white/[0.08] smooth-transition" required />
          </div>
          <div className="animate-slideInDown" style={{animationDelay: '0.2s'}}>
            <label className="text-gray-300 text-xs font-semibold mb-2 block uppercase tracking-wider">Email Address</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-blue-500/30 text-white rounded-lg focus:border-blue-500/50 focus:bg-white/[0.08] smooth-transition" required />
          </div>
          <div className="animate-slideInDown" style={{animationDelay: '0.3s'}}>
            <label className="text-gray-300 text-xs font-semibold mb-2 block uppercase tracking-wider">Password</label>
            <div className="relative">
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-blue-500/30 text-white rounded-lg focus:border-blue-500/50 focus:bg-white/[0.08] smooth-transition pr-12" required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-400 smooth-transition text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 border border-blue-500/50 text-white font-semibold text-sm rounded-lg smooth-transition transform active:scale-95 shadow-lg shadow-blue-500/20 animate-slideInDown" style={{animationDelay: '0.4s'}}>Create Account</button>
        </form>
        <p className="text-gray-500 text-center mt-6 text-sm">Already have an account? <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold smooth-transition">Sign in</Link></p>
      </div>
      <ErrorNotification message={error} onClose={() => setError("")} />
    </div>
  );
}
