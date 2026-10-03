import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BANK_SOAL_FLUIDA } from '../data/physicsData';
import { QuizResult } from '../types';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

export const QuizExerciseView: React.FC = () => {
  const { currentUser, addQuizResult, setCurrentPage, setActiveSubmateriId } = useApp();

  // Mode: 'latihan' (instant explanation per question) or 'kuis' (exam style)
  const [practiceMode, setPracticeMode] = useState<'latihan' | 'kuis'>('latihan');
  
  // Current active index in exam mode
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Student selections map: questionId -> selectedOptionIndex (0-3)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  
  // Quiz completion state
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizStartTime] = useState<number>(Date.now());

  const questions = BANK_SOAL_FLUIDA;
  const currentQ = questions[currentIndex];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (practiceMode === 'kuis' && isQuizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Submit quiz in 'kuis' mode
  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const answerDetails = questions.map((q) => {
      const studentPick = selectedAnswers[q.id];
      const isCorrect = studentPick === q.kunciJawaban;
      if (isCorrect) correctCount++;
      return {
        soalId: q.id,
        pilihanSiswa: studentPick !== undefined ? studentPick : -1,
        isBenar: isCorrect,
      };
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    const elapsedSeconds = Math.round((Date.now() - quizStartTime) / 1000);

    // Generate personalized reinforcement recommendations based on errors
    const recommendations: string[] = [];
    const wrongQuestions = questions.filter(q => selectedAnswers[q.id] !== q.kunciJawaban);
    
    if (wrongQuestions.some(q => q.submateriId === 'hukum-archimedes')) {
      recommendations.push('Perkuat konsep Hukum Archimedes, khususnya membedakan volume tercelup dengan volume yang menyembul.');
    }
    if (wrongQuestions.some(q => q.submateriId === 'hukum-pascal')) {
      recommendations.push('Ingat kembali bahwa perbandingan gaya pada Hukum Pascal sebanding dengan kuadrat perbandingan diameter piston (d₂/d₁)².');
    }
    if (wrongQuestions.some(q => q.submateriId === 'tekanan-hidrostatis')) {
      recommendations.push('Perhatikan rumus tekanan hidrostatis Ph = ρ g h, dan jangan lupa menjumlahkan tekanan atmosfer jika ditanyakan Tekanan Mutlak.');
    }
    if (recommendations.length === 0) {
      recommendations.push('Pemahaman konsep Fluida Statis Anda sangat luar biasa! Lanjutkan eksplorasi modul selanjutnya.');
    }

    const newResult: QuizResult = {
      id: `hasil_${Date.now()}`,
      siswaId: currentUser.id,
      siswaNama: currentUser.nama,
      kelasId: currentUser.kelasId || 'kelas_01',
      tanggal: new Date().toISOString(),
      skor: finalScore,
      totalSoal: questions.length,
      jumlahBenar: correctCount,
      jumlahSalah: questions.length - correctCount,
      waktuPengerjaanDetik: elapsedSeconds,
      jawabanSiswa: answerDetails,
      rekomendasiMateri: recommendations,
    };

    addQuizResult(newResult);
    setIsQuizSubmitted(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setCurrentIndex(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Bank Soal & Penilaian Terstandar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Latihan Soal & Kuis Fluida Statis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            10 Soal bertingkat (Mudah, Sedang, Sulit) dengan pembahasan terstruktur
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => {
              setPracticeMode('latihan');
              setIsQuizSubmitted(false);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              practiceMode === 'latihan'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mode Latihan (Bahas Langsung)
          </button>
          <button
            onClick={() => {
              setPracticeMode('kuis');
              handleReset();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              practiceMode === 'kuis'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mode Kuis Ujian (Beri Skor)
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: LATIHAN MANDIRI (DAFTAR SEMUA SOAL DENGAN PEMBAHASAN LANGSUNG)*/}
      {/* ==================================================================== */}
      {practiceMode === 'latihan' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-between">
            <span>
              💡 <strong>Tips Belajar:</strong> Pilih jawabanmu pada setiap soal. Pembahasan lengkap dengan rincian <em>Diketahui, Ditanya, Rumus, dan Langkah Pengerjaan</em> akan otomatis muncul.
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-400">
              Terjawab: {answeredCount} / {questions.length}
            </span>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => {
              const studentChoice = selectedAnswers[q.id];
              const hasAnswered = studentChoice !== undefined;
              const isCorrect = studentChoice === q.kunciJawaban;

              return (
                <div 
                  key={q.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  {/* Top Question Metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Soal #{qIndex + 1}
                      </span>
                      <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        q.tingkat === 'mudah'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : q.tingkat === 'sedang'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        Tingkat: {q.tingkat}
                      </span>
                      <span className="text-xs text-slate-500">
                        {q.submateriJudul}
                      </span>
                    </div>

                    <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                      Konteks: {q.konteksNyata}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                    {q.pertanyaan}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {q.pilihan.map((pilihanText, optIndex) => {
                      const isSelected = studentChoice === optIndex;
                      const isRightAnswer = optIndex === q.kunciJawaban;

                      let optionStyle = 'border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500';
                      if (hasAnswered) {
                        if (isRightAnswer) {
                          optionStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                        } else if (isSelected && !isRightAnswer) {
                          optionStyle = 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-sky-500 bg-sky-50 dark:bg-sky-950';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${optionStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="flex-1 font-medium">{pilihanText}</span>
                          {hasAnswered && isRightAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                          {hasAnswered && isSelected && !isRightAnswer && (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Explanation Accordion / Card */}
                  {hasAnswered && (
                    <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          {isCorrect ? (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Jawabanmu Benar!</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                              <XCircle className="w-4 h-4" />
                              <span>Jawaban Belum Tepat. Mari pelajari pembahasannya:</span>
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-semibold text-slate-500">
                          Kunci: {String.fromCharCode(65 + q.kunciJawaban)} ({q.pilihan[q.kunciJawaban]})
                        </span>
                      </div>

                      {/* Step-by-step breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Diketahui:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                            {q.diketahui.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Ditanya & Rumus:</span>
                          <p className="text-slate-600 dark:text-slate-400">Ditanya: {q.ditanya}</p>
                          <p className="font-mono text-sky-600 dark:text-sky-400 font-semibold">{q.rumus}</p>
                        </div>
                      </div>

                      {/* Langkah perhitungan */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          Tahapan Perhitungan Matematis:
                        </span>
                        {q.pembahasanLangkah.map((step, idx) => (
                          <p key={idx} className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                            {step}
                          </p>
                        ))}
                      </div>

                      {/* Analisis Konsep & Tips */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>Analisis Konsep: </strong>
                          {q.analisisKonsep}
                        </p>
                        <p className="text-amber-700 dark:text-amber-400 font-medium">
                          <strong>Tips Cepat Fisika: </strong>
                          {q.tipsFisika}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: KUIS UJIAN (TIMED / SCORED WORKFLOW)                         */}
      {/* ==================================================================== */}
      {practiceMode === 'kuis' && !isQuizSubmitted && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Question Card (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Soal Nomor {currentIndex + 1} dari {questions.length}
              </span>
              <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                currentQ.tingkat === 'mudah'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : currentQ.tingkat === 'sedang'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                Tingkat: {currentQ.tingkat}
              </span>
            </div>

            {/* Context Badge */}
            <div className="text-xs text-slate-500">
              Konteks Studi Kasus: <strong className="text-slate-700 dark:text-slate-300">{currentQ.konteksNyata}</strong>
            </div>

            {/* Question Text */}
            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
              {currentQ.pertanyaan}
            </p>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.pilihan.map((option, oIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'bg-sky-600 border-sky-600 text-white' 
                        : 'border-slate-300 dark:border-slate-600 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Sebelumnya
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <span>Selesaikan & Kumpulkan Kuis</span>
                  <FileCheck2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Question Number Grid & Submit Box (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Question Pallet */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Nomor Soal
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {answeredCount} / {questions.length} Terisi
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'ring-2 ring-sky-500 bg-sky-600 text-white'
                          : isAnswered
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-sky-600" />
                  <span>Aktif</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-700" />
                  <span>Terjawab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800" />
                  <span>Kosong</span>
                </div>
              </div>

              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0}
                className="w-full py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
              >
                Kumpulkan Jawaban Sekarang
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* KUIS SUBMITTED: SCORECARD & REKOMENDASI PENGUATAN                   */}
      {/* ==================================================================== */}
      {practiceMode === 'kuis' && isQuizSubmitted && (
        <div className="space-y-8">
          
          {/* Score Card Banner */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 text-white shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Hasil Evaluasi Kuis Fluida Statis</span>
                </div>
                <h2 className="text-3xl font-extrabold">
                  {currentUser.nama}
                </h2>
                <p className="text-xs text-sky-200">
                  {currentUser.kelasNama || 'XI MIPA 1'} · SMA Negeri 1 Mantang
                </p>
              </div>

              {/* Big Score Display */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-xs p-5 rounded-2xl border border-white/10">
                <div className="text-center">
                  <span className="text-5xl font-black font-mono tracking-tight text-white tabular-nums">
                    {Math.round((questions.filter(q => selectedAnswers[q.id] === q.kunciJawaban).length / questions.length) * 100)}
                  </span>
                  <span className="block text-[11px] text-sky-200 mt-1 uppercase font-semibold">
                    Skor Akhir / 100
                  </span>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="text-xs space-y-1 text-sky-100">
                  <p>Benar: <strong className="text-emerald-400 font-mono">{questions.filter(q => selectedAnswers[q.id] === q.kunciJawaban).length}</strong></p>
                  <p>Salah: <strong className="text-rose-400 font-mono">{questions.filter(q => selectedAnswers[q.id] !== q.kunciJawaban).length}</strong></p>
                </div>
              </div>

            </div>

            {/* Rekomendasi Materi Penguatan */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-amber-300 block">
                Rekomendasi Materi Penguatan:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-200">
                {questions.some(q => selectedAnswers[q.id] !== q.kunciJawaban && q.submateriId === 'hukum-archimedes') && (
                  <li>Perdalam kembali pemahaman <strong>Hukum Archimedes</strong>, terutama menghitung persentase volume benda yang tercelup (V_celup / V_total = ρ_benda / ρ_fluida).</li>
                )}
                {questions.some(q => selectedAnswers[q.id] !== q.kunciJawaban && q.submateriId === 'hukum-pascal') && (
                  <li>Pelajari kembali prinsip <strong>Hukum Pascal</strong> dan rumus gaya dengan rasio diameter kuadrat (F₂/F₁ = (d₂/d₁)²).</li>
                )}
                {questions.some(q => selectedAnswers[q.id] !== q.kunciJawaban && q.submateriId === 'tekanan-hidrostatis') && (
                  <li>Periksa kembali rumus <strong>Tekanan Mutlak</strong> (P = P₀ + ρ g h) yang menjumlahkan tekanan atmosfer permukaan.</li>
                )}
                <li>Manfaatkan <strong>Laboratorium Virtual</strong> untuk melihat visualisasi interaktif dari konsep yang masih belum dipahami.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Kuis</span>
              </button>
              <button
                onClick={() => setPracticeMode('latihan')}
                className="px-5 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Lihat Pembahasan Lengkap Semua Soal
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
