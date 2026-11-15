import { useState } from 'react';
import { Eye, EyeOff, Mail, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authErrorMessage } from '../services/authService';

export function Register() {
  const navigate = useNavigate();
  const { signUp, resendSignupConfirmation, isConfigured } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    department: '',
    year: '1st Year'
  });

  const updateField = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfigured) {
      setError('Supabase is not configured. Add the project URL and anon key to your environment.');
      return;
    }

    const fullName = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email || !form.password || !form.college.trim() || !form.department.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (fullName.length < 2 || fullName.length > 100) {
      setError('Full name must be between 2 and 100 characters.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    if (form.password.length < 8 || !/[a-z]/i.test(form.password) || !/\d/.test(form.password)) {
      setError('Use at least 8 characters, including at least one letter and one number.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setNotice('');
    setPendingEmail(email);
    setIsSubmitting(true);
    try {
      const session = await signUp(email, form.password, {
        full_name: form.name.trim(),
        college: form.college.trim(),
        department: form.department.trim(),
        year_of_study: form.year
      });
      if (session?.user.email_confirmed_at) {
        navigate('/dashboard');
      } else {
        navigate('/verify-email', { state: { email } });
      }
    } catch (registrationError) {
      setError(authErrorMessage(registrationError, 'Unable to create your account. Please try again.'));
    } finally {
      setIsSubmitting(false);
      setForm((current) => ({ ...current, password: '', confirmPassword: '' }));
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    setError('');
    setNotice('');
    setIsResending(true);
    try {
      await resendSignupConfirmation(pendingEmail);
      setNotice('If an unconfirmed account exists for this address, a new confirmation email has been requested.');
    } catch (resendError) {
      setError(authErrorMessage(resendError, 'Unable to resend the confirmation email. Please try again later.'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h2>Create your account</h2>
        <p>Join the CampusConnect community.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          {!isConfigured && <div className="alert error">Backend setup is required before students can register.</div>}
          {error && <div className="alert error" role="alert">{error}</div>}
          {notice && <div className="alert success" role="status">{notice}</div>}
          <div className="two-col">
            <label>
              <span>Full name</span>
              <input value={form.name} onChange={(e) => updateField('name', e.target.value)} autoComplete="name" minLength={2} maxLength={100} required placeholder="Your full name" />
            </label>
            <label>
              <span>College email</span>
              <input value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" autoComplete="email" autoCapitalize="none" maxLength={254} required placeholder="you@college.edu" />
            </label>
          </div>
          <div className="two-col">
            <label>
              <span>Password</span>
              <div className="password-wrap">
                <input value={form.password} onChange={(e) => updateField('password', e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="8+ characters with letters and numbers" />
                <button type="button" className="eye-button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>
              </div>
            </label>
            <label>
              <span>Confirm password</span>
              <input value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required placeholder="Repeat password" />
            </label>
          </div>
          <div className="two-col">
            <label>
              <span>College name</span>
              <input value={form.college} onChange={(e) => updateField('college', e.target.value)} required placeholder="Your college" />
            </label>
            <label>
              <span>Department</span>
              <input value={form.department} onChange={(e) => updateField('department', e.target.value)} required placeholder="Computer Science" />
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
          <button type="submit" className="primary-button wide" disabled={isSubmitting || !isConfigured}>
            <UserPlus size={16} /> {isSubmitting ? 'Creating account…' : 'Register'}
          </button>
          {pendingEmail && (
            <button type="button" className="secondary-button wide" onClick={handleResend} disabled={isResending || !isConfigured}>
              <Mail size={16} /> {isResending ? 'Sending confirmation…' : 'Resend confirmation email'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
