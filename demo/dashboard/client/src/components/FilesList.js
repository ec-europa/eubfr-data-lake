import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const getIcon = status => {
  if (status === 'parsed')
    return 'ecl-icon ecl-icon--success ecl-u-color-success';
  else if (status === 'not parsed')
    return 'ecl-icon ecl-icon--warning ecl-u-color-warning';

  return 'ecl-icon ecl-icon--error ecl-u-color-error';
};

const List = ({ files }) => (
  <table className="ecl-table">
    <thead>
      <tr>
        <th>Filename</th>
        <th>Last update</th>
        <th>Content length</th>
      </tr>
    </thead>
    <tbody>
      {files.map(file => (
        <tr key={file.computed_key}>
          <td>
            <span
              title={file.message || 'Not parsed'}
              className={getIcon(file.status)}
            />
            <Link
              to={`/files/${encodeURIComponent(file.computed_key)}`}
              className="ecl-link"
            >
              {file.original_key || 'unknown'}
            </Link>
          </td>
          <td>{new Date(file.last_modified).toLocaleString()}</td>
          <td>{Math.floor(file.content_length / 1024) || 0} kB</td>
        </tr>
      ))}
    </tbody>
  </table>
);

List.propTypes = {
  files: PropTypes.array,
};

export default List;
