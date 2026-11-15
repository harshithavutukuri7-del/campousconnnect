import { SlidersHorizontal, Sparkles, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { defaultState } from './data';
import { recommendStudents } from './matchingService';
import { Sidebar } from './Sidebar';

export function TeamMatcher() {
  const [selectedFilter, setSelectedFilter] = useState('Highest match');
  const project = defaultState.projects[0];
  const recommendations = useMemo(() => recommendStudents(project, defaultState.students), [project]);

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
          <div className="filter-row">
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option>Highest match</option>
              <option>Department</option>
              <option>Skills</option>
              <option>Availability</option>
            </select>
          </div>
        </div>

        <div className="results-grid">
          {recommendations.map(({ student, score, skillMatch }) => (
            <div key={student.id} className="card recommendation-card">
              <div className="card-header-row">
                <img src={student.avatar} alt={student.name} className="student-avatar small" />
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.department}</p>
                </div>
                <span className="match-badge">{score}%</span>
              </div>
              <p>{student.bio}</p>
              <div className="tag-list">
                {student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
              </div>
              <div className="meta-line"><Sparkles size={14} /> Skill match: {skillMatch}%</div>
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
