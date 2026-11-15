import { Sparkles, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentProfiles } from '../services/campusService';
import { errorMessage } from '../services/supabase';
import type { ProfileRow } from '../types/supabase';

const project = {
  title: 'Campus Safety App',
  requiredSkills: ['React', 'UI/UX', 'Supabase'],
  department: 'Computer Science'
};

type Teammate = Pick<ProfileRow, 'id' | 'full_name' | 'department' | 'skills' | 'availability' | 'avatar'>;

export function TeamMatcher() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Teammate[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('Highest match');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [invited, setInvited] = useState<string[]>([]);
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

  const departments = [...new Set(students.map((student) => student.department).filter(Boolean))];
  const matches = useMemo(() => {
    const results = students.map((student) => {
      const skillMatch = Math.round(
        student.skills.filter((skill) => project.requiredSkills.includes(skill)).length / project.requiredSkills.length * 100
      );
      const departmentBonus = student.department === project.department ? 20 : 0;
      const availabilityBonus = student.availability === 'Available' ? 15 : 0;
      return { ...student, skillMatch, score: Math.min(100, skillMatch + departmentBonus + availabilityBonus) };
    });

    const filtered = departmentFilter === 'All'
      ? results
      : results.filter((student) => student.department === departmentFilter);

    if (selectedFilter === 'Department') return [...filtered].sort((a, b) => a.department.localeCompare(b.department));
    if (selectedFilter === 'Skills') return [...filtered].sort((a, b) => b.skills.length - a.skills.length);
    if (selectedFilter === 'Availability') {
      return [...filtered].sort((a, b) => (b.availability === 'Available' ? 1 : 0) - (a.availability === 'Available' ? 1 : 0));
    }
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [departmentFilter, selectedFilter, students]);

  const handleInvite = (id: string) => {
    setInvited((current) => current.includes(id) ? current : [...current, id]);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Smart Team Matcher</p>
            <h1>Find ideal teammates</h1>
          </div>
        </div>

        <div className="card matcher-panel">
          <div className="project-overview">
            <div>
              <span className="eyebrow">Current Project</span>
              <h3>{project.title}</h3>
            </div>
            <div className="tag-list">
              {project.requiredSkills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
            </div>
          </div>
          <div className="filter-row two-col">
            <select value={selectedFilter} onChange={(event) => setSelectedFilter(event.target.value)} aria-label="Sort teammates">
              <option>Highest match</option>
              <option>Department</option>
              <option>Skills</option>
              <option>Availability</option>
            </select>
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} aria-label="Filter by department">
              <option>All</option>
              {departments.map((department) => <option key={department}>{department}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="alert error" role="alert">{error}</div>}
        {loading ? <p className="page-loading" role="status">Finding student matches…</p> : matches.length ? (
          <div className="results-grid">
            {matches.map((student) => {
              const initials = student.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
              return (
                <div key={student.id} className="card recommendation-card">
                  <div className="card-header-row">
                    {student.avatar ? <img src={student.avatar} alt="" className="student-avatar small" /> : <div className="student-avatar student-avatar-fallback">{initials}</div>}
                    <div>
                      <h4>{student.full_name}</h4>
                      <p>{student.department || 'Department not provided'}</p>
                    </div>
                    <span className="match-badge">{student.score}%</span>
                  </div>
                  <p className="muted">{student.availability} for team collaboration</p>
                  <div className="tag-list">
                    {student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
                  </div>
                  <div className="meta-line"><Sparkles size={14} /> Skill match: {student.skillMatch}%</div>
                  <div className="card-footer-row">
                    <span className="muted">{student.availability}</span>
                    <button
                      type="button"
                      className="primary-button small"
                      onClick={() => handleInvite(student.id)}
                      disabled={invited.includes(student.id)}
                    >
                      <UserPlus size={14} /> {invited.includes(student.id) ? 'Invite Sent' : 'Invite'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="card empty-state">No student profiles are available yet. Check back after more students join.</p>}
      </main>
    </div>
  );
}
