import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const blankCustomer = { customerFullName: '', telephone: '', emailAddress: '', customerBirthday: '', password: '', customerStatus: 1 };

export default function StaffCustomersPage({ notify }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(blankCustomer);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadCustomers(searchText = '') {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/staff/customers', { params: searchText ? { search: searchText } : {} });
      setCustomers(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomers(); }, []);

  function openCreate() {
    setEditingCustomer(null);
    setForm(blankCustomer);
    setError('');
    setShowModal(true);
  }

  function openEdit(customer) {
    setEditingCustomer(customer);
    setForm({
      customerFullName: customer.customerFullName || '',
      telephone: customer.telephone || '',
      emailAddress: customer.emailAddress || '',
      customerBirthday: customer.customerBirthday || '',
      password: '',
      customerStatus: customer.customerStatus ?? 1
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, customerBirthday: form.customerBirthday || null, telephone: form.telephone || null, customerStatus: Number(form.customerStatus) };
    if (editingCustomer && !payload.password) delete payload.password;
    if (!editingCustomer) delete payload.customerStatus;
    try {
      if (editingCustomer) await api.put(`/staff/customers/${editingCustomer.customerId}`, payload);
      else await api.post('/staff/customers', payload);
      notify('success', editingCustomer ? 'Customer information updated.' : 'Customer account created.');
      setShowModal(false);
      await loadCustomers(search);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(customer) {
    const confirmed = window.confirm(`Remove or deactivate ${customer.customerFullName}? Customers with booking history are deactivated to preserve the records.`);
    if (!confirmed) return;
    try {
      const response = await api.delete(`/staff/customers/${customer.customerId}`);
      notify('success', response.message || 'Customer record processed.');
      await loadCustomers(search);
    } catch (err) {
      notify('error', err.message);
    }
  }

  return (
    <div className="page-container">
      <div className="section-heading">
        <div><span className="eyebrow">STAFF WORKSPACE</span><h2>Customer management</h2><p>Search and maintain customer information.</p></div>
        <button className="button button-primary" onClick={openCreate} type="button">＋ Add customer</button>
      </div>
      <form className="search-row" onSubmit={(e) => { e.preventDefault(); loadCustomers(search); }}>
        <input aria-label="Search customers" placeholder="Search by customer name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="button button-primary" type="submit">Search</button>
        <button className="button button-outline" type="button" onClick={() => { setSearch(''); loadCustomers(''); }}>Reset</button>
      </form>
      {error && !showModal && <div className="inline-error">{error}</div>}
      {loading ? <Loading label="Loading customers..." /> : (
        <div className="panel table-panel">
          <div className="table-scroll"><table>
            <thead><tr><th>Customer</th><th>Telephone</th><th>Birthday</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{customers.map((customer) => (
              <tr key={customer.customerId}>
                <td><strong>{customer.customerFullName}</strong><small className="table-subtext">{customer.emailAddress}</small></td>
                <td>{customer.telephone || '—'}</td>
                <td>{customer.customerBirthday || '—'}</td>
                <td><span className={`status-pill ${customer.customerStatus === 1 ? 'status-1' : 'status-0'}`}>{customer.customerStatus === 1 ? 'Active' : 'Inactive'}</span></td>
                <td><div className="table-actions"><button className="text-button" onClick={() => openEdit(customer)} type="button">Edit</button><button className="text-button danger-text" onClick={() => handleDelete(customer)} type="button">Remove</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
          {customers.length === 0 && <div className="empty-state">No customers found.</div>}
        </div>
      )}

      {showModal && <Modal title={editingCustomer ? 'Update customer' : 'Add customer'} onClose={() => setShowModal(false)}>
        <form className="form-stack" onSubmit={handleSave}>
          <div className="field"><label htmlFor="customer-name">Full name *</label><input id="customer-name" required maxLength="100" value={form.customerFullName} onChange={(e) => setForm({ ...form, customerFullName: e.target.value })} /></div>
          <div className="field"><label htmlFor="customer-email">Email *</label><input id="customer-email" type="email" required maxLength="100" value={form.emailAddress} onChange={(e) => setForm({ ...form, emailAddress: e.target.value })} /></div>
          <div className="field"><label htmlFor="customer-phone">Telephone</label><input id="customer-phone" maxLength="12" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
          <div className="field"><label htmlFor="customer-birthday">Birthday</label><input id="customer-birthday" type="date" value={form.customerBirthday} onChange={(e) => setForm({ ...form, customerBirthday: e.target.value })} /></div>
          <div className="field"><label htmlFor="customer-password">{editingCustomer ? 'New password (optional)' : 'Password *'}</label><input id="customer-password" type="password" minLength="6" maxLength="50" required={!editingCustomer} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingCustomer ? 'Leave blank to keep current password' : 'At least 6 characters'} /></div>
          {editingCustomer && <div className="field"><label htmlFor="customer-status">Account status</label><select id="customer-status" value={form.customerStatus} onChange={(e) => setForm({ ...form, customerStatus: e.target.value })}><option value="1">Active</option><option value="0">Inactive</option></select></div>}
          {error && <div className="inline-error">{error}</div>}
          <div className="modal-actions"><button className="button button-outline" onClick={() => setShowModal(false)} type="button">Cancel</button><button className="button button-primary" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save customer'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
