import React from 'react';

import clients from '../clientFactory';
import indices from '../clientFactory/esIndices';

import getProducersBuckets from '../lib/getProducersBuckets';

import Spinner from '../components/Spinner';

class Producers extends React.Component {
  state = {
    isLoading: true,
    producers: [],
  };

  async componentDidMount() {
    const client = clients.Create();

    try {
      const buckets = await getProducersBuckets();

      const results = await client.private.search({
        index: indices.meta,
        type: 'file',
        size: 1000, // You are here and wonder: how did you decide this number? Ambition and goals!
      });

      const filesAll = results.hits.hits;

      const producers = buckets.map(bucket => {
        const name = bucket.Name.split('-').pop();
        const files = filesAll.filter(file =>
          file._source.computed_key.includes(name)
        );
        return { name, files, bucket };
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
              const { name, files, bucket } = producer;

              return (
                <li key={key}>
                  <a
                    className="ecl-link ecl-link--external"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://${
                      bucket.Name
                    }.s3-website.eu-central-1.amazonaws.com`}
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
