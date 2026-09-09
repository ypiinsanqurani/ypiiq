// 1. IMPORT DI BAGIAN PALING ATAS FILE PAGE.JS LO
import { dataSejarahLembaga } from './dataSejarah.js';

export default async function HalamanLembagaDinamis({ params }) {
  // Tangkap parameter slug dari URL (bisa 'tk', 'sd', atau 'smp')
  const { slug } = await params; 

  // 2. AMBIL DATA SEJARAH YANG COCOK SAMA SLUG URL NYA
  // Jika slug-nya "sd", otomatis ngambil dataSejarahLembaga.sd
  const sejarahLengkap = dataSejarahLembaga[slug];

  // Jaga-jaga kalau user ngetik slug aneh-aneh di URL
  if (!sejarahLengkap) {
    return <div className="text-white">Halaman Lembaga Tidak Ditemukan!</div>;
  }

  return (
   <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
  
  {/* Aksen Hiasan Cahaya di Background (Biar gak flat) */}
  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

  {/* HEADER UTAMA SEJARAH */}
  <header className="mb-8 border-b border-slate-800/60 pb-6 relative z-10">
    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-3 py-1 rounded-md inline-block border border-indigo-500/10">
      📄 Riwayat & Profil Lembaga
    </div>
    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-3">
      {sejarahLengkap.judul}
    </h1>
    <p className="text-xs md:text-sm text-slate-400 italic mt-1 font-medium">
      "{sejarahLengkap.subJudul}"
    </p>
    <p className="text-xs text-slate-300 leading-relaxed mt-4 max-w-3xl bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
      {sejarahLengkap.ringkasan}
    </p>
  </header>

  {/* TIMELINE SECTION (ALUR PERJALANAN TAHUN KE TAHUN) */}
  <div className="relative z-10 mt-8 pl-4 border-l-2 border-slate-800 space-y-8">
    {sejarahLengkap.milestones.map((item, index) => (
      <div key={index} className="relative group">
        
        {/* Bulatan Menyala di Garis Kiri */}
        <div className="absolute -left-[25px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] group-hover:border-emerald-400 transition-colors duration-300" />
        
        {/* Konten Kartu Peristiwa */}
        <div className="bg-slate-900/40 border border-slate-800/70 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 hover:translate-x-1 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            {/* Tag Tahun */}
            <span className="text-xs font-black px-2.5 py-1 bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-md tracking-wider shadow-sm">
               {item.tahun}
            </span>
            <div className="h-[1px] flex-1 bg-slate-800/50" />
          </div>
          
          {/* Teks Peristiwanya */}
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
            {item.peristiwa}
          </p>
        </div>

      </div>
    ))}
  </div>

</div>
  );
}