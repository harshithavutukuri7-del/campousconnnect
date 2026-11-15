import { BarChart3, BriefcaseBusiness, Compass, MessageSquareText, Settings, Sparkles, Users, LogOut, BellRing, Bookmark, ShieldCheck, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: BarChart3 },
  { label: 'My Profile', to: '/profile', icon: UserRound },
  { label: 'Smart Team Matcher', to: '/team-matcher', icon: Sparkles },
  { label: 'Skill Exchange', to: '/skill-exchange', icon: Compass },
  { label: 'Projects', to: '/projects', icon: BriefcaseBusiness },
  { label: 'Opportunity Hub', to: '/opportunities', icon: Bookmark },
  { label: 'Messages', to: '/messages', icon: MessageSquareText },
  { label: 'Notifications', to: '/notifications', icon: BellRing },
  { label: 'Saved Opportunities', to: '/saved-opportunities', icon: Bookmark },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Admin', to: '/admin', icon: ShieldCheck },
  { label: 'Logout', to: '/', icon: LogOut }
];

export function Sidebar() {
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
          <NavLink key={label} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
