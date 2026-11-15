import { Search, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import { defaultState, demoMessages } from './data';
import { Sidebar } from './Sidebar';

export function Messages() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const conversation = useMemo(() => defaultState.conversations[0], []);

  const filtered = defaultState.conversations.filter((item) => item.participantNames.some((name) => name.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel messages-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Messages</p>
            <h1>Student conversations</h1>
          </div>
        </div>

        <div className="messages-layout card">
          <aside className="conversation-list">
            <div className="search-row">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations" />
            </div>
            {filtered.map((item) => (
              <div key={item.id} className="conversation-item active">
                <strong>{item.participantNames.join(', ')}</strong>
                <small>{item.lastMessage}</small>
              </div>
            ))}
          </aside>

          <section className="chat-panel">
            <div className="chat-header">
              <h3>{conversation.participantNames.join(', ')}</h3>
            </div>
            <div className="chat-feed">
              {demoMessages.map((msg) => (
                <div key={msg.id} className={`chat-bubble ${msg.senderId === 's1' ? 'mine' : ''}`}>
                  <p>{msg.text}</p>
                  <small>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
              ))}
            </div>
            <div className="chat-composer">
              <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
              <button className="primary-button small" type="button"><Send size={14} /> Send</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
