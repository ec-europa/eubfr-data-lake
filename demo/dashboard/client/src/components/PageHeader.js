import React from 'react';
import { NavLink } from 'react-router-dom';

const PageHeader = () => (
  <div className="ecl-page-header">
    <div className="ecl-container">
      <nav className="ecl-breadcrumbs" aria-label="breadcrumbs">
        <span className="ecl-u-sr-only">You are here:</span>
        <ol className="ecl-breadcrumbs__segments-wrapper">
          <li className="ecl-breadcrumbs__segment ecl-breadcrumbs__segment--first">
            <a
              href="http://europa.eu/index_en.htm"
              className="ecl-link ecl-link--inverted ecl-link--standalone ecl-breadcrumbs__link"
            >
              European Commission
            </a>
          </li>
          <li className="ecl-breadcrumbs__segment ecl-breadcrumbs__segment--last">
            <NavLink
              to="/"
              exact
              className="ecl-link ecl-link--inverted ecl-link--standalone ecl-breadcrumbs__link"
            >
              EUBFR
            </NavLink>
          </li>
        </ol>
      </nav>
      <div className="ecl-page-header__body">
        <div className="ecl-page-header__identity">
          {(process.env.REACT_APP_PRODUCER || '').toUpperCase()} Dashboard
        </div>
      </div>
    </div>
  </div>
);

export default PageHeader;
