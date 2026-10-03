/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { StudentDashboard } from './components/StudentDashboard';
import { MaterialView } from './components/MaterialView';
import { SimulationLab } from './components/SimulationLab';
import { QuizExerciseView } from './components/QuizExerciseView';
import { TanyaFisikaChat } from './components/TanyaFisikaChat';
import { TeacherDashboard } from './components/TeacherDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      
      <main className="flex-1">
        {currentPage === 'beranda' && <HomeView />}
        {currentPage === 'dashboard-siswa' && <StudentDashboard />}
        {currentPage === 'materi' && <MaterialView />}
        {currentPage === 'simulasi' && <SimulationLab />}
        {currentPage === 'latihan' && <QuizExerciseView />}
        {currentPage === 'tanya-fisika' && <TanyaFisikaChat />}
        {currentPage === 'dashboard-guru' && <TeacherDashboard />}
      </main>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
