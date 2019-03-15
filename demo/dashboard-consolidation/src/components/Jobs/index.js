import React from 'react';
import { chunk } from 'lodash';
import Job from '../Job';

const Jobs = ({ jobs }) =>
  chunk(jobs, 3).map(group => (
    <div className="ecl-row ecl-u-mt-l">
      {group.map((job, key) => (
        <Job key={key} job={job} />
      ))}
    </div>
  ));

export default Jobs;
