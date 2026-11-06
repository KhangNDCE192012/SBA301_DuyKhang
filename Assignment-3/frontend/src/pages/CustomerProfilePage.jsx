import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';

export default function CustomerProfilePage({ notify }) {
  const [form, setForm] = useState({ customerFullName: '', telephone: '', customerBirthday: '', newPassword: '' });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/customer/profile')
      .then((response) => {
        const profile = response.data;
        setEmail(profile.emailAddress || '');
        setForm({
          customerFullName: profile.customerFullName || '',
          telephone: profile.telephone || '',
          customerBirthday: profile.customerBirthday || '',
          newPassword: ''
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, customerBirthday: form.customerBirthday || null };
      if (!payload.newPassword) delete payload.newPassword;
      await api.put('/customer/profile', payload);
      setForm({ ...form, newPassword: '' });
      notify('success', 'Your profile has been updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-container"><Loading label="Loading your profile..." /></div>;

  return (
    <div className="page-container narrow-page">
      <div className="section-heading section-heading-left"><div><span className="eyebrow">CUSTOMER AREA</span><h2>My profile</h2><p>Update your contact information and password.</p></div></div>
      <section className="panel profile-panel">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field field-span-2"><label>Email address</label><input value={email} disabled /><small className="field-hint">Email is used as your login ID and cannot be changed here.</small></div>
          <div className="field field-span-2"><label htmlFor="profile-name">Full name</label><input id="profile-name" required maxLength="100" value={form.customerFullName} onChange={(e) => setForm({ ...form, customerFullName: e.target.value })} /></div>
          <div className="field"><label htmlFor="profile-phone">Telephone</label><input id="profile-phone" maxLength="12" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
          <div className="field"><label htmlFor="profile-birthday">Birthday</label><input id="profile-birthday" type="date" value={form.customerBirthday} onChange={(e) => setForm({ ...form, customerBirthday: e.target.value })} /></div>
          <div className="field field-span-2"><label htmlFor="profile-password">New password (optional)</label><input id="profile-password" type="password" minLength="6" maxLength="50" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Leave blank to keep your current password" /></div>
          {error && <div className="inline-error field-span-2">{error}</div>}
          <div className="field-span-2"><button className="button button-primary" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save profile'}</button></div>
        </form>
      </section>
    </div>
  );
}
