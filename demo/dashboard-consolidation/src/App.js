import React from 'react';
import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';
import SiteHeader from './components/SiteHeader';
import Header from './components/Header';
import PageHeader from './components/PageHeader';
import Footer from './components/Footer';

import './App.css';

const App = () => (
  <div>
    <SiteHeader />
    <Header />
    <PageHeader />
    <div className="ecl-container">Placeholder</div>
    <Footer />
  </div>
);

export default App;
