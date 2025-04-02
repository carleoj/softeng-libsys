import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ServerTest from './components/ServerTest';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  
  useEffect(() => {
    const savedAuthStatus = localStorage.getItem('isAuthenticated');
    if (savedAuthStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); 
    localStorage.removeItem('userName'); 
  };

  if (isAuthenticated === null) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/test" element={<ServerTest />} />

        <Route
          path="/student-dashboard/*"
          element={
            isAuthenticated ? (
              <StudentDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/faculty-dashboard/*"
          element={
            isAuthenticated ? (
              <FacultyDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
