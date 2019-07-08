import React from 'react';
import { Link } from 'react-router-dom';

const Reports = () => (
  <>
    <p className="ecl-paragraph">Types of projects:</p>
    <ul className="ecl-list">
      <li>
        <Link to="/reports/projects">Projects</Link>
      </li>
    </ul>
  </>
);

export default Reports;
