import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';

export default function StaffDashboardPage({ goTo }) {
  const [summary, setSummary] = useState({ rooms: 0, customers: 0, bookings: 0, activeRooms: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/staff/rooms'), api.get('/staff/customers'), api.get('/staff/bookings')])
      .then(([rooms, customers, bookings]) => {
        const roomList = rooms.data || [];
        setSummary({
          rooms: roomList.length,
          customers: (customers.data || []).length,
          bookings: (bookings.data || []).length,
          activeRooms: roomList.filter((room) => room.roomStatus === 1).length
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="section-heading section-heading-left"><div><span className="eyebrow">STAFF WORKSPACE</span><h2>Hotel overview</h2><p>A quick view of the hotel's rooms, customers and reservations.</p></div></div>
      {loading ? <Loading label="Loading hotel information..." /> : <>
        {error && <div className="inline-error">{error}</div>}
        <div className="stats-grid">
          <div className="stat-card"><span>Total rooms</span><strong>{summary.rooms}</strong><small>All room records</small></div>
          <div className="stat-card"><span>Active rooms</span><strong>{summary.activeRooms}</strong><small>Visible to customers</small></div>
          <div className="stat-card"><span>Customers</span><strong>{summary.customers}</strong><small>Registered customers</small></div>
          <div className="stat-card"><span>Reservations</span><strong>{summary.bookings}</strong><small>Online and offline bookings</small></div>
        </div>
      </>}
      <div className="quick-actions">
        <button className="quick-action" onClick={() => goTo('staff-rooms')} type="button"><span className="quick-icon">01</span><strong>Manage rooms</strong><small>Add, update and safely remove room information.</small><span className="quick-arrow">→</span></button>
        <button className="quick-action" onClick={() => goTo('staff-customers')} type="button"><span className="quick-icon">02</span><strong>Manage customers</strong><small>Search, create, edit or deactivate customer accounts.</small><span className="quick-arrow">→</span></button>
        <button className="quick-action" onClick={() => goTo('staff-bookings')} type="button"><span className="quick-icon">03</span><strong>Manage reservations</strong><small>Review room details and create offline reservations.</small><span className="quick-arrow">→</span></button>
      </div>
    </div>
  );
}
