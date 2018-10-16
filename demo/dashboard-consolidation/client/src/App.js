import React, { Fragment } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';

import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';
import './App.css';

// Components
import Header from './components/Header';
import PageHeader from './components/PageHeader';
import SideNav from './components/SideNav';
import Footer from './components/Footer';

// Pages
import PageNuts from './pages/Nuts';

const App = () => (
  <HashRouter>
    <Fragment>
      <Header />
      <PageHeader />
      <div className="ecl-container eubfr-main-content">
        <div className="ecl-row">
          <div className="ecl-col-md-3">
            <SideNav />
          </div>
          <div className="ecl-col-md-9">
            <Route exact path="/" render={() => <Redirect to="/nuts" />} />
            <Route path="/nuts" component={PageNuts} />
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  </HashRouter>
);

export default App;
