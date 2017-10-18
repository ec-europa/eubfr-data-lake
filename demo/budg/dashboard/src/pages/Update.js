import React from 'react';
import PropTypes from 'prop-types';
import FormUpload from '../components/FormUpload';

const Update = ({ match }) => (
  <div>
    <h1>Update file</h1>
    <p>Computed key: {decodeURIComponent(match.params.id)}</p>
    <FormUpload computedKey={decodeURIComponent(match.params.id)} />
  </div>
);

Update.propTypes = {
  match: PropTypes.object,
};

export default Update;
