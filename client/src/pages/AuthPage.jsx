import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setForm({ username: '', password: '' });
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
      const res = await axios.post(url, form);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">UrbanEcho</div>
      <div className="auth-container">
        <div className="form-section">
          <h2>{isLogin ? 'Login to Your Account' : 'Register a New Account'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{isLogin ? 'Sign In' : 'Sign Up'}</button>
          </form>
          {error && <p className="error-msg">{error}</p>}
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
