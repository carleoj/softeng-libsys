import React, { useEffect, useState } from 'react';
import './styles/Approved.css';
import Notification from '../components/Notification';

const Approved = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/approved-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch approved requests');
      }
      const data = await response.json();
      setApprovedRequests(data);
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    }
  };

  const handlePrint = async (request) => {
    try {
      await fetch(`http://localhost:8081/api/print-request/${request.print_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update local state to remove printed request
      setApprovedRequests(prevRequests => prevRequests.filter(req => req.print_id !== request.print_id));
      setNotificationMessage('Request marked as printed successfully!');
      setShowNotification(true);
      setShowModal(false);
    } catch (error) {
      console.error('Error marking request as printed:', error);
      setNotificationMessage('Error marking request as printed');
      setShowNotification(true);
    }
  };

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const handleCloseNotification = () => setShowNotification(false);

  return (
    <div className="approved">
      <h2>APPROVED REQUESTS</h2>
      <div className="approved-container">
        <div className="table-wrapper"> {/* Added wrapper for scrolling */}
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Phone Number</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedRequests.length > 0 ? (
                approvedRequests.map(request => (
                  <tr key={request.print_id}>
                    <td>{request.student_id}</td>
                    <td>{request.name}</td>
                    <td>{request.course}</td>
                    <td>{request.phone_number}</td>
                    <td>₱{request.price || 'N/A'}</td>
                    <td>
                      <button className='view-btn' onClick={() => handleViewClick(request)}>View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No approved requests found.</td>
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
            <p>File Link: <a href={selectedRequest.file_link} target="_blank" rel="noopener noreferrer">{selectedRequest.file_link}</a></p>
            <p>Price: ₱{selectedRequest.price || 'N/A'}</p>
            <p>Message: {selectedRequest.message}</p>
            <p>Requested At: {new Date(selectedRequest.requested_at).toLocaleString()}</p>
            <br />
            <div className="modal-buttons">
              <button className="printed-button-a" onClick={() => handlePrint(selectedRequest)}>Printed</button>
              <button className="cancel-button-a" onClick={handleCloseModal}>Close</button>
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

export default Approved;
