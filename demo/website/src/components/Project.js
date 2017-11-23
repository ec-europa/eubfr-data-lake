import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Project extends Component {
  render() {
    return (
      <li className="ecl-list-item">
        <a href="" className="ecl-link ecl-list-item__link">
          <div className="ecl-u-sr-only">List item</div>

          <div className="ecl-list-item__body">
            <div className="ecl-list-item__meta">
              <div className="ecl-meta">
                {this.props.project._source.related_links
                  ? this.props.project._source.related_links.map(
                      (related, index) => (
                        <span className="ecl-meta__item" key={index}>
                          {related.label}
                        </span>
                      )
                    )
                  : ''}
              </div>
            </div>

            <h3 className="ecl-list-item__title ecl-heading ecl-heading--h3">
              {this.props.project._source.title}
            </h3>

            <p
              className="ecl-list-item__detail ecl-paragraph"
              dangerouslySetInnerHTML={{
                __html: this.props.project._source.description,
              }}
            />

            <div className="ecl-list-item__action" />
          </div>
        </a>
      </li>
    );
  }
}

Project.propTypes = {
  project: PropTypes.object,
};

export default Project;
