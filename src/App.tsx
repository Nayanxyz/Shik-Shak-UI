import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import HomePage from './pages/HomePage';
import PracticePage from './pages/PracticePage';
import BattleLobby from './pages/BattleLobby';
import BattleGame from './pages/BattleGame';
import ResultsPage from './pages/ResultsPage';
import BattleResultsPage from './pages/BattleResultsPage';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function AppRoutes() {
  const location = useLocation();
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
          <Route path="/battle/lobby" element={<ProtectedRoute><BattleLobby /></ProtectedRoute>} />
          <Route path="/battle/game/:roomCode" element={<ProtectedRoute><BattleGame /></ProtectedRoute>} />
          <Route path="/practice/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/battle/results/:roomCode" element={<ProtectedRoute><BattleResultsPage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}