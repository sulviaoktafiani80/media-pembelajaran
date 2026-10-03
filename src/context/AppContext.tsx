import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StudentProgress, QuizResult, Kelas, Tugas } from '../types';
import { DEMO_USERS, DEMO_CLASSES, DEMO_TUGAS, DEMO_PROGRESS, DEMO_QUIZ_RESULTS } from '../services/firebaseConfig';

export type NavigationPage = 
  | 'beranda'
  | 'dashboard-siswa'
  | 'materi'
  | 'simulasi'
  | 'latihan'
  | 'tanya-fisika'
  | 'dashboard-guru';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: 'siswa' | 'guru') => void;
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  progress: StudentProgress;
  markSubmateriComplete: (submateriId: string) => void;
  recordSimulationUse: (type: 'hidrostatis' | 'pascal' | 'archimedes') => void;
  activeSubmateriId: string;
  setActiveSubmateriId: (id: string) => void;
  quizResults: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  classes: Kelas[];
  addClass: (newClass: Omit<Kelas, 'id' | 'guruId' | 'guruNama' | 'jumlahSiswa' | 'daftarSiswaIds'>) => void;
  tugasList: Tugas[];
  addTugas: (newTugas: Omit<Tugas, 'id' | 'jumlahMengumpulkan'>) => void;
  toggleTugasSelesai: (tugasId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fisika_mantang_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('fisika_mantang_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('fisika_mantang_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Active user
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedUser = localStorage.getItem('fisika_mantang_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS[0]; // Default Ahmad Fauzi (Siswa)
  });

  useEffect(() => {
    localStorage.setItem('fisika_mantang_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Current page
  const [currentPage, setCurrentPage] = useState<NavigationPage>('beranda');

  // Active Submateri selection in reading mode
  const [activeSubmateriId, setActiveSubmateriId] = useState<string>('tekanan-hidrostatis');

  // Student progress state
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem('fisika_mantang_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('fisika_mantang_progress', JSON.stringify(progress));
  }, [progress]);

  // Quiz results
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('fisika_mantang_quizzes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_QUIZ_RESULTS;
  });

  useEffect(() => {
    localStorage.setItem('fisika_mantang_quizzes', JSON.stringify(quizResults));
  }, [quizResults]);

  // Classes
  const [classes, setClasses] = useState<Kelas[]>(() => {
    const saved = localStorage.getItem('fisika_mantang_classes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_CLASSES;
  });

  useEffect(() => {
    localStorage.setItem('fisika_mantang_classes', JSON.stringify(classes));
  }, [classes]);

  // Assignments / Tugas
  const [tugasList, setTugasList] = useState<Tugas[]>(() => {
    const saved = localStorage.getItem('fisika_mantang_tugas');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_TUGAS;
  });

  useEffect(() => {
    localStorage.setItem('fisika_mantang_tugas', JSON.stringify(tugasList));
  }, [tugasList]);

  // Helper actions
  const switchRole = (role: 'siswa' | 'guru') => {
    if (role === 'siswa') {
      setCurrentUser(DEMO_USERS[0]); // Ahmad Fauzi
      setCurrentPage('dashboard-siswa');
    } else {
      setCurrentUser(DEMO_USERS[2]); // Bu Nurhidayati
      setCurrentPage('dashboard-guru');
    }
  };

  const markSubmateriComplete = (submateriId: string) => {
    setProgress(prev => {
      const already = prev.submateriSelesai.includes(submateriId);
      const updatedList = already ? prev.submateriSelesai : [...prev.submateriSelesai, submateriId];
      const newPercentage = Math.min(100, Math.round((updatedList.length / 5) * 100));
      return {
        ...prev,
        submateriSelesai: updatedList,
        submateriTerakhirId: submateriId,
        persentaseTotal: newPercentage,
        totalMenitBelajar: prev.totalMenitBelajar + 15,
      };
    });
  };

  const recordSimulationUse = (type: 'hidrostatis' | 'pascal' | 'archimedes') => {
    setProgress(prev => ({
      ...prev,
      simulasiTelahDicoba: {
        ...prev.simulasiTelahDicoba,
        [type]: true,
      },
    }));
  };

  const addQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [result, ...prev]);
    setProgress(prev => ({
      ...prev,
      kuisTerakhirSkor: result.skor,
      kuisTerakhirTanggal: result.tanggal,
    }));
  };

  const addClass = (newClass: Omit<Kelas, 'id' | 'guruId' | 'guruNama' | 'jumlahSiswa' | 'daftarSiswaIds'>) => {
    const freshClass: Kelas = {
      ...newClass,
      id: `kelas_${Date.now()}`,
      guruId: currentUser.id,
      guruNama: currentUser.nama,
      jumlahSiswa: 0,
      daftarSiswaIds: [],
    };
    setClasses(prev => [freshClass, ...prev]);
  };

  const addTugas = (newTugas: Omit<Tugas, 'id' | 'jumlahMengumpulkan'>) => {
    const freshTugas: Tugas = {
      ...newTugas,
      id: `tugas_${Date.now()}`,
      jumlahMengumpulkan: 0,
      sudahSelesaiOlehUser: false,
    };
    setTugasList(prev => [freshTugas, ...prev]);
  };

  const toggleTugasSelesai = (tugasId: string) => {
    setTugasList(prev =>
      prev.map(t => {
        if (t.id === tugasId) {
          const nextState = !t.sudahSelesaiOlehUser;
          return {
            ...t,
            sudahSelesaiOlehUser: nextState,
            jumlahMengumpulkan: nextState ? t.jumlahMengumpulkan + 1 : Math.max(0, t.jumlahMengumpulkan - 1),
          };
        }
        return t;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        currentPage,
        setCurrentPage,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        progress,
        markSubmateriComplete,
        recordSimulationUse,
        activeSubmateriId,
        setActiveSubmateriId,
        quizResults,
        addQuizResult,
        classes,
        addClass,
        tugasList,
        addTugas,
        toggleTugasSelesai,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
