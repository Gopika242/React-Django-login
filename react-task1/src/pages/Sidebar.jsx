import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

function Sidebar() {
  return (
    <div style={{ backgroundColor: "#085191", height: "100vh", width: "200px" }} className='div2'>
      <ul className="nav nav-tabs flex-column" style={{ marginTop: "50px" }}>
        <li className="nav-item">
          <NavLink   to="/dashboard" className={({ isActive }) =>isActive ? "nav-link active-tab" : "nav-link"}>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink   to="/profile"
  className={({ isActive }) =>
    isActive ? "nav-link active-tab" : "nav-link"
  }>
            Profile
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink   to="/notes"
  className={({ isActive }) =>
    isActive ? "nav-link active-tab" : "nav-link"
  }>
            Notes
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
