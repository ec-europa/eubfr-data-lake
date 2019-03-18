import React from 'react';

const SiteHeader = () => (
  <div className="ecl-site-switcher ecl-site-switcher--header">
    <div className="ecl-container ecl-site-switcher__container">
      <ul className="ecl-site-switcher__list">
        <li className="ecl-site-switcher__option">
          <a
            href="../../example.html#"
            className="ecl-site-switcher__link ecl-link"
          >
            Commission and its priorities
          </a>
        </li>
        <li className="ecl-site-switcher__option ecl-site-switcher__option--is-selected">
          <a
            href="../../example.html#"
            className="ecl-site-switcher__link ecl-link"
          >
            Policies, information and services
          </a>
        </li>
      </ul>
    </div>
  </div>
);

export default SiteHeader;
