import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import Pager from 'react-pager-component';
import JsonView from 'react-json-view';

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

const Listing = ({
  budgetData,
  budgetItemsCount,
  current,
  enrichmentReportsLoading,
  enrichmentReportsMessage,
  enrichmentResults,
  locationsCount,
  locationsData,
  onHandlePageChange,
  pagerLength,
  projectsEnriched,
  total,
}) => (
  <div className="ecl-container">
    <div className="ecl-row">
      <div className="ecl-col-md-3">
        <p>Overall statistics</p>
        <ul>
          <li>Records: {total}</li>
          <li>
            Locations:{' '}
            {enrichmentReportsLoading ? 'loading ...' : locationsCount}
          </li>
          <li>
            Budget items:{' '}
            {enrichmentReportsLoading ? 'loading ...' : budgetItemsCount}
          </li>
        </ul>
        <p>Enriched on this page: {projectsEnriched}</p>
      </div>
      <div className="ecl-col-md-9">
        {!enrichmentReportsLoading ? (
          <div className="ecl-container" style={{ textAlign: 'center' }}>
            <div className="ecl-row">
              <div className="ecl-col-md-6">
                <h2>Locations</h2>
                <PieChart width={300} height={300}>
                  <Pie
                    labelLine={false}
                    label={renderCustomizedLabel}
                    data={locationsData}
                    dataKey="value"
                    nameKey="name"
                    fill="#9F9F9F"
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
                <h2>Budgetary</h2>
                <PieChart width={300} height={300}>
                  <Pie
                    labelLine={false}
                    label={renderCustomizedLabel}
                    data={budgetData}
                    dataKey="value"
                    nameKey="name"
                    fill="#9F9F9F"
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
            <p>Compiling reports about enrichment results ...</p>
            <p>{enrichmentReportsMessage}</p>
            <Spinner />
          </Fragment>
        )}
      </div>
    </div>

    <ul className="ecl-listing">
      {enrichmentResults.map((project, key) => {
        const { _source: doc } = project;
        const { title, description } = doc;

        return (
          <li className="ecl-list-item" key={key} tabIndex={key}>
            <Collapsible trigger={title}>
              <Fragment>
                <p
                  className="ecl-paragraph"
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                />
                {project.enrichmentResults
                  ? Object.keys(project.enrichmentResults).map(
                      (enrichedProperty, i) => (
                        <Fragment key={i}>
                          <h3>
                            Enrichment in <code>{enrichedProperty}</code>
                          </h3>
                          <JsonView
                            name={enrichedProperty}
                            displayObjectSize={false}
                            collapsed={true}
                            src={project.enrichmentResults[enrichedProperty]}
                          />
                        </Fragment>
                      )
                    )
                  : ''}
              </Fragment>
            </Collapsible>
          </li>
        );
      })}
    </ul>

    <Pager
      length={pagerLength}
      current={current}
      onChange={onHandlePageChange}
    />
  </div>
);

renderCustomizedLabel.propTypes = {
  cx: PropTypes.string,
  cy: PropTypes.string,
  midAngle: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  percent: PropTypes.string,
};

Listing.propTypes = {
  cx: PropTypes.string,
  cy: PropTypes.string,
  budgetData: PropTypes.array,
  budgetItemsCount: PropTypes.number,
  current: PropTypes.number,
  enrichmentReportsLoading: PropTypes.bool,
  enrichmentReportsMessage: PropTypes.string,
  enrichmentResults: PropTypes.array,
  locationsCount: PropTypes.number,
  locationsData: PropTypes.array,
  onHandlePageChange: PropTypes.func,
  pagerLength: PropTypes.number,
  projectsEnriched: PropTypes.number,
  total: PropTypes.number,
};

export default Listing;
