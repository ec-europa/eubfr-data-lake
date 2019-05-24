import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import Pager from 'react-pager-component';

import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

import enrichmentDecorator from '../../../lib/enrichmentDecorator';

class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      current: 1,
      isLoading: false,
      length: 0,
      projects: [],
      projectsDecorated: [],
      total: 0,
      projectsEnriched: 0,
    };

    this.emptyResults = this.emptyResults.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.loadData = this.loadData.bind(this);
    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    this.clients = clients.Create();
    this.loadData();
  }

  emptyResults() {
    this.setState({
      projects: [],
      isLoading: false,
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
        const projectsDecorated = enrichmentDecorator(projects);

        const { total } = data.hits;
        const length = Math.ceil(Number(total) / size);

        projectsDecorated.forEach(p => {
          if (p.enrichmentResults) {
            projectsEnriched += 1;
          }
        });

        this.setState({
          isLoading: false,
          length,
          projects,
          projectsDecorated,
          total,
          projectsEnriched,
        });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
        this.emptyResults();
      });
  }

  render() {
    const {
      projects,
      projectsDecorated,
      projectsEnriched,
      isLoading,
      total,
      current,
      length,
    } = this.state;

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

    return (
      <Fragment>
        <p>Total: {total}</p>
        <p>Enriched on this page: {projectsEnriched}</p>

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
              {JSON.stringify(project.enrichmentResults)}
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

Projects.propTypes = {
  computedKey: PropTypes.string,
};

export default Projects;
