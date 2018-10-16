import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NutsCodesList = ({ codes }) => {
  console.log(codes);
  return (
    <Fragment>
      <ul>
        {codes.map((code, key) => (
          <li key={key}>
            <Link to={code.key}>
              {code.key} ({code.doc_count} documents)
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

NutsCodesList.propTypes = {
  codes: PropTypes.array,
  statuses: PropTypes.array,
};

export default NutsCodesList;
