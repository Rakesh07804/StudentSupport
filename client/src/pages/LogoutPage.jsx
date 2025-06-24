import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear user info from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // Redirect to login page
        navigate('/login');
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
};

export default LogoutPage;
