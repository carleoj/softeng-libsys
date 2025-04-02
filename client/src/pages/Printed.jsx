import React, { useEffect, useState } from 'react';
import './styles/Printed.css'; 

const Printed = () => {
  const [printedRequests, setPrintedRequests] = useState([]);

  useEffect(() => {
    fetchPrintedRequests();
  }, []);

  const fetchPrintedRequests = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/printed-requests');
      if (!response.ok) {
        throw new Error('Failed to fetch printed requests');
      }
      const data = await response.json();
      setPrintedRequests(data);
    } catch (error) {
      console.error('Error fetching printed requests:', error);
    }
  };

  const handleClear = async (print_id, price) => {
    try {
      console.log("Sending request to clear with price:", price);
      const response = await fetch(`http://localhost:8081/api/printed-requests/${print_id}/clear`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to clear the request: ${errorData.error}`);
      }
  
      setPrintedRequests(prev =>
        prev.filter(request => request.print_id !== print_id)
      );
    } catch (error) {
      console.error('Error clearing the request:', error.message);
    }
  };

  return (
    <div className="printed">
      <h2>PRINTED REQUESTS</h2>
      <div className="printed-container">
        <div className="table-wrapper"> 
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Phone Number</th>
                <th>File Name</th>
                <th>Printed At</th>
                <th>Price</th>  
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {printedRequests.length > 0 ? (
                printedRequests.map(request => (
                  <tr key={request.print_id}>
                    <td>{request.student_id}</td>
                    <td>{request.name}</td>
                    <td>{request.course}</td>
                    <td>{request.phone_number}</td>
                    <td>{request.file_name}</td>
                    <td>{new Date(request.requested_at).toLocaleString()}</td>
                    <td>&#8369;{request.price || 'N/A'}</td>
                    <td>
                      <button
                        className="clear-button"
                        onClick={() => handleClear(request.print_id, request.price)}
                      >
                        Clear
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No printed requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Printed;
