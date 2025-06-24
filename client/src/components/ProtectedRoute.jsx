import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        await axios.get('/api/users/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };
    checkToken();
  }, []);

  if (isValid === null) {
    return <div>Loading...</div>;
  }
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute; 