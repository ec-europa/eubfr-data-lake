import React, { Fragment } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import Files from './pages/Files';
import Upload from './pages/Upload';

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
