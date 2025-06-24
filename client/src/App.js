// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Register from './pages/register';
import Login from './pages/login';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import LostFoundPage from './pages/LostFoundPage';
import RaiseComplaintPage from './pages/RaiseComplaintPage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import LogoutPage from './pages/LogoutPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];

  if (noLayoutRoutes.includes(location.pathname)) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><LostFoundPage /></ProtectedRoute>} />
        <Route path="/raise-complaint" element={<ProtectedRoute><RaiseComplaintPage /></ProtectedRoute>} />
        <Route path="/personal-info" element={<ProtectedRoute><PersonalInfoPage /></ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute><LogoutPage /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
