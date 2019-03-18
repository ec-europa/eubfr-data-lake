import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import JobsList from './jobs/List';
import Job from './jobs/Page';

const Jobs = ({ match }) => (
  <Fragment>
    <Route exact path={`${match.url}/`} component={JobsList} />
    <Route path={`${match.url}/:id`} component={Job} />
  </Fragment>
);

Jobs.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default Jobs;
