import { Route, Routes } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { Login } from './Login';
import { Register } from './Register';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { TeamMatcher } from './TeamMatcher';
import { SkillExchange } from './SkillExchange';
import { Projects } from './Projects';
import { OpportunityHub } from './OpportunityHub';
import { Messages } from './Messages';
import { Notifications } from './Notifications';
import { Settings } from './Settings';
import { AdminDashboard } from './AdminDashboard';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ProtectedRoute } from './ProtectedRoute';
import { useState } from 'react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = true;

  const renderWithLayout = (element: JSX.Element, showFooter = true) => (
    <>
      <Navbar isLoggedIn={isAuthenticated} userName="Aisha Patel" unreadCount={2} mobileMenuOpen={mobileMenuOpen} onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)} />
      {element}
      {showFooter ? <Footer /> : null}
    </>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={renderWithLayout(<LandingPage />)} />
        <Route path="/login" element={renderWithLayout(<Login />)} />
        <Route path="/register" element={renderWithLayout(<Register />)} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Dashboard />, false)}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Profile />, false)}</ProtectedRoute>} />
        <Route path="/team-matcher" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<TeamMatcher />, false)}</ProtectedRoute>} />
        <Route path="/skill-exchange" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<SkillExchange />, false)}</ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Projects />, false)}</ProtectedRoute>} />
        <Route path="/opportunities" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<OpportunityHub />, false)}</ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Messages />, false)}</ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Notifications />, false)}</ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<Settings />, false)}</ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}>{renderWithLayout(<AdminDashboard />, false)}</ProtectedRoute>} />
      </Routes>
    </>
  );
}
