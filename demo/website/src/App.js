import React from 'react';
import ProjectsList from './components/ProjectsList';

import Header from './components/Header';
import Footer from './components/Footer';

import '@ecl/ec-preset-website/dist/styles/ecl-ec-preset-website.css';
import './App.css';

const App = () => (
  <div>
    <Header />
    <div className="ecl-container">
      <h1>EUBFR Website</h1>
      <ProjectsList />
    </div>
    <Footer />
  </div>
);

export default App;
