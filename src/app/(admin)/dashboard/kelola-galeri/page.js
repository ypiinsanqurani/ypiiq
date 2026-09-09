"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HalamanKelolaGaleri() {
  const [roleLembaga, setRoleLembaga] = useState("");
  const [namaAdmin, setNamaAdmin] = useState("");
  const [listGaleri, setListGaleri] = useState([]);
  
  // State Input Form
  const [caption, setCaption] = useState("");
  const [slugLembaga, setSlugLembaga] = useState("");
  const [fileGambar, setFileGambar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [isModalTerbuka, setIsModalTerbuka] = useState(false);

  const fileInputRef = useRef(null);

  // 1. Tarik Data Galeri dari Database lewat API
  const muatDaftarGaleri = async (slug) => {
    try {
      const res = await fetch(`/api/galeri?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setListGaleri(data);
      }
    } catch (err) {
      console.error("Gagal muat data galeri:", err);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role_lembaga");
    const nama = localStorage.getItem("nama_admin");

    if (!role) {
      window.location.href = "/login";
    } else {
      setRoleLembaga(role);
      setNamaAdmin(nama || "Admin");
      const slugAktif = role === "all" ? "sd" : role;
      setSlugLembaga(slugAktif);
      
      muatDaftarGaleri(role);
    }
  }, []);

  // 2. Handler Nyari Preview Gambar pas dipilih dari Komputer
  const handlePilihGambar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileGambar(file);
    setPreviewUrl(URL.createObjectURL(file)); // Buat link preview sementara
  };

  // 3. Handler Create Data (Upload ke Server & Simpan DB)
  const handleSubmitGaleri = async (e) => {
    e.preventDefault();
    if (!fileGambar) {
      alert("Pilih fotonya dulu dong, ustadz! 📸");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("aksi", "simpan_galeri");
    formData.append("slug_lembaga", slugLembaga);
    formData.append("caption", caption);
    formData.append("image", fileGambar);

    try {
      const response = await fetch('/api/galeri', { method: 'POST', body: formData });
      if (response.ok) {
        setCaption("");
        setFileGambar(null);
        setPreviewUrl("");
        setIsModalTerbuka(false);
        alert("Alhamdulillah! Foto kegiatan berhasil dipajang di galeri publik! 🚀🎉");
        muatDaftarGaleri(roleLembaga); // Refresh list gambar
      } else {
        alert("Gagal menyimpan ke database.");
      }
    } catch (error) {
      alert("Koneksi API galeri jebol!");
    } finally {
      setLoading(false);
    }
  };

  // 4. Handler Delete Data (Hapus Gambar)
  const handleHapusGaleri = async (id, ketFoto) => {
    const yakin = confirm(`Yakin mau menghapus foto: "${ketFoto}" dari galeri?`);
    if (!yakin) return;

    try {
      const res = await fetch(`/api/galeri?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Sukses! Foto dihapus dari album.");
        muatDaftarGaleri(roleLembaga); // Refresh list gambar otomatis
      } else {
        alert("Gagal menghapus gambar.");
      }
    } catch (error) {
      alert("Error koneksi saat menghapus.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <span className="text-2xl">📸</span>
            <div>
              <h1 className="font-black text-xs tracking-wider uppercase text-white truncate max-w-[150px]">{namaAdmin}</h1>
              <p className="text-[9px] font-bold text-indigo-400">Akses: {roleLembaga.toUpperCase()}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Link href="/dashboard" className="block w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition">
              ⬅️ Menu Utama
            </Link>
          
            <button className="w-full text-left bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md cursor-default">
              🖼️ Dokumentasi Galeri
            </button>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase text-center py-3 rounded-xl transition border border-red-500/10 cursor-pointer">
          ❌ Logout
        </button>
      </aside>

      {/* WORKSPACE UTAMA: GRID FOTO-FOTO GALERI */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-x-hidden">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Galeri Dokumentasi</h2>
            <p className="text-xs text-slate-400 mt-1">Kelola foto dokumentasi kegiatan yang nampang di website publik.</p>
          </div>
          <button 
            onClick={() => { setIsModalTerbuka(true); setPreviewUrl(""); setCaption(""); }}
            className="bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-md cursor-pointer transition active:scale-95"
          >
            📸 Upload Foto Baru
          </button>
        </header>

        {/* INTERFACE GRID ALBUM FOTO */}
        {listGaleri.length === 0 ? (
          <div className="text-center py-20 bg-slate-950/30 border border-dashed border-slate-800 rounded-3xl">
            <span className="text-4xl block mb-3">🖼️</span>
            <p className="text-xs text-slate-500 font-medium italic">
              Belum ada foto kegiatan yang di-upload ustadz. Yuk abadikan momen santri!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listGaleri.map((item) => (
              <div key={item.id} className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group relative">
                
                {/* Gambar Kegiatan */}
                <div className="w-full h-44 bg-black overflow-hidden relative">
                  <img src={item.url_gambar} alt={item.caption} className="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                  <span className="absolute top-2 left-2 bg-slate-950/80 text-indigo-400 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-slate-800">
                    {item.slug_lembaga}
                  </span>
                </div>

                {/* Keterangan & Tombol Hapus */}
                <div className="p-4 bg-slate-900/40 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                  <button 
                    onClick={() => handleHapusGaleri(item.id, item.caption)}
                    className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-[10px] uppercase py-2 rounded-xl transition cursor-pointer"
                  >
                    🗑️ Hapus Foto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ----------------------------------------------------------------- */}
      {/* MODAL MODAL POP-UP UPLOAD GAMBER (MUNCUL PAS TRUE)               */}
      {/* ----------------------------------------------------------------- */}
      {isModalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsModalTerbuka(false)}></div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl relative z-10 flex flex-col p-6 animate-scale-up">
            <header className="flex justify-between items-center pb-3 border-b border-slate-800 mb-5">
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Upload Foto Kegiatan</h3>
              <button onClick={() => setIsModalTerbuka(false)} className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">✕</button>
            </header>

            <form onSubmit={handleSubmitGaleri} className="space-y-5">
              {/* Pilihan Lembaga */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Kategori Lembaga</label>
                {roleLembaga === 'all' ? (
                  <select value={slugLembaga} onChange={(e) => setSlugLembaga(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-xs font-bold uppercase outline-none">
                    <option value="sd">SDIT</option>
                    <option value="tk">TKIT</option>
                    <option value="smp">SMPIT</option>
                  </select>
                ) : (
                  <input type="text" value={slugLembaga.toUpperCase()} disabled className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-xl px-3 py-2.5 text-xs font-bold uppercase select-none cursor-not-allowed" />
                )}
              </div>

              {/* Area Seret / Klik Pilih File */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">File Foto Dokumentasi</label>
                <input type="file" ref={fileInputRef} onChange={handlePilihGambar} accept="image/*" className="hidden" />
                
                {previewUrl ? (
                  <div className="relative w-full h-40 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black text-white uppercase cursor-pointer transition">
                      🔄 Ganti Gambar
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="w-full h-32 bg-slate-950 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-indigo-500/50 transition"
                  >
                    <span className="text-2xl">📸</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Klik Cari Foto Komputer</span>
                  </div>
                )}
              </div>

              {/* Isian Keterangan */}
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Caption / Judul Kegiatan</label>
                <textarea 
                  value={caption} 
                  onChange={(e) => setCaption(e.target.value)} 
                  placeholder=" Di isi caption yang keren yak uusss!!" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 h-20 resize-none" 
                  required
                />
              </div>

              {/* Button Aksi */}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setIsModalTerbuka(false)} className="flex-1 bg-slate-800 text-slate-300 font-bold text-[10px] uppercase py-3 rounded-xl hover:bg-slate-700">Batal</button>
                <button type="submit" disabled={loading} className="flex-1 bg-linear-to-r from-indigo-500 to-violet-600 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-md disabled:opacity-50">
                  {loading ? "Mengupload..." : "Pajang Foto 🚀"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}