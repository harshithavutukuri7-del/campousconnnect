import { ArrowRightLeft, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { defaultState } from './data';
import { Sidebar } from './Sidebar';

export function SkillExchange() {
  const [search, setSearch] = useState('');
  const filtered = defaultState.students.filter((student) => student.name.toLowerCase().includes(search.toLowerCase()));

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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students by skill or name" />
          </div>
        </div>

        <div className="results-grid">
          {filtered.map((student) => (
            <div key={student.id} className="card recommendation-card">
              <div className="card-header-row">
                <img src={student.avatar} alt={student.name} className="student-avatar small" />
                <div>
                  <h4>{student.name}</h4>
                  <p>{student.department}</p>
                </div>
              </div>
              <div className="tag-list">
                {student.skills.map((skill) => <span key={skill} className="tag">{skill}</span>)}
              </div>
              <div className="card-footer-row">
                <button className="secondary-button small"><UserRound size={14} /> Connect</button>
                <button className="primary-button small"><ArrowRightLeft size={14} /> Exchange</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
