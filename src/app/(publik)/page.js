"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HalamanPortalYayasan() {
  const [dataLogo, setDataLogo] = useState([]);

  // TARIK DATA LOGO DARI API DATABASE MYSQL
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo');
        if (res.ok) {
          const data = await res.json();
          setDataLogo(data);
        }
      } catch (error) {
        console.error("Gagal konek API logo:", error);
      }
    };
    fetchLogo();
  }, []);

  // Helper untuk mencari URL logo berdasarkan slug
  const getLogoUrl = (slug, fallback) => {
    const item = dataLogo.find((l) => l.slug === slug);
    return item?.logo_url || fallback;
  };

  const daftarSekolah = [
    {
      nama: "TKIT Insan Qur'ani",
      slug: "tk",
      warnaLinear: "bg-linear-to-br from-cyan-400/90 to-blue-600/95 text-white shadow-cyan-500/20",
      warnaAksen: "border-cyan-200/40 bg-cyan-500/10 text-cyan-400",
      warnaGlow: "group-hover:shadow-[0_0_40px_rgba(34,211,238,0.25)]",
      deskripsi: "Membentuk karakter anak usia dini yang ceria, kreatif, mandiri, dan berakhlak mulia.",
      fallbackLogo: "gambar/logo-tk.jpg"
    },
    {
      nama: "SDIT Insan Qur'ani",
      slug: "sd",
      warnaLinear: "bg-linear-to-br from-rose-500/90 to-orange-500/95 text-white shadow-rose-500/20",
      warnaAksen: "border-rose-200/40 bg-rose-500/10 text-rose-400",
      warnaGlow: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.25)]",
      deskripsi: "Pendidikan dasar unggulan berbasis teknologi informasi terintegrasi nilai Al-Qur'an.",
      fallbackLogo: "gambar/logo-sd.jpg"
    },
    {
      nama: "SMP Tahfidz Insan Qur'ani",
      slug: "smp",
      warnaLinear: "bg-linear-to-br from-emerald-500/90 to-teal-600/95 text-white shadow-emerald-500/20",
      warnaAksen: "border-emerald-200/40 bg-emerald-500/10 text-emerald-400",
      warnaGlow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
      deskripsi: "Mencetak generasi penghafal Al-Qur'an yang kompeten, kompetitif, dan menguasai sains.",
      fallbackLogo: "gambar/logo-smp.jpg"
    }
  ];

  const statsYayasan = [
    { angka: "150+", label: "Total Siswa Aktif" },
    { angka: "20+", label: "Ustadz & Murabbi" },
    { angka: "45+", label: "Prestasi Tingkat Kota/Nasional" },
    { angka: "3", label: "Lembaga Terintegrasi" }
  ];

  const visiMisi = [
    { poin: "01", judul: "Tauhid & Akhlakul Karimah", isi: "Menjadikan anak didik yang berakhlaqul karimah dan berkarakter Qur’ani." },
    { poin: "02", judul: "Tahfidz & Ilmu Al-Qur'an", isi: "Mewujudkan generasi Penghafal Qur`an yang berkualitas baik secara “lafdzan wa ma‘nan wa ‘amalan." },
    { poin: "03", judul: "Kitab Ulama' Salafi", isi: "Menanamkan Iman, Ilmu dan Amal secara intergral pada peserta didik." }
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between relative overflow-hidden font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* 1. EFEK GRID PATTERN & NEON BLUR BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
      
      <div className="absolute top-[-10%] left-[15%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[15%] w-[35vw] h-[35vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HEADER SECTION UTAMA */}
      <header className="text-center pt-24 pb-8 px-4 relative z-10 flex flex-col items-center">
        
        {/* CONTAINER LOGO YAYASAN PUSAT */}
        <div className="inline-flex bg-slate-800/80 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-slate-700/50 mb-6 transition-transform duration-500 hover:rotate-6 hover:scale-105 cursor-pointer group relative">
          <div className="absolute inset-0 rounded-3xl bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img 
            src={getLogoUrl('yayasan', 'gambar/logo-ypiiq.jpg')} 
            alt="Logo YPI Insan Qur'ani" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain relative z-10 filter drop-shadow-md"
          />
        </div>

        {/* JUDUL UTAMA PORTAL */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
          WELCOME TO <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent filter drop-shadow-xs">
            YPI INSAN QUR'ANI..!!!
          </span>
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        <p className="text-slate-400 mt-5 max-w-xl mx-auto text-sm md:text-base leading-relaxed font-medium opacity-90">
          Selamat datang di ekosistem informasi digital terpadu. Silakan pilih gerbang lembaga pendidikan Anda di bawah ini.
        </p>
      </header>

      {/* CARDS CONTAINER (DAFTAR SEKOLAH) */}
      <main className="max-w-6xl mx-auto px-6 py-12 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {daftarSekolah.map((sekolah, index) => (
            <div 
              key={index} 
              className={`bg-slate-800/30 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-3 hover:border-slate-700/50 group ${sekolah.warnaGlow}`}
            >
              <div>
                {/* LOGO SEKOLAH & BADGE */}
                <div className="flex justify-between items-center mb-8">
                  {/* LOGO MASING-MASING LEMBAGA DARI DATABASE */}
                  <div className={`w-16 h-16 rounded-2xl ${sekolah.warnaAksen} border p-2 flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <img 
                      src={getLogoUrl(sekolah.slug, sekolah.fallbackLogo)} 
                      alt={`Logo ${sekolah.nama}`} 
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                  
                  <span className={`text-[10px] font-extrabold tracking-widest px-3 py-1.5 rounded-xl ${sekolah.warnaAksen} border uppercase`}>
                    GO TO {sekolah.slug} 
                  </span>
                </div>

                {/* TEXTS */}
                <h2 className="text-2xl font-black text-white mb-3 tracking-wide group-hover:text-indigo-400 transition-colors duration-300">
                  {sekolah.nama}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium group-hover:text-slate-300 transition-colors duration-300">
                  {sekolah.deskripsi}
                </p>
              </div>

              {/* ACTION BUTTON */}
              <Link 
                href={`/${sekolah.slug}`}
                className={`w-full text-center block ${sekolah.warnaLinear} font-bold py-4 px-6 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300 tracking-wider text-xs uppercase`}
              >
                Buka Situs Lembaga &rarr;
              </Link>
            </div>
          ))}
        </div>

        {/* SECTION 2: STATISTIK COUNTER */}
        <section className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md">
          {statsYayasan.map((stat, i) => (
            <div key={i} className="text-center p-4 group">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 transition-transform duration-300 group-hover:scale-105">
                {stat.angka}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 3: SEJARAH PUSAT YAYASAN */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 bg-slate-800/20 border border-slate-800 rounded-3xl p-8 md:p-10 backdrop-blur-xs">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/10">
              📜 Kilas Sejarah 
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-4 mb-5">
              SEJARAH SINGKAT BERDIRINYA YAYASAN PENDIDIKAN ISLAM INSAN QUR`ANI DAN PONDOK PESANTREN JAMI`ATUL QUR`AN
            </h2>
            <div className="space-y-4 text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
              <p>
               SEJARAH SINGKAT BERDIRINYA YAYASAN PENDIDIKAN ISLAM INSAN QUR`ANI DAN PONDOK PESANTREN JAMI`ATUL QUR`AN Awalnya, pada pertengahan tahun 2012, 
               diadakan pengajian al-Qur`an ba`da maghrib dengan meminjam Mushola Haji Utsman (Alm.), milik Ibu Mutammimah, dusun Sumbergambi Kidul, RT 003 RW 002, 
               \desa Sonorejo, Kec. Grogol, Kab. Kediri yang waktu itu diikuti anak-anak kecil kurang lebih 15 anak. Lambat laun semakin bertambah santri. 
               Maka pengelola berinisiatif untuk tidak hanya mengadakan pengajian al-Qur’an ba’da maghrib saja, tapi ditambah ba’da Ashar. Maka pengelola 
               bergerilya mengajak tetangga yang punya kemampuan membaca al-Qur’an untuk ikut nimbrung mengajar anak-anak yang jumlahnya semakin banyak. 
               Waktu itu yang direkrut sebagai ustadzah adalah ibu Binti, ibu Dewi, ibu Dziroh, Ibu Anis, ibu Rom, dan Ibu Lia. Pada tanggal 1 September 2012 
               bertepatan acara Halal Bihalal diadakan peresmian TPQ Qur-any `Utsmany di mushola Haji Utsman secara sederhana dengan menghadirkan kepala KUA 
               Kec. Grogol. Kemudian pengelola TPQ Qur-any `Utsmany mengajukan ijin operasional dari Kemenag Kab. Kediri No. Regrestasi 012350604028 tertanggal 
               31 Agustus 2012. Sebelumnya pengelola juga mendaftarkan lembaga ke notaris tertanggal 17 April 2013 no. 21 atas nama Notaris Achmadin, S.H., 
               dengan nama Lembaga Pendidikan Islam Terpadu Insan Qur’ani disingkat LPIT IQ. LPIT IQ ini membawahi dan mewadahi PAUD dan TPQ. Awal tahun 2013 
               mulai dirintis Kelompok Bermain (Play Group) dengan nama PAUD Insan Qur`ani dan pada waktu itu banyak orang tua yang menitipkan anak-anaknya di PAUD ini. 
               Ada sekitar 50 anak yang menjadi peserta didik. Tempat belajarnya masih menggunakan mushola dan bekas “toko” milik bapak Slamet (Orang tua dari ust. Samsul) 
               dengan memakai dampar (meja panjang yang digunakan untuk mengaji al-Qur’an). PAUD Insan Qur`ani mendapatkan ijin operasional dari Dikpora 
               (Dinas Pendidkan Pemuda dan Olahraga) tertanggal 7 Maret 2013 no. 421.9/84/418.47/2013. Mulai tahun 2013 dan tahun-tahun berikutnya sebelum datangnya 
               bulan Ramadhan diadakan haflah akhirussanah dengan mengadakan berbagai kegiatan seperti lomba-lomba, pentas seni dan pengajian. Hal ini merupakan daya 
               tarik tersendiri bagi masyarakat sekitarnya meskipun belum mempunyai gedung. Seiring dengan berjalannya waktu ustadz maupun ustadzah seperti tambal sulam 
               silih berganti ada yang keluar ada yang masuk. Tercatat sampai sekarang ustadzah-ustadzah baru yaitu ustadzah ibu Nurul, ibu Nur, Irma, dan Nisa. 
               Tahun 2014 Bapak Slamet Rifai mewakafkan tanahnya seluas 591 meter persegi yang berlokasi di dusun Sumbertowo RT 002 RW 02 untuk pendidikan.
               Maka pada hari Jum’at 28 Februari 2014 dilaksanakan ikrar wakaf dengan disaksi nadzir , saksi-saksi dan kepala KUA Kec. Grogol yang waktu itu 
               dijabat oleh H. M. Zulfa Isyad. MHI. Setelah resmi punya tanah wakaf, maka pihak pengelola berusaha mencarikan donator untuk pembangunan tempat pendidikan. 
               Alhamdulillah dengan Izin Allah SWT mendapatkan bantuan paket Masjid dan Gedung Sekolah 3 kelas dari Donatur dari Arab. Mulailah pembangunan masjid, 
               dan sekolah dimulai setelah hari raya Idul Adha tahun 2014. Pembangunan masjid dan gedung sekolah ini selesai memakan waktu agak lama yaitu kurang 
               lebih 1 tahun dikarenakan banyaknya proyek-proyek dari donator yang belum terselesaikan. Meskipun pembangunan belum selesai, di awal bulan ramadhan 
               18 Juni 2015 pihak pengelola sudah mulai menempati gedung baru. Sehingga tanggal 1 Ramdhan 2015 merupakan awal dimulainya pengajian al-Qur`an di tempat 
               yang baru. Diadakanlah berbagai macam kegiatan Ramadhan antara lain sholat berjamaah, sholat Tarowih, pengajian al-Qur`an, pengajian TPQ, pengajian 
               kitab dan bukber (buka bersama). TPQ di sini di bulan Ramadhan tetap berjalan, tidak libur sampai terakhir masuknya tanggal 27 Ramadhan, 
               sekaligus di adakan Malam “Lailatul Qadaran” sholat malam dengan diakhiri doa khatmul Qur’an dan itu sudah dilaksanakan pada tahun-tahun sebelumnya. 
               Pada tahun 2016 pihak pengelola berkeinginan untuk memperbaruhi lembaga yang semula bernama LPIT Insan Qur`ani menjadi sebuah Yayasan yang tidak 
               hanya terdaftar di akte notaris saja tetapi juga terdaftar di Kemenhum HAM. Maka LPIT Insan Qur’ani mempunyai nama baru “Yayasan Pendidikan Islam 
               Insan Qur`ani disingkat YPI-IQ dan resmi disahkan oleh Kemenhum HAM dengan no. AHU-0022463.AH.01.04/2016 tertanggaL 29 Februari 2016. 
               Adapun notarisnya atas nama notaris, Nur Hidayat, SH., M.Kn. No. 405 tertanggal 24 Februari 2016. YPI Insan Qur`ani sampai sekarang membawahi 
               beberapa unit pendidikan yaitu KB, TKIT, SDIT, SMP Tahfidz, TPQ, MADIN dan selanjutnya mengajukan ijin operasional Pondok Pesantren Jami`atul Qur`an.
              </p>
            </div>
          </div>

          {/* SECTION 4: PILAR NILAI UTAMA */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-300 tracking-wider pl-1">
              🎯 Pilar Nilai Utama
            </h3>
            <div className="space-y-4">
              {visiMisi.map((item, index) => (
                <div key={index} className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-2xl flex gap-4 hover:border-slate-700/50 transition">
                  <div className="text-xl font-black text-indigo-400/80 bg-indigo-500/5 border border-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    {item.poin}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.judul}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.isi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 mt-12 border-t border-slate-800/80 text-xs font-semibold text-slate-500 bg-slate-950/40 backdrop-blur-md relative z-10 tracking-wide">
        &copy; {new Date().getFullYear()} <span className="text-slate-400">Yayasan Pendidikan Islam Insan Qur'ani</span>. All Rights Reserved.
      </footer>

    </div>
  );
}