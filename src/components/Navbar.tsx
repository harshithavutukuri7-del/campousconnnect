import { Bell, LogIn, Menu, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

type NavbarProps = {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  userName?: string;
  onToggleMobileMenu?: () => void;
  onSignOut?: () => void;
  mobileMenuOpen?: boolean;
  unreadCount?: number;
  signOutError?: string;
};

export function Navbar({
  isLoggedIn = false,
  isAdmin = false,
  userName = 'Student',
  onToggleMobileMenu,
  onSignOut,
  mobileMenuOpen = false,
  unreadCount = 0,
  signOutError = ''
}: NavbarProps) {
  return (
    <header className="topbar">
      <div className="container nav-shell">
        <Link to="/" className="brand-wrap">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <span>CampusConnect</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/team-matcher">Team Matcher</NavLink>
          <NavLink to="/skill-exchange">Skill Exchange</NavLink>
          <NavLink to="/opportunities">Opportunities</NavLink>
        </nav>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="secondary-button small">Dashboard</Link>
              <div className="notification-wrap">
                <Link to="/dashboard" className="icon-button" aria-label="Notifications">
                  <Bell size={16} />
                  {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
                </Link>
              </div>
              <span className="user-pill">{userName}</span>
              <button type="button" className="secondary-button small" onClick={onSignOut}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="secondary-button small"><LogIn size={16} /> Login</Link>
              <Link to="/register" className="primary-button small">Get Started</Link>
            </>
          )}
          <button type="button" className="mobile-menu" onClick={onToggleMobileMenu} aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          <NavLink to="/">Home</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/team-matcher">Team Matcher</NavLink>
              <NavLink to="/skill-exchange">Skill Exchange</NavLink>
              <NavLink to="/opportunities">Opportunities</NavLink>
              {isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <button type="button" onClick={onSignOut}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Get Started</NavLink>
            </>
          )}
        </div>
      )}
      {signOutError && <div className="container alert error" role="alert">{signOutError}</div>}
    </header>
  );
}
