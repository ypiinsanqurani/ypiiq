import { db } from '../../lib/db.js';
import React from 'react';
import Link from 'next/link';

export default async function LayoutSekolahDinamis({ children, params }) {
  const resolvedParams = await params;
  const slug = (resolvedParams.slug || "").toLowerCase();

  let lembaga = null;

  try {
    const [rows] = await db.query('SELECT * FROM table_lembaga WHERE slug = ?', [slug]);
    if (rows.length > 0) {
      lembaga = rows[0];
    }
  } catch (error) {
    console.error("Gagal konek database di layout:", error);
  }

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col justify-between">
      
   {/* 1. BAGIAN ATAS: NAVBAR */}
<header className="w-full sticky top-0 z-50 bg-slate-950/60 backdrop-blur-md border-b border-slate-800/80 shadow-xl shadow-black/20">
  <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
    
    {/* LOGO & NAMA LEMBAGA (DIBUAT GLOWING & PREMIUM) */}
    <div className="flex items-center gap-3 group">
      {/* Indikator Garis Warna Khas Lembaga di Samping Judul */}
      <div 
        className="w-1.5 h-7 rounded-full transition-all duration-300 group-hover:scale-y-110"
        style={{ 
          backgroundColor: lembaga?.warna_khas || '#6366f1',
          boxShadow: `0 0 12px ${lembaga?.warna_khas || '#6366f1'}` 
        }}
      />
      
      <div>
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {lembaga ? lembaga.nama_lembaga : (
            <span className="text-slate-500 animate-pulse text-sm font-medium tracking-normal lowercase italic">
              memuat profil lembaga...⏳
            </span>
          )}
        </h1>
      </div>
    </div>
          
         <nav className="flex items-center gap-3">
  
  {/* Link: HOME */}
  <Link 
    href={`/${slug}`} 
    className="text-slate-300 hover:text-indigo-400 bg-slate-900/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
  >
    Home
  </Link>

  {/* Link: SEJARAH */}
  <Link 
    href={`/${slug}/sejarah`} 
    className="text-slate-300 hover:text-indigo-400 bg-slate-900/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
  >
    Profile
  </Link>

  {/* Link: GALERI */}
  <Link 
    href={`/${slug}/galeri`} 
    className="text-slate-300 hover:text-indigo-400 bg-slate-900/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
  >
    Galeri
  </Link>

  {/* Link: KONTAK */}
  <Link 
    href={`/${slug}/kontak`} 
    className="text-slate-300 hover:text-indigo-400 bg-slate-900/20 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200"
  >
    Kontak
  </Link>

  {/* Pembatas Spasi Kosong */}
  <div className="w-2" />

  {/* Tombol: KELUAR PORTAL (Minimalis Outline, Anti-Gagal di Semua Versi Tailwind) */}
  <Link 
    href="/" 
    className="border border-rose-500/40 hover:border-rose-500 bg-transparent hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
  >
    ← Keluar Portal
  </Link>

</nav>
        </div>
      </header>

      {/* 2. BAGIAN TENGAH: TEMPAT ARTIKEL (DINAMIS SIKAT!) */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* 3. BAGIAN BAWAH: IDENTITAS SEKOLAH (FOOTER) */}
      <footer className="bg-slate-900 text-slate-300 mt-12 border-t-4 border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          
          {/* Kolom 1: Nama Sekolah */}
          <div>
            <h3 className="font-bold text-white text-base uppercase mb-2">
              {lembaga ? lembaga.nama_lembaga : "Nama Sekolah"}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Membentuk generasi cerdas, kreatif, dan berakhlak mulia di bawah naungan yayasan terpadu.
            </p>
          </div>

          {/* Kolom 2: Identitas Kontak (Dinamis dari DB jika ada) */}
          <div>
            <h3 className="font-bold text-white text-base mb-2">Hubungi Kami</h3>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>📍 {lembaga?.alamat || "Sonorejo, Grogol, Kediri"}</li>
              <li>📞 {lembaga?.telepon || "+62 851-1313-3770"}</li>
              
            </ul>
          </div>

          {/* Kolom 3: Hak Cipta */}
          <div className="flex flex-col justify-end md:items-end">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} {lembaga ? lembaga.nama_lembaga : "Sekolah"}. All Rights Reserved.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}