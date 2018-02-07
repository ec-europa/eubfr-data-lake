import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import getIcon from '../lib/getIcon';

const List = ({ files, statuses }) => (
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

        let message = 'Not parsed';
        let status = 0;

        if (
          statuses &&
          statuses[hit.computed_key] &&
          statuses[hit.computed_key].message
        ) {
          message = statuses[hit.computed_key].message.status_message;
          status = statuses[hit.computed_key].message.status_code;
        }

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
              {`${message} `}
              <span title={message} className={getIcon(status)} />
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

List.propTypes = {
  files: PropTypes.array,
  statuses: PropTypes.array,
};

export default List;
