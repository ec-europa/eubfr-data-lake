import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import FilesList from './files/List';
import File from './files/File';

const Files = ({ match }) => (
  <div className="ecl-u-mv-m">
    <Route exact path={`${match.url}/`} component={FilesList} />
    <Route path={`${match.url}/:id`} component={File} />
  </div>
);

Files.propTypes = {
  match: PropTypes.object,
};

export default Files;
