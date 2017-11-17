import React from 'react';
import ProjectsList from './components/ProjectsList';
import elasticsearch from 'elasticsearch';

import './App.css';

const App = () => (
  <div className="App">
    <h1>EUBFR Website</h1>
    <ProjectsList elasticsearch={elasticsearch} />
  </div>
);

export default App;
