import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { OpportunityHub } from './pages/OpportunityHub';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';
import { SkillExchange } from './pages/SkillExchange';
import { TeamMatcher } from './pages/TeamMatcher';
import { VerifyEmail } from './pages/VerifyEmail';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { errorMessage } from './services/supabase';

export default function App() {
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut();
      setSignOutError('');
    } catch (error) {
      setSignOutError(errorMessage(error, 'Unable to sign out. Please try again.'));
    }
  };

  const renderWithLayout = (element: JSX.Element, showFooter = true) => (
    <>
      <Navbar
        isLoggedIn={Boolean(user)}
        isAdmin={profile?.role === 'admin'}
        userName={profile?.full_name || user?.email || 'Student'}
        unreadCount={0}
        mobileMenuOpen={mobileMenuOpen}
        signOutError={signOutError}
        onSignOut={handleSignOut}
        onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)}
      />
      {element}
      {showFooter ? <Footer /> : null}
    </>
  );

  const protectedPage = (element: JSX.Element, requireAdmin = false) => (
    <ProtectedRoute requireAdmin={requireAdmin}>
      {renderWithLayout(element, false)}
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route path="/" element={renderWithLayout(<LandingPage />)} />
      <Route path="/login" element={renderWithLayout(<Login />)} />
      <Route path="/register" element={renderWithLayout(<Register />)} />
      <Route path="/verify-email" element={renderWithLayout(<VerifyEmail />)} />
      <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
      <Route path="/profile" element={protectedPage(<Profile />)} />
      <Route path="/team-matcher" element={protectedPage(<TeamMatcher />)} />
      <Route path="/skill-exchange" element={protectedPage(<SkillExchange />)} />
      <Route path="/opportunities" element={protectedPage(<OpportunityHub />)} />
      <Route path="/admin" element={protectedPage(<AdminDashboard />, true)} />
      <Route path="*" element={renderWithLayout(<LandingPage />)} />
    </Routes>
  );
}
