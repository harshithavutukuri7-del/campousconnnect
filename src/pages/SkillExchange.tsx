import { ArrowRightLeft, Search, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

const students = [
  { id: 'u2', name: 'Rohit Sharma', department: 'Mechanical', skills: ['CAD', 'Design', '3D Print'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'u3', name: 'Meera Iyer', department: 'Electronics', skills: ['IoT', 'Python', 'Embedded C'], avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80' },
  { id: 'u4', name: 'Karan Singh', department: 'Computer Science', skills: ['React', 'Firebase', 'Node.js'], avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' }
];

export function SkillExchange() {
  const [search, setSearch] = useState('');
  const [sent, setSent] = useState<string[]>([]);

  const filtered = students.filter((student) => {
    const query = search.toLowerCase();
    return student.name.toLowerCase().includes(query) || student.skills.some((skill) => skill.toLowerCase().includes(query));
  });

  const handleSendRequest = (studentName: string) => {
    setSent((prev) => [...prev, studentName]);
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
                <button className="primary-button small" onClick={() => handleSendRequest(student.name)}><ArrowRightLeft size={14} /> {sent.includes(student.name) ? 'Request Sent' : 'Exchange'}</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
