import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import axios from 'axios';
import AnimatedBackground from '../components/AnimatedBackground';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', fullName: '', orgName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('volunteer'); // 'volunteer' | 'ngo'
  const navigate = useNavigate();

  const toggleForm = () => {
    setForm({ username: '', password: '', fullName: '', orgName: '' });
    setError('');
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
  ? 'http://localhost:5000/api/auth/login'
  : 'http://localhost:5000/api/auth/register';
    try {
      setError('');
      setLoading(true);
      const payload = isLogin
        ? { username: form.username, password: form.password, role }
        : {
            username: form.username,
            password: form.password,
            role,
            // Send profile fields only on registration
            ...(role === 'volunteer' ? { fullName: form.fullName } : {}),
            ...(role === 'ngo' ? { orgName: form.orgName } : {}),
          };
      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = useMemo(() => {
    if (isLogin) return null;
    const pwd = form.password || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const levels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { score, label: levels[Math.max(0, score - 1)] || 'Weak' };
  }, [form.password, isLogin]);

  return (
    <div className="auth-page">
      <AnimatedBackground />
      <div className="auth-brand">UrbanEcho</div>
      <div className="auth-container">
        <div className="form-section">
          <div className="auth-card">
            <div className="role-toggle" role="tablist" aria-label="Choose your role">
              <button
                type="button"
                className={`role-btn ${role === 'volunteer' ? 'active' : ''}`}
                onClick={() => setRole('volunteer')}
                role="tab"
                aria-selected={role === 'volunteer'}
              >
                Volunteer
              </button>
              <button
                type="button"
                className={`role-btn ${role === 'ngo' ? 'active' : ''}`}
                onClick={() => setRole('ngo')}
                role="tab"
                aria-selected={role === 'ngo'}
              >
                NGO
              </button>
            </div>
          <h2 className="auth-title">
            {isLogin
              ? `Login as ${role === 'volunteer' ? 'Volunteer' : 'NGO'}`
              : `Create ${role === 'volunteer' ? 'Volunteer' : 'NGO'} Account`}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete={isLogin ? 'username' : 'new-username'}
            />
            {!isLogin && role === 'volunteer' && (
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                autoComplete="name"
              />
            )}
            {!isLogin && role === 'ngo' && (
              <input
                type="text"
                name="orgName"
                placeholder="Organization Name"
                value={form.orgName}
                onChange={handleChange}
                autoComplete="organization"
              />
            )}
            <div className="password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.1A10.78 10.78 0 0112 5c5 0 9 4.5 9 7 0 1.02-.58 2.22-1.6 3.38M6.46 6.46C4.39 7.81 3 9.67 3 12c0 2.5 4 7 9 7 1.22 0 2.38-.22 3.44-.62" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </button>
            </div>
            {!isLogin && (
              <div className="strength">
                <div className={`bar bar-${passwordStrength?.score || 0}`} />
                <span className="label">Strength: {passwordStrength?.label}</span>
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? (isLogin ? 'Signing In…' : 'Creating Account…') : (isLogin ? 'Sign In' : 'Sign Up')}
            </button>
            <div className="form-footer">
              {isLogin ? (
                <button type="button" className="linklike" onClick={() => alert('Forgot password flow to implement')}>Forgot password?</button>
              ) : (
                <span className="helper">By creating an account you agree to our Terms and Privacy Policy.</span>
              )}
            </div>
          </form>
          {error && <p className="error-msg">{error}</p>}
          </div>
        </div>
        <div className="info-section">
          <h2>{isLogin ? 'New Here?' : 'Already Have an Account?'}</h2>
          <p>
            {isLogin
              ? 'Sign up and be a part of the movement for smarter cities.'
              : 'Log in and continue improving your community with UrbanEcho.'}
          </p>
          <button onClick={toggleForm}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
