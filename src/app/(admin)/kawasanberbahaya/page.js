"use client";

import React, { useState } from 'react';

export default function HalamanLoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pesanError, setPesanError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setPesanError("");
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPesanError(data.message || "Gagal Login!");
        setIsLoading(false);
        return;
      }

      // SIMPAN IDENTITAS LOGIN DI LOCALSTORAGE
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role_lembaga", data.role);
      localStorage.setItem("nama_admin", data.namaAdmin);

      // PINDAH KELUAR KE DASHBOARD
      window.location.href = "/dashboard";
    } catch (err) {
      setPesanError("Gagal terhubung ke server!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center font-sans text-slate-100 px-4">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex bg-slate-800 p-3 rounded-2xl border border-slate-700/50 mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">Pusat Kendali</h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">Masukan kredensial akun admin kamu.</p>
        </div>

        {pesanError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-center font-semibold">
            ⚠️ {pesanError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username admin" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Password Security</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500 transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-lg mt-2 cursor-pointer hover:opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Memeriksa DB..." : "Monggo Mlebet →"}
          </button>
        </form>

      </div>
    </div>
  );
}