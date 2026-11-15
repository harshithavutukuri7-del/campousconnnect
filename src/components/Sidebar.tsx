import { BarChart3, BriefcaseBusiness, Compass, Sparkles, Users, UserRound, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'My Profile', to: '/profile', icon: UserRound },
  { label: 'Smart Team Matcher', to: '/team-matcher', icon: Sparkles },
  { label: 'Skill Exchange', to: '/skill-exchange', icon: Compass },
  { label: 'Opportunity Hub', to: '/opportunities', icon: BriefcaseBusiness },
  { label: 'Logout', to: '/', icon: LogOut }
];

export function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('campusconnect-user');
    localStorage.removeItem('campusconnect-user-name');
    window.dispatchEvent(new Event('campusconnect-auth-change'));
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
        {links.map(({ label, to, icon: Icon }) => (
          label === 'Logout' ? (
            <NavLink key={label} to={to} onClick={handleLogout} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ) : (
            <NavLink key={label} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          )
        ))}
      </nav>
    </aside>
  );
}
