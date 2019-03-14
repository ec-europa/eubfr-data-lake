import React from 'react';
import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

const App = () => (
  <div>
    <Header />
    <div className="ecl-container">
      <h1>Demo Dashboard Consolidation</h1>
    </div>
    <Footer />
  </div>
);

export default App;
