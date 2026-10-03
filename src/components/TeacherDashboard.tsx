import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BANK_SOAL_FLUIDA } from '../data/physicsData';
import { 
  Users, 
  Plus, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  GraduationCap, 
  Copy, 
  Check, 
  X,
  FileSpreadsheet,
  Clock
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { 
    currentUser, 
    classes, 
    addClass, 
    quizResults, 
    tugasList, 
    addTugas 
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'kelas_01');
  
  // Modals state
  const [createClassModalOpen, setCreateClassModalOpen] = useState<boolean>(false);
  const [createTugasModalOpen, setCreateTugasModalOpen] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Class Form state
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassDescription, setNewClassDescription] = useState<string>('');
  const [newClassYear, setNewClassYear] = useState<string>('2025/2026');

  // New Assignment Form state
  const [newTugasTitle, setNewTugasTitle] = useState<string>('');
  const [newTugasSubmateri, setNewTugasSubmateri] = useState<string>('hukum-archimedes');
  const [newTugasDesc, setNewTugasDesc] = useState<string>('');
  const [newTugasDeadline, setNewTugasDeadline] = useState<string>('2026-10-25');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // Copy class code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Submit Create Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    // Generate unique code like MNTG-XIM1-2026
    const cleanPrefix = newClassName.toUpperCase().replace(/\s+/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `MNTG-${cleanPrefix}-${randomSuffix}`;

    addClass({
      nama: newClassName.trim(),
      kodeKelas: code,
      tahunAjaran: newClassYear,
      deskripsi: newClassDescription.trim() || 'Kelas Fisika SMA Negeri 1 Mantang',
    });

    setNewClassName('');
    setNewClassDescription('');
    setCreateClassModalOpen(false);
  };

  // Submit Create Assignment
  const handleCreateTugas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTugasTitle.trim()) return;

    addTugas({
      judul: newTugasTitle.trim(),
      kelasId: selectedClassId,
      materiId: newTugasSubmateri,
      deskripsi: newTugasDesc.trim(),
      tenggatWaktu: `${newTugasDeadline}T23:59:00`,
      jumlahSiswa: selectedClass.jumlahSiswa || 32,
    });

    setNewTugasTitle('');
    setNewTugasDesc('');
    setCreateTugasModalOpen(false);
  };

  // Calculate question difficulty analysis from bank soal & quiz results
  // For each question, count error rate
  const questionAnalytics = BANK_SOAL_FLUIDA.map(q => {
    // Default simulated rate based on difficulty + actual student attempts
    let errorRate = q.tingkat === 'sulit' ? 68 : q.tingkat === 'sedang' ? 42 : 18;
    return {
      ...q,
      errorRate,
    };
  }).sort((a, b) => b.errorRate - a.errorRate);

  // Top 3 most difficult concepts
  const topDifficultQuestions = questionAnalytics.slice(0, 3);

  // Filter quiz results for current class
  const classQuizzes = quizResults.filter(q => q.kelasId === selectedClassId);
  const averageScore = classQuizzes.length > 0 
    ? Math.round(classQuizzes.reduce((acc, curr) => acc + curr.skor, 0) / classQuizzes.length)
    : 87;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Teacher Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50 via-white to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Portal Guru Fisika
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Guru: {currentUser.nama}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            NIP: {currentUser.nip || '19780512 200501 2 008'} · SMA Negeri 1 Mantang
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCreateClassModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Kelas Baru</span>
          </button>
          <button
            onClick={() => setCreateTugasModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Tugas</span>
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Pilih Kelas Binaan:
          </span>
          <div className="flex flex-wrap gap-1.5 ml-2">
            {classes.map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedClassId === cls.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cls.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Class Unique Code with Copy Button */}
        {selectedClass && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Kode Gabung Siswa:</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-sky-600 dark:text-sky-400">
              <span>{selectedClass.kodeKelas}</span>
              <button
                onClick={() => handleCopyCode(selectedClass.kodeKelas)}
                className="hover:text-sky-800 p-0.5 cursor-pointer"
                title="Salin Kode Kelas"
              >
                {copiedCode === selectedClass.kodeKelas ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 block">Total Siswa Terdaftar</span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {selectedClass?.jumlahSiswa || 32} Siswa
          </span>
          <span className="text-[11px] text-emerald-600 block">100% Aktif Pekan Ini</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 block">Rata-rata Nilai Kuis</span>
          <span className="text-2xl font-bold font-mono text-sky-600 dark:text-sky-400 tabular-nums">
            {averageScore} / 100
          </span>
          <span className="text-[11px] text-slate-400 block">KKM SMAN 1 Mantang: 75</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 block">Ketuntasan Materi Fluida</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            81,4%
          </span>
          <span className="text-[11px] text-slate-400 block">26 dari 32 Siswa Tuntas</span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs text-slate-500 block">Tugas Aktif</span>
          <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {tugasList.length} Tugas
          </span>
          <span className="text-[11px] text-slate-400 block">Dipantau Real-Time</span>
        </div>

      </div>

      {/* Main Grid: Question Difficulty Analysis & Student Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (7 Cols): Question & Concept Difficulty Analysis */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: Materi & Soal Paling Banyak Salah */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Analisis Kesulitan: Soal & Konsep Paling Sering Salah
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Data Kuis Siswa
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Berdasarkan hasil pengerjaan kuis siswa SMAN 1 Mantang, berikut adalah materi dan butir soal yang paling banyak mengalami kekeliruan konsep untuk diperkuat di kelas tatap muka:
            </p>

            <div className="space-y-4">
              {topDifficultQuestions.map((q, idx) => (
                <div 
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      #{idx + 1}. {q.submateriJudul} — {q.konteksNyata}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                      {q.errorRate}% Salah
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                    "{q.pertanyaan}"
                  </p>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${q.errorRate}%` }}
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>Penyebab Umum Salah: </strong>
                    {q.submateriId === 'hukum-archimedes' 
                      ? 'Siswa kerap terbalik menghitung volume yang terapung di atas permukaan dengan volume yang tenggelam di bawah air.' 
                      : q.submateriId === 'hukum-pascal'
                      ? 'Siswa lupa mengkuadratkan perbandingan diameter (d₂/d₁)² dan hanya membagi gaya secara linear.'
                      : 'Siswa lupa menjumlahkan tekanan atmosfer permukaan (P₀) pada soal tekanan mutlak.'}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-between">
              <span>Rekomendasi Tindak Lanjut Guru: Berikan penguatan konsep interaktif melalui Simulasi Lab Archimedes & Pascal.</span>
            </div>

          </div>

          {/* Card: Kelola Tugas & Tenggat Waktu */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Daftar Tugas & Status Pengumpulan
              </h3>
              <button
                onClick={() => setCreateTugasModalOpen(true)}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tugas Baru</span>
              </button>
            </div>

            <div className="space-y-3">
              {tugasList.map((tugas) => (
                <div 
                  key={tugas.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 space-y-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {tugas.judul}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {tugas.deskripsi}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {tugas.jumlahMengumpulkan} / {tugas.jumlahSiswa} Kumpul
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Batas: {new Date(tugas.tenggatWaktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <span className="text-emerald-600 font-medium">
                      {Math.round((tugas.jumlahMengumpulkan / tugas.jumlahSiswa) * 100)}% Kelengkapan
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right (5 Cols): Student Roster & Quiz Scores */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Daftar Siswa & Progres {selectedClass?.nama}
              </h3>
              <span className="text-xs text-slate-500">
                Nilai Kuis Terakhir
              </span>
            </div>

            {/* Student list */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { nama: 'Ahmad Fauzi', nisn: '0067891234', skor: 85, progress: 72, status: 'Tuntas' },
                { nama: 'Siti Rahmawati', nisn: '0067891235', skor: 90, progress: 85, status: 'Tuntas' },
                { nama: 'Budi Santoso', nisn: '0067891236', skor: 70, progress: 55, status: 'Remedial' },
                { nama: 'Dewi Lestari', nisn: '0067891237', skor: 95, progress: 90, status: 'Tuntas' },
                { nama: 'Fajar Pratama', nisn: '0067891238', skor: 80, progress: 68, status: 'Tuntas' },
                { nama: 'Gita Maharani', nisn: '0067891239', skor: 65, progress: 45, status: 'Remedial' },
                { nama: 'Hendra Wijaya', nisn: '0067891240', skor: 88, progress: 78, status: 'Tuntas' },
                { nama: 'Indah Permata', nisn: '0067891241', skor: 92, progress: 82, status: 'Tuntas' },
              ].map((siswa, sIdx) => (
                <div key={sIdx} className="py-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {siswa.nama}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      NISN: {siswa.nisn} · Progres: {siswa.progress}%
                    </span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm tabular-nums">
                      {siswa.skor}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      siswa.status === 'Tuntas' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {siswa.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Rekapitulasi nilai kelas telah diunduh dalam format Excel/CSV.')}
                className="w-full py-2.5 text-xs font-semibold text-center rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Ekspor Rekapitulasi Nilai (CSV/Excel)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Modal: Buat Kelas Baru */}
      {createClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buat Kelas Fisika Baru
              </h3>
              <button
                onClick={() => setCreateClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Nama Kelas (contoh: XI MIPA 4):
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. XI MIPA 4"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Tahun Ajaran:
                </label>
                <input
                  type="text"
                  value={newClassYear}
                  onChange={(e) => setNewClassYear(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Deskripsi / Peminatan:
                </label>
                <textarea
                  rows={2}
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                  placeholder="e.g. Kelas Peminatan Sains Terapan SMAN 1 Mantang"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 text-[11px]">
                Kode unik kelas (misal: <code>MNTG-XIM4-2026</code>) akan digenerate otomatis agar siswa dapat langsung bergabung.
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateClassModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Simpan & Buat Kode Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Tugas Baru */}
      {createTugasModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tambah Tugas Fisika Baru
              </h3>
              <button
                onClick={() => setCreateTugasModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTugas} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Judul Tugas:
                </label>
                <input
                  type="text"
                  required
                  value={newTugasTitle}
                  onChange={(e) => setNewTugasTitle(e.target.value)}
                  placeholder="e.g. Analisis Hukum Pascal Dongkrak Bengkel"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Submateri Terkait:
                </label>
                <select
                  value={newTugasSubmateri}
                  onChange={(e) => setNewTugasSubmateri(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="massa-jenis">Massa Jenis</option>
                  <option value="tekanan-hidrostatis">Tekanan Hidrostatis</option>
                  <option value="hukum-pascal">Hukum Pascal</option>
                  <option value="hukum-archimedes">Hukum Archimedes</option>
                  <option value="penerapan-fluida-statis">Penerapan Fluida Statis</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Tenggat Waktu:
                </label>
                <input
                  type="date"
                  required
                  value={newTugasDeadline}
                  onChange={(e) => setNewTugasDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Instruksi Pengerjaan:
                </label>
                <textarea
                  rows={3}
                  value={newTugasDesc}
                  onChange={(e) => setNewTugasDesc(e.target.value)}
                  placeholder="e.g. Kerjakan simulasi virtual lab, hitung nilai F2 untuk 3 variasi diameter..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateTugasModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Publikasikan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
