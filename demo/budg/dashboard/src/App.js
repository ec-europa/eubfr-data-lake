import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import Files from './pages/Files';
import Home from './pages/Home';
import Upload from './pages/Upload';

import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

const App = () => (
  <Router>
    <div className="ecl-container">
      <Header />
      <h1 className="ecl-heading ecl-heading--h1">Dashboard</h1>
      <nav className="ecl-navigation-list-wrapper">
        <h2 className="ecl-u-sr-only">Navigation Menu</h2>
        <ul className="ecl-navigation-list ecl-navigation-list--tabs">
          <li className="ecl-navigation-list__item">
            <NavLink
              to="/"
              exact
              className="ecl-navigation-list__link ecl-link"
              activeClassName="ecl-navigation-list__link--active"
            >
              Home
            </NavLink>
          </li>
          <li className="ecl-navigation-list__item">
            <NavLink
              to="/upload"
              className="ecl-navigation-list__link ecl-link"
              activeClassName="ecl-navigation-list__link--active"
            >
              Upload new file
            </NavLink>
          </li>
          <li className="ecl-navigation-list__item">
            <NavLink
              to="/files"
              className="ecl-navigation-list__link ecl-link"
              activeClassName="ecl-navigation-list__link--active"
            >
              Files
            </NavLink>
          </li>
        </ul>
      </nav>
      <Route exact path="/" component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/files" component={Files} />

      <Footer />
    </div>
  </Router>
);

export default App;
