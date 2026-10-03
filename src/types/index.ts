export type UserRole = 'siswa' | 'guru';

export interface UserProfile {
  id: string;
  nama: string;
  email: string;
  role: UserRole;
  sekolah: string;
  kelasId?: string;
  kelasNama?: string;
  nisn?: string;
  nip?: string;
  avatarUrl?: string;
}

export interface Kelas {
  id: string;
  nama: string; // e.g. "XI MIPA 1"
  kodeKelas: string; // e.g. "MNTG-XI-M1"
  guruId: string;
  guruNama: string;
  tahunAjaran: string;
  deskripsi: string;
  jumlahSiswa: number;
  daftarSiswaIds: string[];
}

export interface SymbolDefinition {
  simbol: string;
  nama: string;
  satuanSI: string;
  keterangan: string;
}

export interface ExampleProblem {
  judul: string;
  soal: string;
  diketahui: string[];
  ditanya: string;
  jawabanLangkah: {
    langkah: string;
    keterangan: string;
    rumus?: string;
    hasil?: string;
  }[];
  kesimpulan: string;
}

export interface Submateri {
  id: string;
  urutan: number;
  judul: string;
  deskripsiSingkat: string;
  estimasiMenit: number;
  tujuanBelajar: string[];
  penjelasanKonsep: string[];
  rumusUtama: {
    rumus: string;
    namaRumus: string;
    penjelasan: string;
  }[];
  simbolDanSatuan: SymbolDefinition[];
  contohSoal: ExampleProblem;
  rangkuman: string[];
  studiKasusNyata?: {
    judul: string;
    konteks: string;
    penjelasan: string;
  };
}

export interface MateriModul {
  id: string;
  tingkatKelas: 'X' | 'XI' | 'XII';
  judul: string;
  semester: 1 | 2;
  deskripsi: string;
  isUnlocked: boolean;
  submateri: Submateri[];
}

export type DifficultyLevel = 'mudah' | 'sedang' | 'sulit';

export interface QuizQuestion {
  id: string;
  submateriId: string;
  submateriJudul: string;
  tingkat: DifficultyLevel;
  konteksNyata: string; // e.g., "Penyelam di Pantai Senggigi / Teluk Awang NTB", "Dongkrak Hidrolik Bengkel Motor Mantang"
  pertanyaan: string;
  pilihan: string[];
  kunciJawaban: number; // 0-based index
  diketahui: string[];
  ditanya: string;
  rumus: string;
  pembahasanLangkah: string[];
  analisisKonsep: string;
  tipsFisika: string;
}

export interface QuizResult {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelasId: string;
  tanggal: string;
  skor: number; // 0 - 100
  totalSoal: number;
  jumlahBenar: number;
  jumlahSalah: number;
  waktuPengerjaanDetik: number;
  jawabanSiswa: {
    soalId: string;
    pilihanSiswa: number;
    isBenar: boolean;
  }[];
  rekomendasiMateri: string[];
}

export interface StudentProgress {
  siswaId: string;
  submateriSelesai: string[]; // submateri ids
  submateriTerakhirId: string;
  persentaseTotal: number;
  kuisTerakhirSkor?: number;
  kuisTerakhirTanggal?: string;
  totalMenitBelajar: number;
  simulasiTelahDicoba: {
    hidrostatis: boolean;
    pascal: boolean;
    archimedes: boolean;
  };
}

export interface Tugas {
  id: string;
  judul: string;
  kelasId: string;
  materiId: string;
  deskripsi: string;
  tenggatWaktu: string;
  jumlahSiswa: number;
  jumlahMengumpulkan: number;
  sudahSelesaiOlehUser?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
