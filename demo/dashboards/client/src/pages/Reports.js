import React from 'react';
import { Link } from 'react-router-dom';

const Reports = () => (
  <>
    <p className="ecl-paragraph">Please select a type of report to visualize</p>
    <ul className="ecl-list">
      <li>
        <Link to="/reports/projects">Projects</Link>
      </li>
      <li>
        <Link to="/reports/enrichment">Enrichment</Link>
      </li>
    </ul>
  </>
);

export default Reports;
