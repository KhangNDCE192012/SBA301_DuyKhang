import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';
import Modal from '../components/Modal';

const emptyForm = { roomNumber: '', roomDetailDescription: '', roomMaxCapacity: 2, roomTypeId: '', roomStatus: 1, roomPricePerDay: 50 };

export default function StaffRoomsPage({ notify }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      const [roomResponse, typeResponse] = await Promise.all([api.get('/staff/rooms'), api.get('/staff/room-types')]);
      setRooms(roomResponse.data || []);
      setRoomTypes(typeResponse.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  function openCreate() {
    setEditingRoom(null);
    setForm({ ...emptyForm, roomTypeId: roomTypes[0]?.roomTypeId || '' });
    setError('');
    setShowModal(true);
  }

  function openEdit(room) {
    setEditingRoom(room);
    setForm({
      roomNumber: room.roomNumber || '',
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity || 1,
      roomTypeId: room.roomTypeId || '',
      roomStatus: room.roomStatus ?? 1,
      roomPricePerDay: room.roomPricePerDay || 1
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');
    if (!form.roomTypeId) return setError('Please select a room type.');
    setSaving(true);
    const payload = {
      ...form,
      roomMaxCapacity: Number(form.roomMaxCapacity),
      roomTypeId: Number(form.roomTypeId),
      roomStatus: Number(form.roomStatus),
      roomPricePerDay: Number(form.roomPricePerDay)
    };
    try {
      if (editingRoom) await api.put(`/staff/rooms/${editingRoom.roomId}`, payload);
      else await api.post('/staff/rooms', payload);
      notify('success', editingRoom ? 'Room updated.' : 'Room created.');
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(room) {
    const confirmed = window.confirm(`Remove room ${room.roomNumber}? If it has booking history, it will be marked inactive instead of being deleted.`);
    if (!confirmed) return;
    try {
      const response = await api.delete(`/staff/rooms/${room.roomId}`);
      notify('success', response.message || 'Room processed.');
      await loadData();
    } catch (err) {
      notify('error', err.message);
    }
  }

  return (
    <div className="page-container">
      <div className="section-heading">
        <div><span className="eyebrow">STAFF WORKSPACE</span><h2>Room management</h2><p>Maintain room details, room types, capacity and daily rates.</p></div>
        <button className="button button-primary" onClick={openCreate} type="button">＋ Add room</button>
      </div>
      {error && !showModal && <div className="inline-error">{error}</div>}
      {loading ? <Loading label="Loading room records..." /> : (
        <div className="panel table-panel">
          <div className="table-scroll"><table>
            <thead><tr><th>Room</th><th>Type</th><th>Capacity</th><th>Price / day</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{rooms.map((room) => (
              <tr key={room.roomId}>
                <td><strong>{room.roomNumber}</strong><small className="table-subtext">{room.roomDetailDescription}</small></td>
                <td>{room.roomTypeName}</td>
                <td>{room.roomMaxCapacity} guests</td>
                <td>${Number(room.roomPricePerDay || 0).toFixed(2)}</td>
                <td><span className={`status-pill ${room.roomStatus === 1 ? 'status-1' : 'status-0'}`}>{room.roomStatus === 1 ? 'Active' : 'Inactive'}</span></td>
                <td><div className="table-actions"><button className="text-button" onClick={() => openEdit(room)} type="button">Edit</button><button className="text-button danger-text" onClick={() => handleDelete(room)} type="button">Remove</button></div></td>
              </tr>
            ))}</tbody>
          </table></div>
          {rooms.length === 0 && <div className="empty-state">No room records found.</div>}
        </div>
      )}

      {showModal && <Modal title={editingRoom ? 'Update room' : 'Add a room'} onClose={() => setShowModal(false)}>
        <form className="form-stack" onSubmit={handleSave}>
          <div className="field"><label htmlFor="room-number">Room number *</label><input id="room-number" required maxLength="50" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} /></div>
          <div className="field"><label htmlFor="room-description">Description</label><textarea id="room-description" rows="3" maxLength="250" value={form.roomDetailDescription} onChange={(e) => setForm({ ...form, roomDetailDescription: e.target.value })} /></div>
          <div className="form-grid">
            <div className="field"><label htmlFor="room-type">Room type *</label><select id="room-type" required value={form.roomTypeId} onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })}><option value="">Select type</option>{roomTypes.map((type) => <option key={type.roomTypeId} value={type.roomTypeId}>{type.roomTypeName}</option>)}</select></div>
            <div className="field"><label htmlFor="room-capacity">Max guests *</label><input id="room-capacity" type="number" min="1" required value={form.roomMaxCapacity} onChange={(e) => setForm({ ...form, roomMaxCapacity: e.target.value })} /></div>
            <div className="field"><label htmlFor="room-price">Price per day *</label><input id="room-price" type="number" min="0.01" step="0.01" required value={form.roomPricePerDay} onChange={(e) => setForm({ ...form, roomPricePerDay: e.target.value })} /></div>
            <div className="field"><label htmlFor="room-status">Status</label><select id="room-status" value={form.roomStatus} onChange={(e) => setForm({ ...form, roomStatus: e.target.value })}><option value="1">Active</option><option value="0">Inactive</option></select></div>
          </div>
          {error && <div className="inline-error">{error}</div>}
          <div className="modal-actions"><button className="button button-outline" onClick={() => setShowModal(false)} type="button">Cancel</button><button className="button button-primary" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save room'}</button></div>
        </form>
      </Modal>}
    </div>
  );
}
