// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationCircle, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const DashboardPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [events, setEvents] = useState([]);
    const [lostFounds, setLostFounds] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [complaintsRes, eventsRes, lostFoundRes] = await Promise.all([
                    axios.get('/api/complaints', config),
                    axios.get('/api/events', config),
                    axios.get('/api/lostfound', config),
                ]);
                setComplaints(complaintsRes.data);
                setEvents(eventsRes.data);
                setLostFounds(lostFoundRes.data);
            } catch (error) {
                console.error('Dashboard data load error:', error);
            }
        };
        fetchData();
    }, []);

    const renderCard = (title, items, icon, type) => (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
                <div className="card-body">
                    {icon}
                    <h5 className="card-title mt-3">{title}</h5>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {items.length === 0 && <p className="text-muted">No {type} available.</p>}
                        {items.slice(0, 3).map((item, index) => (
                            <div key={index} className="mb-3 border-bottom pb-2">
                                <h6>{item.subject || item.title || item.itemName}</h6>
                                {item.image || item.poster ? (
                                    <img
                                        src={item.image || item.poster}
                                        alt="preview"
                                        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                        className="mb-2"
                                    />
                                ) : null}
                                <p className="small text-muted">{item.description?.substring(0, 100)}...</p>
                            </div>
                        ))}
                    </div>
                    <Link to={`/${type}`} className={`btn btn-${type === 'raise-complaint' ? 'primary' : type === 'lost-found' ? 'success' : 'info'}`}>View All</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <div className="p-5 mb-4 bg-light rounded-3">
                <div className="container-fluid py-5">
                    <h1 className="display-5 fw-bold">Student Support Hub</h1>
                    <p className="col-md-8 fs-4">
                        Welcome! This is your central place for campus support. Whether you need to raise a complaint, report a lost item, or check out upcoming events, we've got you covered.
                    </p>
                </div>
            </div>
            <div className="row text-center">
                {renderCard('Complaints', complaints, <FaExclamationCircle size={40} className="text-primary" />, 'raise-complaint')}
                {renderCard('Lost & Found', lostFounds, <FaSearch size={40} className="text-success" />, 'lost-found')}
                {renderCard('Events', events, <FaCalendarAlt size={40} className="text-info" />, 'events')}
            </div>
        </div>
    );
};

export default DashboardPage;
