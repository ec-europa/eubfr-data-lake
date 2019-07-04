import React from 'react';

import Spinner from '../components/Spinner';
import handleErrors from '../lib/handleErrors';

class Producers extends React.Component {
  state = {
    isLoading: true,
    dashboards: [],
  };

  componentDidMount() {
    const { REACT_APP_DASHBOARDS_SERVER, NODE_ENV } = process.env;
    const resource = 'producers';

    const endpoint =
      NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : `https://${REACT_APP_DASHBOARDS_SERVER}`;

    window
      .fetch(`${endpoint}/${resource}`)
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        const { dashboards } = data.data;
        this.setState({ dashboards, isLoading: false });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  render() {
    const { dashboards, isLoading } = this.state;

    return (
      <>
        <p>Available ETLs</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {dashboards.map((dashboard, key) => {
              const name = dashboard.Name;
              const producerParts = name.split('-');
              const producer = producerParts.pop();

              return (
                <li key={key}>
                  <a
                    className="ecl-link ecl-link--external"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://${name}.s3-website.eu-central-1.amazonaws.com`}
                  >
                    {producer}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  }
}

export default Producers;
