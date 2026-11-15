import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { defaultState } from './data';
import { OpportunityCard } from './OpportunityCard';
import { Sidebar } from './Sidebar';

export function OpportunityHub() {
  const [search, setSearch] = useState('');
  const filtered = defaultState.opportunities.filter((opportunity) => opportunity.title.toLowerCase().includes(search.toLowerCase()) || opportunity.organization.toLowerCase().includes(search.toLowerCase()));

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
        </div>

        <div className="results-grid">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </main>
    </div>
  );
}
