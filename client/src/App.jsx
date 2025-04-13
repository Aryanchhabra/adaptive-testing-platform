import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import AdaptiveQuiz from './components/quiz/AdaptiveQuiz';
import { AuthProvider } from './contexts/AuthContext';
import AdminLogin from './components/auth/AdminLogin';
import Signup from './components/auth/Signup';
import Profile from './components/auth/Profile';
import DemoFeatures from './components/Demo/DemoFeatures';
import TestConnection from './components/Test/TestConnection';
import QuestionGenerator from './components/Admin/QuestionGenerator';
import AdminDashboard from './components/Admin/AdminDashboard';
import Login from './components/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quiz" element={<AdaptiveQuiz />} />
              <Route path="/demo" element={<DemoFeatures />} />
              <Route path="/test-connection" element={<TestConnection />} />
              
              {/* Auth Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requireAdmin={true} />} />
              <Route path="/admin/question-generator" element={<ProtectedRoute element={<QuestionGenerator />} requireAdmin={true} />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App; 