import { db } from '@/app/lib/db.js';
import React from 'react';
// Kita panggil komponen Client khusus pop-up yang kita rakit di bawah
import ListArtikelDenganPopUp from './ListArtikelDenganPopUp';

export default async function HalamanLembagaDinamis(props) {
  const params = await props.params;
  const slug = (params.slug || "").toLowerCase();

  let artikelList = [];
  let lembaga = null;

  try {
    // 1. Ambil data lembaga dari database
    const [rowsLembaga] = await db.query('SELECT * FROM table_lembaga WHERE slug = ?', [slug]);
    if (rowsLembaga.length > 0) {
      lembaga = rowsLembaga[0];
      
      // 2. Ambil artikel khusus sekolah ini (ANTI TERCAMPUR!)
      const [rowsArtikel] = await db.query(
        'SELECT * FROM table_artikel WHERE slug_lembaga = ? ORDER BY id DESC', 
        [slug]
      );
      artikelList = rowsArtikel;
    }
  } catch (error) {
    console.error("Gagal narik data artikel:", error);
  }

  if (!lembaga) {
    return <div className="text-center py-20 font-black text-red-500">Lembaga Tidak Ditemukan.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto mt-8 p-6 font-sans">
      {/* HEADER UTAMA */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Berita & Artikel Terbaru
        </h2>
        <p className="text-sm text-slate-500">Informasi terupdate seputar kegiatan di {lembaga.nama_lembaga}.</p>
      </div>

      {/* JIKA BELUM ADA ARTIKEL */}
      {artikelList.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-lg font-medium mb-1">Belum ada artikel diinput 📝</p>
          <p className="text-xs">Artikel khusus untuk sekolah <span className="font-bold text-slate-600 uppercase">{slug}</span> bakal muncul di sini.</p>
        </div>
      ) : (
        /* KUNCI UTAMA: Kita lempar datanya ke komponen pembaca pop-up di bawah */
        <ListArtikelDenganPopUp artikelList={artikelList} slug={slug} />
      )}
    </main>
  );
}
