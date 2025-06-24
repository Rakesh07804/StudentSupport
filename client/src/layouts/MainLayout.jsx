// src/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../components/sidebar';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar />
      <main style={{ marginLeft: '250px', flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
