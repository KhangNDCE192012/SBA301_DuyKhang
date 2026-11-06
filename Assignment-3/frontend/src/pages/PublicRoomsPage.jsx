import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';

export default function PublicRoomsPage({ user, goTo, setSelectedRoomId, notify }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ roomNumber: '', roomTypeId: '', maxCapacity: '', minPrice: '', maxPrice: '' });

  async function loadRooms() {
    setLoading(true);
    setError('');
    try {
      const [roomResponse, typeResponse] = await Promise.all([
        api.get('/rooms'),
        api.get('/room-types')
      ]);
      setRooms(roomResponse.data || []);
      setRoomTypes(typeResponse.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadRooms(); }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      );
      const response = await api.get('/rooms/search', { params });
      setRooms(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startBooking(roomId) {
    if (!user) {
      notify('info', 'Please log in as a Customer before booking a room.');
      goTo('login');
      return;
    }
    if (user.role !== 'ROLE_CUSTOMER') {
      notify('info', 'Staff accounts manage reservations from the Staff menu.');
      return;
    }
    setSelectedRoomId(roomId);
    goTo('customer-booking');
  }

  return (
    <div className="page-container">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">WELCOME TO FU MINI HOTEL</span>
          <h1>A comfortable stay, <em>made simple.</em></h1>
          <p>Find a room that fits your trip. Browse room information first — no account is needed to explore.</p>
          <button className="button button-light" onClick={() => document.getElementById('room-list')?.scrollIntoView({ behavior: 'smooth' })} type="button">
            Explore rooms <span aria-hidden="true">↓</span>
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-sun" />
          <div className="hero-building"><span /><span /><span /></div>
          <div className="hero-leaf leaf-one" /><div className="hero-leaf leaf-two" />
        </div>
      </section>

      <section className="section-heading" id="room-list">
        <div>
          <span className="eyebrow">OUR ACCOMMODATION</span>
          <h2>Choose your room</h2>
          <p>Browse the room options and compare capacity and daily rates.</p>
        </div>
        <span className="result-count">{rooms.length} room{rooms.length === 1 ? '' : 's'} found</span>
      </section>

      <form className="filter-panel" onSubmit={handleSearch}>
        <div className="field">
          <label htmlFor="filter-room">Room number</label>
          <input id="filter-room" placeholder="e.g. 101" value={filters.roomNumber} onChange={(e) => setFilters({ ...filters, roomNumber: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="filter-type">Room type</label>
          <select id="filter-type" value={filters.roomTypeId} onChange={(e) => setFilters({ ...filters, roomTypeId: e.target.value })}>
            <option value="">All room types</option>
            {roomTypes.map((type) => <option key={type.roomTypeId} value={type.roomTypeId}>{type.roomTypeName}</option>)}
          </select>
        </div>
        <div className="field field-short">
          <label htmlFor="filter-capacity">Guests</label>
          <input id="filter-capacity" type="number" min="1" placeholder="Any" value={filters.maxCapacity} onChange={(e) => setFilters({ ...filters, maxCapacity: e.target.value })} />
        </div>
        <div className="field field-short">
          <label htmlFor="filter-min">Min / day</label>
          <input id="filter-min" type="number" min="0" placeholder="$" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        </div>
        <div className="field field-short">
          <label htmlFor="filter-max">Max / day</label>
          <input id="filter-max" type="number" min="0" placeholder="$" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        </div>
        <div className="filter-actions">
          <button className="button button-primary" type="submit">Search</button>
          <button className="button button-outline" type="button" onClick={() => { setFilters({ roomNumber: '', roomTypeId: '', maxCapacity: '', minPrice: '', maxPrice: '' }); loadRooms(); }}>Reset</button>
        </div>
      </form>

      {error && <div className="inline-error">{error}</div>}
      {loading ? <Loading label="Loading available rooms..." /> : (
        <div className="room-grid">
          {rooms.map((room, index) => (
            <article className="room-card" key={room.roomId}>
              <div className={`room-illustration room-illustration-${index % 3}`}>
                <span className="room-number">ROOM {room.roomNumber}</span>
                <div className="room-bed"><span /></div>
                <div className="room-window" />
              </div>
              <div className="room-card-body">
                <div className="room-card-title">
                  <div><span className="eyebrow">{room.roomTypeName || 'ROOM'}</span><h3>Room {room.roomNumber}</h3></div>
                  <strong className="room-price">${Number(room.roomPricePerDay || 0).toFixed(2)}<small>/ night</small></strong>
                </div>
                <p className="room-description">{room.roomDetailDescription || 'A comfortable room with the essentials for a relaxing stay.'}</p>
                <div className="room-meta"><span>♙ {room.roomMaxCapacity || 1} guests</span><span>Active room</span></div>
                <button className="button button-primary button-full" onClick={() => startBooking(room.roomId)} type="button">Book this room</button>
              </div>
            </article>
          ))}
          {rooms.length === 0 && <div className="empty-state"><strong>No rooms match your search.</strong><span>Try changing the filters or reset your search.</span></div>}
        </div>
      )}
    </div>
  );
}
