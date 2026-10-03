import React from 'react';
import { useApp } from '../context/AppContext';
import { Atom, MapPin, GraduationCap, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <Atom className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Fisika Mantang
              </span>
            </div>
            <p className="text-sm font-serif italic text-sky-700 dark:text-sky-300">
              "Memahami Fisika, Menjelaskan Alam"
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Platform pembelajaran fisika interaktif berbasis konsep dan eksplorasi virtual untuk siswa SMA Negeri 1 Mantang, Kabupaten Lombok Tengah, Nusa Tenggara Barat.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>Jl. Raya Mantang, Kec. Batukliang, Lombok Tengah, NTB</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigasi Belajar
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button 
                  onClick={() => setCurrentPage('materi')} 
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Modul Fluida Statis Kelas XI
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('simulasi')} 
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Laboratorium Virtual 3-in-1
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('latihan')} 
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Latihan Soal & Pembahasan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('tanya-fisika')} 
                  className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  Tanya Fisika AI (Metode Sokratik)
                </button>
              </li>
            </ul>
          </div>

          {/* Academic & Platform details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Model & Arsitektur
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                <span>Kurikulum Fisika SMA Merdeka & K13</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tanya Fisika powered by Gemini AI</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                Tersinkronisasi dengan arsitektur Firebase Auth & Firestore untuk rekap nilai dan data kelas.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Fisika Mantang — SMA Negeri 1 Mantang. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Versi Akademik 2.4</span>
            <span aria-hidden="true">·</span>
            <span>Satuan Standar Internasional (SI)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
