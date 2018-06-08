/* eslint react/jsx-key: 0 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../../../components/Spinner';

import clients from '../../../clientFactory';
import indices from '../../../clientFactory/esIndices';

class Reports extends React.Component {
  constructor() {
    super();

    this.state = {
      report: [],
      reportsLoading: false,
    };

    this.loadReport = this.loadReport.bind(this);
    this.setReport = this.setReport.bind(this);
    this.resetReportState = this.resetReportState.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();

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
        .then(
          exists =>
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
                      // destructuring doesn't make sense here
                      // eslint-disable-next-line
                      report = data._source.report;
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
      reportsLoading: false,
      report: [],
    });
  }

  render() {
    const { report, reportsLoading } = this.state;

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

    return (
      <Fragment>
        <p>
          The report data below is based on analysis of harmonized file. If the
          number of records do not match in the end of the ingestion, this means
          that some records could have same names, titles, or any other property
          which results duplication.
        </p>
        <p>
          Please double-check the file for duplicate entries and try to update
          it via the Actions tab.
        </p>
        <table className="ecl-table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Records</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {report.map(reportItem => {
              const r = Object.keys(reportItem);
              const property = r[0];

              return (
                <Fragment>
                  <tr>
                    <td>{property}</td>
                    <td>{reportItem[property]}</td>
                    <td>{reportItem.coverage}%</td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    );
  }
}

Reports.propTypes = {
  computedKey: PropTypes.string,
};

export default Reports;
