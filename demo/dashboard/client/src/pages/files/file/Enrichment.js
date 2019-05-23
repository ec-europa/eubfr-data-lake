import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

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

    return (
      <Fragment>
        <p>Total number of projects: {projectsTotal}</p>
        {console.log(projects)}

        <ul className="ecl-list--unstyled">
          {projects.map(project => (
            <li className="ecl-list-item" key={project._source.project_id}>
              <div className="ecl-field ecl-u-pa-xs">
                <div className="ecl-field__label">ID</div>
                <div className="ecl-field__body">{project._id}</div>
              </div>
              <div className="ecl-field ecl-u-pa-xs">
                <div className="ecl-field__label">Title</div>
                <div className="ecl-field__body">{project._source.title}</div>
              </div>
              <div className="ecl-field">
                <div className="ecl-field__label">EU Contribution:</div>
                <div className="ecl-field__body">
                  {JSON.stringify(project._source.budget.eu_contrib)}
                </div>
              </div>
              <div className="ecl-field">
                <div className="ecl-field__label">Total:</div>
                <div className="ecl-field__body">
                  {JSON.stringify(project._source.budget.total_cost)}
                </div>
              </div>
              <div className="ecl-field">
                <div className="ecl-field__label">Locations:</div>
                <div className="ecl-field__body">
                  {JSON.stringify(project._source.project_locations)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

Enrichment.propTypes = {
  computedKey: PropTypes.string,
};

export default Enrichment;
