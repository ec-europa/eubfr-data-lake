import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNav = () => (
  <nav className="ecl-navigation-inpage">
    <div className="ecl-navigation-inpage__body">
      <ul
        className="ecl-navigation-inpage__list"
        aria-labelledby="ecl-navigation-inpage-trigger"
      >
        <li className="ecl-navigation-inpage__item">
          <NavLink
            to="/files"
            className="ecl-navigation-inpage__link ecl-link ecl-link--standalone"
            activeClassName="ecl-navigation-inpage__link--is-active"
          >
            My Files
          </NavLink>
        </li>
        <li className="ecl-navigation-inpage__item">
          <NavLink
            to="/upload"
            className="ecl-navigation-inpage__link ecl-link ecl-link--standalone"
            activeClassName="ecl-navigation-inpage__link--is-active"
          >
            Upload a new file
          </NavLink>
        </li>
      </ul>
    </div>
  </nav>
);

export default SideNav;
