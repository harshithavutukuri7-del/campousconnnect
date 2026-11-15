import { SlidersHorizontal, Sparkles, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Sidebar } from './Sidebar';

const project = {
  title: 'Campus Safety App',
  requiredSkills: ['React', 'UI/UX', 'Firebase'],
  department: 'Computer Science'
};

const students = [
  { id: 'u2', name: 'Rohit Sharma', department: 'Mechanical', skills: ['CAD', 'Design', '3D Print'], availability: 'Open to discuss', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'u3', name: 'Meera Iyer', department: 'Electronics', skills: ['IoT', 'Python', 'Embedded C'], availability: 'Busy', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80' },
  { id: 'u4', name: 'Karan Singh', department: 'Computer Science', skills: ['React', 'Firebase', 'Node.js'], availability: 'Available', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
];

export function TeamMatcher() {
  const [selectedFilter, setSelectedFilter] = useState('Highest match');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  const matches = useMemo(() => {
    const results = students.map((student) => {
      const skillMatch = Math.round((student.skills.filter((skill) => project.requiredSkills.includes(skill)).length / project.requiredSkills.length) * 100);
      const departmentBonus = student.department === project.department ? 20 : 0;
      const availabilityBonus = student.availability === 'Available' ? 15 : 0;
      const score = Math.min(100, skillMatch + departmentBonus + availabilityBonus);
      return { ...student, score };
    });

    if (departmentFilter !== 'All') {
      return results.filter((student) => student.department === departmentFilter);
    }

    if (selectedFilter === 'Department') {
      return [...results].sort((a, b) => a.department.localeCompare(b.department));
    }
    if (selectedFilter === 'Skills') {
      return [...results].sort((a, b) => b.skills.length - a.skills.length);
    }
    if (selectedFilter === 'Availability') {
      return [...results].sort((a, b) => (b.availability === 'Available' ? 1 : 0) - (a.availability === 'Available' ? 1 : 0));
    }
    return [...results].sort((a, b) => b.score - a.score);
  }, [departmentFilter, selectedFilter]);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Smart Team Matcher</p>
            <h1>Find ideal teammates</h1>
          </div>
          <button className="secondary-button small"><SlidersHorizontal size={14} /> Filters</button>
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
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option>Highest match</option>
              <option>Department</option>
              <option>Skills</option>
              <option>Availability</option>
            </select>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
              <option>All</option>
              <option>Computer Science</option>
              <option>Mechanical</option>
              <option>Electronics</option>
            </select>
          </div>
        </div>

        <div className="results-grid">
          {matches.map((student) => (
            <div key={student.id} className="card recommendation-card">
              <div className="card-header-row">
                <img src={student.avatar} alt={student.name} className="student-avatar small" />
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.department}</p>
                </div>
                <span className="match-badge">{student.score}%</span>
              </div>
              <p className="muted">Available for team collaboration and product work.</p>
              <div className="tag-list">
                {student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
              </div>
              <div className="meta-line"><Sparkles size={14} /> Skill match: {Math.round((student.skills.filter((skill) => project.requiredSkills.includes(skill)).length / project.requiredSkills.length) * 100)}%</div>
              <div className="card-footer-row">
                <button className="secondary-button small">View Profile</button>
                <button className="primary-button small"><UserPlus size={14} /> Invite</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
