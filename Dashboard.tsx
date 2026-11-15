import { Bell, BriefcaseBusiness, CalendarClock, Sparkles, Star, Users } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { defaultState } from './data';
import { Sidebar } from './Sidebar';
import { StudentCard } from './StudentCard';

export function Dashboard() {
  const currentUser = defaultState.students[0];
  const recommended = useMemo(() => defaultState.students.filter((student) => student.id !== currentUser.id).slice(0, 2), [currentUser.id]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back, {currentUser.name}!</h1>
          </div>
          <div className="header-actions">
            <button className="secondary-button small">+ New Project</button>
            <div className="notification-wrap"><Bell size={18} /></div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box card"><Users size={22} /> <strong>6</strong><span>My Projects</span></div>
          <div className="stat-box card"><Sparkles size={22} /> <strong>3</strong><span>Team Invitations</span></div>
          <div className="stat-box card"><Star size={22} /> <strong>7</strong><span>Skills Listed</span></div>
          <div className="stat-box card"><BriefcaseBusiness size={22} /> <strong>4</strong><span>Saved Opportunities</span></div>
        </div>

        <div className="content-grid two-col">
          <section className="panel card">
            <div className="section-header">
              <h3>Recommended Teammates</h3>
              <Link to="/team-matcher" className="text-link">View all</Link>
            </div>
            <div className="stack-list">
              {recommended.map((student) => (
                <StudentCard key={student.id} student={student} matchPercent={88} />
              ))}
            </div>
          </section>

          <section className="panel card">
            <div className="section-header">
              <h3>Upcoming Deadlines</h3>
            </div>
            <ul className="simple-list">
              <li><CalendarClock size={14} /> HackOn 2026 — Dec 5</li>
              <li><CalendarClock size={14} /> AI Product Intern — Nov 22</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
