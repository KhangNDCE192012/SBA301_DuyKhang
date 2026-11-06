import React, { useState } from 'react';
import api from '../api/client';

export default function LoginPage({ onLoginSuccess, goTo, notify }) {
  const [accountType, setAccountType] = useState('customer');
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post(`/auth/${accountType}/login`, form);
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <span className="eyebrow">YOUR HOTEL, YOUR WAY</span>
        <h1>Welcome back.</h1>
        <p>Sign in to manage your stay or manage hotel operations.</p>
        <div className="auth-note"><strong>Good to know</strong><span>Room information is public. You only need an account when you want to make a reservation.</span></div>
      </section>
      <section className="auth-card">
        <span className="eyebrow">ACCOUNT ACCESS</span>
        <h2>Log in</h2>
        <p className="muted">Choose the account type you want to use.</p>
        <div className="segmented-control">
          <button className={accountType === 'customer' ? 'selected' : ''} onClick={() => setAccountType('customer')} type="button">Customer</button>
          <button className={accountType === 'staff' ? 'selected' : ''} onClick={() => setAccountType('staff')} type="button">Staff</button>
        </div>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="field">
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
          </div>
          <div className="field">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
          </div>
          {error && <div className="inline-error">{error}</div>}
          <button className="button button-primary button-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : `Log in as ${accountType}`}</button>
        </form>
        {accountType === 'customer' && <p className="auth-switch">New here? <button className="text-button" onClick={() => goTo('register')} type="button">Create a customer account</button></p>}
        {accountType === 'staff' && <p className="auth-switch">Staff credentials are configured in <code>application.properties</code>.</p>}
      </section>
    </div>
  );
}
