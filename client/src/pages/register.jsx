// src/pages/register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css.css/register.css'; // ensure path is correct

const Register = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!email) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const payload = {
                email,
                name: 'New User', // Default name that can be updated later
                password: 'tempPassword123', // Temporary password that must be changed
                role: 'student', // Default role that can be updated later
                isVerified: false
            };

            const { data } = await axios.post('/api/users/register', payload, config);
            
            // Store user info and token
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);

            setSuccess('Registration successful! Redirecting to complete your profile...');
            setTimeout(() => {
                navigate('/personal-info');
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
            console.error("Registration failed:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container" style={{ maxWidth: '400px' }}>
                <h1 className="register-title">Get Started</h1>
                <p className="register-subtitle">Enter your email to create your account</p>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={onSubmit} className="register-form">
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                    
                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
