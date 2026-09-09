"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function HalamanPublikGaleri() {
  const params = useParams();
  const slug = params?.slug; // Menangkap 'tk', 'sd', atau 'smp' dari URL

  const [listGaleri, setListGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk fitur Lightbox (Zoom Foto Fullscreen)
  const [fotoAktif, setFotoAktif] = useState(null);

  // Ambil data foto dari API backend yang udah lo buat tadi
  useEffect(() => {
    const ambilDataGaleri = async () => {
      try {
        // Minta data ke pelayan API berdasarkan slug lembaga aktif
        const res = await fetch(`/api/galeri?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setListGaleri(data);
        }
      } catch (err) {
        console.error("Gagal memuat galeri publik:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      ambilDataGaleri();
    }
  }, [slug]);

  // Fungsi pembantu buat nampilin nama lembaga yang rapi
  const dapatkanNamaLembaga = (kodeSlug) => {
    if (kodeSlug === "sd") return "SDIT Insan Qurani";
    if (kodeSlug === "tk") return "TKIT Insan Qurani";
    if (kodeSlug === "smp") return "SMPIT Insan Qurani";
    return "Lembaga";
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[500px]">
      
      {/* Aksen Hiasan Cahaya Latar Belakang */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER UTAMA GALERI */}
      <header className="mb-10 border-b border-slate-800/60 pb-6 relative z-10">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-3 py-1 rounded-md inline-block border border-indigo-500/10">
          📸 Dokumentasi Kegiatan
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-3">
          Galeri Foto {dapatkanNamaLembaga(slug)}
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
          Melihat lebih dekat keseruan aktivitas, kreativitas, dan momentum belajar mengajar para santri.
        </p>
      </header>

      {/* INTERFACE GRID FOTO / LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Memuat Album Foto... ⏳</p>
        </div>
      ) : listGaleri.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl relative z-10">
          <span className="text-4xl block mb-3">🖼️</span>
          <p className="text-xs text-slate-500 font-medium italic">
            Belum ada dokumentasi foto kegiatan yang dipajang untuk lembaga ini.
          </p>
        </div>
      ) : (
        /* GRID KARTU FOTO MODERN */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {listGaleri.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setFotoAktif(item)}
              className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-1 flex flex-col"
            >
              {/* Wadah Frame Foto */}
              <div className="w-full h-48 bg-black overflow-hidden relative">
                <img 
                  src={item.url_gambar} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                {/* Efek Overlay Gelap pas Kursor Masuk */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider bg-indigo-600 px-2 py-1 rounded shadow-sm">
                    🔍 Perbesar Foto
                  </span>
                </div>
              </div>

              {/* Caption Penjelasan Kegiatan */}
              <div className="p-4 bg-slate-950/20 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-2">
                  {item.caption}
                </p>
                <div className="text-[9px] text-slate-500 font-bold uppercase mt-3 tracking-wider">
                  🗓️ {new Date(item.tanggal_input || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 🌌 MODAL LIGHTBOX INTERAKTIF (ZOOM FULLSCREEN PAS FOTO DIKLIK)     */}
      {/* ----------------------------------------------------------------- */}
      {fotoAktif && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 animate-fade-in"
          onClick={() => setFotoAktif(null)} // Klik di mana aja buat nutup modal
        >
          {/* Tombol Silang Pojok Kanan Atas */}
          <button 
            onClick={() => setFotoAktif(null)}
            className="absolute top-6 right-6 w-10 h-10 bg-slate-900 hover:bg-rose-600 border border-slate-800 text-white rounded-full flex items-center justify-center font-black transition text-sm cursor-pointer shadow-xl"
          >
            ✕
          </button>

          {/* Kontainer Utama Preview */}
          <div 
            className="max-w-4xl w-full flex flex-col gap-4 relative animate-scale-up"
            onClick={(e) => e.stopPropagation()} // Supaya kalau gambarnya diklik modal gak ketutup
          >
            {/* Foto Ukuran Gede */}
            <div className="w-full max-h-[70vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
              <img 
                src={fotoAktif.url_gambar} 
                alt={fotoAktif.caption} 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Kotak Keterangan Caption Gambar */}
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-xs shadow-xl">
              <span className="text-[9px] font-black tracking-widest uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-2.5 py-1 rounded mb-2 inline-block">
                Keterangan Acara
              </span>
              <p className="text-xs md:text-sm text-slate-200 font-semibold leading-relaxed">
                {fotoAktif.caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}