import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  FlaskConical, 
  FileCheck2, 
  HelpCircle, 
  ArrowRight, 
  GraduationCap, 
  Award, 
  Compass, 
  Gauge, 
  ShieldCheck 
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { switchRole, setCurrentPage } = useApp();

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>SMA Negeri 1 Mantang · Lombok Tengah</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none text-balance">
                  Fisika Mantang
                </h1>
                <p className="text-xl sm:text-2xl font-serif italic text-sky-700 dark:text-sky-300 font-medium">
                  "Memahami Fisika, Menjelaskan Alam"
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Aplikasi pembelajaran fisika interaktif yang dirancang khusus untuk siswa SMA Negeri 1 Mantang. Eksplorasi konsep fluida statis lewat simulasi laboratorium virtual, latihan soal bertahap, dan bimbingan guru AI yang mendidik.
              </p>

              {/* CTAs: Masuk sebagai Siswa & Masuk sebagai Guru */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => switchRole('siswa')}
                  className="px-6 py-3.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/20 transition-all flex items-center gap-2.5 group cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Masuk sebagai Siswa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => switchRole('guru')}
                  className="px-6 py-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Masuk sebagai Guru</span>
                </button>

                <button
                  onClick={() => setCurrentPage('simulasi')}
                  className="px-4 py-3.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Buka Laboratorium Virtual</span>
                </button>
              </div>

              {/* Trust & Academic markers */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div>
                  <span className="block text-lg font-bold text-slate-900 dark:text-white tabular-nums">5 Modul</span>
                  <span>Materi Fluida Statis</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900 dark:text-white tabular-nums">3 Lab</span>
                  <span>Simulasi Interaktif</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900 dark:text-white tabular-nums">100% SI</span>
                  <span>Standar Internasional</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-900 aspect-16/10">
                <img
                  src="/src/assets/images/hero_fisika_mantang_1791012718581.jpg"
                  alt="Laboratorium Fisika Mantang dengan peralatan fluida dan simulasi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 text-xs text-sky-300 font-medium">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Laboratorium Fisika Virtual</span>
                  </div>
                  <p className="text-sm font-semibold mt-0.5">
                    Eksperimen Fluida: Tekanan Hidrostatis, Pascal, & Archimedes
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ringkasan Fitur Aplikasi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Fitur Utama Aplikasi
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Dirancang untuk Penguasaan Konsep Mandiri
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Membantu siswa menghubungkan rumus-rumus fisika dengan fenomena alam nyata dan teknologi di sekitar Lombok.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Modul Materi Interaktif */}
          <div 
            onClick={() => setCurrentPage('materi')}
            className="group p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Modul Fluida Statis
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Materi mendalam dari massa jenis, tekanan hidrostatis, hukum Pascal, hukum Archimedes, hingga penerapannya di bendungan dan kapal laut.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Buka Modul</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Simulasi Virtual 3-in-1 */}
          <div 
            onClick={() => setCurrentPage('simulasi')}
            className="group p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Simulasi Lab Interaktif
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Ubah kedalaman dan massa jenis zat cair, uji amplifikasi dongkrak hidrolik, serta lihat kondisi benda terapung, melayang, atau tenggelam.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Mulai Simulasi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Latihan Soal & Pembahasan */}
          <div 
            onClick={() => setCurrentPage('latihan')}
            className="group p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Latihan Soal Bertahap
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              10 soal terstandarisasi dengan tingkat mudah, sedang, dan sulit. Lengkap dengan pembahasan langkah demi langkah (Diketahui, Ditanya, Solusi).
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Uji Kemampuan</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Tanya Fisika AI Guru */}
          <div 
            onClick={() => setCurrentPage('tanya-fisika')}
            className="group p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Tanya Fisika AI (Sokratik)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Asisten guru virtual ramah yang membimbing pemikiran siswa dengan petunjuk dan pertanyaan pemandu tanpa memberikan jalan pintas bocoran.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Konsultasi AI</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* Studi Kasus Kontekstual NTB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 p-8 sm:p-10 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-sky-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Pembelajaran Berbasis Konteks Nyata</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">
                Mengapa Mempelajari Fluida Statis di SMAN 1 Mantang?
              </h3>
              <p className="text-sm text-sky-100/90 leading-relaxed">
                Di Pulau Lombok, prinsip fluida statis ada di sekeliling kita: dari bendungan pengairan Batujai dan Pengga, kapal feri penyeberangan Lembar, hingga para penyelam tradisional mutiara di pesisir selatan. Kami merancang pembelajaran ini agar siswa tidak hanya menghafal rumus, melainkan memahami hukum alam yang bekerja.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('materi');
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors"
                >
                  Pelajari Studi Kasus Bendungan & Kapal
                </button>
              </div>
            </div>
            <div className="space-y-3 p-5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Gauge className="w-4 h-4" />
                <span>Rumus Kunci Hari Ini</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 font-mono text-xs text-sky-300 space-y-1">
                <p>P = ρ × g × h</p>
                <p>F₁ / A₁ = F₂ / A₂</p>
                <p>Fa = ρ_fluida × g × V_celup</p>
              </div>
              <p className="text-[11px] text-slate-300">
                Gunakan satuan SI: kg/m³, m/s², m, N, dan Pascal (Pa).
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
