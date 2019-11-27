import React from 'react';

const Footer = () => (
  <footer className="ecl-footer">
    <div className="ecl-footer__corporate">
      <div className="ecl-footer__corporate-top">
        <div className="ecl-container">
          <div className="ecl-row">
            <div className="ecl-footer__column ecl-col-md">
              <h2
                className="ecl-heading ecl-heading--h4 ecl-footer__column-title"
                id="footer-corporate-about-ec"
              >
                European Commission
              </h2>
              <ul
                className="ecl-list ecl-list--unstyled ecl-footer__list"
                aria-labelledby="footer-corporate-about-ec"
              >
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="https://ec.europa.eu/commission/index_en"
                  >
                    Commission and its priorities
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="https://ec.europa.eu/info/index_en"
                  >
                    Policies information and services
                  </a>
                </li>
              </ul>
            </div>
            <div className="ecl-footer__column ecl-col-md">
              <h2
                className="ecl-heading ecl-heading--h4 ecl-footer__column-title"
                id="footer-corporate-social-media"
              >
                Follow the European Commission
              </h2>
              <ul
                className="ecl-list ecl-list--unstyled ecl-list--inline ecl-footer__list ecl-footer__list--inline  ecl-footer__social-links"
                aria-labelledby="footer-corporate-social-media"
              >
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="https://www.facebook.com/EuropeanCommission"
                  >
                    {' '}
                    <span className="ecl-icon ecl-icon--facebook ecl-footer__social-icon" />
                    <span>Facebook</span>{' '}
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="https://twitter.com/EU_commission"
                  >
                    {' '}
                    <span className="ecl-icon ecl-icon--twitter ecl-footer__social-icon" />
                    <span>Twitter</span>{' '}
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-link--external ecl-footer__link"
                    href="https://europa.eu/european-union/contact/social-networks_en#n:|i:4|e:1|t:|s"
                  >
                    Other social media
                  </a>
                </li>
              </ul>
            </div>
            <div className="ecl-footer__column ecl-col-md">
              <h2
                className="ecl-heading ecl-heading--h4 ecl-footer__column-title"
                id="footer-corporate-about-eu"
              >
                European Union
              </h2>
              <ul
                className="ecl-list ecl-list--unstyled ecl-footer__list"
                aria-labelledby="footer-corporate-about-eu"
              >
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="https://europa.eu/european-union/about-eu/institutions-bodies_en"
                  >
                    EU institutions
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
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
      <div className="ecl-footer__corporate-bottom">
        <div className="ecl-container">
          <div className="ecl-row">
            <div className="ecl-col">
              <ul className="ecl-list ecl-list--unstyled ecl-list--inline ecl-footer__list ecl-footer__list--inline">
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="http://ec.europa.eu/info/about-commissions-new-web-presence_en"
                  >
                    About the Commission&apos;s new web presence
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="http://ec.europa.eu/info/resources-partners_en"
                  >
                    Resources for partners
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="http://ec.europa.eu/info/cookies_en"
                  >
                    Cookies
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
                    href="http://ec.europa.eu/info/legal-notice_en"
                  >
                    Legal notice
                  </a>
                </li>
                <li className="ecl-footer__list-item">
                  <a
                    className="ecl-link ecl-link--inverted ecl-footer__link"
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
    </div>
  </footer>
);

export default Footer;
