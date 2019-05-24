import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import Pager from 'react-pager-component';

import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

import enrichmentDecorator from '../../../lib/enrichmentDecorator';

class Enrichment extends React.Component {
  constructor() {
    super();

    this.state = {
      total: 0,
      length: 0,
      current: 1,
      isLoading: false,
      projects: [],
    };

    this.loadData = this.loadData.bind(this);
    this.setResults = this.setResults.bind(this);
    this.emptyResults = this.emptyResults.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    this.clients = clients.Create();
    this.loadData();
  }

  handlePageChange(newPage) {
    this.setState({ current: newPage }, this.loadData);
  }

  loadData() {
    const { computedKey } = this.props;
    this.setState({ isLoading: true }, this.setResults(computedKey));
  }

  setResults(computedKey) {
    const size = 9;
    const { current } = this.state;
    const from = (Number(current) - 1) * size;

    const params = {
      index: indices.projects,
      type: 'project',
      q: `computed_key:"${computedKey}.ndjson"`,
      from,
      size,
    };

    this.clients.public
      .search(params)
      .then(data => {
        const projects = data.hits && data.hits.hits ? data.hits.hits : [];
        const { total } = data.hits;
        const length = Math.ceil(Number(total) / size);

        this.setState({
          projects,
          isLoading: false,
          total,
          length,
        });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
        this.emptyResults();
      });
  }

  emptyResults() {
    this.setState({
      projects: [],
      isLoading: false,
      total: 0,
    });
  }

  render() {
    let enrichedCount = 0;
    const { projects, isLoading, total, current, length } = this.state;

    if (isLoading) {
      return <Spinner />;
    }
    if (!projects || total === 0) {
      return (
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          No projects found in current file.
        </h1>
      );
    }

    const projectsDecorated = enrichmentDecorator(projects);
    projectsDecorated.forEach(p => {
      if (p.enrichmentResults) {
        enrichedCount += 1;
      }
    });

    return (
      <Fragment>
        <p>Total number of projects: {total}</p>
        <p>Number of enriched projects on this page: {enrichedCount}</p>

        <Pager
          length={length}
          current={current}
          onChange={this.handlePageChange}
        />

        {projectsDecorated.map(project => {
          const { _id: key, _source: doc } = project;
          const { title } = doc;
          const isEnriched = project.enrichmentResults
            ? ' (has been enriched)'
            : '';

          return (
            <Collapsible trigger={title + isEnriched} key={key}>
              {JSON.stringify(project.enrichmentResults, null, 2)}
            </Collapsible>
          );
        })}

        <Pager
          length={length}
          current={current}
          onChange={this.handlePageChange}
        />
      </Fragment>
    );
  }
}

Enrichment.propTypes = {
  computedKey: PropTypes.string,
};

export default Enrichment;
