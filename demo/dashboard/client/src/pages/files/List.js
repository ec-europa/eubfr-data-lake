import React, { Component } from 'react';
import elasticsearch from 'elasticsearch';
import FilesList from '../../components/FilesList';

import Spinner from '../../components/Spinner';

const privateApiEndpoint = `https://${process.env.ES_PRIVATE_ENDPOINT}`;
const metaIndex = `${process.env.REACT_APP_STAGE}-meta`;
const logsIndex = `${process.env.REACT_APP_STAGE}-logs`;

class List extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      files: [],
      statuses: [],
      filesCount: 0,
    };

    this.esClient = null;
    this.loadFiles = this.loadFiles.bind(this);
    this.loadStatuses = this.loadStatuses.bind(this);
  }

  componentDidMount() {
    this.esClient = elasticsearch.Client({
      host: privateApiEndpoint,
      apiVersion: '6.2',
      log: 'warning',
    });

    this.loadFiles();
  }

  loadFiles() {
    return this.setState(
      {
        loading: true,
      },
      () =>
        this.esClient
          .search({
            index: metaIndex,
            type: 'file',
            body: {
              query: {
                term: {
                  producer_id: process.env.REACT_APP_PRODUCER,
                },
              },
              aggs: {
                group_by_name: {
                  terms: { field: 'computed_key' },
                  aggs: {
                    remove_dups: {
                      top_hits: {
                        sort: [{ last_modified: { order: 'desc' } }],
                        size: 1,
                      },
                    },
                  },
                },
              },
              sort: [{ last_modified: { order: 'desc' } }],
            },
          })
          .then(data => {
            const files = [].concat(
              ...data.aggregations.group_by_name.buckets.map(
                bucket => bucket.remove_dups.hits.hits
              )
            );
            this.setState(
              {
                loading: false,
                files,
                filesCount: files.length,
              },
              this.loadStatuses
            );
          })
          .catch(error => {
            throw Error(`An error occured: ${error.message}`);
          })
    );
  }

  loadStatuses() {
    const keys = (this.state.files || [])
      .map(file => (file._source || {}).computed_key)
      .filter(file => file);

    return this.esClient
      .search({
        index: logsIndex,
        type: 'file',
        body: {
          size: 0,
          query: {
            nested: {
              path: 'message',
              query: {
                terms: {
                  'message.computed_key': keys,
                },
              },
            },
          },
          aggs: {
            logs: {
              nested: {
                path: 'message',
              },
              aggs: {
                logs_by_computed_key: {
                  terms: {
                    field: 'message.computed_key',
                  },
                  aggs: {
                    full_logs: {
                      reverse_nested: {},
                      aggs: {
                        most_recent: {
                          top_hits: {
                            size: 1,
                            sort: [
                              {
                                time: {
                                  order: 'desc',
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
      .then(data => {
        // Dangerous
        const { buckets } = data.aggregations.logs.logs_by_computed_key;
        const statuses = [];
        buckets.forEach(bucket => {
          statuses[bucket.key] =
            bucket.full_logs.most_recent.hits.hits[0]._source;
        });

        this.setState({
          statuses,
        });
      })
      .catch(error => {
        throw Error(`An error occured: ${error.message}`);
      });
  }

  render() {
    const { loading, files, statuses } = this.state;

    if (loading) {
      return <Spinner />;
    }

    const RefreshButton = () => (
      <button
        className="ecl-button ecl-button--default"
        onClick={this.loadFiles}
      >
        Refresh
      </button>
    );

    if (files.length === 0) {
      return (
        <div>
          <RefreshButton />
          <p className="ecl-paragraph">No files found</p>
        </div>
      );
    }

    return (
      <div className="files-list">
        <FilesList files={files} statuses={statuses} />
        <div className="ecl-u-mv-s">
          <RefreshButton />
        </div>
      </div>
    );
  }
}

export default List;
