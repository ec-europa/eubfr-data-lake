import React from 'react';

import clients from '../clientFactory';
import indices from '../clientFactory/esIndices';

import getProducersBuckets from '../lib/getProducersBuckets';

import Spinner from '../components/Spinner';

class Locations extends React.Component {
  state = {
    isLoading: true,
    producersSelected: [],
    producersAvailable: [],
  };

  handleInputChange = event => {
    const { producersSelected: producers } = this.state;
    const { name, checked } = event.target;

    // Add selection.
    if (checked && !producers[name]) {
      producers.push(name);
    }
    // Remove items from selection.
    else if (checked === false) {
      const index = producers.findIndex(p => p === name);
      delete producers[index];
    }

    const producersSelected = producers.filter(a => a);

    this.setState({ producersSelected });
  };

  async componentDidMount() {
    const client = clients.Create();

    try {
      const buckets = await getProducersBuckets();

      const results = await client.private.search({
        index: indices.meta,
        type: 'file',
        size: 1000,
      });

      const filesAll = results.hits.hits;

      const producersAvailable = buckets.map(bucket => {
        const name = bucket.Name.split('-').pop();
        const files = filesAll.filter(file =>
          file._source.computed_key.includes(name)
        );
        return { name, files, bucket };
      });

      this.setState({ producersAvailable, isLoading: false });
    } catch (error) {
      console.error(`An error occured: ${error.message}`);
    }
  }

  render() {
    const { producersAvailable, producersSelected, isLoading } = this.state;

    console.log(producersSelected);

    return (
      <>
        {isLoading ? (
          <Spinner />
        ) : (
          <form className="ecl-form">
            <fieldset className="ecl-fieldset">
              <legend className="ecl-form-legend ecl-form-legend--level-1">
                Select ETLs
              </legend>
            </fieldset>
            <div className="ecl-form-group producers-form">
              {producersAvailable.map((producer, key) => {
                const { name, files } = producer;
                const isChecked = producersSelected.includes(name);

                return (
                  <label className="ecl-form-label ecl-checkbox" key={key}>
                    <input
                      className="ecl-checkbox__input ecl-u-sr-only"
                      type="checkbox"
                      id={name}
                      name={name}
                      checked={isChecked}
                      onChange={this.handleInputChange}
                    />
                    <span className="ecl-checkbox__label">
                      {name} {files.length ? `(${files.length} files)` : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </form>
        )}
      </>
    );
  }
}

export default Locations;
