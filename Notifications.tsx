import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { defaultState } from './data';
import { Sidebar } from './Sidebar';

export function Notifications() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Notifications</p>
            <h1>Notification centre</h1>
          </div>
          <div className="action-row compact">
            <button className="secondary-button small"><CheckCheck size={14} /> Mark all as read</button>
            <button className="danger-button small"><Trash2 size={14} /> Clear all</button>
          </div>
        </div>

        <div className="stack-list">
          {defaultState.notifications.map((notification) => (
            <div key={notification.id} className={`card notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-main">
                <Bell size={16} />
                <div>
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                </div>
              </div>
              <div className="notification-actions">
                <button className="secondary-button small">Mark as read</button>
                <button className="danger-button small">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
