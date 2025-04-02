import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';
import FacultyHome from './FacultyHome';
import Pending from './Pending';
import Approved from './Approved';
import Printed from './Printed';
import Cleared from './Cleared';
import Stats from './Stats';
import brandImage from '../assets/lib-logo.jpg';

const FacultyDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    printed: 0,
    cleared: 0,
  });

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle brand name click to refresh the page
  const handleBrandClick = () => {
    window.location.reload(); // Refreshes the current page
  };

  const currentDate = new Date();

  const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  const numericalDate = currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/requests/count');
        const data = await response.json();

        setCounts({
          pending: data.pendingCount || 0,
          approved: data.approvedCount || 0,
          printed: data.printedCount || 0,
          cleared: data.clearedCount || 0,
        });
      } catch (error) {
        console.error('Error fetching request counts:', error);
      }
    };
    fetchCounts(); // Fetch data once when component mounts
  }, []);
  
  // Helper function to determine if the current route is active
  const isActive = (path) => window.location.pathname === path;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <img src={brandImage} alt="Brand" className="brand-logo" />
          <span
            className="brand-name"
            onClick={handleBrandClick} // Click event to refresh the page
          >
            SPAC Library System
          </span>
        </div>
        <h1 className="sidebar-header">Hello, Library Staff!</h1>
        <nav className="nav-links">
          <Link className={`nav-link ${isActive('/faculty-dashboard') ? 'active' : ''}`} to="/faculty-dashboard">
            <div className="icon-container">
              <img src="../src/assets/home.png" alt="Home Icon" />
            </div>
            Home
          </Link>
          <Link className={`nav-link ${isActive('/faculty-dashboard/pending') ? 'active' : ''}`} to="/faculty-dashboard/pending">
            <div className="icon-container">
              <img src="../src/assets/clock.png" alt="Pending Icon" />
            </div>
            Pending
            {counts.pending > 0 && <span className="badge">{counts.pending}</span>}
          </Link>
          <Link className={`nav-link ${isActive('/faculty-dashboard/approved') ? 'active' : ''}`} to="/faculty-dashboard/approved">
            <div className="icon-container">
              <img src="../src/assets/approved.png" alt="Approved Icon" />
            </div>
            Approved
            {counts.approved > 0 && <span className="badge">{counts.approved}</span>}
          </Link>
          <Link className={`nav-link ${isActive('/faculty-dashboard/printed') ? 'active' : ''}`} to="/faculty-dashboard/printed">
            <div className="icon-container">
              <img src="../src/assets/printed.png" alt="Printed Icon" />
            </div>
            Printed
            {counts.printed > 0 && <span className="badge">{counts.printed}</span>}
          </Link>
          <Link className={`nav-link ${isActive('/faculty-dashboard/cleared') ? 'active' : ''}`} to="/faculty-dashboard/cleared">
            <div className="icon-container">
              <img src="../src/assets/sent.png" alt="Cleared Icon" />
            </div>
            Cleared
            {counts.cleared > 0 && <span className="badge">{counts.cleared}</span>}
          </Link>
          <Link className={`nav-link ${isActive('/faculty-dashboard/stats') ? 'active' : ''}`} to="/faculty-dashboard/stats">
            <div className="icon-container">
              <img src="../src/assets/graph.png" alt="Stats Icon" />
            </div>
            Data
          </Link>
          <div className="sidebar-date">
            <div className="day">{dayOfWeek}</div>
            <div className="date">{numericalDate}</div>
          </div>
        </nav>

        <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<FacultyHome />} />
          <Route path="pending" element={<Pending />} />
          <Route path="approved" element={<Approved />} />
          <Route path="printed" element={<Printed />} />
          <Route path="cleared" element={<Cleared />} />
          <Route path="stats" element={<Stats />} />
        </Routes>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={handleLogout} className="modal-btn">Okay</button>
              <button onClick={closeModal} className="modal-btn modal-btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
