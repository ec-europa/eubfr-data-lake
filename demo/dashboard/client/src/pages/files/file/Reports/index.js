import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import EnrichmentReport from './Enrichment';
import DataQualityReport from './DataQuality';

import clients from '../../../../clientFactory';
import indices from '../../../../clientFactory/esIndices';

import formatQualityReport from '../../../../lib/formatQualityReport';

class Reports extends React.Component {
  constructor() {
    super();

    this.state = {
      budgetItemsCount: 0,
      budgetItemsEnrichedCount: 0,
      dataQualityReports: [],
      dataQualityReportsAreLoading: false,
      enrichmentReportsAreLoading: false,
      enrichmentReportsMessage: '',
      enrichmentResults: [],
      locationsCount: 0,
      locationsEnrichedCount: 0,
    };

    this.getDataQualityData = this.getDataQualityData.bind(this);
    this.getEnrichmentData = this.getEnrichmentData.bind(this);
    this.resetDataQualityReports = this.resetDataQualityReports.bind(this);
    this.resetEnrichmentReports = this.resetEnrichmentReports.bind(this);
    this.setDataQualityReports = this.setDataQualityReports.bind(this);
    this.setEnrichmentReports = this.setEnrichmentReports.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getDataQualityData();
    this.getEnrichmentData();
  }

  resetDataQualityReports() {
    this.setState({
      dataQualityReports: [],
      dataQualityReportsAreLoading: false,
    });
  }

  resetEnrichmentReports() {
    this.setState({
      budgetItemsCount: 0,
      budgetItemsEnrichedCount: 0,
      enrichmentReportsAreLoading: false,
      enrichmentReportsMessage: '',
      enrichmentResults: [],
      locationsCount: 0,
      locationsEnrichedCount: 0,
    });
  }

  getDataQualityData() {
    const { computedKey } = this.props;

    this.setState(
      { dataQualityReportsAreLoading: true },
      this.setDataQualityReports(computedKey)
    );
  }

  getEnrichmentData() {
    const { computedKey } = this.props;

    this.setState(
      { enrichmentReportsAreLoading: true },
      this.setEnrichmentReports(computedKey)
    );
  }

  setDataQualityReports(computedKey) {
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
                  let dataQualityReports = [];

                  if (data._source && data._source.report) {
                    dataQualityReports = formatQualityReport(
                      data._source.report
                    );
                  }

                  this.setState({
                    dataQualityReportsAreLoading: false,
                    dataQualityReports,
                  });
                })
                .catch(error => {
                  this.resetDataQualityReports();
                  throw Error(`An error occured: ${error.message}`);
                })
            : this.resetDataQualityReports()
        )
        .catch(() => {
          this.resetDataQualityReports();
        });
  }

  setEnrichmentReports(computedKey) {
    (async () => {
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

      try {
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
          enrichmentReportsAreLoading: false,
          locationsCount,
          locationsEnrichedCount,
        });
      } catch (error) {
        console.error(error);
        this.resetEnrichmentReports();
      }
    })();
  }

  render() {
    const {
      budgetItemsCount,
      budgetItemsEnrichedCount,
      dataQualityReports,
      dataQualityReportsAreLoading,
      enrichmentReportsAreLoading,
      enrichmentReportsMessage,
      locationsCount,
      locationsEnrichedCount,
    } = this.state;

    return (
      <Fragment>
        <h2>Enrichment</h2>
        <EnrichmentReport
          budgetItemsCount={budgetItemsCount}
          budgetItemsEnrichedCount={budgetItemsEnrichedCount}
          enrichmentReportsAreLoading={enrichmentReportsAreLoading}
          enrichmentReportsMessage={enrichmentReportsMessage}
          locationsCount={locationsCount}
          locationsEnrichedCount={locationsEnrichedCount}
          isLoading={enrichmentReportsAreLoading}
        />
        <h2>Data quality</h2>
        <DataQualityReport
          reports={dataQualityReports}
          isLoading={dataQualityReportsAreLoading}
        />
      </Fragment>
    );
  }
}

Reports.propTypes = {
  computedKey: PropTypes.string,
};

export default Reports;
