"use client";

import React, { useState } from 'react';

export default function HalamanKontakLembaga() {
  const [nama, setNama] = useState('');
  const [pesan, setPesan] = useState('');

  const nomorWA = "6285113133770"; // Format WA: gunakan 62 tanpa '+' atau spasi/strip

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
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-slate-800">Hubungi Kami</h2>
        <p className="text-sm text-slate-400 mt-1">Punya pertanyaan? Silakan kirim pesan atau hubungi kontak di bawah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LAYANAN INFORMASI CEPAT */}
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm mb-1">📍 Alamat</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Dsn Sumbertowo, Ds. Sonorejo, Kec. Grogol, Kab. Kediri</p>
          </div>

          {/* CALL CENTER BISA DIKLIK LANGSUNG KE WA */}
          <a 
            href={`https://wa.me/${nomorWA}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-4 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-100 transition group cursor-pointer"
          >
            <h3 className="font-bold text-emerald-800 text-sm mb-1 flex items-center justify-between">
              <span>📞 Call Center (WA)</span>
              <span className="text-xs text-emerald-600 group-hover:translate-x-0.5 transition-transform">➡️</span>
            </h3>
            <p className="text-xs text-emerald-700 font-mono font-semibold">+62 851-1313-3770</p>
          </a>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm mb-1">✉️ Email Resmi</h3>
            <p className="text-xs text-slate-500 font-mono">ypiinsanquranii@gmail.com</p>
          </div>
        </div>

        {/* FORM PESAN (INTEGRASI WA) */}
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Kirim Kotak Saran / Pesan</h3>
          <form onSubmit={handleKirimWA} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
              <input 
                type="text" 
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama Anda" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition" 
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Isi Pesan</label>
              <textarea 
                rows="4" 
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Ketik pesan atau pertanyaan Anda di sini..." 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition resize-none"
                required
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>💬 Kirim Pesan via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
