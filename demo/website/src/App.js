import React from 'react';
import ProjectsList from './components/ProjectsList';

import ProjectsList from './components/ProjectsList';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = () => (
  <div className="ecl-container">
    <Header />
    <h1>EUBFR Website</h1>
    <ProjectsList />
  </div>
);

export default App;
