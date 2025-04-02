import React, { useEffect, useState } from 'react';
import './styles/FacultyHome.css';

const FacultyHome = () => {
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    printed: 0,
    cleared: 0,
    total_income: 0,
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [message, setMessage] = useState('');
  const [targetId, setTargetId] = useState(''); // New state for target_id

  const handleModalToggle = () => {
    setModalOpen(!isModalOpen);
  };

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value);
  };

  const handleTargetIdChange = (e) => {
    setTargetId(e.target.value); // Update targetId when input changes
  };

  const handlePostAnnouncement = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/post-announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: announcement, target_id: targetId || null }), // Include target_id
      });

      const data = await response.json();
      if (data.success) {
        setMessage('Announcement posted successfully!');
        setAnnouncement('');
        setTargetId(''); // Clear targetId after successful post
      } else {
        setMessage('Failed to post announcement.');
      }
    } catch (error) {
      console.error('Error posting announcement:', error);
      setMessage('An error occurred while posting.');
    }

    setTimeout(() => {
      setModalOpen(false);
      setMessage('');
    }, 1500);
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/requests/count');
        const data = await response.json();

        const response2 = await fetch('http://localhost:8081/api/get-total-income');
        const data2 = await response2.json();
        setCounts({
          pending: data.pendingCount || 0,
          approved: data.approvedCount || 0,
          printed: data.printedCount || 0,
          cleared: data.clearedCount || 0,
          total_income: data2.totalIncome || 0,
        });
      } catch (error) {
        console.error('Error fetching request counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="home">
      <div className="faculty-home">
        <div className="head-box2">
          <h4>DASHBOARD</h4>
          <div className="notification-container">
            <p>Announcements</p>
            <button className="notification-button" onClick={handleModalToggle}>
              <img
                src="../src/assets/3d-speaker.png"
                alt="Notifications"
                className="notification-icon"
              />
            </button>
          </div>
        </div>

        <div className="comps-wrapper-f">
          <div className="comp1-f">
            <h1>Pending Requests: <span className="active-count-f">{counts.pending}</span></h1>
          </div>
          <div className="comp1-f">
            <h1>Approved Requests: <span className="active-count-f">{counts.approved}</span></h1>
          </div>
        </div>
        <div className="comps-wrapper-f">
          <div className="comp1-f">
            <h1>Printed Requests: <span className="active-count-f">{counts.printed}</span></h1>
          </div>
          <div className="comp1-f">
            <h1>Cleared Requests: <span className="active-count-f">{counts.cleared}</span></h1>
          </div>
        </div>
        <div className="comps-wrapper-f">
          <div className="comp1-f">
            <h1>Total Revenue: <span className="active-count-f">&#8369; {counts.total_income}</span></h1>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-fh-overlay" onClick={handleModalToggle}>
          <div className="modal-fh" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-fh-title">Post Announcement</h2>
            <label htmlFor="announcement" className="modal-fh-label">Announcement (public):</label>
            <textarea
              id="announcement"
              value={announcement}
              onChange={handleAnnouncementChange}
              placeholder="Write your announcement here..."
              rows="5"
              className="modal-fh-input"
              spellCheck={false}
            ></textarea>

            {/* New Target ID Field */}
            <label htmlFor="target-id" className="modal-fh-label">Student ID (private):</label>
            <input
              id="target-id"
              value={targetId}
              onChange={handleTargetIdChange}
              type="text"
              placeholder="Enter Student ID"
              className="modal-fh-input"
            />

            <button className="modal-fh-post-button" onClick={handlePostAnnouncement}>
              Post
            </button>
            <button className="modal-fh-close-button" onClick={handleModalToggle}>
              Cancel
            </button>
            {message && (
              <p className={`modal-fh-message ${message.includes('success') ? 'modal-fh-success' : 'modal-fh-error'}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyHome;
