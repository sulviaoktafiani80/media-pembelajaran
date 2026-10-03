import { UserProfile, Kelas, QuizResult, StudentProgress, Tugas } from '../types';

/**
 * STRUKTUR KOLEKSI FIRESTORE UNTUK FISIKA MANTANG
 *
 * 1. Koleksi: `users`
 *    Dokumen ID: `uid` (dari Firebase Authentication)
 *    Field:
 *      - id: string
 *      - nama: string
 *      - email: string
 *      - role: "siswa" | "guru"
 *      - sekolah: "SMA Negeri 1 Mantang"
 *      - kelasId?: string
 *      - kelasNama?: string
 *      - nisn?: string (untuk siswa)
 *      - nip?: string (untuk guru)
 *      - createdAt: Timestamp
 *
 * 2. Koleksi: `kelas`
 *    Dokumen ID: `kelasId` (e.g. "kelas_xi_mipa_1")
 *    Field:
 *      - id: string
 *      - nama: string ("XI MIPA 1")
 *      - kodeKelas: string ("MNTG-XIM1-2026")
 *      - guruId: string
 *      - guruNama: string
 *      - tahunAjaran: string ("2025/2026")
 *      - deskripsi: string
 *      - jumlahSiswa: number
 *      - daftarSiswaIds: string[]
 *
 * 3. Koleksi: `quiz_results`
 *    Dokumen ID: auto-generated ID
 *    Field:
 *      - id: string
 *      - siswaId: string
 *      - siswaNama: string
 *      - kelasId: string
 *      - tanggal: string (ISO)
 *      - skor: number (0 - 100)
 *      - totalSoal: number
 *      - jumlahBenar: number
 *      - jumlahSalah: number
 *      - waktuPengerjaanDetik: number
 *      - jawabanSiswa: Array<{ soalId, pilihanSiswa, isBenar }>
 *      - rekomendasiMateri: string[]
 *
 * 4. Koleksi: `student_progress`
 *    Dokumen ID: `siswaId`
 *    Field:
 *      - siswaId: string
 *      - submateriSelesai: string[]
 *      - submateriTerakhirId: string
 *      - persentaseTotal: number
 *      - kuisTerakhirSkor?: number
 *      - kuisTerakhirTanggal?: string
 *      - totalMenitBelajar: number
 *      - simulasiTelahDicoba: { hidrostatis: boolean, pascal: boolean, archimedes: boolean }
 *
 * 5. Koleksi: `tugas`
 *    Dokumen ID: auto-generated ID
 *    Field:
 *      - id: string
 *      - judul: string
 *      - kelasId: string
 *      - materiId: string
 *      - deskripsi: string
 *      - tenggatWaktu: string
 *      - jumlahSiswa: number
 *      - jumlahMengumpulkan: number
 */

// Contoh representasi blueprint JSON untuk deployment Firebase rules
export const FIREBASE_BLUEPRINT_SCHEMA = {
  version: '1.0',
  collections: {
    users: {
      rules: 'read: if request.auth != null; write: if request.auth.uid == resource.data.id || request.auth.token.role == "guru"',
    },
    kelas: {
      rules: 'read: if request.auth != null; write: if request.auth.token.role == "guru"',
    },
    quiz_results: {
      rules: 'read: if request.auth != null; create: if request.auth != null; update, delete: if request.auth.token.role == "guru"',
    },
    student_progress: {
      rules: 'read: if request.auth != null; write: if request.auth != null',
    },
    tugas: {
      rules: 'read: if request.auth != null; write: if request.auth.token.role == "guru"',
    },
  },
};

// Seed Pengguna Demo
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'siswa_01',
    nama: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@siswa.sman1mantang.sch.id',
    role: 'siswa',
    sekolah: 'SMA Negeri 1 Mantang',
    kelasId: 'kelas_01',
    kelasNama: 'XI MIPA 1',
    nisn: '0067891234',
  },
  {
    id: 'siswa_02',
    nama: 'Siti Rahmawati',
    email: 'siti.rahma@siswa.sman1mantang.sch.id',
    role: 'siswa',
    sekolah: 'SMA Negeri 1 Mantang',
    kelasId: 'kelas_01',
    kelasNama: 'XI MIPA 1',
    nisn: '0067891235',
  },
  {
    id: 'guru_01',
    nama: 'Dra. Hj. Nurhidayati, M.Pd',
    email: 'nurhidayati@guru.sman1mantang.sch.id',
    role: 'guru',
    sekolah: 'SMA Negeri 1 Mantang',
    nip: '19780512 200501 2 008',
  },
];

// Seed Kelas Demo
export const DEMO_CLASSES: Kelas[] = [
  {
    id: 'kelas_01',
    nama: 'XI MIPA 1',
    kodeKelas: 'MNTG-XIM1-2026',
    guruId: 'guru_01',
    guruNama: 'Dra. Hj. Nurhidayati, M.Pd',
    tahunAjaran: '2025/2026',
    deskripsi: 'Kelas Unggulan Fisika Eksperimen dan Olimpiade Sains SMAN 1 Mantang.',
    jumlahSiswa: 32,
    daftarSiswaIds: ['siswa_01', 'siswa_02'],
  },
  {
    id: 'kelas_02',
    nama: 'XI MIPA 2',
    kodeKelas: 'MNTG-XIM2-2026',
    guruId: 'guru_01',
    guruNama: 'Dra. Hj. Nurhidayati, M.Pd',
    tahunAjaran: '2025/2026',
    deskripsi: 'Kelas Reguler Fisika Sains dan Terapan Teknologi.',
    jumlahSiswa: 34,
    daftarSiswaIds: [],
  },
  {
    id: 'kelas_03',
    nama: 'XI MIPA 3',
    kodeKelas: 'MNTG-XIM3-2026',
    guruId: 'guru_01',
    guruNama: 'Dra. Hj. Nurhidayati, M.Pd',
    tahunAjaran: '2025/2026',
    deskripsi: 'Kelas Minat Riset Lingkungan dan Rekayasa.',
    jumlahSiswa: 30,
    daftarSiswaIds: [],
  },
];

// Seed Tugas Demo
export const DEMO_TUGAS: Tugas[] = [
  {
    id: 'tugas_01',
    judul: 'Laporan Mandiri Simulasi Hukum Archimedes',
    kelasId: 'kelas_01',
    materiId: 'hukum-archimedes',
    deskripsi: 'Lakukan percobaan pada Lab Virtual Fisika Mantang dengan 3 variasi massa jenis benda. Catat persentase volume tercelup dan bandingkan dengan perhitungan rumus.',
    tenggatWaktu: '2026-10-15T23:59:00',
    jumlahSiswa: 32,
    jumlahMengumpulkan: 24,
    sudahSelesaiOlehUser: true,
  },
  {
    id: 'tugas_02',
    judul: 'Studi Kasus Tekanan Hidrostatis Bendungan Batujai',
    kelasId: 'kelas_01',
    materiId: 'tekanan-hidrostatis',
    deskripsi: 'Analisis gaya tekan air pada kedalaman 12 meter dan jelaskan alasan struktural mengapa dinding dasar bendungan harus berbentuk trapesium.',
    tenggatWaktu: '2026-10-20T23:59:00',
    jumlahSiswa: 32,
    jumlahMengumpulkan: 18,
    sudahSelesaiOlehUser: false,
  },
];

// Seed Progres Awal Siswa
export const DEMO_PROGRESS: StudentProgress = {
  siswaId: 'siswa_01',
  submateriSelesai: ['massa-jenis', 'tekanan-hidrostatis', 'hukum-pascal'],
  submateriTerakhirId: 'hukum-archimedes',
  persentaseTotal: 72,
  kuisTerakhirSkor: 85,
  kuisTerakhirTanggal: '2026-10-02',
  totalMenitBelajar: 145,
  simulasiTelahDicoba: {
    hidrostatis: true,
    pascal: true,
    archimedes: false,
  },
};

// Seed Hasil Kuis Demo
export const DEMO_QUIZ_RESULTS: QuizResult[] = [
  {
    id: 'hasil_01',
    siswaId: 'siswa_01',
    siswaNama: 'Ahmad Fauzi',
    kelasId: 'kelas_01',
    tanggal: '2026-10-02T14:30:00',
    skor: 85,
    totalSoal: 10,
    jumlahBenar: 8,
    jumlahSalah: 2,
    waktuPengerjaanDetik: 480,
    jawabanSiswa: [
      { soalId: 'soal-1', pilihanSiswa: 1, isBenar: true },
      { soalId: 'soal-2', pilihanSiswa: 2, isBenar: true },
      { soalId: 'soal-3', pilihanSiswa: 2, isBenar: true },
      { soalId: 'soal-4', pilihanSiswa: 1, isBenar: true },
      { soalId: 'soal-5', pilihanSiswa: 2, isBenar: true },
      { soalId: 'soal-6', pilihanSiswa: 2, isBenar: false }, // Salah bagian menyembul vs tercelup
      { soalId: 'soal-7', pilihanSiswa: 1, isBenar: true },
      { soalId: 'soal-8', pilihanSiswa: 2, isBenar: true },
      { soalId: 'soal-9', pilihanSiswa: 0, isBenar: false }, // Salah dua lapisan
      { soalId: 'soal-10', pilihanSiswa: 2, isBenar: true },
    ],
    rekomendasiMateri: [
      'Pelajari kembali bagian volume menyembul vs volume tercelup pada Hukum Archimedes.',
      'Perkuat konsep rata-rata tertimbang massa jenis pada dua fluida bertingkat.',
    ],
  },
  {
    id: 'hasil_02',
    siswaId: 'siswa_02',
    siswaNama: 'Siti Rahmawati',
    kelasId: 'kelas_01',
    tanggal: '2026-10-01T10:15:00',
    skor: 90,
    totalSoal: 10,
    jumlahBenar: 9,
    jumlahSalah: 1,
    waktuPengerjaanDetik: 420,
    jawabanSiswa: [],
    rekomendasiMateri: ['Pertahankan prestasi luar biasa pada pemahaman Hukum Pascal!'],
  },
];
