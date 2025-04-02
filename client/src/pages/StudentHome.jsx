import React, { useEffect, useState } from 'react';
import './styles/StudentHome.css';
import axios from 'axios';

const StudentHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeRequestsCount, setActiveRequestsCount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Fix: Declare `today`
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setCurrentDate(formattedDate);

    const username = localStorage.getItem('user_userName');
    const student_id = localStorage.getItem('user_student_id');

    if (!username || !student_id) {
      setError('Missing user credentials in localStorage');
      setLoading(false);
      return;
    }

    // Fetch user data
    fetch(`http://localhost:8081/api/getUser?username=${username}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then((userData) => {
        setData(userData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });

    // Fetch count of active requests
    axios
      .get(`http://localhost:8081/api/active-requests/count?student_id=${student_id}`)
      .then((res) => setActiveRequestsCount(res.data.activeRequestsCount))
      .catch((err) => {
        console.error('Error fetching active requests count:', err);
        setError('Failed to fetch active requests count');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="student-home">
      <div className="head-box">
        <h4>DASHBOARD</h4>
        <h3>{currentDate}</h3>
      </div>
      <div className="comps-wrapper-s">
        <div className="comp1-s">
          <h2>STUDENT INFORMATION</h2>
          {data ? (
            <div className="info-student">
              <div className="info-stud"><h3>Student ID: <br />{data.student_id}</h3></div>
              <div className="info-stud"><h3>Name: <br />{data.name}</h3></div>
              <div className="info-stud"><h3>Course: <br />{data.course}</h3></div>
              <div className="info-stud"><h3>Phone: {data.phone_number}</h3></div>
            </div>
          ) : (
            <p>No student information available.</p>
          )}
          <div className="dual-box">
            <div className="left-box">
              Active Request(s):
              <span className="active-count">{activeRequestsCount}</span>
            </div>
            <div className="right-box">
              Status: <br />
              <span className="clearance-status">{activeRequestsCount === 0 ? 'Cleared' : 'Not Cleared'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
