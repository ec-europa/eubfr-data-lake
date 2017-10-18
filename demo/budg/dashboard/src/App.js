import React from 'react';
import FormUpload from '../src/components/FormUpload';
import FilesList from './components/FilesList';

import './App.css';

const App = () => (
  <div className="ecl-container">
    <h1 className="ecl-heading ecl-heading--h1">BUDG dashboard</h1>
    <div className="dashboard">
      <div className="dashboard__item">
        <h2 className="ecl-heading ecl-heading--h2">Upload a new file</h2>
        <FormUpload />
      </div>
      <div className="dashboard__item">
        <h2 className="ecl-heading ecl-heading--h2">Existing files</h2>
        <FilesList />
      </div>
    </div>
  </div>
);

export default App;
