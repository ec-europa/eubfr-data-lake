import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import Spinner from '../../../../components/Spinner';

const DataQualityReport = ({ reports, isLoading }) => {
  // Structure data for visualization.
  const qualityData = reports.map(row => ({
    name: Object.keys(row)[0],
    coverage: Number(row.coverage),
  }));

  if (isLoading) {
    return (
      <Fragment>
        <p>Loading reports about quality of data ...</p>
        <Spinner />
      </Fragment>
    );
  }

  if (reports.length === 0) {
    return <p>Reports about quality of data are not available.</p>;
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
        Please double-check the file for duplicate entries and try to update it
        via the Actions tab.
      </p>

      <AreaChart
        width={800}
        height={400}
        data={qualityData}
        margin={{ top: 30, right: 0, left: 200, bottom: 30 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <YAxis type="category" dataKey="name" />
        <XAxis type="number" dataKey="coverage" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="coverage"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>

      <Collapsible trigger="COVERAGE DETAILS BY FIELD">
        <table className="ecl-table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Records</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((reportItem, i) => {
              const r = Object.keys(reportItem);
              const property = r[0];

              return (
                <Fragment key={i}>
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
      </Collapsible>
    </Fragment>
  );
};

DataQualityReport.propTypes = {
  reports: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default DataQualityReport;
