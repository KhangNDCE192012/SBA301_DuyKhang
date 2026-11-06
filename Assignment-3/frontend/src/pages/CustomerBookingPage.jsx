import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';

function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CustomerBookingPage({ initialRoomId, goTo, notify }) {
  const [rooms, setRooms] = useState([]);
  const [selectedIds, setSelectedIds] = useState(initialRoomId ? [initialRoomId] : []);
  const [startDate, setStartDate] = useState(localDate(1));
  const [endDate, setEndDate] = useState(localDate(2));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRoomId) setSelectedIds((current) => current.includes(initialRoomId) ? current : [...current, initialRoomId]);
  }, [initialRoomId]);

  useEffect(() => {
    api.get('/rooms')
      .then((response) => setRooms(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedRooms = useMemo(() => rooms.filter((room) => selectedIds.includes(room.roomId)), [rooms, selectedIds]);
  const numberOfDays = Math.max(0, Math.round((new Date(`${endDate}T00:00:00`) - new Date(`${startDate}T00:00:00`)) / 86400000));
  const estimatedTotal = selectedRooms.reduce((sum, room) => sum + Number(room.roomPricePerDay || 0) * numberOfDays, 0);

  function toggleRoom(roomId) {
    setSelectedIds((current) => current.includes(roomId)
      ? current.filter((id) => id !== roomId)
      : [...current, roomId]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (selectedIds.length === 0) return setError('Please select at least one room.');
    if (!startDate || !endDate || endDate <= startDate) return setError('Check-out date must be after check-in date.');

    setSaving(true);
    try {
      const items = selectedIds.map((roomId) => ({ roomId, startDate, endDate }));
      await api.post('/customer/bookings', { items });
      notify('success', 'Your reservation has been created successfully.');
      goTo('customer-history');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="page-container"><Loading label="Loading rooms..." /></div>;

  return (
    <div className="page-container narrow-page">
      <div className="section-heading section-heading-left">
        <div><span className="eyebrow">CUSTOMER AREA</span><h2>Make a reservation</h2><p>Select one or more rooms and choose your stay dates.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="booking-layout">
        <section className="panel">
          <div className="panel-heading"><h3>1. Select rooms</h3><span>{selectedIds.length} selected</span></div>
          <div className="select-room-list">
            {rooms.map((room) => (
              <label className={`select-room ${selectedIds.includes(room.roomId) ? 'checked' : ''}`} key={room.roomId}>
                <input type="checkbox" checked={selectedIds.includes(room.roomId)} onChange={() => toggleRoom(room.roomId)} />
                <span className="checkmark" />
                <span className="select-room-info"><strong>Room {room.roomNumber}</strong><small>{room.roomTypeName} · Up to {room.roomMaxCapacity} guests</small></span>
                <strong className="select-room-price">${Number(room.roomPricePerDay || 0).toFixed(2)}<small>/day</small></strong>
              </label>
            ))}
            {rooms.length === 0 && <div className="empty-state">There are currently no available rooms.</div>}
          </div>
        </section>

        <aside className="panel booking-summary">
          <h3>2. Your stay</h3>
          <div className="field"><label htmlFor="check-in">Check-in date</label><input id="check-in" type="date" min={localDate(0)} value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
          <div className="field"><label htmlFor="check-out">Check-out date</label><input id="check-out" type="date" min={startDate || localDate(0)} value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
          <div className="summary-line"><span>Selected rooms</span><strong>{selectedIds.length}</strong></div>
          <div className="summary-line"><span>Number of nights</span><strong>{numberOfDays}</strong></div>
          <div className="summary-total"><span>Estimated total</span><strong>${estimatedTotal.toFixed(2)}</strong></div>
          <p className="small-note">The server calculates the final price again before saving the reservation.</p>
          {error && <div className="inline-error">{error}</div>}
          <button className="button button-primary button-full" type="submit" disabled={saving}>{saving ? 'Creating reservation...' : 'Confirm reservation'}</button>
          <button className="button button-outline button-full" type="button" onClick={() => goTo('rooms')}>Back to rooms</button>
        </aside>
      </form>
    </div>
  );
}
