import React from 'react';

const Header = () => (
  <header className="ecl-site-header">
    <div className="ecl-site-header__container ecl-container">
      <div className="ecl-site-header__banner">
        <a
          className="ecl-link ecl-link--standalone"
          href="/example"
          aria-label="European Commission"
        >
          <img
            alt="European Commission logo"
            title="European Commission"
            className="ecl-site-header__logo-image"
            src="/images/logo/logo--en.svg"
          />
        </a>
        <div className="ecl-site-header__selector" />
      </div>
    </div>
  </header>
);

export default Header;
