import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Loading from '../components/Loading';

function statusText(status) {
  if (status === 2) return 'Completed';
  if (status === 0) return 'Cancelled';
  return 'Confirmed';
}

export default function CustomerHistoryPage({ notify }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/customer/bookings')
      .then((response) => setBookings(response.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="section-heading section-heading-left">
        <div><span className="eyebrow">CUSTOMER AREA</span><h2>My reservations</h2><p>Review your booking history and room details.</p></div>
      </div>
      {error && <div className="inline-error">{error}</div>}
      {loading ? <Loading label="Loading your reservations..." /> : bookings.length === 0 ? (
        <div className="empty-state large-empty"><strong>You do not have any reservations yet.</strong><span>Browse the available rooms to plan your next stay.</span></div>
      ) : (
        <div className="panel table-panel">
          <div className="table-scroll"><table>
            <thead><tr><th>Reservation</th><th>Booking date</th><th>Rooms</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{bookings.map((booking) => (
              <tr key={booking.bookingReservationId}>
                <td><strong>#{booking.bookingReservationId}</strong></td>
                <td>{booking.bookingDate}</td>
                <td><div className="booking-room-lines">{(booking.bookingDetails || []).map((detail, index) => <span key={`${detail.roomId}-${index}`}>Room {detail.roomNumber} · {detail.startDate} to {detail.endDate}</span>)}</div></td>
                <td><strong>${Number(booking.totalPrice || 0).toFixed(2)}</strong></td>
                <td><span className={`status-pill status-${booking.bookingStatus}`}>{statusText(booking.bookingStatus)}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}
    </div>
  );
}
