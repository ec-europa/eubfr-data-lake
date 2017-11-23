import React from 'react';

const Footer = () => (
  <footer className="ecl-footer">
    <div className="ecl-footer__site-corporate">
      <div className="ecl-container">
        <div className="ecl-row">
          <div className="ecl-col-sm ecl-footer__column">
            <h4 className="ecl-h4 ecl-footer__title">European Commission</h4>

            <ul className="ecl-footer__menu">
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="https://ec.europa.eu/commission/index_en"
                >
                  Commission and its priorities
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="https://ec.europa.eu/info/index_en"
                >
                  Policies information and services
                </a>
              </li>
            </ul>
          </div>
          <div className="ecl-col-sm ecl-footer__column">
            <h4 className="ecl-h4 ecl-footer__title">
              Follow the European Commission
            </h4>

            <ul className="ecl-footer__menu ecl-list--inline">
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="https://www.facebook.com/EuropeanCommission"
                >
                  <span className="ecl-icon ecl-icon--facebook ecl-footer__social-icon" />Facebook
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="https://twitter.com/EU_commission"
                >
                  <span className="ecl-icon ecl-icon--twitter ecl-footer__social-icon" />Twitter
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link ecl-link--external"
                  href="https://europa.eu/european-union/contact/social-networks_en"
                >
                  Other social media
                </a>
              </li>
            </ul>
          </div>
          <div className="ecl-col-sm ecl-footer__column">
            <h4 className="ecl-h4 ecl-footer__title">European Union</h4>

            <ul className="ecl-footer__menu">
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link ecl-link--external"
                  href="https://europa.eu/european-union/about-eu/institutions-bodies_en"
                >
                  EU institutions
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link ecl-link--external"
                  href="https://europa.eu/european-union/index_en"
                >
                  European Union
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="ecl-footer__ec">
      <div className="ecl-container">
        <div className="ecl-row">
          <div className="ecl-col-sm ">
            <ul className="ecl-list--inline ecl-footer__menu">
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="http://ec.europa.eu/info/about-commissions-new-web-presence_en"
                >
                  About the Commission&apos;s new web presence
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="http://ec.europa.eu/info/resources-partners_en"
                >
                  Resources for partners
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="http://ec.europa.eu/info/cookies_en"
                >
                  Cookies
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="http://ec.europa.eu/info/legal-notice_en"
                >
                  Legal notice
                </a>
              </li>
              <li className="ecl-footer__menu-item">
                <a
                  className="ecl-link ecl-footer__link"
                  href="http://ec.europa.eu/info/contact_en"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
