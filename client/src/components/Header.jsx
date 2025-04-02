import React, { useState, useEffect, useRef } from 'react';
import './styles/Header.css';
import Logo from '../assets/lib-logo.jpg';
import DrawerIcon from '../assets/drawer.png'; // Assuming the drawer icon is in this path
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null); // Reference for the drawer

  // Navigation handlers
  const toHome = () => {
    navigate('/');
    setIsDrawerOpen(false); // Close drawer after navigation
  };
  const toSignup = () => {
    navigate('/signup');
    setIsDrawerOpen(false); // Close drawer after navigation
  };
  const toLogin = () => {
    navigate('/login');
    setIsDrawerOpen(false); // Close drawer after navigation
  };

  // Toggle drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Handle closing drawer when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setIsDrawerOpen(false); // Close drawer when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='header-container'>
      {/* Logo and Brand */}
      <div className='logo-brand'>
        <div className='logo-container'>
          <img src={Logo} alt='Logo' className='logo' />
        </div>
        <div className='brand-name'>SPAC Library System</div>
      </div>

      {/* Desktop buttons */}
      <div className='header-buttons'>
        <button className='header-btn' onClick={toHome}>Home</button>
        <button className='header-btn' onClick={toSignup}>Signup</button>
        <button className='header-btn' onClick={toLogin}>Login</button>
      </div>

      {/* Drawer Icon for mobile */}
      <div className='drawer-icon' onClick={toggleDrawer}>
        <img src={DrawerIcon} alt='Menu' />
      </div>

      {/* Drawer menu */}
      {isDrawerOpen && (
        <div className='drawer' ref={drawerRef}>
          <button className='drawer-btn' onClick={toHome}>Home</button>
          <button className='drawer-btn' onClick={toSignup}>Signup</button>
          <button className='drawer-btn' onClick={toLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Header;
