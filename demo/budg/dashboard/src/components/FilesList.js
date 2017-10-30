import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const List = ({ files }) => (
  <table className="ecl-table">
    <thead>
      <tr>
        <th>Original name</th>
        <th>Computed key</th>
        <th>Last update</th>
        <th>Content length</th>
        <th>Status</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {files.map(file => (
        <tr key={file.computed_key}>
          <td>{file.original_key || 'unknown'}</td>
          <td>{file.computed_key}</td>
          <td>{new Date(file.last_modified).toLocaleString()}</td>
          <td>{Math.floor(file.content_length / 1024)} kB</td>
          <td>
            {file.message ? (
              <details>
                <summary>{file.status}</summary>
                <p>{file.message}</p>
              </details>
            ) : (
              file.status
            )}
          </td>
          <td>
            <Link
              to={`/files/${encodeURIComponent(file.computed_key)}`}
              className="ecl-button ecl-button--secondary"
            >
              More info<span className="ecl-icon ecl-icon--right" />
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

List.propTypes = {
  files: PropTypes.array,
};

export default List;
