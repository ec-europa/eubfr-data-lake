import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCard = ({ job }) => {
  const { _source: task, _id: id } = job;

  const hasDuplicates = task['CONTAINS DUPLICATES ?'];
  const sameComputedKey = task['SAME JSON? (computed key)'];
  const javaJob = JSON.parse(task['JAVA JOB RESULT ']);
  const { count, _id } = javaJob;

  return (
    <div className="ecl-col-sm-12 ecl-col-md-4">
      <article className="ecl-card">
        <header className="ecl-card__header">
          <div className="ecl-card__meta">Projects: {count}</div>
          <h1 className="ecl-card__title">
            <Link
              level="1"
              to={`/jobs/${encodeURIComponent(id)}`}
              className="ecl-link ecl-link--standalone"
            >
              {JSON.stringify(_id)}
            </Link>
          </h1>
        </header>
        <footer className="ecl-card__footer">
          <ul className="ecl-card__info-container">
            <li className="ecl-card__info-item">
              Has duplicates: {hasDuplicates}
            </li>
            <li className="ecl-card__info-item">
              Has same computed_key: {sameComputedKey}
            </li>
          </ul>
        </footer>
      </article>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _source: PropTypes.string,
    _id: PropTypes.string,
  }),
};

export default JobCard;
