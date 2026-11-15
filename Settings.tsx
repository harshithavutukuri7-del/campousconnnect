import { LogOut, Shield, UserCog } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Settings() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Settings</p>
            <h1>Account settings</h1>
          </div>
        </div>

        <div className="card settings-card">
          <div className="settings-group">
            <h3>Account information</h3>
            <label><span>Email</span><input defaultValue="aisha@campus.edu" /></label>
            <label><span>Full name</span><input defaultValue="Aisha Patel" /></label>
          </div>

          <div className="settings-group">
            <h3>Notification preferences</h3>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Team invites</label>
            <label className="checkbox-row"><input type="checkbox" defaultChecked /> Skill exchange updates</label>
            <label className="checkbox-row"><input type="checkbox" /> Opportunity alerts</label>
          </div>

          <div className="settings-group">
            <h3>Profile visibility</h3>
            <select defaultValue="Public">
              <option>Public</option>
              <option>Campus only</option>
              <option>Private</option>
            </select>
          </div>

          <div className="action-row">
            <button className="primary-button small"><UserCog size={14} /> Save Changes</button>
            <button className="secondary-button small"><Shield size={14} /> Change Password</button>
            <button className="danger-button small"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </main>
    </div>
  );
}
