import React from 'react';

const Header = () => (
  <header className="ecl-site-header" role="banner">
    <div className="ecl-site-switcher ecl-site-switcher--header">
      <div className="ecl-container">
        <ul className="ecl-site-switcher__list">
          <li className="ecl-site-switcher__option">
            <a
              className="ecl-link ecl-site-switcher__link"
              href="https://ec.europa.eu/commission/index_en"
            >
              Commission and its priorities
            </a>
          </li>
          <li className="ecl-site-switcher__option ecl-site-switcher__option--is-selected">
            <a
              className="ecl-link ecl-site-switcher__link"
              href="https://ec.europa.eu/info/index_en"
            >
              Policies, information and services
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="ecl-container ecl-site-header__banner">
      <a
        href="https://ec.europa.eu"
        className="ecl-logo ecl-logo--logotype ecl-site-header__logo"
        title="Home - European Commission"
      >
        <span className="ecl-u-sr-only">Home - European Commission</span>
      </a>
    </div>
  </header>
);

export default Header;
