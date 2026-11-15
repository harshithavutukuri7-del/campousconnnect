import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { applyToOpportunity, getOpportunities, getStudentApplications } from '../services/campusService';
import { errorMessage } from '../services/supabase';
import type { ApplicationWithOpportunity, OpportunityRow } from '../types/supabase';

const categories = ['All', 'Internships', 'Hackathons', 'Workshops', 'Competitions', 'Events', 'Scholarships', 'Student Programs'];

function isDuplicateApplication(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'code' in error && error.code === '23505');
}

function externalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : '';
  } catch {
    return '';
  }
}

export function OpportunityHub() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    void Promise.all([getOpportunities(), getStudentApplications(user.id)])
      .then(([availableOpportunities, studentApplications]) => {
        if (!active) return;
        setOpportunities(availableOpportunities);
        setApplications(studentApplications);
      })
      .catch((loadError) => {
        if (active) setError(errorMessage(loadError, 'Unable to load opportunities.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [user]);

  const appliedIds = useMemo(() => new Set(applications.map((application) => application.opportunity_id)), [applications]);
  const filtered = opportunities.filter((opportunity) => {
    const text = search.trim().toLowerCase();
    const matchesText = !text
      || opportunity.title.toLowerCase().includes(text)
      || opportunity.organization.toLowerCase().includes(text)
      || opportunity.description.toLowerCase().includes(text);
    const matchesCategory = category === 'All' || opportunity.category === category;
    return matchesText && matchesCategory;
  });

  const toggleSave = (id: string) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const handleApply = async (opportunity: OpportunityRow) => {
    if (!user) return;
    setError('');
    setMessage('');
    setApplyingId(opportunity.id);
    try {
      const application = await applyToOpportunity(opportunity.id, user.id);
      setApplications((current) => [{ ...application, opportunity: { id: opportunity.id, title: opportunity.title, organization: opportunity.organization } }, ...current]);
      setMessage(`Application submitted for ${opportunity.title}.`);
    } catch (applyError) {
      if (isDuplicateApplication(applyError)) {
        setMessage('You have already applied to this opportunity.');
        return;
      }
      setError(errorMessage(applyError, 'Unable to submit your application.'));
    } finally {
      setApplyingId('');
    }
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
          <span className="muted">{filtered.length} opportunities</span>
        </div>

        <div className="card search-panel">
          <div className="search-row">
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search opportunities" aria-label="Search opportunities" />
          </div>
          <div className="filter-row">
            <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">
              {categories.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>

        {error && <div className="alert error" role="alert">{error}</div>}
        {message && <div className="alert success" role="status">{message}</div>}
        {loading ? <p className="page-loading" role="status">Loading opportunities…</p> : filtered.length ? (
          <div className="results-grid">
            {filtered.map((opportunity) => {
              const isApplied = appliedIds.has(opportunity.id);
              const link = externalUrl(opportunity.application_link);
              return (
                <div key={opportunity.id} className="opportunity-card card">
                  <div className="card-header-row">
                    <div>
                      <h4>{opportunity.title}</h4>
                      <p>{opportunity.organization}</p>
                    </div>
                    <span className="tag">{opportunity.category}</span>
                  </div>
                  <p>{opportunity.description}</p>
                  <p className="muted">
                    {opportunity.deadline ? `Apply before ${new Date(`${opportunity.deadline}T00:00:00`).toLocaleDateString()}` : 'No deadline listed'}
                    {opportunity.location ? ` · ${opportunity.location}` : ''}
                  </p>
                  <div className="card-footer-row">
                    <button type="button" className="secondary-button small" onClick={() => toggleSave(opportunity.id)}>
                      {saved.includes(opportunity.id) ? 'Saved' : 'Save'}
                    </button>
                    <div className="action-row">
                      {link && <a href={link} target="_blank" rel="noopener noreferrer" className="secondary-button small">Details</a>}
                      <button
                        type="button"
                        className="primary-button small"
                        onClick={() => void handleApply(opportunity)}
                        disabled={isApplied || applyingId === opportunity.id}
                      >
                        {isApplied ? 'Applied' : applyingId === opportunity.id ? 'Applying…' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="card empty-state">{opportunities.length ? 'No opportunities match your search.' : 'No opportunities have been published yet.'}</p>}
      </main>
    </div>
  );
}
