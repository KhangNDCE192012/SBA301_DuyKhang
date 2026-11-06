import React from 'react';

export default function Header({ user, page, goTo, onLogout }) {
  const isStaff = user?.role === 'ROLE_STAFF';
  const isCustomer = user?.role === 'ROLE_CUSTOMER';

  const link = (key, label) => (
    <button
      key={key}
      className={`nav-link ${page === key ? 'active' : ''}`}
      onClick={() => goTo(key)}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => goTo('rooms')} type="button">
          <span className="brand-mark">FH</span>
          <span>
            <strong>FU Mini Hotel</strong>
            <small>Stay simple. Feel at home.</small>
          </span>
        </button>

        <nav className="main-nav">
          {link('rooms', 'Rooms')}
          {isCustomer && <>
            {link('customer-booking', 'Book a room')}
            {link('customer-history', 'My reservations')}
            {link('customer-profile', 'My profile')}
          </>}
          {isStaff && <>
            {link('staff-home', 'Overview')}
            {link('staff-rooms', 'Rooms')}
            {link('staff-customers', 'Customers')}
            {link('staff-bookings', 'Reservations')}
          </>}
        </nav>

        <div className="account-area">
          {user ? (
            <>
              <div className="account-name">
                <strong>{user.name || user.email}</strong>
                <small>{isStaff ? 'STAFF ACCOUNT' : 'CUSTOMER ACCOUNT'}</small>
              </div>
              <button className="button button-outline button-small" onClick={onLogout} type="button">Log out</button>
            </>
          ) : (
            <>
              <button className="button button-quiet button-small" onClick={() => goTo('login')} type="button">Log in</button>
              <button className="button button-primary button-small" onClick={() => goTo('register')} type="button">Create account</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
