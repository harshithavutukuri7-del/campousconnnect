import { Bell, BriefcaseBusiness, CalendarClock, Sparkles, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const defaultStudents = [
  { id: 'u1', name: 'Aisha Patel', college: 'NIT Trichy', department: 'Computer Science', year: '3rd Year', skills: ['React', 'UI/UX', 'TypeScript'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 'u2', name: 'Rohit Sharma', college: 'IIT Delhi', department: 'Mechanical', year: '2nd Year', skills: ['CAD', 'Design', '3D Print'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'u3', name: 'Meera Iyer', college: 'BITS Pilani', department: 'Electronics', year: '4th Year', skills: ['IoT', 'Python', 'Embedded C'], avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80' }
];

export function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem('campusconnect-user') || JSON.stringify({ name: 'Aisha Patel' }));
  const recommended = defaultStudents.filter((student) => student.id !== currentUser.id).slice(0, 2);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back, {currentUser.name || 'Student'}!</h1>
          </div>
          <div className="header-actions">
            <button className="secondary-button small">+ New Project</button>
            <div className="notification-wrap"><Bell size={18} /></div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box card"><Users size={22} /> <strong>5</strong><span>My Projects</span></div>
          <div className="stat-box card"><Sparkles size={22} /> <strong>3</strong><span>Team Invitations</span></div>
          <div className="stat-box card"><Star size={22} /> <strong>8</strong><span>Skills Listed</span></div>
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
                <div key={student.id} className="student-card-mini card">
                  <div className="card-header-row">
                    <img src={student.avatar} alt={student.name} className="student-avatar" />
                    <div>
                      <h4>{student.name}</h4>
                      <p>{student.department}</p>
                    </div>
                    <span className="match-badge">92%</span>
                  </div>
                  <div className="tag-list">
                    {student.skills.map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                  </div>
                  <Link to="/team-matcher" className="secondary-button small">View Profile</Link>
                </div>
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
