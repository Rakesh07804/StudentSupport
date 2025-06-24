import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUser,
  FaHome,
  FaExclamationCircle,
  FaSearch,
  FaCalendarAlt,
  FaSignOutAlt,
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column align-items-center p-3">
      <div className="user-icon mb-4">
        <FaUser size={40} />
      </div>

      <nav className="nav flex-column w-100">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaHome /> Dashboard
        </NavLink>
        <NavLink to="/personal-info" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaUser /> Personal Info
        </NavLink>
        <NavLink to="/raise-complaint" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaExclamationCircle /> Raise Complaint
        </NavLink>
        <NavLink to="/lost-found" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaSearch /> Lost & Found
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <FaCalendarAlt /> Events
        </NavLink>
        <NavLink to="/logout" className={({ isActive }) => `nav-link text-danger mt-auto ${isActive ? 'active' : ''}`}>
          <FaSignOutAlt /> Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
