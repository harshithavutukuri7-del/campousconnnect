import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { TeamMatcher } from './pages/TeamMatcher';
import { SkillExchange } from './pages/SkillExchange';
import { OpportunityHub } from './pages/OpportunityHub';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

const USERS_KEY = 'campusconnect-users';
const DEMO_USER = {
  id: 'u1',
  name: 'Aisha Patel',
  email: 'aisha@campus.edu',
  password: 'demo123',
  college: 'NIT Trichy',
  department: 'Computer Science',
  year: '3rd Year',
  bio: 'Frontend developer exploring AI-driven student platforms and intuitive product experiences.',
  skills: ['React', 'TypeScript', 'UI/UX', 'Node.js'],
  interests: ['AI', 'Hackathons'],
  availability: 'Available',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
};

const ensureDemoState = () => {
  const saved = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  if (!saved.length) {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
  }
  if (!localStorage.getItem('campusconnect-user-name')) {
    localStorage.setItem('campusconnect-user-name', DEMO_USER.name);
  }
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  ensureDemoState();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('campusconnect-user')));

  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('campusconnect-user')));
    window.addEventListener('campusconnect-auth-change', syncAuth);
    return () => window.removeEventListener('campusconnect-auth-change', syncAuth);
  }, []);

  const renderWithLayout = (element: JSX.Element, showFooter = true) => (
    <>
      <Navbar
        isLoggedIn={isAuthenticated}
        userName={localStorage.getItem('campusconnect-user-name') || 'Student'}
        unreadCount={2}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)}
      />
      {element}
      {showFooter ? <Footer /> : null}
    </>
  );

  return (
    <Routes>
      <Route path="/" element={renderWithLayout(<LandingPage />)} />
      <Route path="/login" element={renderWithLayout(<Login />)} />
      <Route path="/register" element={renderWithLayout(<Register />)} />
      <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Dashboard />, false)}</ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Profile />, false)}</ProtectedRoute>} />
      <Route path="/team-matcher" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<TeamMatcher />, false)}</ProtectedRoute>} />
      <Route path="/skill-exchange" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<SkillExchange />, false)}</ProtectedRoute>} />
      <Route path="/opportunities" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<OpportunityHub />, false)}</ProtectedRoute>} />
    </Routes>
  );
}
