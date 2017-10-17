import React from 'react';
import FormUpload from '../src/components/FormUpload';
import FilesList from './components/FilesList';

import './App.css';

const App = () => (
  <div className="App">
    <h1>BUDG dashboard</h1>
    <h2>Upload a new file</h2>
    <FormUpload />
    <h2>Existing files</h2>
    <FilesList />
  </div>
);

export default App;
