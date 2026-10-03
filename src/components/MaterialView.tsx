import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAFTAR_KURIKULUM } from '../data/physicsData';
import { 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  FlaskConical, 
  Target, 
  Lightbulb, 
  Variable, 
  HelpCircle, 
  BookmarkCheck,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const MaterialView: React.FC = () => {
  const { 
    activeSubmateriId, 
    setActiveSubmateriId, 
    progress, 
    markSubmateriComplete, 
    setCurrentPage 
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<'X' | 'XI' | 'XII'>('XI');

  // Filter modules based on grade
  const availableModules = DAFTAR_KURIKULUM.filter(m => m.tingkatKelas === selectedGrade);
  const activeModule = DAFTAR_KURIKULUM.find(m => m.id === 'fluida-statis-xi')!;
  
  const currentSubmateri = activeModule.submateri.find(s => s.id === activeSubmateriId) || activeModule.submateri[0];
  const isCompleted = progress.submateriSelesai.includes(currentSubmateri.id);

  const currentIndex = activeModule.submateri.findIndex(s => s.id === currentSubmateri.id);
  const nextSubmateri = activeModule.submateri[currentIndex + 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Grade Selector & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Materi Fisika SMA
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kurikulum Merdeka & K13 Revisi · SMAN 1 Mantang
          </p>
        </div>

        {/* Grade tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
          {(['X', 'XI', 'XII'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-4 py-1.5 rounded-md transition-colors ${
                selectedGrade === grade
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Kelas {grade}
            </button>
          ))}
        </div>
      </div>

      {selectedGrade !== 'XI' ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Modul Kelas {selectedGrade} Sedang Disiapkan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Fokus kurikulum interaktif saat ini adalah modul lengkap <strong>Fluida Statis Kelas XI</strong> dengan visualisasi laboratorium virtual.
          </p>
          <button
            onClick={() => setSelectedGrade('XI')}
            className="mt-2 px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-500 transition-colors"
          >
            Buka Modul Fluida Statis Kelas XI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Submaterials Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Fluida Statis (Kelas XI)
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  5 Submateri
                </span>
              </div>

              <div className="space-y-1.5">
                {activeModule.submateri.map((sub, idx) => {
                  const isActive = sub.id === currentSubmateri.id;
                  const isDone = progress.submateriSelesai.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubmateriId(sub.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all flex items-start justify-between gap-2.5 ${
                        isActive
                          ? 'bg-sky-50 dark:bg-sky-950/60 border border-sky-400 dark:border-sky-500/60 text-slate-900 dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-xs font-semibold block leading-tight truncate">
                          {sub.judul}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                          Estimasi: {sub.estimasiMenit} menit
                        </span>
                      </div>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lab simulation banner in sidebar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentPage('simulasi')}
                  className="w-full p-3 rounded-lg bg-gradient-to-r from-sky-600 to-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>Buka Laboratorium Virtual</span>
                </button>
              </div>
            </div>

            {/* Quick Ask AI CTA */}
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Butuh Bimbingan Konsep?</span>
              </div>
              <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                Tanya langsung ke asisten AI Guru Fisika untuk petunjuk langkah pengerjaan tanpa bocoran.
              </p>
              <button
                onClick={() => setCurrentPage('tanya-fisika')}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 pt-1"
              >
                <span>Buka Tanya Fisika</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Detailed Submaterial Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header of Active Submaterial */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Submateri #{currentSubmateri.urutan}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Waktu Belajar: {currentSubmateri.estimasiMenit} Menit
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {currentSubmateri.judul}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentSubmateri.deskripsiSingkat}
              </p>

              {/* Action: Mark Complete / Jump to next */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => markSubmateriComplete(currentSubmateri.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompleted ? 'Sudah Dipelajari' : 'Tandai Selesai Dipelajari'}</span>
                </button>

                <button
                  onClick={() => setCurrentPage('simulasi')}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                  <span>Uji di Simulasi Lab</span>
                </button>
              </div>
            </div>

            {/* 1. Tujuan Belajar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Tujuan Pembelajaran</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {currentSubmateri.tujuanBelajar.map((tujuan, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>{tujuan}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. Penjelasan Konsep Fisis */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Penjelasan Konsep Fisis</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentSubmateri.penjelasanKonsep.map((paragraf, idx) => (
                  <p key={idx}>{paragraf}</p>
                ))}
              </div>
            </div>

            {/* 3. Rumus Utama */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Variable className="w-4 h-4 text-sky-600" />
                <span>Rumus Matematika & Fisis</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentSubmateri.rumusUtama.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 space-y-1.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.namaRumus}
                      </span>
                      <code className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400">
                        {item.rumus}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.penjelasan}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Tabel Arti Simbol & Satuan SI */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 overflow-hidden">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Variable className="w-4 h-4 text-emerald-600" />
                <span>Arti Simbol & Satuan SI</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-3 font-semibold">Simbol</th>
                      <th className="py-2.5 px-3 font-semibold">Besaran</th>
                      <th className="py-2.5 px-3 font-semibold">Satuan SI</th>
                      <th className="py-2.5 px-3 font-semibold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {currentSubmateri.simbolDanSatuan.map((sim, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                          {sim.simbol}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {sim.nama}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono">
                          {sim.satuanSI}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                          {sim.keterangan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Contoh Soal & Pembahasan Bertahap */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Contoh Soal Kontekstual & Penyelesaian</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {currentSubmateri.contohSoal.judul}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentSubmateri.contohSoal.soal}
                </p>

                {/* Diketahui & Ditanya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Diketahui:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                      {currentSubmateri.contohSoal.diketahui.map((dik, idx) => (
                        <li key={idx}>{dik}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Ditanya:</span>
                    <p className="text-slate-600 dark:text-slate-400">{currentSubmateri.contohSoal.ditanya}</p>
                  </div>
                </div>

                {/* Langkah Penyelesaian */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Langkah Penyelesaian:
                  </span>
                  {currentSubmateri.contohSoal.jawabanLangkah.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sky-600 dark:text-sky-400">
                          {idx + 1}. {step.langkah}
                        </span>
                        {step.hasil && (
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {step.hasil}
                          </span>
                        )}
                      </div>
                      {step.rumus && (
                        <p className="font-mono text-slate-700 dark:text-slate-300">{step.rumus}</p>
                      )}
                      <p className="text-slate-500 dark:text-slate-400">{step.keterangan}</p>
                    </div>
                  ))}
                </div>

                {/* Kesimpulan */}
                <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-xs text-sky-900 dark:text-sky-200">
                  <strong>Kesimpulan: </strong>
                  <span>{currentSubmateri.contohSoal.kesimpulan}</span>
                </div>

              </div>
            </div>

            {/* 6. Studi Kasus Nyata (Bendungan, Penyelam NTB, Kapal, Dongkrak) */}
            {currentSubmateri.studiKasusNyata && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-md space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Studi Kasus Nyata: {currentSubmateri.studiKasusNyata.judul}</span>
                </div>
                <p className="text-xs text-sky-100/90 italic leading-relaxed">
                  "{currentSubmateri.studiKasusNyata.konteks}"
                </p>
                <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-xs leading-relaxed text-slate-200">
                  <strong className="text-sky-300">Penjelasan Fisis: </strong>
                  {currentSubmateri.studiKasusNyata.penjelasan}
                </div>
              </div>
            )}

            {/* 7. Rangkuman Inti */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                <span>Rangkuman Inti Konsep</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {currentSubmateri.rangkuman.map((rang, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{rang}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Nav: Next Submaterial */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentPage('simulasi')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FlaskConical className="w-4 h-4 text-sky-600" />
                <span>Uji di Laboratorium Simulasi</span>
              </button>

              {nextSubmateri ? (
                <button
                  onClick={() => {
                    markSubmateriComplete(currentSubmateri.id);
                    setActiveSubmateriId(nextSubmateri.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Lanjut: {nextSubmateri.judul}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentPage('latihan')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mulai Latihan Soal 10 Butir</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
