"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function HalamanKelolaArtikel() {
  const [roleLembaga, setRoleLembaga] = useState("");
  const [namaAdmin, setNamaAdmin] = useState("");
  const [listArtikel, setListArtikel] = useState([]);
  
  // State Form Editor
  const [judul, setJudul] = useState("");
  const [slugLembaga, setSlugLembaga] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusStatus, setStatusStatus] = useState({ tipe: "", pesan: "" });
  
  // Control Modal Pop-up Tambah Artikel
  const [isModalTerbuka, setIsModalTerbuka] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fungsi Tarik Data dari Database MySQL lewat API
  const muatDaftarArtikel = async (slug) => {
    try {
      const res = await fetch(`/api/artikel?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        setListArtikel(data);
      }
    } catch (err) {
      console.error("Gagal muat tabel berita:", err);
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
      
      // Jalankan fungsi muat tabel pas halaman terbuka
      muatDaftarArtikel(role);
    }
  }, []);

  // Handler Hapus Data (D)
  const handleHapusArtikel = async (id, judulArtikel) => {
    const yakin = confirm(`Ustadz/Ustadzah yakin mau menghapus berita: "${judulArtikel}"? Tindakan ini tidak bisa dibatalkan!`);
    if (!yakin) return;

    try {
      const res = await fetch(`/api/artikel?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Sukses! Artikel berhasil didelete dari mading.");
        muatDaftarArtikel(roleLembaga); // Refresh tabel otomatis
      } else {
        alert("Gagal menghapus data.");
      }
    } catch (error) {
      alert("Error koneksi saat menghapus.");
    }
  };

  // Editor Command Utilities
  const eksekusiPerintah = (perintah, nilai = null) => {
    document.execCommand(perintah, false, nilai);
    editorRef.current?.focus();
  };

  const handleUploadGambarFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("aksi", "upload_gambar");
    formData.append("image", file);

    try {
      setStatusStatus({ tipe: "sukses", pesan: "Gambar lagi meluncur ke server... ⏳" });
      const response = await fetch('/api/artikel', { method: 'POST', body: formData });
      const hasil = await response.json();
      if (response.ok && hasil.url) {
        const imgHtml = `<img src="${hasil.url}" alt="Gambar" class="max-w-full h-auto rounded-2xl my-4 shadow-md mx-auto block" />`;
        eksekusiPerintah("insertHTML", imgHtml);
        setStatusStatus({ tipe: "sukses", pesan: "Gambar nangkring di lembar kerja! 🎉" });
      }
    } catch (err) {
      setStatusStatus({ tipe: "gagal", pesan: "Gagal upload file komputer." });
    } finally {
      e.target.value = "";
    }
  };

  // Handler Create Data (C)
  const handleSubmitArtikelFinal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusStatus({ tipe: "", pesan: "" });

    const isiKontenHTML = editorRef.current.innerHTML;
    if (isiKontenHTML === "" || isiKontenHTML === "<br>") {
      setStatusStatus({ tipe: "gagal", pesan: "Isi madingnya jangan dikosongin ya ustadz!" });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("aksi", "simpan_artikel");
    formData.append("slug_lembaga", slugLembaga);
    formData.append("judul", judul);
    formData.append("isi_artikel", isiKontenHTML);

    try {
      const response = await fetch('/api/artikel', { method: 'POST', body: formData });
      if (response.ok) {
        setJudul("");
        setIsModalTerbuka(false); // Tutup pop up modal editor otomatis
        alert("Alhamdulillah! Artikel berhasil diterbitkan! 🚀");
        muatDaftarArtikel(roleLembaga); // Reload isi tabel utama
      } else {
        setStatusStatus({ tipe: "gagal", pesan: "Gagal nembus database." });
      }
    } catch (error) {
      setStatusStatus({ tipe: "gagal", pesan: "Koneksi API jebol!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-950 p-6 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
            <span className="text-2xl">🕌</span>
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
              📝 Daftar Mading Artikel
            </button>
          </nav>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase text-center py-3 rounded-xl transition border border-red-500/10 cursor-pointer">
          ❌ Logout
        </button>
      </aside>

      {/* WORKSPACE UTAMA: TABEL CRUD */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-x-hidden">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Manajemen Artikel</h2>
            <p className="text-xs text-slate-400 mt-1">Daftar seluruh berita yang aktif tayang di halaman publik sekolah.</p>
          </div>
          {/* TOMBOL PICU MODAL WORD */}
          <button 
            onClick={() => { setIsModalTerbuka(true); setStatusStatus({ tipe: "", pesan: "" }); }}
            className="bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-md cursor-pointer transition active:scale-95"
          >
            ➕ Tambah Artikel Baru
          </button>
        </header>

        {/* DATA TABEL ARTIKEL NYATA */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">Judul Pengumuman / Berita</th>
                  <th className="p-4 w-32 text-center">Lembaga</th>
                  <th className="p-4 w-40">Tanggal Input</th>
                  <th className="p-4 w-28 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {listArtikel.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-10 text-center text-slate-500 font-medium italic">
                      Belum ada berita yang diisi ustadz. Klik tombol pojok kanan atas buat bikin! 📝
                    </td>
                  </tr>
                ) : (
                  listArtikel.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-slate-500 text-center">#{art.id}</td>
                      <td className="p-4 font-bold text-white text-sm max-w-[250px] truncate">{art.judul}</td>
                      <td className="p-4 text-center">
                        <span className="bg-indigo-500/10 text-indigo-400 font-black text-[9px] px-2.5 py-1 rounded-md uppercase border border-indigo-500/10">
                          {art.slug_lembaga}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 font-medium">
                        {new Date(art.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleHapusArtikel(art.id, art.judul)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL POP-UP EDITING MODEL WORD */}
      {isModalTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-all">
          <div className="absolute inset-0" onClick={() => setIsModalTerbuka(false)}></div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col p-6 md:p-8">
            
            <header className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Ketik Artikel Baru..!!</h3>
                <p className="text-[11px] text-slate-400">Di isi nggeh, alon alon mawon, penting ampun ngantos klentu ketikan e.</p>
              </div>
              <button 
                onClick={() => setIsModalTerbuka(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-sm hover:bg-rose-600 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </header>

            {statusStatus.pesan && (
              <div className={`p-4 rounded-xl text-xs font-bold mb-6 text-center border ${statusStatus.tipe === "sukses" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>{statusStatus.pesan}</div>
            )}

            <form onSubmit={handleSubmitArtikelFinal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Target Lembaga</label>
                  {roleLembaga === 'all' ? (
                    <select value={slugLembaga} onChange={(e) => setSlugLembaga(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3.5 text-sm font-bold uppercase outline-none focus:border-indigo-500">
                      <option value="sd">SDIT</option>
                      <option value="tk">TKIT</option>
                      <option value="smp">SMPIT</option>
                    </select>
                  ) : (
                    <input type="text" value={slugLembaga.toUpperCase()} disabled className="w-full bg-slate-950/50 border border-slate-800 text-slate-500 rounded-xl px-4 py-3.5 text-sm font-bold uppercase select-none cursor-not-allowed" />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Judul Artikel Utama</label>
                  <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Masukkan judul pengumuman resmi..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white outline-none focus:border-indigo-500" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Isi Konten Berita</label>
                
                {/* TOOLBAR */}
                <div className="bg-slate-950 border border-slate-800 rounded-t-2xl p-3 flex flex-wrap gap-2 items-center">
                  <button type="button" onClick={() => eksekusiPerintah("bold")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold">B</button>
                  <button type="button" onClick={() => eksekusiPerintah("italic")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs italic">I</button>
                  <button type="button" onClick={() => eksekusiPerintah("underline")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs underline">U</button>
                  <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>
                  <button type="button" onClick={() => eksekusiPerintah("justifyLeft")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs">⬅️</button>
                  <button type="button" onClick={() => eksekusiPerintah("justifyCenter")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs">⏹️</button>
                  <button type="button" onClick={() => eksekusiPerintah("justifyRight")} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs">➡️</button>
                  <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>
                  <input type="file" ref={fileInputRef} onChange={handleUploadGambarFile} accept="image/*" className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/30 rounded-lg text-xs font-bold">📸 Upload Foto</button>
                </div>

                {/* WORK SHEET */}
                <div ref={editorRef} contentEditable className="w-full bg-slate-950 border-x border-b border-slate-800 rounded-b-2xl p-5 min-h-[300px] text-sm text-slate-200 outline-none focus:border-indigo-500/40 prose prose-invert max-w-none overflow-y-auto"></div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalTerbuka(false)} className="bg-slate-800 text-slate-300 font-bold text-xs uppercase px-6 py-3 rounded-xl hover:bg-slate-700 transition">Batal</button>
                <button type="submit" disabled={loading} className="bg-linear-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold uppercase px-8 py-3 rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50">
                  {loading ? "Menyimpan..." : "Terbitkan 🚀"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}