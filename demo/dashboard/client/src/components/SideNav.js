import React from 'react';
import { NavLink } from 'react-router-dom';

const SideNav = () => (
  <nav
    className="ecl-inpage-navigation ecl-u-align-self-start ecl-inpage-navigation--sticky ecl-inpage-navigation--changed"
    style={{ top: '0px', position: 'sticky' }}
  >
    <div className="ecl-inpage-navigation__body">
      <ul
        className="ecl-inpage-navigation__list"
        aria-hidden="true"
        aria-labelledby="ecl-inpage-navigation-trigger"
        id="ecl-inpage-navigation-list"
      >
        <li className="ecl-inpage-navigation__item">
          <NavLink
            className="ecl-link ecl-link--standalone ecl-inpage-navigation__link"
            activeClassName="ecl-inpage-navigation__link--is-active"
            to="/files"
          >
            My Files
          </NavLink>
        </li>
        <li className="ecl-inpage-navigation__item">
          <NavLink
            className="ecl-link ecl-link--standalone ecl-inpage-navigation__link"
            activeClassName="ecl-inpage-navigation__link--is-active"
            to="/upload"
          >
            Upload a new file
          </NavLink>
        </li>
      </ul>
    </div>
  </nav>
);

export default SideNav;
