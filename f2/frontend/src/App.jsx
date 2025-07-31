import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';

import SearchHistory from './pages/HistoryPage';
import { Navigate } from 'react-router-dom';


const App = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/history" element={isLoggedIn ? <SearchHistory /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 Feedback Analysis Project. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;