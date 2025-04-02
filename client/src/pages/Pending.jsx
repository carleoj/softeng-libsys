import React, { useEffect, useState } from 'react';
import './styles/Pending.css';
import Notification from '../components/Notification';

const Pending = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [price, setPrice] = useState(''); // Added price state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/pending-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch pending requests');
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setPrice(''); 
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/approveRequest/${selectedRequest.print_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve the request');
      }

      setPendingRequests(prevRequests => prevRequests.filter(req => req.print_id !== selectedRequest.print_id));
      setNotificationMessage('Request approved successfully!');
      setShowNotification(true);
      setShowModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error approving request:', error);
      setNotificationMessage('Error approving request');
      setShowNotification(true);
    }
  };

  const handleDecline = async () => {
    try {
        const response = await fetch(`http://localhost:8081/api/declineRequest/${selectedRequest.print_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to decline the request');
        }

        setPendingRequests(prevRequests => prevRequests.filter(req => req.print_id !== selectedRequest.print_id));
        setNotificationMessage('Request declined successfully!');
        setShowNotification(true);
        setShowModal(false);
        setSelectedRequest(null);
    } catch (error) {
        console.error('Error declining request:', error);
        setNotificationMessage('Error declining request');
        setShowNotification(true);
    }
};

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleCloseNotification = () => setShowNotification(false);

  return (
    <div className="pending">
      <h2>PENDING REQUESTS</h2>
      <div className="pending-container">
        <div className="table-wrapper"> 
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.length > 0 ? (
                pendingRequests.map(request => (
                  <tr key={request.print_id}>
                    <td>{request.student_id}</td>
                    <td>{request.name}</td>
                    <td>{request.course}</td>
                    <td>{request.phone_number}</td>
                    <td>
                      <button className='view-btn' onClick={() => handleViewClick(request)}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No pending requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>  
      </div>

      {showModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Request Details:</p>
            <p>Requested At: {new Date(selectedRequest.requested_at).toLocaleString()}</p>
            <p>File Link: <a href={selectedRequest.file_link} target="_blank" rel="noopener noreferrer">{selectedRequest.file_link}</a></p>
            <p>Message: {selectedRequest.message}</p>
            <p>Price: <input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Enter price" 
                required
            /></p>
            <div className="modal-buttons">
              <button className="approve-button" onClick={handleApprove}>Approve</button>
              <button className="decline-button" onClick={handleDecline}>Decline</button>
              <button className="cancel-button-p" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
  
      {showNotification && (
        <Notification message={notificationMessage} onClose={handleCloseNotification} />
      )}
    </div>
  );
  
};

export default Pending;
