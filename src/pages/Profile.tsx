import { Pencil, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, type ProfileUpdate } from '../services/campusService';
import { errorMessage } from '../services/supabase';

const emptyProfile: ProfileUpdate = {
  full_name: '',
  college: '',
  department: '',
  year_of_study: '',
  bio: '',
  skills: []
};

export function Profile() {
  const { profile, profileLoading, profileError, refreshProfile } = useAuth();
  const [draft, setDraft] = useState<ProfileUpdate>(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setDraft({
        full_name: profile.full_name,
        college: profile.college,
        department: profile.department,
        year_of_study: profile.year_of_study,
        bio: profile.bio,
        skills: profile.skills
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setError('');
    setSaved(false);
    setIsSaving(true);
    try {
      await updateProfile(profile.id, draft);
      await refreshProfile();
      setIsEditing(false);
      setSaved(true);
    } catch (saveError) {
      setError(errorMessage(saveError, 'Unable to save your profile.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return <main className="page-loading" role="status">Loading your profile…</main>;
  }

  if (profileError || !profile) {
    return <main className="page-loading alert error" role="alert">{profileError || 'Student profile not found.'}</main>;
  }

  const initials = profile.full_name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">Profile</p>
            <h1>Student Profile</h1>
          </div>
          <button
            type="button"
            className="primary-button small"
            onClick={() => {
              if (isEditing) {
                setDraft({
                  full_name: profile.full_name,
                  college: profile.college,
                  department: profile.department,
                  year_of_study: profile.year_of_study,
                  bio: profile.bio,
                  skills: profile.skills
                });
              }
              setIsEditing((value) => !value);
              setError('');
              setSaved(false);
            }}
          >
            <Pencil size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="card profile-card">
          {error && <div className="alert error" role="alert">{error}</div>}
          {saved && <div className="alert success" role="status">Profile saved.</div>}
          <div className="profile-head">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.full_name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar-fallback" aria-hidden="true">{initials}</div>
            )}
            <div>
              <h2>{profile.full_name}</h2>
              <p>{profile.department} • {profile.college}</p>
            </div>
          </div>

          <div className="profile-grid">
            <div>
              <strong>Full Name</strong>
              {isEditing ? <input value={draft.full_name} onChange={(event) => setDraft({ ...draft, full_name: event.target.value })} /> : <span>{profile.full_name || 'Not provided'}</span>}
            </div>
            <div>
              <strong>College</strong>
              {isEditing ? <input value={draft.college} onChange={(event) => setDraft({ ...draft, college: event.target.value })} /> : <span>{profile.college || 'Not provided'}</span>}
            </div>
            <div>
              <strong>Department</strong>
              {isEditing ? <input value={draft.department} onChange={(event) => setDraft({ ...draft, department: event.target.value })} /> : <span>{profile.department || 'Not provided'}</span>}
            </div>
            <div>
              <strong>Year</strong>
              {isEditing ? <input value={draft.year_of_study} onChange={(event) => setDraft({ ...draft, year_of_study: event.target.value })} /> : <span>{profile.year_of_study || 'Not provided'}</span>}
            </div>
            <div className="full-span">
              <strong>Bio</strong>
              {isEditing ? <textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} rows={4} /> : <span>{profile.bio || 'Add a short bio about yourself.'}</span>}
            </div>
            <div className="full-span">
              <strong>Skills</strong>
              {isEditing ? (
                <input
                  value={draft.skills.join(', ')}
                  onChange={(event) => setDraft({
                    ...draft,
                    skills: event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean)
                  })}
                  placeholder="React, UI/UX, Python"
                />
              ) : (
                <div className="tag-list">
                  {profile.skills.length ? profile.skills.map((skill) => <span key={skill} className="tag">{skill}</span>) : <span>No skills added yet.</span>}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="action-row">
              <button type="button" className="primary-button small" onClick={handleSave} disabled={isSaving}>
                <Save size={14} /> {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
