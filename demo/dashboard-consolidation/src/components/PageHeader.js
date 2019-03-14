import React from 'react';

const PageHeader = () => (
  <div class="ecl-page-header">
    <div class="ecl-container">
      <nav
        class="ecl-page-header__breadcrumb ecl-breadcrumb"
        aria-label="You are here:"
        data-ecl-breadcrumb="true"
      >
        <ol class="ecl-breadcrumb__container">
          <li
            class="ecl-breadcrumb__segment"
            data-ecl-breadcrumb-item="static"
            aria-hidden="false"
          >
            <a
              href="/"
              class="ecl-breadcrumb__link ecl-link ecl-link--standalone"
            >
              Home
            </a>
          </li>
        </ol>
      </nav>
      <h1 class="ecl-page-header__title">Consolidation Dashboard</h1>
      <p class="ecl-page-header__description">
        Facilitates the marking of duplicate records.
      </p>
    </div>
  </div>
);

export default PageHeader;
