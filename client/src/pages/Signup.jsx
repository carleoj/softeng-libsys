import React, { useState } from 'react';
import './styles/Signup.css';
import Header from '../components/Header';

const Signup = () => {
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    course: '',
    phone: '',
    username: '',
    password: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [submittedData, setSubmittedData] = useState(null); // State to store submitted data

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number to allow only numeric input
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8081/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Thank you for registering! Your library account has been created successfully.');

        // Save the submitted data and open modal
        setSubmittedData(formData);
        setIsModalOpen(true);

        // Reset form data
        setFormData({
          studentId: '',
          name: '',
          course: '',
          phone: '',
          username: '',
          password: '',
        });
      } else {
        setMessage(result.error || 'Error registering user');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      <Header />
      <div className="signup-container">
        <div className="div-container3">
          <h2>Create your Student Library Account</h2>
          <div className="form-container">
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  placeholder="Enter your student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="course">Course</label>
                <input
                  type="text"
                  id="course"
                  name="course"
                  placeholder="Enter your course"
                  value={formData.course}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="\d*"
                  title="Phone number must contain only digits"
                />
              </div>

              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="email"
                  id="username"
                  name="username"
                  placeholder="Enter your email"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="signup-btn">Sign Up</button>
            </form>

            {message && <p className="signup-message">{message}</p>}
          </div>
        </div>
      </div>

      {/* Modal for displaying user information */}
      {isModalOpen && submittedData && ( // Check if submittedData exists
        <div className="modal-overlay">
          <div className="modal">
            <h2>Registration Successful!</h2>
            <p>Please save your account information.</p><br />
            <p><strong>Student ID:</strong> {submittedData.studentId}</p>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Course:</strong> {submittedData.course}</p>
            <p><strong>Phone Number:</strong> {submittedData.phone}</p>
            <p><strong>Username:</strong> {submittedData.username}</p>
            <p><strong>Password:</strong> {submittedData.password}</p><br />
            <button onClick={closeModal} className="modal-btn">Okay</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;
