import React, { useEffect, useState } from 'react';
import './styles/Cleared.css';

const Cleared = () => {
  const [clearedRequests, setClearedRequests] = useState([]);

  useEffect(() => {
    fetchClearedRequests();
  }, []);

  const fetchClearedRequests = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/cleared');
      if (!response.ok) {
        throw new Error('Failed to fetch cleared requests');
      }
      const data = await response.json();
      setClearedRequests(data);
    } catch (error) {
      console.error('Error fetching cleared requests:', error);
    }
  };

  const handleDelete = async (print_id) => {
    try {
      const response = await fetch(`http://localhost:8081/api/cleared/${print_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the request');
      }

      // Update the state to reflect the deleted request
      setClearedRequests(prev =>
        prev.filter(request => request.print_id !== print_id)
      );
    } catch (error) {
      console.error('Error deleting the request:', error);
    }
  };

  return (
    <div className="cleared">
      <h2>CLEARED PRINT REQUESTS</h2>
      <div className="cleared-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Print ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Phone Number</th>
                <th>File Name</th>
                <th>Requested At</th>
                <th>Price</th> {/* New column for Price */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {clearedRequests.length > 0 ? (
                clearedRequests.map(request => (
                  <tr key={request.print_id}>
                    <td>{request.print_id}</td>
                    <td>{request.name}</td>
                    <td>{request.course}</td>
                    <td>{request.phone_number}</td>
                    <td>{request.file_name}</td>
                    <td>{new Date(request.requested_at).toLocaleString()}</td>
                    <td>&#8369;{request.price ? `${request.price.toFixed(2)}` : 'N/A'}</td> {/* Render price */}
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(request.print_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No cleared requests found.</td> {/* Adjusted colspan */}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cleared;
