"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [namaAdmin, setNamaAdmin] = useState("");
  const [roleLembaga, setRoleLembaga] = useState("");

  useEffect(() => {
    // Ambil data login murni dari localStorage
    const statusLogin = localStorage.getItem("isLoggedIn");
    const storedNama = localStorage.getItem("nama_admin");
    const storedRole = localStorage.getItem("role_lembaga");

    if (!statusLogin) {
      // Kalau belum login, lempar balik ke kawasanberbahaya
      window.location.href = "/kawasanberbahaya";
    } else {
      setNamaAdmin(storedNama || "Admin");
      setRoleLembaga(storedRole || "ALL");
      setIsAuth(true);
    }
  }, []);

  // Fungsi Logout Murni tanpa cookie
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/kawasanberbahaya";
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center text-sm">
        Memeriksa akses...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <span className="text-2xl">🕌</span>
            <div>
              <h1 className="font-black text-xs tracking-wider uppercase text-white truncate max-w-[150px]">
                {namaAdmin}
              </h1>
              <p className="text-[9px] font-bold text-indigo-400">
                Akses: {roleLembaga.toUpperCase()}
              </p>
            </div>
          </div>
          <nav className="space-y-2">
            <Link 
              href="/dashboard" 
              className="block w-full text-left bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md"
            >
              🎛️ Pusat Komando
            </Link>
          </nav>
        </div>

        {/* TOMBOL LOGOUT MURNI LOCALSTORAGE */}
        <button 
          onClick={handleLogout} 
          className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs uppercase text-center py-3 rounded-xl transition border border-rose-500/10 cursor-pointer mt-6"
        >
          ❌ Logout
        </button>
      </aside>

      {/* WORKSPACE UTAMA */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <header className="mb-8 p-6 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 text-9xl opacity-5 pointer-events-none">🕌</div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Haaiiiiii {namaAdmin}! 👋
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            🔥 Semangat Ngetik Artikelnya pak/bu guyuu!<br/><br/>
            Yok gas terus ngisi artikel! 😎<br/><br/>
            Inget ya, setiap artikel yang kamu bikin itu bukan cuma nambah isi website, tapi juga jadi sumber informasi buat banyak orang. Makin rajin update artikel, makin hidup websitenya, makin keren juga tampilannya.<br/><br/>
            Nggak usah mikir harus langsung sempurna. Yang penting mulai dulu, satu artikel demi satu artikel. Lama-lama bakal banyak, dan hasilnya pasti bikin bangga.<br/><br/>
            Kalau lagi mentok ide, santai aja. Cari inspirasi, ngobrol sama guru, lihat kegiatan sekolah, atau manfaatin AI buat bantu nyusun draft. Yang penting tetap pakai sentuhanmu biar artikelnya terasa lebih hidup.<br/><br/>
            Ingat, website yang aktif itu cerminan sekolah yang aktif. Jadi setiap kali kamu klik tombol Publish, berarti kamu lagi ikut membangun citra sekolah jadi lebih baik. 💪<br/><br/>
            Hari ini satu artikel, besok satu lagi. Lama-lama website penuh dengan karya keren buatan kamu sendiri.<br/><br/>
            Gaskeun and sikaaaaatttt, semangaaaattt!! 🚀🔥
          </p>
        </header>

        {/* MENU NAVIGASI UTAMA (CRUD CENTER) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* CARD MENU 1: KELOLA ARTIKEL */}
          <Link 
            href="/dashboard/kelola-artikel" 
            className="group bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 shadow-xl transition flex flex-col justify-between min-h-[190px]"
          >
            <div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition duration-300">
                📝
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">Berita & Artikel</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Pusat kendali artikel. Di sini Ustadz bisa nyari data lama, ngedit typo, hapus berita, atau bikin artikel multi-media baru.
              </p>
            </div>
            <div className="text-xs font-black text-indigo-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Buka Mading Artikel <span>→</span>
            </div>
          </Link>

          {/* CARD MENU 2: KELOLA GALERI */}
          <Link 
            href="/dashboard/kelola-galeri" 
            className="group bg-slate-950/40 hover:bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-6 shadow-xl transition flex flex-col justify-between min-h-[190px]"
          >
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition duration-300">
                🖼️
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Galeri Foto</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tempat upload dokumentasi kegiatan sekolah. Tambah atau hapus foto-foto estetik biar dilirik wali santri baru.
              </p>
            </div>
            <div className="text-xs font-black text-emerald-400 mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Buka Galeri Foto <span>→</span>
            </div>
          </Link>

        </div>
      </main>

    </div>
  );
}