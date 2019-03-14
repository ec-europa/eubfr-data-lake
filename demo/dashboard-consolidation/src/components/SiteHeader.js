import React from 'react';

const SiteHeader = () => (
  <div class="ecl-site-switcher ecl-site-switcher--header">
    <div class="ecl-container ecl-site-switcher__container">
      <ul class="ecl-site-switcher__list">
        <li class="ecl-site-switcher__option">
          <a
            href="../../example.html#"
            class="ecl-site-switcher__link ecl-link"
          >
            Commission and its priorities
          </a>
        </li>
        <li class="ecl-site-switcher__option ecl-site-switcher__option--is-selected">
          <a
            href="../../example.html#"
            class="ecl-site-switcher__link ecl-link"
          >
            Policies, information and services
          </a>
        </li>
      </ul>
    </div>
  </div>
);

export default SiteHeader;
