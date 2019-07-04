import React from 'react';
import handleErrors from '../lib/handleErrors';

class Producers extends React.Component {
  componentDidMount() {
    const { REACT_APP_DASHBOARDS_SERVER } = process.env;
    const endpoint = `https://${REACT_APP_DASHBOARDS_SERVER}/producers`;

    window
      .fetch(endpoint)
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  render() {
    return <div>Producers list.</div>;
  }
}

export default Producers;
