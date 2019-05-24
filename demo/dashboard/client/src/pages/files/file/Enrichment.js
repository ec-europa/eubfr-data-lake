import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';

import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

import enrichmentDecorator from '../../../lib/enrichmentDecorator';

class Enrichment extends React.Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      projects: [],
      projectsTotal: 0,
    };

    this.loadData = this.loadData.bind(this);
    this.setResults = this.setResults.bind(this);
    this.emptyResults = this.emptyResults.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    this.clients = clients.Create();
    this.loadData();
  }

  loadData() {
    const { computedKey } = this.props;
    this.setState({ isLoading: true }, this.setResults(computedKey));
  }

  setResults(computedKey) {
    (async () => {
      try {
        const exists = await this.clients.public.indices.exists({
          index: indices.projects,
        });

        if (exists) {
          const data = await this.clients.public.search({
            index: indices.projects,
            type: 'project',
            q: `computed_key:"${computedKey}.ndjson"`,
            size: 200,
          });

          this.setState({
            projects: data.hits.hits,
            isLoading: false,
            projectsTotal: data.hits.total,
          });
        } else {
          this.emptyResults();
        }
      } catch (error) {
        console.error(
          'An error occured while trying to fetch information.',
          error
        );
        this.emptyResults();
      }
    })();
  }

  emptyResults() {
    this.setState({
      projects: [],
      isLoading: false,
      projectsTotal: 0,
    });
  }

  render() {
    let enrichedCount = 0;
    const { projects, isLoading, projectsTotal } = this.state;

    if (isLoading) {
      return <Spinner />;
    }
    if (!projects || projectsTotal === 0) {
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
        <p>Total number of projects: {projectsTotal}</p>
        <p>Enriched projects: {enrichedCount}</p>

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
      </Fragment>
    );
  }
}

Enrichment.propTypes = {
  computedKey: PropTypes.string,
};

export default Enrichment;
