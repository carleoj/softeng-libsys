import React, { useState } from 'react';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8081/api/login', {
                username,
                password,
            });
    
            console.log('Response Status:', response.status);
            console.log('Response Data:', response.data);
    
            if (response.status === 200) {
                const { user, role } = response.data;
                setIsAuthenticated(true);
                setMessage('Login successful');
                
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('userName', user.name); 
                localStorage.setItem('user_userName', user.username); 
                localStorage.setItem('user_student_id', user.student_id);
    
                if (role === 'faculty') {
                    navigate('/faculty-dashboard'); 
                } else if (role === 'student') {
                    navigate('/student-dashboard');
                }
            } 
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Invalid username or password');
            } else {
                setMessage('Error logging in. Please try again.');
            }
        }
    };

    return (
        <>
            <Header />
            <div className='login-container'>
                <div className='div-container'>
                    <h2>Login to your Library Account</h2>
                    <div className="form-container">
                        <form className='login-form' onSubmit={handleLogin}>
                            <div className='input-group'>
                                <label htmlFor='username'>Username/Email</label>
                                <input
                                    type='text'
                                    id='username'
                                    name='username'
                                    placeholder='Enter your username'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className='input-group'>
                                <label htmlFor='password'>Password</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='Enter your password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type='submit' className='login-btn'>Log In</button>
                        </form>
                        {message && <p>{message}</p>} {/* Display message */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
