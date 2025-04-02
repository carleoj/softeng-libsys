import React, { useEffect, useState } from 'react';
import './styles/Notifications.css';

const Notifications = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const student_id = localStorage.getItem('user_student_id');

        const response = await fetch(
          `http://localhost:8081/api/posts?student_id=${student_id}`
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading posts:', error);
        setLoading(false);
      }
    };

    loadPosts(); // Fetch posts
  }, []); // Empty array ensures this runs only once on mount

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="notifications">
      <h2>NOTIFICATIONS</h2>
      <div className="notifications-container">
        {messages.map((msg) => (
          <div className="message-box" key={msg.post_id}>
            <div className="sender-image-container">
              <img
                src="../src/assets/lib-logo.jpg"
                alt={`Sender: System`}
                className="sender-image"
              />
            </div>
            <div className="message-content">
              <p className="sender-name">Library Admin</p>
              <p className="message-text">{msg.content}</p>
              <p className="message-date">{new Date(msg.posted_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
