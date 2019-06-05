import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EnrichmentReport from './Enrichment';
import DataQualityReport from './DataQuality';

import Spinner from '../../../../components/Spinner';

import clients from '../../../../clientFactory';
import indices from '../../../../clientFactory/esIndices';

import formatQualityReport from '../../../../lib/formatQualityReport';

class Reports extends React.Component {
  constructor() {
    super();

    this.state = {
      budgetItemsCount: 0,
      budgetItemsEnrichedCount: 0,
      enrichmentReportsLoading: true,
      enrichmentReportsMessage: '',
      enrichmentResults: [],
      locationsCount: 0,
      locationsEnrichedCount: 0,
      report: [],
      reportsLoading: false,
    };

    this.getEnrichmentReport = this.getEnrichmentReport.bind(this);
    this.loadReport = this.loadReport.bind(this);
    this.resetReportState = this.resetReportState.bind(this);
    this.setReport = this.setReport.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getEnrichmentReport();
    this.loadReport();
  }

  loadReport() {
    const { computedKey } = this.props;
    this.setState({ reportsLoading: true }, this.setReport(computedKey));
  }

  setReport(computedKey) {
    return () =>
      this.clients.public.indices
        .exists({
          index: indices.qualityReports,
        })
        .then(exists =>
          exists
            ? this.clients.public
                .get({
                  index: indices.qualityReports,
                  type: 'report',
                  id: `${computedKey}.ndjson`,
                })
                .then(data => {
                  let report = [];

                  if (data._source && data._source.report) {
                    report = formatQualityReport(data._source.report);
                  }

                  this.setState({ reportsLoading: false, report });
                })
                .catch(error => {
                  this.resetReportState();
                  throw Error(`An error occured: ${error.message}`);
                })
            : this.resetReportState()
        )
        .catch(() => {
          this.resetReportState();
        });
  }

  resetReportState() {
    this.setState({
      enrichmentReportsLoading: true,
      report: [],
      reportsLoading: false,
    });
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
      const { total } = hits;

      while (hits && hits.hits.length) {
        pagination += hits.hits.length;
        this.setState({
          enrichmentReportsMessage: `${pagination} of ${total}`,
        });

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
        enrichmentReportsLoading: false,
        locationsCount,
        locationsEnrichedCount,
        total,
      });
    })();
  }

  render() {
    const {
      budgetItemsCount,
      budgetItemsEnrichedCount,
      enrichmentReportsLoading,
      enrichmentReportsMessage,
      locationsCount,
      locationsEnrichedCount,
      report,
      reportsLoading,
    } = this.state;

    if (reportsLoading) {
      return <Spinner />;
    }

    if (report.length === 0) {
      return (
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          No reports yet.
        </h1>
      );
    }

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

    return (
      <Fragment>
        <h2>Enrichment</h2>
        <EnrichmentReport
          budgetData={budgetData}
          budgetItemsCount={budgetItemsCount}
          enrichmentReportsLoading={enrichmentReportsLoading}
          enrichmentReportsMessage={enrichmentReportsMessage}
          locationsCount={locationsCount}
          locationsData={locationsData}
        />
        <h2>Data quality</h2>
        <DataQualityReport report={report} />
      </Fragment>
    );
  }
}

Reports.propTypes = {
  computedKey: PropTypes.string,
};

export default Reports;
