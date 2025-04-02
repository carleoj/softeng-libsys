// src/components/Notification.js
import React from 'react';
import './styles/Notification.css'; // Import your CSS for styling

const Notification = ({ message, onClose }) => {
  return (
    <div className="notification-overlay2">
      <div className="notification-content2">
        <p>{message}</p><br />
        <button onClick={onClose} className="notification-button2">Close</button>
      </div>
    </div>
  );
};

export default Notification;
