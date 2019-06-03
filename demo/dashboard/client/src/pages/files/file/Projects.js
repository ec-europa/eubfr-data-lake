import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Pager from 'react-pager-component';
import ReactJson from 'react-json-view';

import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

// The work of this utility is supposed to be gradually deprecated after EUBFR-268.
import enrichmentDecorator from '../../../lib/enrichmentDecorator';

class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      budgetItemsCount: 0,
      budgetItemsEnrichedCount: 0,
      current: 1,
      enrichmentResults: [],
      isLoading: false,
      length: 0,
      locationsCount: 0,
      locationsEnrichedCount: 0,
      projects: [],
      projectsEnriched: 0,
      total: 0,
    };

    this.emptyResults = this.emptyResults.bind(this);
    this.getEnrichmentReport = this.getEnrichmentReport.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
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
      isLoading: false,
      projects: [],
      total: 0,
    });
  }

  handlePageChange(newPage) {
    this.setState({ current: newPage }, this.loadData);
  }

  getEnrichmentReport() {
    (async () => {
      const { computedKey } = this.props;
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
        const next = await this.clients.public.scroll({
          scroll_id: _scroll_id,
          scroll: '10m',
        });

        // eslint-disable-next-line
        hits = next.hits;
        // eslint-disable-next-line
        _scroll_id = next._scroll_id;
      }

      this.setState({
        budgetItemsCount,
        budgetItemsEnrichedCount,
        locationsCount,
        locationsEnrichedCount,
      });
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
        // Take enrichmentResults directly from Elasticsearch when available.
        const enrichmentResults = enrichmentDecorator(projects);

        const { total } = data.hits;
        const length = Math.ceil(Number(total) / size);

        enrichmentResults.forEach(p => {
          if (p.enrichmentResults) {
            projectsEnriched += 1;
          }
        });

        this.setState({
          enrichmentResults,
          isLoading: false,
          length,
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

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    const {
      budgetItemsCount,
      budgetItemsEnrichedCount,
      current,
      enrichmentResults,
      isLoading,
      length,
      locationsCount,
      locationsEnrichedCount,
      projects,
      projectsEnriched,
      total,
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

    const locationsData = [
      {
        name: 'Locations without enrichment',
        value: locationsCount - locationsEnrichedCount,
      },
      {
        name: 'Locations which have been enriched',
        value: locationsEnrichedCount,
      },
    ];

    const budgetData = [
      {
        name: 'Budget items without enrichment',
        value: budgetItemsCount - budgetItemsEnrichedCount,
      },
      {
        name: 'Budget items which have been enriched',
        value: budgetItemsEnrichedCount,
      },
    ];

    return (
      <div className="ecl-container">
        <div className="ecl-row">
          <div className="ecl-col-md-4">
            <p>Overall statistics</p>
            <ul>
              <li>Records: {total}</li>
              <li>Locations: {locationsCount}</li>
              <li>Budget items: {budgetItemsCount}</li>
            </ul>
            <p>Enriched on this page: {projectsEnriched}</p>
          </div>
          <div className="ecl-col-md-8 ecl-u-d-flex ecl-u-align-items-center">
            <PieChart width={200} height={200}>
              <Pie
                labelLine={false}
                label={this.renderCustomizedLabel}
                data={locationsData}
                dataKey="value"
                nameKey="name"
                outerRadius={50}
                fill="#9F9F9F"
              >
                {locationsData.map((entry, key) => (
                  <Cell
                    key={key}
                    fill={
                      entry.name.includes('enriched') ? '#467A39' : '#9F9F9F'
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <PieChart width={200} height={200}>
              <Pie
                labelLine={false}
                label={this.renderCustomizedLabel}
                data={budgetData}
                dataKey="value"
                nameKey="name"
                outerRadius={50}
                fill="#9F9F9F"
              >
                {budgetData.map((entry, key) => (
                  <Cell
                    key={key}
                    fill={
                      entry.name.includes('enriched') ? '#467A39' : '#9F9F9F'
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <Pager
          length={length}
          current={current}
          onChange={this.handlePageChange}
        />

        {enrichmentResults.map(project => {
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
                <ReactJson
                  name="enrichmentResults"
                  displayObjectSize={false}
                  collapsed={true}
                  src={project.enrichmentResults}
                />
              </Collapsible>
            </div>
          );
        })}

        <Pager
          length={length}
          current={current}
          onChange={this.handlePageChange}
        />
      </div>
    );
  }
}

Projects.propTypes = {
  computedKey: PropTypes.string,
};

export default Projects;
