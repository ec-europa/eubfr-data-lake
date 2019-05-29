import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import Pager from 'react-pager-component';
import ReactJson from 'react-json-view';

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
      locationsCount: 0,
      locationsEnrichedCount: 0,
    };

    this.emptyResults = this.emptyResults.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.getEnrichmentReport = this.getEnrichmentReport.bind(this);
    this.loadData = this.loadData.bind(this);
    this.setResults = this.setResults.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getEnrichmentReport();
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

  getEnrichmentReport() {
    (async () => {
      const { computedKey } = this.props;
      let pagination = 0;
      let locationsCount = 0;
      let locationsEnrichedCount = 0;

      const params = {
        index: indices.projects,
        type: 'project',
        scroll: '10m',
        q: `computed_key:"${computedKey}.ndjson"`,
        body: {
          size: 1000,
          query: {
            exists: {
              field: 'project_locations',
            },
          },
        },
      };

      // @see https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_search
      const results = await this.clients.public.search(params);

      // eslint-disable-next-line
      let { hits, _scroll_id } = results;

      while (hits && hits.hits.length) {
        pagination += hits.hits.length;
        console.log(`Compiling reports about enrichment results ...`);
        console.log(`${pagination} of ${hits.total}`);

        // eslint-disable-next-line
        hits.hits.forEach(record => {
          const locations = record._source.project_locations;

          const locationsInRecord = locations.length;
          locationsCount += locationsInRecord;

          const enrichedLocationsInRecord = locations.filter(
            location => location.enriched
          ).length;
          locationsEnrichedCount += enrichedLocationsInRecord;
        });

        // eslint-disable-next-line
        const next = await this.clients.public.scroll({
          scroll_id: _scroll_id,
          scroll: '10m',
        });

        // eslint-disable-next-line
        hits = next.hits;
        // eslint-disable-next-line
        _scroll_id = next._scroll_id;
      }

      this.setState({ locationsCount, locationsEnrichedCount });
    })();
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
      locationsCount,
      locationsEnrichedCount,
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
        <p>Records: {total}</p>
        <p>Locations: {locationsCount}</p>
        <p>Enriched locations: {locationsEnrichedCount}</p>
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
            <div key={key} className="ecl-u-d-flex ecl-u-align-items-center">
              <span
                className={
                  isEnriched
                    ? 'ecl-icon ecl-icon--data ecl-u-color-primary'
                    : 'ecl-icon ecl-icon--data'
                }
              />
              <Collapsible trigger={title} key={key}>
                <ReactJson collapsed={true} src={project.enrichmentResults} />
              </Collapsible>
            </div>
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
