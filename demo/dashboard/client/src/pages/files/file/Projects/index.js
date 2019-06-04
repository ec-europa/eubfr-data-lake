import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../../../components/Spinner';

import clients from '../../../../clientFactory';
import indices from '../../../../clientFactory/esIndices';

// The work of this utility is supposed to be gradually deprecated after EUBFR-268.
import enrichmentDecorator from '../../../../lib/enrichmentDecorator';

import Listing from './Listing';

class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      current: 1,
      enrichmentResults: [],
      isLoading: false,
      pagerLength: 0,
      projects: [],
      projectsEnriched: 0,
      total: 0,
    };

    this.emptyResults = this.emptyResults.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.loadData();
  }

  emptyResults() {
    this.setState({
      current: 1,
      enrichmentResults: [],
      isLoading: false,
      pagerLength: 0,
      projects: [],
      projectsEnriched: 0,
      total: 0,
    });
  }

  handlePageChange(newPage) {
    this.setState({ current: newPage }, this.loadData);
  }

  loadData() {
    const { computedKey } = this.props;
    this.setState({ isLoading: true }, this.setResults(computedKey));
  }

  setResults(computedKey) {
    let projectsEnriched = 0;
    const size = 10;
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
        // Take enrichmentResults directly from Elasticsearch when available.
        const enrichmentResults = enrichmentDecorator(projects);

        const { total } = data.hits;
        const pagerLength = Math.ceil(Number(total) / size);

        enrichmentResults.forEach(p => {
          if (p.enrichmentResults) {
            projectsEnriched += 1;
          }
        });

        this.setState({
          enrichmentResults,
          isLoading: false,
          pagerLength,
          projects,
          projectsEnriched,
          total,
        });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
        this.emptyResults();
      });
  }

  render() {
    const {
      current,
      enrichmentResults,
      isLoading,
      pagerLength,
      projects,
      projectsEnriched,
      total,
    } = this.state;

    if (isLoading) {
      return <Spinner />;
    }

    if (!projects || projects.length === 0) {
      return (
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          No projects found in current file.
        </h1>
      );
    }

    return (
      <Listing
        current={current}
        enrichmentResults={enrichmentResults}
        onHandlePageChange={this.handlePageChange}
        pagerLength={pagerLength}
        projectsEnriched={projectsEnriched}
        total={total}
      />
    );
  }
}

Projects.propTypes = {
  computedKey: PropTypes.string,
};

export default Projects;
