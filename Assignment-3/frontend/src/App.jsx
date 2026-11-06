import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Notice from './components/Notice';
import { clearSession, getSavedUser, saveSession } from './api/client';
import PublicRoomsPage from './pages/PublicRoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerBookingPage from './pages/CustomerBookingPage';
import CustomerHistoryPage from './pages/CustomerHistoryPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffRoomsPage from './pages/StaffRoomsPage';
import StaffCustomersPage from './pages/StaffCustomersPage';
import StaffBookingsPage from './pages/StaffBookingsPage';

export default function App() {
  const [user, setUser] = useState(getSavedUser);
  const [page, setPage] = useState('rooms');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [notice, setNotice] = useState(null);

  function notify(type, message) {
    setNotice({ type, message });
  }

  function goTo(nextPage) {
    setNotice(null);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleLoginSuccess(authData) {
    saveSession(authData);
    setUser(authData);
    setPage(authData.role === 'ROLE_STAFF' ? 'staff-home' : 'rooms');
    notify('success', `Welcome, ${authData.name || authData.email}.`);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setSelectedRoomId(null);
    setPage('rooms');
    notify('info', 'You have logged out.');
  }

  useEffect(() => {
    function handleExpiredSession() {
      setUser(null);
      setPage('login');
      notify('error', 'Your login session has expired. Please log in again.');
    }
    window.addEventListener('a3-session-expired', handleExpiredSession);
    return () => window.removeEventListener('a3-session-expired', handleExpiredSession);
  }, []);

  let content;
  const needsCustomer = page.startsWith('customer-');
  const needsStaff = page.startsWith('staff-');

  if (needsCustomer && user?.role !== 'ROLE_CUSTOMER') {
    content = <LoginPage onLoginSuccess={handleLoginSuccess} goTo={goTo} notify={notify} />;
  } else if (needsStaff && user?.role !== 'ROLE_STAFF') {
    content = <LoginPage onLoginSuccess={handleLoginSuccess} goTo={goTo} notify={notify} />;
  } else {
    switch (page) {
      case 'login':
        content = <LoginPage onLoginSuccess={handleLoginSuccess} goTo={goTo} notify={notify} />;
        break;
      case 'register':
        content = <RegisterPage goTo={goTo} notify={notify} />;
        break;
      case 'customer-booking':
        content = <CustomerBookingPage initialRoomId={selectedRoomId} goTo={goTo} notify={notify} />;
        break;
      case 'customer-history':
        content = <CustomerHistoryPage notify={notify} />;
        break;
      case 'customer-profile':
        content = <CustomerProfilePage notify={notify} />;
        break;
      case 'staff-home':
        content = <StaffDashboardPage goTo={goTo} />;
        break;
      case 'staff-rooms':
        content = <StaffRoomsPage notify={notify} />;
        break;
      case 'staff-customers':
        content = <StaffCustomersPage notify={notify} />;
        break;
      case 'staff-bookings':
        content = <StaffBookingsPage notify={notify} />;
        break;
      case 'rooms':
      default:
        content = <PublicRoomsPage user={user} goTo={goTo} setSelectedRoomId={setSelectedRoomId} notify={notify} />;
    }
  }

  return (
    <div className="app-shell">
      <Header user={user} page={page} goTo={goTo} onLogout={handleLogout} />
      <main className="main-content">{content}</main>
      <footer className="site-footer">
        <div><strong>FU Mini Hotel</strong><span>Hotel Management System · SBA301 Assignment 03</span></div>
        <small>Nguyen Duy Khang · CE192012</small>
      </footer>
      <Notice notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
}
