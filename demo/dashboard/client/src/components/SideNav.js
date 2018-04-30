import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNav = () => (
  <nav>
    <ul>
      <li>
        <NavLink to="/files">My Files</NavLink>
      </li>
      <li>
        <NavLink to="/upload">Upload a new file</NavLink>
      </li>
    </ul>
  </nav>
);

export default SideNav;
