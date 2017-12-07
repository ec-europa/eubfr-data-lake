import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import FilesList from './files/List';
import File from './files/File';

const Files = ({ match }) => (
  <Fragment>
    <Route exact path={`${match.url}/`} component={FilesList} />
    <Route path={`${match.url}/:id`} component={File} />
  </Fragment>
);

Files.propTypes = {
  match: PropTypes.object,
};

export default Files;
