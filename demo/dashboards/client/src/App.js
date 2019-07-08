import React, { Fragment } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';

import Producers from './pages/Producers';
import Reports from './pages/Reports';
import Projects from './pages/Projects';
import Locations from './pages/Locations';

import Header from './components/Header';
import PageHeader from './components/PageHeader';
import SideNav from './components/SideNav';
import Footer from './components/Footer';

import './App.css';

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
            <Route exact path="/" render={() => <Redirect to="/producers" />} />
            <Route path="/producers" component={Producers} />
            <Route path="/reports" component={Reports} />
            <Route path="/reports/projects" component={Projects} />
            <Route path="/reports/locations" component={Locations} />
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  </HashRouter>
);

export default App;
