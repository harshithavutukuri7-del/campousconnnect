import { Activity, BriefcaseBusiness, ShieldCheck, Users } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AdminDashboard() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Platform administration</h1>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box card"><Users size={22} /> <strong>1,245</strong><span>Students</span></div>
          <div className="stat-box card"><BriefcaseBusiness size={22} /> <strong>340</strong><span>Projects</span></div>
          <div className="stat-box card"><ShieldCheck size={22} /> <strong>142</strong><span>Opportunities</span></div>
          <div className="stat-box card"><Activity size={22} /> <strong>459</strong><span>Activity logs</span></div>
        </div>
      </main>
    </div>
  );
}
