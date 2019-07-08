import React from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import clients from '../clientFactory';
import indices from '../clientFactory/esIndices';

import getProducersBuckets from '../lib/getProducersBuckets';

import Spinner from '../components/Spinner';

class Enrichment extends React.Component {
  state = {
    // Page
    isLoading: true,
    producersSelected: [],
    producersAvailable: [],
    messages: [],
    results: [],
  };

  getFileData = async computedKey => {
    const client = clients.Create();
    let budgetItemsCount = 0;
    let budgetItemsEnrichedCount = 0;
    let locationsCount = 0;
    let locationsEnrichedCount = 0;
    let pagination = 0;

    const params = {
      index: indices.projects,
      type: 'project',
      scroll: '10m',
      q: `computed_key:"${computedKey}.ndjson"`,
      body: {
        size: 1000,
        query: {
          match_all: {},
        },
      },
    };

    try {
      // @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_search
      const results = await client.public.search(params);

      // eslint-disable-next-line
      let { hits, _scroll_id } = results;
      const { total } = hits;

      while (hits && hits.hits.length) {
        pagination += hits.hits.length;
        const { messages } = this.state;

        messages.push(`File ${computedKey}: ${pagination} of ${total}`);

        this.setState({ messages });

        // eslint-disable-next-line
        hits.hits.forEach(record => {
          const locations = record._source.project_locations;
          const { budget } = record._source;

          // Count occurences which contain useful data about locations and budget.

          // Location is a nested document, so 1 project record can contain multiple sub-documents of a location sub-records.
          const locationsInRecord = locations.length;
          locationsCount += locationsInRecord;

          // Budget enrichment happens in total_cost and eu_contrib.
          if (budget.total_cost.value || budget.eu_contrib.value) {
            budgetItemsCount += 1;
          }

          // Count how many items have been enriched.

          // Location items are marked with a field "enriched".
          const enrichedLocationsInRecord = locations.filter(
            location => location.enriched
          ).length;
          locationsEnrichedCount += enrichedLocationsInRecord;

          // Budget items are updated in-place, state before enrichment is stored in "_original" sub-field.
          if (budget.total_cost._original) {
            budgetItemsEnrichedCount += 1;
          }
          if (budget.eu_contrib._original) {
            budgetItemsEnrichedCount += 1;
          }
        });

        // eslint-disable-next-line
        const next = await client.public.scroll({
          scroll_id: _scroll_id,
          scroll: '10m',
        });

        // eslint-disable-next-line
        hits = next.hits;
        // eslint-disable-next-line
        _scroll_id = next._scroll_id;
      }

      return {
        budgetItemsCount,
        budgetItemsEnrichedCount,
        locationsCount,
        locationsEnrichedCount,
      };
    } catch (error) {
      return console.error(error);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { producersSelected, producersAvailable } = this.state;

    Promise.all(
      producersSelected.map(async producer => {
        const info = producersAvailable.find(p => p.name === producer);
        const { files } = info;

        const data = await Promise.all(
          files.map(async file => {
            const computedKey = file._source.computed_key;
            const fileData = await this.getFileData(computedKey);
            return { computedKey, ...fileData };
          })
        );

        return { producer, data };
      })
    ).then(results => this.setState({ results }));
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
    const data = [];

    const {
      producersAvailable,
      producersSelected,
      isLoading,
      messages,
      results,
    } = this.state;

    const messagesDisplay =
      messages.length > 3
        ? messages.slice(messages.length - 3, messages.length)
        : messages;

    results.forEach(producerResults => {
      let locations = 0;
      let locationsEnriched = 0;
      let budgetItems = 0;
      let budgetItemsEnriched = 0;

      const { producer } = producerResults;
      const files = producerResults.data;

      files.forEach(file => {
        locations += file.locationsCount;
        locationsEnriched += file.locationsEnrichedCount;
        budgetItems += file.budgetItemsCount;
        budgetItemsEnriched += file.budgetItemsEnrichedCount;
      });

      data.push({
        name: producer,
        Locations: locations,
        'Locations enriched': locationsEnriched,
        'Budget items': budgetItems,
        'Budget items enriched': budgetItemsEnriched,
      });
    });

    return (
      <>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {messagesDisplay.length ? (
              <div className="ecl-message" role="alert">
                <span className="ecl-u-sr-only">Progress report</span>
                <div className="ecl-message__title">Compiling reports ...</div>
                <ul className="ecl-list ecl-message__body">
                  {messagesDisplay.map((message, key) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : (
              ''
            )}
            <form className="ecl-form" onSubmit={this.handleSubmit}>
              <fieldset className="ecl-fieldset">
                <legend className="ecl-form-legend ecl-form-legend--level-1">
                  Select ETLs
                </legend>
              </fieldset>
              <div className="ecl-form-group producers-form">
                {producersAvailable.length
                  ? producersAvailable.map((producer, key) => {
                      const { name, files } = producer;
                      const isChecked = producersSelected.includes(name);

                      return (
                        <label
                          className="ecl-form-label ecl-checkbox"
                          key={key}
                        >
                          <input
                            className="ecl-checkbox__input ecl-u-sr-only"
                            type="checkbox"
                            id={name}
                            name={name}
                            checked={isChecked}
                            onChange={this.handleInputChange}
                          />
                          <span className="ecl-checkbox__label">
                            {name}{' '}
                            {files.length ? `(${files.length} files)` : ''}
                          </span>
                        </label>
                      );
                    })
                  : 'Not ETLs available for this environment.'}
              </div>
              <button
                type="submit"
                className="ecl-button ecl-button--primary ecl-button--block ecl-u-mt-s"
                value="Visualize"
              >
                Visualize
              </button>
            </form>
            <br />
            {results.length ? (
              <ResponsiveContainer width="100%" height={600}>
                <BarChart
                  layout="vertical"
                  data={data}
                  margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis interval={0} type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Locations" stackId="a" fill="#4073AF" />
                  <Bar
                    dataKey="Locations enriched"
                    stackId="a"
                    fill="#7FA1C9"
                  />
                  <Bar dataKey="Budget items" stackId="b" fill="#FFDE39" />
                  <Bar
                    dataKey="Budget items enriched"
                    stackId="b"
                    fill="#FFE879"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              ''
            )}
          </>
        )}
      </>
    );
  }
}

export default Enrichment;
