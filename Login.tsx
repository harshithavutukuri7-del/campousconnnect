import { useState } from 'react';
import { Lock, Mail, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from './authService';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('aisha@campus.edu');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = authService.login(email, password);
    if (!result.success) {
      setError(result.message || 'Unable to login');
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="auth-shell">
      <div className="auth-card card">
        <h2>Welcome back</h2>
        <p>Log in to continue your student journey.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          {error && <div className="alert error">{error}</div>}
          <label>
            <span><Mail size={14} /> College email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@college.edu" />
          </label>
          <label>
            <span><Lock size={14} /> Password</span>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="primary-button wide">Login</button>
        </form>
        <div className="auth-links">
          <Link to="/register">Create an account</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="demo-note">Demo account: aisha@campus.edu / demo123</div>
      </div>
    </div>
  );
}
