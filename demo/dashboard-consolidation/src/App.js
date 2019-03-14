import React, { Fragment } from 'react';
import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';
import SiteHeader from './components/partials/SiteHeader';
import Header from './components/partials/Header';
import PageHeader from './components/partials/PageHeader';
import Main from './components/Main';
import Footer from './components/partials/Footer';

import './App.css';

const App = () => (
  <Fragment>
    <SiteHeader />
    <Header />
    <PageHeader />
    <Main />
    <Footer />
  </Fragment>
);

export default App;
