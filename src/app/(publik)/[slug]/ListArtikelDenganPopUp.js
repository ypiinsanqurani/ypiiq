"use client";

import React, { useState } from 'react';

export default function ListArtikelDenganPopUp(props) {
  // State untuk melacak artikel LAMA mana yang lagi dibuka pop-up nya
  const [artikelAktif, setArtikelAktif] = useState(null);

  // Otomatis nyari mana variabel yang isinya array data dari file sebelah
  const listDataBerita = 
    props.artikel || 
    props.data || 
    props.awalArtikel || 
    props.listArtikel || 
    Object.values(props).find(val => Array.isArray(val)) || 
    [];

  // 🕵️ Fungsi untuk ekstrak gambar atau video pertama dari HTML isi_artikel (khusus artikel lama)
  const ambilMediaPertama = (htmlString) => {
    if (!htmlString) return { tipe: 'kosong', url: null };

    // Cari tag <img>
    const matchImg = htmlString.match(/<img[^>]+src="([^">]+)"/);
    if (matchImg && matchImg[1]) {
      return { tipe: 'gambar', url: matchImg[1] };
    }

    // Cari tag <iframe> (YouTube)
    const matchIframe = htmlString.match(/<iframe[^>]+src="([^">]+)"/);
    if (matchIframe && matchIframe[1]) {
      return { tipe: 'youtube', url: matchIframe[1] };
    }

    // Cari tag <video>
    const matchVideo = htmlString.match(/<video[^>]+src="([^">]+)"/);
    if (matchVideo && matchVideo[1]) {
      return { tipe: 'video', url: matchVideo[1] };
    }

    return { tipe: 'kosong', url: null };
  };

  // Fungsi pembantu untuk ekstrak ID Video YouTube
  const ambilIdYoutube = (url) => {
    if (!url) return null;
    const match = url.match(/\/embed\/([^?#]+)/);
    return match ? match[1] : null;
  };

  // DIPISAHKAN:
  // Artikel Pertama (Index 0) -> Artikel Terbaru (Murni artikel tanpa banner buatan)
  // Artikel Sisa (Index 1 dst) -> Artikel Lama (Tetap ada Thumbnail Card & Pop-up)
  const artikelTerbaru = listDataBerita.length > 0 ? listDataBerita[0] : null;
  const artikelLama = listDataBerita.length > 1 ? listDataBerita.slice(1) : [];

  if (listDataBerita.length === 0) {
    return (
      <div className="text-center w-full py-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
        <span className="text-3xl block mb-2">📌</span>
        <p className="text-xs text-slate-500 font-medium italic">
          Belum ada berita atau pengumuman terbaru dari lembaga ini.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12">
      
      {/* ========================================================================= */}
      {/* 🌟 1. SECTION ARTIKEL TERBARU (MURNI TAMPILAN ARTIKEL DENGAN KONTEN ASLI) */}
      {/* ========================================================================= */}
      {artikelTerbaru && (
        <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Badge Penanda */}
          <div className="flex items-center gap-2 mb-4">
            <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">
              🔥 Berita Utama / Terbaru
            </span>
          </div>

          {/* Judul & Meta Tanggal */}
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-snug mb-2">
            {artikelTerbaru.judul}
          </h2>
          <p className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-2">
            <span>📅 {new Date(artikelTerbaru.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </p>

          {/* Isi Murni Artikel Terbaru (Tanpa Banner Tambahan, Gambar Asli Otomatis Diatur CSS) */}
          <div 
            className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base space-y-4
                       prose-p:my-3 prose-strong:text-white prose-a:text-indigo-400
                       [&_img]:rounded-2xl [&_img]:w-full [&_img]:max-h-[500px] [&_img]:object-cover [&_img]:shadow-xl [&_img]:my-6
                       [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-2xl [&_iframe]:shadow-xl [&_iframe]:my-6
                       [&_video]:w-full [&_video]:rounded-2xl [&_video]:shadow-xl [&_video]:my-6"
            dangerouslySetInnerHTML={{ __html: artikelTerbaru.isi_artikel }}
          />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 📚 2. SECTION ARTIKEL LAMA (DAFTAR KARTU DENGAN THUMBNAIL & POP-UP) */}
      {/* ========================================================================= */}
      {artikelLama.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>📰</span> Berita & Arsip Sebelumnya
            </h3>
            <span className="text-xs text-slate-500 font-medium">{artikelLama.length} Artikel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artikelLama.map((art) => {
              const media = ambilMediaPertama(art.isi_artikel);
              let urlThumbnail = "/api/placeholder/400/250";
              
              if (media.tipe === 'gambar') {
                urlThumbnail = media.url;
              } else if (media.tipe === 'youtube') {
                const ytId = ambilIdYoutube(media.url);
                if (ytId) urlThumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
              }

              return (
                <div 
                  key={art.id}
                  onClick={() => setArtikelAktif(art)}
                  className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
                >
                  {/* Thumbnail Kartu Artikel Lama */}
                  <div className="relative w-full h-44 bg-slate-950 overflow-hidden">
                    {media.tipe === 'video' ? (
                      <video src={media.url} muted className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <img 
                        src={urlThumbnail} 
                        alt={art.judul}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=500"; }}
                      />
                    )}
                    {(media.tipe === 'youtube' || media.tipe === 'video') && (
                      <div className="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider flex items-center gap-1 shadow-md">
                        📺 VIDEO
                      </div>
                    )}
                  </div>

                  {/* Teks Kartu */}
                  <div className="p-5 flex-1 flex flex-col justify-between min-h-[140px]">
                    <div>
                      <div className="text-[9px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-md inline-block mb-2.5 border border-indigo-500/10">
                        📢 Arsip Berita
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                        {art.judul}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60">
                      <p className="text-[11px] text-slate-500 font-medium">
                        {new Date(art.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-0.5">
                        Baca <span className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 🎬 MODAL POP-UP UNTUK BACA ARTIKEL LAMA */}
      {/* ========================================================================= */}
      {artikelAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            onClick={() => setArtikelAktif(null)}
          ></div>
          
          <div className="bg-white text-slate-900 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col p-6 md:p-8 animate-scale-up">
            
            <header className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 tracking-widest px-2.5 py-1 rounded-md border border-indigo-100">
                  Arsip Berita
                </span>
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-3 leading-tight">
                  {artikelAktif.judul}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-1.5">
                  📅 Diposting pada: {new Date(artikelAktif.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setArtikelAktif(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs hover:bg-rose-600 hover:text-white transition-colors cursor-pointer flex-shrink-0 shadow-xs"
              >
                ✕
              </button>
            </header>

            {/* Banner Media Pop-up Artikel Lama */}
            {(() => {
              const mediaUtama = ambilMediaPertama(artikelAktif.isi_artikel);
              if (mediaUtama.tipe === 'gambar') {
                return (
                  <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-5 shadow-inner">
                    <img src={mediaUtama.url} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                );
              } else if (mediaUtama.tipe === 'youtube') {
                return (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 shadow-md bg-black">
                    <iframe width="100%" height="100%" src={mediaUtama.url} allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full"></iframe>
                  </div>
                );
              } else if (mediaUtama.tipe === 'video') {
                return (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden mb-5 shadow-md bg-black">
                    <video src={mediaUtama.url} autoPlay muted loop playsInline controls className="w-full h-full object-cover" />
                  </div>
                );
              }
              return null;
            })()}

            {/* Isi Teks Pop-up (Menyembunyikan gambar asli di dalam HTML agar tidak bertumpuk dengan banner) */}
            <div 
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-xs md:text-sm space-y-4
                         prose-p:my-2 prose-strong:text-slate-900
                         [&_img]:hidden [&_iframe]:hidden [&_video]:hidden"
              dangerouslySetInnerHTML={{ __html: artikelAktif.isi_artikel }} 
            />

            <footer className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="button"
                onClick={() => setArtikelAktif(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
              >
                Tutup Berita
              </button>
            </footer>

          </div>
        </div>
      )}

    </div>
  );
}