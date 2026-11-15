import { ArrowRightLeft, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentProfiles } from '../services/campusService';
import { errorMessage } from '../services/supabase';
import type { ProfileRow } from '../types/supabase';

type ExchangeStudent = Pick<ProfileRow, 'id' | 'full_name' | 'department' | 'skills' | 'avatar'>;

export function SkillExchange() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ExchangeStudent[]>([]);
  const [search, setSearch] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    void getStudentProfiles(user.id).then((profiles) => {
      if (active) setStudents(profiles);
    }).catch((loadError) => {
      if (active) setError(errorMessage(loadError, 'Unable to load student profiles.'));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [user]);

  const query = search.trim().toLowerCase();
  const filtered = students.filter((student) =>
    student.full_name.toLowerCase().includes(query)
    || student.skills.some((skill) => skill.toLowerCase().includes(query))
    || student.department.toLowerCase().includes(query)
  );

  const handleSendRequest = (studentId: string) => {
    setSent((current) => current.includes(studentId) ? current : [...current, studentId]);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Skill Exchange</p>
            <h1>Teach and learn together</h1>
          </div>
        </div>

        <div className="card search-panel">
          <div className="search-row">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students by skill or name" aria-label="Search students by skill or name" />
          </div>
        </div>

        {error && <div className="alert error" role="alert">{error}</div>}
        {loading ? <p className="page-loading" role="status">Loading student skills…</p> : filtered.length ? (
          <div className="results-grid">
            {filtered.map((student) => {
              const initials = student.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={student.id} className="card recommendation-card">
                  <div className="card-header-row">
                    {student.avatar ? <img src={student.avatar} alt="" className="student-avatar small" /> : <div className="student-avatar student-avatar-fallback">{initials}</div>}
                    <div>
                      <h4>{student.full_name}</h4>
                      <p>{student.department || 'Department not provided'}</p>
                    </div>
                  </div>
                  <div className="tag-list">
                    {student.skills.length ? student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>) : <span className="muted">No skills listed yet.</span>}
                  </div>
                  <div className="card-footer-row">
                    <Link to="/team-matcher" className="secondary-button small">View in matcher</Link>
                    <button
                      type="button"
                      className="primary-button small"
                      onClick={() => handleSendRequest(student.id)}
                      disabled={sent.includes(student.id)}
                    >
                      <ArrowRightLeft size={14} /> {sent.includes(student.id) ? 'Request Sent' : 'Exchange'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="card empty-state">{students.length ? 'No students match your search.' : 'No student profiles are available yet.'}</p>}
      </main>
    </div>
  );
}
