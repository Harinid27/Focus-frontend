import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSessions } from "../../context/SessionContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useSessions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handle=async(e)=> {
    e.preventDefault();
    const res = await login(email, password);
    if (res.ok) navigate("/dashboard");
    else alert(res.data.message || "Login failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0c0f] to-[#1b1b1f] px-4 font-[Poppins]">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center tracking-wide">Welcome Back</h2>

        <form className="space-y-6" onSubmit={handle}>
          <div>
            <label className="text-gray-300 text-sm">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl" required />
          </div>
          <div>
            <label className="text-gray-300 text-sm">Password</label>
            <div className="relative">
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="w-full mt-2 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl pr-12" required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-purple-600 rounded-xl">Login</button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">Don’t have an account? <Link to="/signup" className="text-purple-400">Sign up</Link></p>
      </div>
    </div>
  );
}
