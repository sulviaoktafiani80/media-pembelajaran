import React from 'react';
import { useApp } from '../context/AppContext';
import { DAFTAR_KURIKULUM } from '../data/physicsData';
import { 
  BookOpen, 
  FlaskConical, 
  FileCheck2, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, 
    progress, 
    setCurrentPage, 
    setActiveSubmateriId, 
    quizResults, 
    tugasList, 
    toggleTugasSelesai 
  } = useApp();

  const fluidaModule = DAFTAR_KURIKULUM[0];
  const lastSubmateri = fluidaModule.submateri.find(s => s.id === progress.submateriTerakhirId) || fluidaModule.submateri[0];

  // Determine greeting based on current local hour
  const currentHour = new Date().getHours();
  let timeGreeting = 'Selamat Datang';
  if (currentHour >= 4 && currentHour < 11) timeGreeting = 'Selamat Pagi';
  else if (currentHour >= 11 && currentHour < 15) timeGreeting = 'Selamat Siang';
  else if (currentHour >= 15 && currentHour < 18) timeGreeting = 'Selamat Sore';
  else timeGreeting = 'Selamat Malam';

  // Last quiz result
  const latestQuiz = quizResults[0];

  // Next recommendation
  const uncompletedSubmateri = fluidaModule.submateri.find(s => !progress.submateriSelesai.includes(s.id));
  const recommendedTitle = uncompletedSubmateri 
    ? uncompletedSubmateri.judul 
    : 'Uji Pemahaman Ulang & Coba Simulasi Virtual';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Personal Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-sky-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
            Portal Pembelajaran Siswa
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {timeGreeting}, {currentUser.nama}! 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {currentUser.kelasNama || 'XI MIPA 1'} · {currentUser.sekolah}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveSubmateriId(lastSubmateri.id);
              setCurrentPage('materi');
            }}
            className="px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Lanjutkan Materi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Progress */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Penguasaan Fluida</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {progress.persentaseTotal}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">dari 5 Submateri</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progress.persentaseTotal}%` }}
            />
          </div>
        </div>

        {/* Card 2: Submateri Selesai */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Submateri Tuntas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {progress.submateriSelesai.length} / 5
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Modul</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            {progress.submateriSelesai.length === 5 ? 'Semua modul telah dipelajari!' : 'Tinggal sedikit lagi tuntas!'}
          </p>
        </div>

        {/* Card 3: Nilai Kuis Terbaru */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Nilai Kuis Terbaru</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {latestQuiz ? latestQuiz.skor : '85'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {latestQuiz ? `${latestQuiz.jumlahBenar} Benar dari ${latestQuiz.totalSoal} Soal` : '8 Benar dari 10 Soal'}
          </p>
        </div>

        {/* Card 4: Waktu Belajar */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Waktu Belajar</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {progress.totalMenitBelajar}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Menit Total</span>
          </div>
          <p className="text-xs text-sky-600 dark:text-sky-400">
            Konsisten belajar mandiri
          </p>
        </div>

      </div>

      {/* Main Grid: Last Material & Recommendation vs Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Materi Terakhir & Rekomendasi */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Materi Terakhir Dipelajari */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Materi Terakhir Dipelajari
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Fluida Statis Kelas XI
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lastSubmateri.judul}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {lastSubmateri.deskripsiSingkat}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveSubmateriId(lastSubmateri.id);
                  setCurrentPage('materi');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shrink-0 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rekomendasi Materi Berikutnya */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  Rekomendasi Langkah Berikutnya:
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {recommendedTitle}. Pelajari konsep fisis dan uji pemahaman lewat simulasi lab untuk hasil maksimal.
                </p>
              </div>
            </div>

          </div>

          {/* Quick Menu Tabs / Navigasi Cepat Siswa */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Menu Belajar Cepat
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              <button
                onClick={() => setCurrentPage('materi')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Materi Lengkap</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Rumus, teori & contoh</span>
              </button>

              <button
                onClick={() => setCurrentPage('simulasi')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <FlaskConical className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Simulasi Lab</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Eksperimen 3 model</span>
              </button>

              <button
                onClick={() => setCurrentPage('latihan')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <FileCheck2 className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Latihan & Kuis</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">10 Soal bertahap</span>
              </button>

              <button
                onClick={() => setCurrentPage('tanya-fisika')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <HelpCircle className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Tanya Fisika AI</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Tanya Bu Guru 24/7</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubmateriId('penerapan-fluida-statis');
                  setCurrentPage('materi');
                }}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <Award className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Studi Kasus</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Bendungan & Kapal</span>
              </button>

              <button
                onClick={() => setCurrentPage('latihan')}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all text-left space-y-2 group shadow-xs cursor-pointer"
              >
                <TrendingUp className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
                <span className="block text-sm font-semibold text-slate-900 dark:text-white">Progres Belajar</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400">Statistik pemahaman</span>
              </button>

            </div>
          </div>

        </div>

        {/* Right Column (1 span): Tugas Kelas & Status Kuis */}
        <div className="space-y-6">
          
          {/* Card: Tugas dari Guru */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tugas Kelas Fisika
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.kelasNama || 'XI MIPA 1'}
              </span>
            </div>

            <div className="space-y-3">
              {tugasList.map((tugas) => (
                <div 
                  key={tugas.id}
                  className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {tugas.judul}
                    </span>
                    <button
                      onClick={() => toggleTugasSelesai(tugas.id)}
                      className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                        tugas.sudahSelesaiOlehUser
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
                      }`}
                    >
                      {tugas.sudahSelesaiOlehUser ? 'Selesai' : 'Kirim'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                    {tugas.deskripsi}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Tenggat: {new Date(tugas.tenggatWaktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Evaluasi Kuis Terakhir */}
          {latestQuiz && (
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Evaluasi Kuis Terakhir
                </h3>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                  {latestQuiz.skor} / 100
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  Catatan Penguatan Konsep:
                </p>
                <ul className="space-y-1.5 list-disc list-inside">
                  {latestQuiz.rekomendasiMateri.map((rek, idx) => (
                    <li key={idx} className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {rek}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentPage('latihan')}
                  className="w-full py-2 text-xs font-semibold text-center rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  Lihat Pembahasan Lengkap
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
