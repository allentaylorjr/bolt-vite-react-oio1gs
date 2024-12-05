import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import SermonDashboard from './pages/dashboard/SermonDashboard';
import SeriesDashboard from './pages/dashboard/SeriesDashboard';
import SpeakersDashboard from './pages/dashboard/SpeakersDashboard';
import EmbedDashboard from './pages/dashboard/EmbedDashboard';
import SettingsDashboard from './pages/dashboard/SettingsDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/sermons" replace />} />
            <Route path="sermons" element={<SermonDashboard />} />
            <Route path="series" element={<SeriesDashboard />} />
            <Route path="speakers" element={<SpeakersDashboard />} />
            <Route path="embed" element={<EmbedDashboard />} />
            <Route path="settings" element={<SettingsDashboard />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all route - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;