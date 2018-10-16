import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ListCodes from './nuts/List';

const Nuts = ({ match }) => (
  <Fragment>
    <Route exact path={`${match.url}/`} component={ListCodes} />
  </Fragment>
);

Nuts.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
};

export default Nuts;
