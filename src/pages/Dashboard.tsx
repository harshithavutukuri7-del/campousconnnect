import { BriefcaseBusiness, CalendarClock, CheckCircle2, Clock3, Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getOpportunities, getStudentApplications, getStudentProfiles } from '../services/campusService';
import { errorMessage } from '../services/supabase';
import type { ApplicationWithOpportunity, OpportunityRow, ProfileRow } from '../types/supabase';

export function Dashboard() {
  const { user, profile, profileError } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
  const [teammates, setTeammates] = useState<Pick<ProfileRow, 'id' | 'full_name' | 'college' | 'department' | 'year_of_study' | 'skills' | 'avatar' | 'availability'>[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    setError('');

    void Promise.all([
      getStudentApplications(user.id),
      getStudentProfiles(user.id),
      getOpportunities()
    ]).then(([studentApplications, students, availableOpportunities]) => {
      if (!active) return;
      setApplications(studentApplications);
      setTeammates(students);
      setOpportunities(availableOpportunities);
    }).catch((loadError) => {
      if (active) setError(errorMessage(loadError, 'Unable to load dashboard data.'));
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [user]);

  const acceptedCount = applications.filter((application) => application.status === 'accepted').length;
  const activeCount = applications.filter((application) => application.status === 'submitted' || application.status === 'reviewing').length;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Welcome back, {profile?.full_name || user?.email || 'Student'}!</h1>
          </div>
          <div className="header-actions">
            <Link to="/opportunities" className="primary-button small">Browse Opportunities</Link>
          </div>
        </div>

        {(error || profileError) && <div className="alert error" role="alert">{error || profileError}</div>}

        <div className="stats-grid">
          <div className="stat-box card"><BriefcaseBusiness size={22} /> <strong>{loading ? '…' : applications.length}</strong><span>Applications</span></div>
          <div className="stat-box card"><Clock3 size={22} /> <strong>{loading ? '…' : activeCount}</strong><span>In Review</span></div>
          <div className="stat-box card"><CheckCircle2 size={22} /> <strong>{loading ? '…' : acceptedCount}</strong><span>Accepted</span></div>
          <div className="stat-box card"><Sparkles size={22} /> <strong>{profile?.skills.length ?? 0}</strong><span>Skills Listed</span></div>
        </div>

        <div className="content-grid two-col">
          <section className="panel card">
            <div className="section-header">
              <h3>My Applications</h3>
              <Link to="/opportunities" className="text-link">Find more</Link>
            </div>
            {loading ? <p role="status">Loading applications…</p> : applications.length ? (
              <ul className="simple-list">
                {applications.map((application) => (
                  <li key={application.id} className="application-row">
                    <div>
                      <strong>{application.opportunity?.title || 'Opportunity'}</strong>
                      <span className="muted">{application.opportunity?.organization || 'Details unavailable'}</span>
                    </div>
                    <span className={`status-pill status-${application.status}`}>{application.status}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="muted">You haven’t applied to any opportunities yet.</p>}
          </section>

          <section className="panel card">
            <div className="section-header">
              <h3>Recommended Teammates</h3>
              <Link to="/team-matcher" className="text-link">View all</Link>
            </div>
            {loading ? <p role="status">Loading students…</p> : teammates.length ? (
              <div className="stack-list">
                {teammates.slice(0, 3).map((student) => {
                  const initials = student.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={student.id} className="student-card-mini card">
                      <div className="card-header-row">
                        {student.avatar ? <img src={student.avatar} alt="" className="student-avatar" /> : <div className="student-avatar student-avatar-fallback">{initials}</div>}
                        <div>
                          <h4>{student.full_name}</h4>
                          <p>{student.department || student.college}</p>
                        </div>
                        <span className="tag">{student.availability}</span>
                      </div>
                      <div className="tag-list">
                        {student.skills.slice(0, 3).map((skill) => <span className="tag" key={skill}>{skill}</span>)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p className="muted">No other student profiles are available yet.</p>}
          </section>
        </div>

        <section className="panel card dashboard-opportunities">
          <div className="section-header">
            <h3>Upcoming Deadlines</h3>
            <Link to="/opportunities" className="text-link">View opportunities</Link>
          </div>
          {loading ? <p role="status">Loading deadlines…</p> : opportunities.length ? (
            <ul className="simple-list">
              {opportunities.filter((opportunity) => opportunity.deadline).slice(0, 4).map((opportunity) => (
                <li key={opportunity.id}>
                  <CalendarClock size={14} />
                  <span>{opportunity.title} — {new Date(`${opportunity.deadline}T00:00:00`).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : <p className="muted">No published opportunities with upcoming deadlines.</p>}
        </section>
      </main>
    </div>
  );
}
