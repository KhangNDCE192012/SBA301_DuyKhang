import React, { useState } from 'react';
import api from '../api/client';

export default function RegisterPage({ goTo, notify }) {
  const [form, setForm] = useState({ customerFullName: '', telephone: '', emailAddress: '', customerBirthday: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/customer/register', { ...form, customerBirthday: form.customerBirthday || null, telephone: form.telephone || null });
      notify('success', 'Your account has been created. You can now log in.');
      goTo('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-layout register-layout">
      <section className="auth-intro">
        <span className="eyebrow">JOIN FU MINI HOTEL</span>
        <h1>Make your next stay easier.</h1>
        <p>Create a customer account to book one or more rooms and keep your reservation history in one place.</p>
        <div className="auth-note"><strong>Your information stays yours</strong><span>Your password is stored as a BCrypt hash. The system never returns it to the browser.</span></div>
      </section>
      <section className="auth-card auth-card-wide">
        <span className="eyebrow">CUSTOMER REGISTRATION</span>
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field field-span-2"><label htmlFor="register-name">Full name *</label><input id="register-name" required maxLength="100" value={form.customerFullName} onChange={(e) => setForm({ ...form, customerFullName: e.target.value })} placeholder="Your full name" /></div>
          <div className="field"><label htmlFor="register-email">Email address *</label><input id="register-email" type="email" required maxLength="100" value={form.emailAddress} onChange={(e) => setForm({ ...form, emailAddress: e.target.value })} placeholder="name@example.com" /></div>
          <div className="field"><label htmlFor="register-phone">Telephone</label><input id="register-phone" maxLength="12" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} placeholder="Phone number" /></div>
          <div className="field"><label htmlFor="register-birthday">Birthday</label><input id="register-birthday" type="date" value={form.customerBirthday} onChange={(e) => setForm({ ...form, customerBirthday: e.target.value })} /></div>
          <div className="field"><label htmlFor="register-password">Password * (min. 6 characters)</label><input id="register-password" type="password" minLength="6" maxLength="50" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Create a password" /></div>
          {error && <div className="inline-error field-span-2">{error}</div>}
          <div className="field-span-2"><button className="button button-primary button-full" disabled={loading} type="submit">{loading ? 'Creating account...' : 'Create customer account'}</button></div>
        </form>
        <p className="auth-switch">Already registered? <button className="text-button" onClick={() => goTo('login')} type="button">Log in</button></p>
      </section>
    </div>
  );
}
