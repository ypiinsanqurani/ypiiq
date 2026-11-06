"use client";

import React, { useState } from 'react';

export default function HalamanKontakLembaga() {
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');

  const nomorWA = "6285113133770"; // Format WA: 62 tanpa '+' atau spasi/strip

  // HANDLER FOR FORM SUBMIT KE WA
  const handleKirimWA = (e) => {
    e.preventDefault();
    if (!nama || !pesan) {
      alert("Silakan isi nama dan pesan Anda terlebih dahulu!");
      return;
    }

    // Format pesan otomatis yang akan masuk ke WA
    const teksTersusun = `Assalamu'alaikum Admin, perkenalkan saya:\n\n*Nama:* ${nama}\n*Pesan:* ${pesan}`;
    
    // Convert spasi & karakter khusus agar aman di URL
    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(teksTersusun)}`;
    
    // Buka WhatsApp di tab baru
    window.open(urlWA, '_blank');
  };

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 md:p-10 bg-white rounded-3xl shadow-xl border border-slate-100 font-sans">
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hubungi Kami</h2>
        <p className="text-sm text-slate-500 mt-1">Punya pertanyaan seputar lembaga? Silakan kirim pesan atau hubungi kontak di bawah ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LAYANAN INFORMASI CEPAT */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
              <span>📍</span> Alamat
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Dsn Sumbertowo, Ds. Sonorejo, Kec. Grogol, Kab. Kediri
            </p>
          </div>

          {/* CALL CENTER LANGSUNG KE WA */}
          <a 
            href={`https://wa.me/${nomorWA}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-5 bg-emerald-50 hover:bg-emerald-100/70 rounded-2xl border border-emerald-100/80 transition-all duration-300 group cursor-pointer shadow-xs"
          >
            <h3 className="font-bold text-emerald-900 text-sm mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-2"><span>📞</span> Call Center (WA)</span>
              <span className="text-xs text-emerald-600 group-hover:translate-x-1 transition-transform">➡️</span>
            </h3>
            <p className="text-xs text-emerald-800 font-mono font-bold tracking-wide">+62 851-1313-3770</p>
          </a>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
            <h3 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
              <span>✉️</span> Email Resmi
            </h3>
            <p className="text-xs text-slate-600 font-mono font-medium">ypiinsanquranii@gmail.com</p>
          </div>
        </div>

        {/* FORM KOTAK SARAN & PESAN (INTEGRASI WA) */}
        <div className="md:col-span-2 bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-5 text-lg">Kirim Kotak Saran / Pesan</h3>
          
          <form onSubmit={handleKirimWA} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda..." 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition" 
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">Isi Pesan</label>
              <textarea 
                rows="4" 
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Ketik pesan, kritik, saran, atau pertanyaan Anda di sini..." 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬 Kirim Pesan via WhatsApp</span>
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
