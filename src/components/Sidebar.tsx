import { BarChart3, BriefcaseBusiness, Compass, ShieldCheck, Sparkles, Users, UserRound, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { errorMessage } from '../services/supabase';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'My Profile', to: '/profile', icon: UserRound },
  { label: 'Smart Team Matcher', to: '/team-matcher', icon: Sparkles },
  { label: 'Skill Exchange', to: '/skill-exchange', icon: Compass },
  { label: 'Opportunity Hub', to: '/opportunities', icon: BriefcaseBusiness }
];

export function Sidebar() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (signOutError) {
      setError(errorMessage(signOutError, 'Unable to sign out. Please try again.'));
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-mark small"><Users size={18} /></div>
        <div>
          <strong>CampusConnect</strong>
          <small>Student Network</small>
        </div>
      </div>

      <nav className="sidebar-nav">
        {profile?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldCheck size={18} />
            <span>Admin</span>
          </NavLink>
        )}
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink key={label} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
        <NavLink to="/" onClick={(event) => { event.preventDefault(); void handleLogout(); }} className="sidebar-link">
          <LogOut size={18} />
          <span>Logout</span>
        </NavLink>
      </nav>
      {error && <div className="alert error sidebar-error" role="alert">{error}</div>}
    </aside>
  );
}
