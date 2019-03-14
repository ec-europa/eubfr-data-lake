import React from 'react';

const Header = () => (
  <header class="ecl-site-header">
    <div class="ecl-site-header__container ecl-container">
      <div class="ecl-site-header__banner">
        <a
          class="ecl-link ecl-link--standalone"
          href="/example"
          aria-label="European Commission"
        >
          <img
            alt="European Commission logo"
            title="European Commission"
            class="ecl-site-header__logo-image"
            src="/images/logo/logo--en.svg"
          />
        </a>
        <div class="ecl-site-header__selector" />
      </div>
    </div>
  </header>
);

export default Header;
