import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import NavBar from './components/common/NavBar';
import Onboarding from './pages/Onboarding';
import HabitSetup from './pages/HabitSetup';
import Dashboard from './pages/Dashboard';
import Garden from './pages/Garden';
import Analytics from './pages/Analytics';

function AppRoutes() {
  const { state } = useApp();

  if (state.isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!state.user) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  if (!state.habits.length) {
    return (
      <div className="app-layout">
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/habits" element={<HabitSetup />} />
            <Route path="*" element={<Navigate to="/habits" replace />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <NavBar />
      <div className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<HabitSetup />} />
            <Route path="/garden" element={<Garden />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
