import React from 'react';

const Header = () => (
  <header className="ecl-site-header" role="banner">
    <div className="ecl-site-switcher ecl-site-switcher--header">
      <ul className="ecl-site-switcher__list ecl-container">
        <li className="ecl-site-switcher__option">
          <a className="ecl-link ecl-site-switcher__link" href="">
            Commission and its priorities
          </a>
        </li>
        <li className="ecl-site-switcher__option ecl-site-switcher__option--is-selected">
          <a className="ecl-link ecl-site-switcher__link" href="">
            Policies, information and services
          </a>
        </li>
      </ul>
    </div>

    <div className="ecl-container ecl-site-header__banner">
      <a
        href="https://ec.europa.eu"
        className="ecl-logo ecl-logo--logotype ecl-site-header__logo"
        title="Home - European Commission"
      >
        <span className="ecl-u-sr-only">Home - European Commission</span>
      </a>

      <form aria-hidden className="ecl-search-form ecl-site-header__search">
        <label className="ecl-search-form__textfield-wrapper">
          <span className="ecl-u-sr-only">Search this website</span>

          <input
            type="search"
            className="ecl-text-input ecl-search-form__textfield"
            id="global-search"
            name="default-name"
          />
        </label>

        <button
          className="ecl-button ecl-button--form ecl-search-form__button"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  </header>
);

export default Header;
