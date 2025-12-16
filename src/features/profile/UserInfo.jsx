import React from "react";

export default function UserInfo({ user }) {
  const initial = user?.name?.[0]?.toUpperCase() || "U";
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl font-semibold mb-4">
        {initial}
      </div>
      <h3 className="text-xl font-semibold">{user?.name || "User"}</h3>
      <p className="text-gray-500 text-sm">{user?.email || ""}</p>
    </div>
  );
}
