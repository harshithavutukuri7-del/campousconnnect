import { Activity, BriefcaseBusiness, Plus, Save, ShieldCheck, Trash2, Users, X } from 'lucide-react';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import {
  deleteOpportunity,
  getAdminApplications,
  getAdminCounts,
  getAdminOpportunities,
  saveOpportunity,
  updateApplicationStatus
} from '../services/campusService';
import { errorMessage } from '../services/supabase';
import type {
  ApplicationStatus,
  ApplicationWithStudentAndOpportunity,
  OpportunityInput,
  OpportunityRow
} from '../types/supabase';

const emptyOpportunity: OpportunityInput = {
  title: '',
  organization: '',
  description: '',
  category: 'Internships',
  eligibility: '',
  deadline: null,
  location: '',
  application_link: '',
  is_published: true
};

const statuses: ApplicationStatus[] = ['submitted', 'reviewing', 'accepted', 'rejected'];
const categories = ['Internships', 'Hackathons', 'Workshops', 'Competitions', 'Events', 'Scholarships', 'Student Programs'];

export function AdminDashboard() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);
  const [applications, setApplications] = useState<ApplicationWithStudentAndOpportunity[]>([]);
  const [counts, setCounts] = useState({ students: 0, opportunities: 0, applications: 0 });
  const [form, setForm] = useState<OpportunityInput>(emptyOpportunity);
  const [editingId, setEditingId] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingApplication, setUpdatingApplication] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [opportunityRows, applicationRows, adminCounts] = await Promise.all([
        getAdminOpportunities(),
        getAdminApplications(),
        getAdminCounts()
      ]);
      setOpportunities(opportunityRows);
      setApplications(applicationRows);
      setCounts(adminCounts);
    } catch (loadError) {
      setError(errorMessage(loadError, 'Unable to load admin data.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAdminData();
  }, [loadAdminData]);

  const startCreate = () => {
    setForm(emptyOpportunity);
    setEditingId('');
    setNotice('');
    setFormOpen(true);
  };

  const startEdit = (opportunity: OpportunityRow) => {
    setForm({
      title: opportunity.title,
      organization: opportunity.organization,
      description: opportunity.description,
      category: opportunity.category,
      eligibility: opportunity.eligibility,
      deadline: opportunity.deadline,
      location: opportunity.location,
      application_link: opportunity.application_link,
      is_published: opportunity.is_published
    });
    setEditingId(opportunity.id);
    setNotice('');
    setFormOpen(true);
  };

  const handleSaveOpportunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    setError('');
    setNotice('');
    setSaving(true);
    try {
      const savedOpportunity = await saveOpportunity(form, user.id, editingId || undefined);
      setOpportunities((current) => editingId
        ? current.map((item) => item.id === savedOpportunity.id ? savedOpportunity : item)
        : [savedOpportunity, ...current]);
      setCounts((current) => ({ ...current, opportunities: editingId ? current.opportunities : current.opportunities + 1 }));
      setNotice(editingId ? 'Opportunity updated.' : 'Opportunity created.');
      setFormOpen(false);
      setEditingId('');
      setForm(emptyOpportunity);
    } catch (saveError) {
      setError(errorMessage(saveError, 'Unable to save this opportunity.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOpportunity = async (opportunity: OpportunityRow) => {
    if (!window.confirm(`Delete "${opportunity.title}"? Existing applications for it will also be deleted.`)) return;
    setError('');
    setNotice('');
    try {
      await deleteOpportunity(opportunity.id);
      setOpportunities((current) => current.filter((item) => item.id !== opportunity.id));
      setApplications((current) => current.filter((item) => item.opportunity_id !== opportunity.id));
      setCounts((current) => ({
        ...current,
        opportunities: Math.max(0, current.opportunities - 1),
        applications: Math.max(0, current.applications - applications.filter((item) => item.opportunity_id === opportunity.id).length)
      }));
      setNotice('Opportunity deleted.');
    } catch (deleteError) {
      setError(errorMessage(deleteError, 'Unable to delete this opportunity.'));
    }
  };

  const handleStatusChange = async (applicationId: string, status: ApplicationStatus) => {
    setError('');
    setUpdatingApplication(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setApplications((current) => current.map((application) => application.id === applicationId ? { ...application, status } : application));
    } catch (statusError) {
      setError(errorMessage(statusError, 'Unable to update application status.'));
    } finally {
      setUpdatingApplication('');
    }
  };

  const updateForm = (field: keyof OpportunityInput, value: string | boolean | null) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h1>Platform administration</h1>
          </div>
          <button type="button" className="primary-button small" onClick={startCreate}>
            <Plus size={15} /> Add opportunity
          </button>
        </div>

        {error && <div className="alert error" role="alert">{error}</div>}
        {notice && <div className="alert success" role="status">{notice}</div>}

        <div className="stats-grid">
          <div className="stat-box card"><Users size={22} /> <strong>{loading ? '…' : counts.students}</strong><span>Students</span></div>
          <div className="stat-box card"><BriefcaseBusiness size={22} /> <strong>{loading ? '…' : counts.opportunities}</strong><span>Opportunities</span></div>
          <div className="stat-box card"><ShieldCheck size={22} /> <strong>{loading ? '…' : counts.applications}</strong><span>Applications</span></div>
          <div className="stat-box card"><Activity size={22} /> <strong>{applications.filter((application) => application.status === 'reviewing').length}</strong><span>Under review</span></div>
        </div>

        {formOpen && (
          <section className="card admin-form-card">
            <div className="section-header">
              <h3>{editingId ? 'Edit opportunity' : 'Add opportunity'}</h3>
              <button type="button" className="icon-button" aria-label="Close form" onClick={() => setFormOpen(false)}><X size={16} /></button>
            </div>
            <form className="form-stack" onSubmit={handleSaveOpportunity}>
              <div className="two-col">
                <label><span>Title</span><input value={form.title} onChange={(event) => updateForm('title', event.target.value)} required /></label>
                <label><span>Organization</span><input value={form.organization} onChange={(event) => updateForm('organization', event.target.value)} required /></label>
              </div>
              <div className="two-col">
                <label>
                  <span>Category</span>
                  <select value={form.category} onChange={(event) => updateForm('category', event.target.value)}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <label><span>Deadline</span><input type="date" value={form.deadline || ''} onChange={(event) => updateForm('deadline', event.target.value || null)} /></label>
              </div>
              <div className="two-col">
                <label><span>Location</span><input value={form.location} onChange={(event) => updateForm('location', event.target.value)} /></label>
                <label><span>Eligibility</span><input value={form.eligibility} onChange={(event) => updateForm('eligibility', event.target.value)} /></label>
              </div>
              <label><span>Application link</span><input type="url" value={form.application_link} onChange={(event) => updateForm('application_link', event.target.value)} placeholder="https://…" /></label>
              <label><span>Description</span><textarea rows={3} value={form.description} onChange={(event) => updateForm('description', event.target.value)} /></label>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.is_published} onChange={(event) => updateForm('is_published', event.target.checked)} />
                <span>Published and visible to students</span>
              </label>
              <div className="action-row">
                <button type="submit" className="primary-button small" disabled={saving}>
                  <Save size={14} /> {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create opportunity'}
                </button>
                <button type="button" className="secondary-button small" onClick={() => setFormOpen(false)}>Cancel</button>
              </div>
            </form>
          </section>
        )}

        <section className="panel card admin-section">
          <div className="section-header"><h3>Opportunities</h3></div>
          {loading ? <p role="status">Loading opportunities…</p> : opportunities.length ? (
            <div className="admin-list">
              {opportunities.map((opportunity) => (
                <div className="admin-list-row" key={opportunity.id}>
                  <div className="admin-list-info">
                    <strong>{opportunity.title}</strong>
                    <span>{opportunity.organization} · {opportunity.category} · {opportunity.is_published ? 'Published' : 'Draft'}</span>
                  </div>
                  <div className="action-row">
                    <button type="button" className="secondary-button small" onClick={() => startEdit(opportunity)}>Edit</button>
                    <button type="button" className="danger-button small" onClick={() => void handleDeleteOpportunity(opportunity)}><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="muted">No opportunities have been added.</p>}
        </section>

        <section className="panel card admin-section">
          <div className="section-header"><h3>Applications and status</h3></div>
          {loading ? <p role="status">Loading applications…</p> : applications.length ? (
            <div className="admin-list">
              {applications.map((application) => (
                <div className="admin-list-row" key={application.id}>
                  <div className="admin-list-info">
                    <strong>{application.student?.full_name || 'Student'} · {application.opportunity?.title || 'Opportunity'}</strong>
                    <span>{application.student?.college || 'College not provided'} · {new Date(application.created_at).toLocaleDateString()}</span>
                  </div>
                  <select
                    className="status-select"
                    value={application.status}
                    disabled={updatingApplication === application.id}
                    aria-label={`Application status for ${application.student?.full_name || 'student'}`}
                    onChange={(event) => void handleStatusChange(application.id, event.target.value as ApplicationStatus)}
                  >
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              ))}
            </div>
          ) : <p className="muted">No applications have been submitted.</p>}
        </section>
      </main>
    </div>
  );
}
