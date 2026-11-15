import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const USERS_KEY = 'campusconnect-users';

export function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '1st Year'
  });

  const updateField = (field: string, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.college || !form.department) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const exists = users.some((user: any) => user.email.toLowerCase() === form.email.toLowerCase());
    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      password: form.password,
      college: form.college,
      department: form.department,
      year: form.year,
      bio: 'Student looking for great collaborators and exciting projects.',
      skills: ['React', 'Communication'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      interests: ['Hackathons', 'Innovation'],
      availability: 'Available'
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem('campusconnect-user', JSON.stringify(newUser));
    localStorage.setItem('campusconnect-user-name', newUser.name);
    window.dispatchEvent(new Event('campusconnect-auth-change'));
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h2>Create your account</h2>
        <p>Join the CampusConnect community.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          {error && <div className="alert error">{error}</div>}
          <div className="two-col">
            <label>
              <span>Full name</span>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Your full name" />
            </label>
            <label>
              <span>College email</span>
              <input value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" placeholder="you@college.edu" />
            </label>
          </div>
          <div className="two-col">
            <label>
              <span>Password</span>
              <div className="password-wrap">
                <input value={form.password} onChange={(e) => updateField('password', e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Create password" />
                <button type="button" className="eye-button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </label>
            <label>
              <span>Confirm password</span>
              <input value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Repeat password" />
            </label>
          </div>
          <div className="two-col">
            <label>
              <span>College name</span>
              <input value={form.college} onChange={(e) => updateField('college', e.target.value)} placeholder="Your college" />
            </label>
            <label>
              <span>Department</span>
              <input value={form.department} onChange={(e) => updateField('department', e.target.value)} placeholder="Computer Science" />
            </label>
          </div>
          <label>
            <span>Year of study</span>
            <select value={form.year} onChange={(e) => updateField('year', e.target.value)}>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </label>
          <button type="submit" className="primary-button wide"><UserPlus size={16} /> Register</button>
        </form>
      </div>
    </div>
  );
}
