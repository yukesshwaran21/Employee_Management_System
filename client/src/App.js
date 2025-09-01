import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import AttendancePage from './pages/AttendancePage';
import PayrollPage from './pages/PayrollPage';
import LeavePage from './pages/LeavePage';
import NotFound from './pages/NotFound';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
