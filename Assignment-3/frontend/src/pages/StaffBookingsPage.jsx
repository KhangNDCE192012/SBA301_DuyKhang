import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

function dateString(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function statusLabel(status) {
  if (status === 2) return 'Completed';
  if (status === 0) return 'Cancelled';
  return 'Confirmed';
}

export default function StaffBookingsPage({ notify }) {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [roomChoices, setRoomChoices] = useState({});
  const [editingBooking, setEditingBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [bookingResponse, customerResponse, roomResponse] = await Promise.all([
        api.get('/staff/bookings'), api.get('/staff/customers'), api.get('/staff/rooms')
      ]);
      setBookings(bookingResponse.data || []);
      setCustomers((customerResponse.data || []).filter((customer) => customer.customerStatus === 1));
      setRooms((roomResponse.data || []).filter((room) => room.roomStatus === 1));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function makeEmptyChoices() {
    const choices = {};
    rooms.forEach((room) => {
      choices[room.roomId] = { selected: false, startDate: dateString(1), endDate: dateString(2) };
    });
    return choices;
  }

  function openCreate() {
    setEditingBooking(null);
    setCustomerId(customers[0]?.customerId || '');
    setRoomChoices(makeEmptyChoices());
    setError('');
    setShowModal(true);
  }

  function openEdit(booking) {
    setEditingBooking(booking);
    setCustomerId(String(booking.customerId));
    const choices = {};
    rooms.forEach((room) => {
      const existing = (booking.bookingDetails || []).find((detail) => detail.roomId === room.roomId);
      choices[room.roomId] = existing
        ? { selected: true, startDate: existing.startDate, endDate: existing.endDate }
        : { selected: false, startDate: dateString(1), endDate: dateString(2) };
    });
    setRoomChoices(choices);
    setError('');
    setShowModal(true);
  }

  function toggleRoom(roomId) {
    setRoomChoices((current) => ({
      ...current,
      [roomId]: { ...current[roomId], selected: !current[roomId]?.selected }
    }));
  }

  function updateRoomDate(roomId, field, value) {
    setRoomChoices((current) => ({
      ...current,
      [roomId]: { ...current[roomId], [field]: value }
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    const items = Object.entries(roomChoices)
      .filter(([, choice]) => choice.selected)
      .map(([roomId, choice]) => ({ roomId: Number(roomId), startDate: choice.startDate, endDate: choice.endDate }));

    if (!customerId) return setError('Please select a customer.');
    if (items.length === 0) return setError('Please select at least one room.');
    if (items.some((item) => !item.startDate || !item.endDate || item.endDate <= item.startDate)) {
      return setError('Each selected room needs a check-out date after its check-in date.');
    }

    setSaving(true);
    try {
      const payload = { customerId: Number(customerId), items };
      if (editingBooking) {
        await api.put(`/staff/bookings/${editingBooking.bookingReservationId}`, payload);
        notify('success', 'Reservation details updated.');
      } else {
        await api.post('/staff/bookings', payload);
        notify('success', 'Offline reservation created.');
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(bookingId, status) {
    try {
      await api.put(`/staff/bookings/${bookingId}/status`, { status: Number(status) });
      notify('success', 'Reservation status updated.');
      await loadData();
    } catch (err) {
      notify('error', err.message);
    }
  }

  async function deleteBooking(booking) {
    if (!window.confirm(`Delete reservation #${booking.bookingReservationId} and its room details?`)) return;
    try {
      await api.delete(`/staff/bookings/${booking.bookingReservationId}`);
      notify('success', 'Reservation deleted.');
      await loadData();
    } catch (err) {
      notify('error', err.message);
    }
  }

  return (
    <div className="page-container">
      <div className="section-heading">
        <div><span className="eyebrow">STAFF WORKSPACE</span><h2>Reservation management</h2><p>Manage online reservations and create bookings for walk-in customers.</p></div>
        <button className="button button-primary" onClick={openCreate} type="button">＋ New offline booking</button>
      </div>
      {error && !showModal && <div className="inline-error">{error}</div>}
      {loading ? <Loading label="Loading reservations..." /> : (
        <div className="panel table-panel">
          <div className="table-scroll"><table>
            <thead><tr><th>Reservation</th><th>Customer</th><th>Room details</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{bookings.map((booking) => (
              <tr key={booking.bookingReservationId}>
                <td><strong>#{booking.bookingReservationId}</strong><small className="table-subtext">{booking.bookingDate}</small></td>
                <td><strong>{booking.customerFullName}</strong><small className="table-subtext">{booking.customerEmail}</small></td>
                <td><div className="booking-room-lines">{(booking.bookingDetails || []).map((detail, index) => <span key={`${detail.roomId}-${index}`}>Room {detail.roomNumber} · {detail.startDate} → {detail.endDate}</span>)}</div></td>
                <td><strong>${Number(booking.totalPrice || 0).toFixed(2)}</strong></td>
                <td><select className="status-select" aria-label={`Status for reservation ${booking.bookingReservationId}`} value={booking.bookingStatus} onChange={(e) => updateStatus(booking.bookingReservationId, e.target.value)}><option value="1">Confirmed</option><option value="2">Completed</option><option value="0">Cancelled</option></select></td>
                <td><div className="table-actions"><button className="text-button" onClick={() => openEdit(booking)} type="button">Edit</button><button className="text-button danger-text" onClick={() => deleteBooking(booking)} type="button">Delete</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
          {bookings.length === 0 && <div className="empty-state">No reservations have been created yet.</div>}
        </div>
      )}

      {showModal && <Modal title={editingBooking ? `Edit reservation #${editingBooking.bookingReservationId}` : 'Create offline reservation'} onClose={() => setShowModal(false)} wide>
        <form onSubmit={handleSave} className="form-stack">
          <div className="field"><label htmlFor="booking-customer">Customer *</label><select id="booking-customer" required value={customerId} onChange={(e) => setCustomerId(e.target.value)}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.customerId} value={customer.customerId}>{customer.customerFullName} — {customer.emailAddress}</option>)}</select></div>
          <div className="field"><label>Select rooms and stay dates *</label><div className="staff-room-picker">
            {rooms.map((room) => {
              const choice = roomChoices[room.roomId] || { selected: false, startDate: dateString(1), endDate: dateString(2) };
              return <div className={`staff-room-choice ${choice.selected ? 'selected' : ''}`} key={room.roomId}>
                <label className="staff-room-check"><input type="checkbox" checked={choice.selected} onChange={() => toggleRoom(room.roomId)} /><strong>Room {room.roomNumber}</strong><span>{room.roomTypeName} · ${Number(room.roomPricePerDay || 0).toFixed(2)}/day</span></label>
                {choice.selected && <div className="staff-room-dates"><div className="field"><label htmlFor={`start-${room.roomId}`}>Check-in</label><input id={`start-${room.roomId}`} type="date" value={choice.startDate} onChange={(e) => updateRoomDate(room.roomId, 'startDate', e.target.value)} /></div><div className="field"><label htmlFor={`end-${room.roomId}`}>Check-out</label><input id={`end-${room.roomId}`} type="date" value={choice.endDate} onChange={(e) => updateRoomDate(room.roomId, 'endDate', e.target.value)} /></div></div>}
              </div>;
            })}
            {rooms.length === 0 && <p className="small-note">No active rooms are available to add.</p>}
          </div></div>
          {error && <div className="inline-error">{error}</div>}
          <div className="modal-actions"><button className="button button-outline" onClick={() => setShowModal(false)} type="button">Cancel</button><button className="button button-primary" disabled={saving} type="submit">{saving ? 'Saving...' : editingBooking ? 'Update reservation' : 'Create reservation'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
