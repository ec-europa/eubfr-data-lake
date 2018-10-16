import React, { Component } from 'react';

// Components
import NutsCodesList from '../../components/NutsCodesList';
import Spinner from '../../components/Spinner';

import clients from '../../clientFactory';

class List extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      codes: [],
    };

    this.clients = null;
  }

  componentDidMount() {
    this.clients = clients.Create();

    this.loadCodes();
  }

  async loadCodes() {
    const results = await this.clients.public.search({
      index: 'test-projects',
      body: {
        size: 0,
        query: {
          nested: {
            path: 'project_locations',
            query: {
              bool: {
                must: {
                  exists: {
                    field: 'project_locations.nuts',
                  },
                },
              },
            },
          },
        },
        aggs: {
          locations: {
            nested: {
              path: 'project_locations',
            },
            aggs: {
              countries: {
                terms: {
                  field: 'project_locations.country_code',
                },
              },
            },
          },
        },
      },
    });

    const codes = results.aggregations.locations.countries.buckets;

    this.setState({ codes, loading: false });
  }

  render() {
    const { loading, codes } = this.state;

    if (loading) {
      return <Spinner />;
    }

    const RefreshButton = () => (
      <button
        className="ecl-button ecl-button--default"
        onClick={this.loadCodes}
      >
        Refresh
      </button>
    );

    if (codes.length === 0) {
      return (
        <div>
          <RefreshButton />
          <p className="ecl-paragraph">No results</p>
        </div>
      );
    }

    return (
      <div className="files-list">
        <div className="ecl-u-mv-s">
          <RefreshButton />
        </div>
        <NutsCodesList codes={codes} />
      </div>
    );
  }
}

export default List;
