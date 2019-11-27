import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import Pager from 'react-pager-component';
import JsonView from 'react-json-view';

const Listing = ({
  current,
  enrichmentResults,
  onHandlePageChange,
  pagerLength,
  projectsEnriched,
}) => (
  <Fragment>
    <p>Enriched on this page: {projectsEnriched}</p>
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
                            collapsed={true}
                            displayObjectSize={false}
                            name={enrichedProperty}
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
  </Fragment>
);

Listing.propTypes = {
  current: PropTypes.number,
  enrichmentResults: PropTypes.array,
  onHandlePageChange: PropTypes.func,
  pagerLength: PropTypes.number,
  projects: PropTypes.array,
  projectsEnriched: PropTypes.number,
};

export default Listing;
