import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

import Spinner from '../../../../components/Spinner';

// Properties coming from http://recharts.org/en-US/api/Pie component.
const renderCustomizedLabel = ({
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

renderCustomizedLabel.propTypes = {
  cx: PropTypes.string,
  cy: PropTypes.string,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  percent: PropTypes.string,
};

const EnrichmentReport = ({
  budgetItemsCount,
  budgetItemsEnrichedCount,
  enrichmentReportsMessage,
  isLoading,
  locationsCount,
  locationsEnrichedCount,
}) => {
  // Structure data for visualization.
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
    <div className="ecl-container">
      <div className="ecl-row">
        <div className="ecl-col-md-3">
          <p>Overall statistics</p>
          <ul>
            <li>Locations: {isLoading ? 'loading ...' : locationsCount}</li>
            <li>
              Budget items: {isLoading ? 'loading ...' : budgetItemsCount}
            </li>
          </ul>
        </div>
        <div className="ecl-col-md-9">
          <p>
            Please find below the percentage of items being enriched in green
            colour.
          </p>
          {!isLoading ? (
            <div className="ecl-container" style={{ textAlign: 'center' }}>
              <div className="ecl-row">
                <div className="ecl-col-md-6">
                  <h3>Locations</h3>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={locationsData}
                      dataKey="value"
                      fill="#9F9F9F"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      nameKey="name"
                    >
                      {locationsData.map((entry, key) => (
                        <Cell
                          key={key}
                          fill={
                            entry.name.includes('enriched')
                              ? '#467A39'
                              : '#9F9F9F'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>

                <div className="ecl-col-md-6">
                  <h3>Budgetary</h3>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={budgetData}
                      dataKey="value"
                      fill="#9F9F9F"
                      label={renderCustomizedLabel}
                      labelLine={false}
                      nameKey="name"
                    >
                      {budgetData.map((entry, key) => (
                        <Cell
                          key={key}
                          fill={
                            entry.name.includes('enriched')
                              ? '#467A39'
                              : '#9F9F9F'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>
          ) : (
            <Fragment>
              <p>Compiling reports ...</p>
              <p>{enrichmentReportsMessage}</p>
              <Spinner />
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

EnrichmentReport.propTypes = {
  budgetItemsCount: PropTypes.number,
  budgetItemsEnrichedCount: PropTypes.number,
  enrichmentReportsMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  locationsCount: PropTypes.number,
  locationsEnrichedCount: PropTypes.number,
  pagerLength: PropTypes.number,
};

export default EnrichmentReport;
