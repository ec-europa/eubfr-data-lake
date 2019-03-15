import React, { Fragment } from 'react';
import { HashRouter, Route, Redirect } from 'react-router-dom';

import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';

// Frequently changing, yet totally static partials related to EC branding.
import Header from './components/partials/Header';
import PageHeader from './components/partials/PageHeader';
import Footer from './components/partials/Footer';

import Main from './components/Main';
import JobPage from './components/Job/JobPage';

const App = () => (
  <HashRouter>
    <Fragment>
      <Header />
      <PageHeader />
      <Route exact path="/" render={() => <Redirect to="/jobs" />} />
      <Route path="/jobs" component={Main} />
      <Route path="/jobs/:jobId" component={JobPage} />
      <Footer />
    </Fragment>
  </HashRouter>
);

export default App;
