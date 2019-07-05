import React from 'react';

import clients from '../clientFactory';
import indices from '../clientFactory/esIndices';

import Spinner from '../components/Spinner';

class Producers extends React.Component {
  state = {
    isLoading: true,
    dashboards: [],
  };

  async componentDidMount() {
    const resource = 'producers';
    const client = clients.Create();
    const { REACT_APP_DASHBOARDS_SERVER, NODE_ENV } = process.env;

    const endpoint =
      NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : `https://${REACT_APP_DASHBOARDS_SERVER}`;

    try {
      const response = await window.fetch(`${endpoint}/${resource}`);

      const data = await response.json();
      const { producers: list } = data.data;

      const results = await client.private.search({
        index: indices.meta,
        type: 'file',
      });

      const filesAll = results.hits.hits;

      const producers = list.map(item => {
        const name = item.Name.split('-').pop();
        const files = filesAll.filter(file =>
          file._source.computed_key.includes(name)
        );
        return { name, files };
      });

      this.setState({ producers, isLoading: false });
    } catch (error) {
      console.error(`An error occured: ${error.message}`);
    }
  }

  render() {
    const { producers, isLoading } = this.state;

    return (
      <>
        <p>Available ETLs</p>
        {isLoading ? (
          <Spinner />
        ) : (
          <ul>
            {producers.map((producer, key) => {
              const { name, files } = producer;

              return (
                <li key={key}>
                  <a
                    className="ecl-link ecl-link--external"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://${name}.s3-website.eu-central-1.amazonaws.com`}
                  >
                    {name} {files.length ? `(${files.length} files)` : ''}
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
