import React from 'react';

export default async function HalamanKontakLembaga() {
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
            <h3 className="font-bold text-slate-700 text-sm mb-1">📍 Alamat </h3>
            <p className="text-xs text-slate-500 leading-relaxed">Dsn Sumbertowo, Ds. Sonorejo, Kec. Grogol, Kab. Kediri</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm mb-1">📞 Call Center </h3>
            <p className="text-xs text-slate-500 font-mono">+62 851-1313-3770</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-700 text-sm mb-1">✉️ Email Resmi</h3>
            <p className="text-xs text-slate-500 font-mono">ypiinsanquranii@gmail.com</p>
          </div>
        </div>

        {/* FORM PESAN (UI ONLY) */}
        <div className="md:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Kirim Kotak Saran / Pesan</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama Anda" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Isi Pesan</label>
              <textarea rows="4" placeholder="Ketik pesan atau pertanyaan Anda di sini..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 transition resize-none"></textarea>
            </div>
            <button type="button" className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition shadow-sm">
              Kirim Pesan via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}