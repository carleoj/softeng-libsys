import React, { useState, useEffect } from 'react';
import './styles/PrintRequests.css';
import Notification from '../components/Notification';

const PrintRequests = () => {
    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [formData, setFormData] = useState({ fileName: '', fileLink: '', message: '' });
    const [printRequests, setPrintRequests] = useState([]);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipTimeout, setTooltipTimeout] = useState(null);
    const student_id = localStorage.getItem('user_student_id');

    useEffect(() => {
        fetchPrintRequests();
    }, []);

    const fetchPrintRequests = async () => {
        try {
            const response = await fetch(`http://localhost:8081/api/prints?student_id=${student_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch print requests');
            }
            const data = await response.json();
            setPrintRequests(data);  
        } catch (error) {
            console.error('Error fetching print requests:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.fileName || !formData.fileLink || !formData.message) {
            setNotificationMessage('Please fill in all required fields.');
            setShowNotification(true);
            return;
        }

        if (!formData.fileLink.startsWith('http://') && !formData.fileLink.startsWith('https://')) {
            setNotificationMessage('Please enter a valid URL starting with http:// or https://');
            setShowNotification(true);
            return;
        }

        const requestBody = {
            fileName: formData.fileName,
            fileLink: formData.fileLink,
            message: formData.message,
            student_id 
        };

        try {
            const response = await fetch('http://localhost:8081/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('File link submission failed');
            }

            const newRequest = await response.json();
            setPrintRequests(prevRequests => [newRequest, ...prevRequests]);
            setNotificationMessage('Request submitted successfully!');
            setShowNotification(true);
            resetForm();
            setShowModal(false);
            fetchPrintRequests();
        } catch (error) {
            setNotificationMessage('Error submitting request: ' + error.message);
            setShowNotification(true);
        }
    };

    const resetForm = () => setFormData({ fileName: '', fileLink: '', message: '' });

    const handleCloseNotification = () => setShowNotification(false);

    const handleCancelRequest = async (print_id) => {
        try {
            const response = await fetch(`http://localhost:8081/api/cleared/${print_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete request');
            }

            fetchPrintRequests();
        } catch (error) {
            setNotificationMessage('Error canceling request: ' + error.message);
            setShowNotification(true);
        }
    };

    const handleMouseEnter = (print_id) => {
        const timeout = setTimeout(() => {
            setTooltipVisible((prev) => ({ ...prev, [print_id]: true }));
        }, 300);
        setTooltipTimeout(timeout);
    };
    
    const handleMouseLeave = (print_id) => {
        clearTimeout(tooltipTimeout);
        setTooltipVisible((prev) => ({ ...prev, [print_id]: false }));
    };
    

    return (
        <div className="print-requests">
            <h2>PRINT REQUESTS</h2>
            <div className="request-container">
                <div className="table-container">
                    <button className="add-request-button" onClick={() => setShowModal(true)}>
                        <img src="../src/assets/more.png" alt="More Icon" />
                        Add Request
                    </button>
                    <div className="table-wrapper-s">
                    <table>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Link</th>
                                <th>Date</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printRequests.length > 0 ? (
                                printRequests.map((request) => (
                                    <tr key={request.print_id}>
                                        <td>{request.file_name}</td>
                                        <td>
                                            <a 
                                                href={request.file_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                {request.file_link}
                                            </a>
                                        </td>
                                        <td>{new Date(request.requested_at).toLocaleString()}</td>
                                        <td>{request.price ? `₱${request.price}` : 'N/A'}</td>
                                        <td>{request.status}</td>
                                        <td>
                                            {['pending', 'cleared', 'declined'].includes(request.status) && (
                                                <div style={{ position: 'relative' }}>
                                                    <button 
                                                        className="row-cancel-button" 
                                                        onClick={() => handleCancelRequest(request.print_id)}
                                                        onMouseEnter={() => handleMouseEnter(request.print_id)}
                                                        onMouseLeave={() => handleMouseLeave(request.print_id)}
                                                    >
                                                        X
                                                    </button>
                                                    {tooltipVisible[request.print_id] && (
                                                    <span className="tooltip">Delete Request</span>
                                                )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No print requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Print Request</h3>
                        <form className="login-form">
                            <div className="form-group">
                                <label className="label" htmlFor="fileName">File Name</label>
                                <input 
                                    type="text" 
                                    name="fileName" 
                                    id="fileName"
                                    value={formData.fileName} 
                                    onChange={handleChange} 
                                    placeholder="File Name" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="fileLink">File Link</label>
                                <input 
                                    type="url" 
                                    name="fileLink" 
                                    id="fileLink"
                                    value={formData.fileLink} 
                                    onChange={handleChange} 
                                    placeholder="Enter raw file link" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label className="label" htmlFor="message">Message</label>
                                <textarea 
                                    name="message" 
                                    id="message"
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    placeholder="Message" 
                                    rows={3} 
                                    required 
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="ok-button" onClick={handleSubmit}>Submit</button>
                                <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNotification && (
                <Notification message={notificationMessage} onClose={handleCloseNotification} />
            )}
        </div>
    );
};

export default PrintRequests;
