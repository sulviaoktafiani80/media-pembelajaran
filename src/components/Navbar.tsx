import React, { useState } from 'react';
import { useApp, NavigationPage } from '../context/AppContext';
import { 
  Atom, 
  BookOpen, 
  FlaskConical, 
  HelpCircle, 
  GraduationCap, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  FileCheck2, 
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    currentPage, 
    setCurrentPage, 
    darkMode, 
    toggleDarkMode 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'beranda', label: 'Beranda', icon: <Atom className="w-4 h-4" /> },
    { 
      id: currentUser.role === 'guru' ? 'dashboard-guru' : 'dashboard-siswa', 
      label: currentUser.role === 'guru' ? 'Dashboard Guru' : 'Dashboard Siswa', 
      icon: <LayoutDashboard className="w-4 h-4" /> 
    },
    { id: 'materi', label: 'Materi', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulasi', label: 'Simulasi Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'latihan', label: 'Latihan & Kuis', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'tanya-fisika', label: 'Tanya Fisika AI', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Zone 1: Single text element wordmark / Brand */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleNavClick('beranda')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  <Atom className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                    Fisika Mantang
                  </span>
                  <span className="hidden sm:inline-block text-xs text-slate-500 dark:text-slate-400 ml-2 border-l border-slate-300 dark:border-slate-700 pl-2">
                    SMAN 1 Mantang
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Navigation Links (Single line, text with subtle underline) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative py-1 text-sm whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-sky-600 dark:text-sky-400 font-semibold' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Theme Toggle, Role Switcher Button) */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle mode tema"
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Role Indicator & Switcher Button */}
              <button
                onClick={() => setRoleModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium text-slate-700 dark:text-slate-200"
                title="Ganti Peran Pengguna (Siswa / Guru)"
              >
                <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span className="hidden sm:inline">Masuk:</span>
                <span className="capitalize font-semibold text-sky-700 dark:text-sky-300">
                  {currentUser.role}
                </span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu navigasi"
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Role Switcher Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pilih Akun Demo Fisika Mantang
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Struktur terhubung dengan model Firebase Auth & Firestore
                </p>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Siswa Option */}
              <button
                onClick={() => {
                  switchRole('siswa');
                  setRoleModalOpen(false);
                }}
                className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                  currentUser.role === 'siswa'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Ahmad Fauzi (Siswa)
                    </span>
                    {currentUser.role === 'siswa' && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Kelas XI MIPA 1 · SMAN 1 Mantang
                  </p>
                  <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">
                    Akses materi, simulasi interaktif, latihan soal, & asisten AI
                  </p>
                </div>
              </button>

              {/* Guru Option */}
              <button
                onClick={() => {
                  switchRole('guru');
                  setRoleModalOpen(false);
                }}
                className={`w-full p-3.5 rounded-lg border text-left flex items-start gap-3 transition-all ${
                  currentUser.role === 'guru'
                    ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      Dra. Hj. Nurhidayati, M.Pd (Guru Fisika)
                    </span>
                    {currentUser.role === 'guru' && (
                      <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    NIP. 19780512 200501 2 008 · Guru Fisika SMAN 1 Mantang
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Kelola kelas, pantau nilai kuis, analisis kesulitan, buat tugas
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
