import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Sidebar } from './Sidebar';

const opportunities = [
  { id: 'o1', title: 'AI Product Intern', organization: 'NovaLabs', category: 'Internships', deadline: '2026-11-22', location: 'Bengaluru' },
  { id: 'o2', title: 'HackOn 2026', organization: 'CodeSprint', category: 'Hackathons', deadline: '2026-12-05', location: 'Hyderabad' },
  { id: 'o3', title: 'Women in Data Workshop', organization: 'DataNest', category: 'Workshops', deadline: '2026-11-18', location: 'Online' }
];

export function OpportunityHub() {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [category, setCategory] = useState('All');

  const filtered = opportunities.filter((opportunity) => {
    const matchesText = opportunity.title.toLowerCase().includes(search.toLowerCase()) || opportunity.organization.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || opportunity.category === category;
    return matchesText && matchesCategory;
  });

  const toggleSave = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Opportunity Hub</p>
            <h1>Discover your next opportunity</h1>
          </div>
          <button className="secondary-button small"><SlidersHorizontal size={14} /> Filters</button>
        </div>

        <div className="card search-panel">
          <div className="search-row">
            <Search size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search opportunities" />
          </div>
          <div className="filter-row">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>All</option>
              <option>Internships</option>
              <option>Hackathons</option>
              <option>Workshops</option>
            </select>
          </div>
        </div>

        <div className="results-grid">
          {filtered.map((opportunity) => (
            <div key={opportunity.id} className="opportunity-card card">
              <div className="card-header-row">
                <div>
                  <h4>{opportunity.title}</h4>
                  <p>{opportunity.organization}</p>
                </div>
                <span className="tag">{opportunity.category}</span>
              </div>
              <p className="muted">Apply before {opportunity.deadline} at {opportunity.location}.</p>
              <div className="card-footer-row">
                <button className="secondary-button small" onClick={() => toggleSave(opportunity.id)}>{saved.includes(opportunity.id) ? 'Saved' : 'Save'}</button>
                <a href="https://example.com" target="_blank" rel="noreferrer" className="primary-button small">Apply Now</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
