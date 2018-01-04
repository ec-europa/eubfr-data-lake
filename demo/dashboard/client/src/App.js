import React, { Fragment } from 'react';
import { HashRouter, Route, NavLink, Redirect } from 'react-router-dom';
import Files from './pages/Files';
import Upload from './pages/Upload';

import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

const App = () => (
  <HashRouter>
    <Fragment>
      <Header />
      <div className="ecl-page-header">
        <div className="ecl-container">
          <nav className="ecl-breadcrumbs " aria-label="breadcrumbs">
            <span className="ecl-u-sr-only">You are here:</span>
            <ol className="ecl-breadcrumbs__segments-wrapper">
              <li className="ecl-breadcrumbs__segment ecl-breadcrumbs__segment--first">
                <a
                  href="http://europa.eu/index_en.htm"
                  className="ecl-breadcrumbs__link"
                >
                  European Commission
                </a>
              </li>
              <li className="ecl-breadcrumbs__segment ecl-breadcrumbs__segment--last">
                <NavLink to="/" exact className="ecl-breadcrumbs__link">
                  EUBFR
                </NavLink>
              </li>
            </ol>
          </nav>
          <div className="ecl-page-header__body">
            <div className="ecl-page-header__identity">
              Dashboard - {process.env.REACT_APP_DEMO_SERVER}
            </div>
          </div>
        </div>
      </div>
      <div className="ecl-container eubfr-main-content">
        <div className="ecl-row">
          <div className="ecl-col-md-3">
            <nav className="ecl-navigation-inpage">
              <div className="ecl-navigation-inpage__body">
                <ul
                  className="ecl-navigation-inpage__list"
                  aria-labelledby="ecl-navigation-inpage-trigger"
                >
                  <li className="ecl-navigation-inpage__item">
                    <NavLink
                      to="/files"
                      className="ecl-navigation-inpage__link ecl-link ecl-link--standalone"
                      activeClassName="ecl-navigation-inpage__link--is-active"
                    >
                      My Files
                    </NavLink>
                  </li>
                  <li className="ecl-navigation-inpage__item">
                    <NavLink
                      to="/upload"
                      className="ecl-navigation-inpage__link ecl-link ecl-link--standalone"
                      activeClassName="ecl-navigation-inpage__link--is-active"
                    >
                      Upload a new file
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="ecl-col-md-9">
            <Route exact path="/" render={() => <Redirect to="/files" />} />
            <Route path="/upload" component={Upload} />
            <Route path="/files" component={Files} />
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  </HashRouter>
);

export default App;
