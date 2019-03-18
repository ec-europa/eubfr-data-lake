import React from 'react';
import PropTypes from 'prop-types';

const JobPage = ({ match }) => {
  return <div>internal page {JSON.stringify(match)}</div>;
};

JobPage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default JobPage;
