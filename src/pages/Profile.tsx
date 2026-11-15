import { Camera, Pencil, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

export function Profile() {
  const storedUser = JSON.parse(localStorage.getItem('campusconnect-user') || JSON.stringify({
    name: 'Aisha Patel',
    college: 'NIT Trichy',
    department: 'Computer Science',
    year: '3rd Year',
    bio: 'Frontend developer exploring AI-driven student platforms and intuitive product experiences.',
    skills: ['React', 'TypeScript', 'UI/UX', 'Node.js'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  }));

  const [user, setUser] = useState(storedUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    localStorage.setItem('campusconnect-user', JSON.stringify(user));
    localStorage.setItem('campusconnect-user-name', user.name);
    setIsEditing(false);
    window.dispatchEvent(new Event('campusconnect-auth-change'));
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h1>Student Profile</h1>
          </div>
          <button className="primary-button small" onClick={() => setIsEditing((value) => !value)}>
            <Pencil size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="card profile-card">
          <div className="profile-head">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <div>
              <h2>{user.name}</h2>
              <p>{user.department} • {user.college}</p>
              <div className="progress-wrap">
                <div className="progress-bar"><span style={{ width: '82%' }} /></div>
                <small>Profile completion: 82%</small>
              </div>
            </div>
          </div>

          <div className="profile-grid">
            <div><strong>Full Name</strong>{isEditing ? <input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} /> : <span>{user.name}</span>}</div>
            <div><strong>College</strong>{isEditing ? <input value={user.college} onChange={(e) => setUser({ ...user, college: e.target.value })} /> : <span>{user.college}</span>}</div>
            <div><strong>Department</strong>{isEditing ? <input value={user.department} onChange={(e) => setUser({ ...user, department: e.target.value })} /> : <span>{user.department}</span>}</div>
            <div><strong>Year</strong>{isEditing ? <input value={user.year} onChange={(e) => setUser({ ...user, year: e.target.value })} /> : <span>{user.year}</span>}</div>
            <div className="full-span"><strong>Bio</strong>{isEditing ? <textarea value={user.bio} onChange={(e) => setUser({ ...user, bio: e.target.value })} rows={4} /> : <span>{user.bio}</span>}</div>
            <div className="full-span"><strong>Skills</strong>{isEditing ? <input value={user.skills.join(', ')} onChange={(e) => setUser({ ...user, skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} /> : <div className="tag-list">{user.skills.map((skill: string) => <span key={skill} className="tag">{skill}</span>)}</div>}</div>
          </div>

          {isEditing && (
            <div className="action-row">
              <button className="primary-button small" onClick={handleSave}><Save size={14} /> Save Changes</button>
              <button className="secondary-button small"><Camera size={14} /> Upload Picture</button>
              <button className="danger-button small"><Trash2 size={14} /> Remove Picture</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
