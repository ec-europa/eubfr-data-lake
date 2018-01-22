import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import getIcon from '../lib/getIcon';

const List = ({ files }) => (
  <table className="ecl-table">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Last update</th>
        <th>Content length</th>
        <th>Ingestion status</th>
      </tr>
    </thead>
    <tbody>
      {files.map(file => {
        const hit = file._source;
        return (
          <tr key={hit.computed_key}>
            <td>
              <Link
                to={`/files/${encodeURIComponent(hit.computed_key)}`}
                className="ecl-link"
              >
                {hit.original_key || 'unknown'}
              </Link>
            </td>
            <td>{new Date(hit.last_modified).toLocaleString()}</td>
            <td>{Math.floor(hit.content_length / 1024) || 0} kB</td>
            <td>
              {hit.message || 'Not parsed'}{' '}
              <span
                title={hit.message || 'Not parsed'}
                className={getIcon(hit.status)}
              />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

List.propTypes = {
  files: PropTypes.array,
};

export default List;
