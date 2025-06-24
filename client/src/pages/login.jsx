// src/pages/login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css.css/register.css'; // Reusing register page styles

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const body = JSON.stringify({ email, password });

            const res = await axios.post('/api/users/login', body, config);
            
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);

            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="register-container">
            <div className="register-form-container">
                <h1 className="register-title">Welcome Back!</h1>
                <p className="register-subtitle">Sign in to continue</p>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={onSubmit} className="register-form">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
                    <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                    <button type="submit" className="register-button">Login</button>
                </form>
                <p style={{ marginTop: '20px' }}>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
