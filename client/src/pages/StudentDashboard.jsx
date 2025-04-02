import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';
import StudentHome from './StudentHome';
import PrintRequests from './PrintRequests';
import ServicesInfo from './ServicesInfo';
import About from './About';
import Notifications from './Notifications';
import brandImage from '../assets/lib-logo.jpg';

const StudentDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const isActive = (path) => window.location.pathname === path;

  const handleBrandClick = () => {
    window.location.reload(); // Refreshes the current page
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <img src={brandImage} alt="Brand Logo" className="brand-logo" />
          <span 
            className="brand-name"
            onClick={handleBrandClick} 
          >
            SPAC Library System
          </span>
        </div>
        <h1>Welcome, {userName}!</h1>
        <nav className="nav-links">
          <Link className={`nav-link ${isActive('/student-dashboard') ? 'active' : ''}`} to="/student-dashboard">
            <div className="icon-container">
              <img src="../src/assets/home.png" alt="Home Icon" />
            </div>
            <span>Home</span>
          </Link>
          <Link className={`nav-link ${isActive('/student-dashboard/print-requests') ? 'active' : ''}`} to="/student-dashboard/print-requests">
            <div className="icon-container">
              <img src="../src/assets/clock.png" alt="Print Requests Icon" />
            </div>
            <span>Print Requests</span>
          </Link>
          <Link className={`nav-link ${isActive('/student-dashboard/notifications') ? 'active' : ''}`} to="/student-dashboard/notifications">
            <div className="icon-container">
              <img src="../src/assets/notification.png" alt="About Icon" />
            </div>
            <span>Notifications</span>
          </Link>
          <Link className={`nav-link ${isActive('/student-dashboard/services-info') ? 'active' : ''}`} to="/student-dashboard/services-info">
            <div className="icon-container">
              <img src="../src/assets/info.png" alt="Services Info Icon" />
            </div>
            <span>Services Info</span>
          </Link>
          <Link className={`nav-link ${isActive('/student-dashboard/about') ? 'active' : ''}`} to="/student-dashboard/about">
            <div className="icon-container">
              <img src="../src/assets/about.png" alt="About Icon" />
            </div>
            <span>About Us</span>
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogoutClick}>Logout</button>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<StudentHome />} />
          <Route path="print-requests" element={<PrintRequests />} />
          <Route path="services-info" element={<ServicesInfo />} />
          <Route path="about" element={<About />} />
          <Route path="notifications" element={<Notifications />} />
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

export default StudentDashboard;
