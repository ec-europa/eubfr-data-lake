import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Files from './pages/Files';
import Home from './pages/Home';
import Upload from './pages/Upload';

import './App.css';

const App = () => (
  <Router>
    <div className="App">
      <h1>BUDG dashboard</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/upload">Upload new file</Link>
        </li>
        <li>
          <Link to="/files">Files</Link>
        </li>
      </ul>
      <Route exact path="/" component={Home} />
      <Route path="/upload" component={Upload} />
      <Route path="/files" component={Files} />
    </div>
  </Router>
);

export default App;
