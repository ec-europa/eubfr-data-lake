import React from 'react';

const PageHeader = () => (
  <div className="ecl-page-header">
    <div className="ecl-container">
      <nav
        className="ecl-page-header__breadcrumb ecl-breadcrumb"
        aria-label="You are here:"
        data-ecl-breadcrumb="true"
      >
        <ol className="ecl-breadcrumb__container">
          <li
            className="ecl-breadcrumb__segment"
            data-ecl-breadcrumb-item="static"
            aria-hidden="false"
          >
            <a
              href="/"
              className="ecl-breadcrumb__link ecl-link ecl-link--standalone"
            >
              Home
            </a>
          </li>
        </ol>
      </nav>
      <h1 className="ecl-page-header__title">Consolidation Dashboard</h1>
      <p className="ecl-page-header__description">
        Facilitates the flaggin of duplicate records.
      </p>
    </div>
  </div>
);

export default PageHeader;
