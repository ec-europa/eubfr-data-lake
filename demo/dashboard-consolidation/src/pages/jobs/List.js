import React from 'react';
import { chunk } from 'lodash';

import clients from '../../clientFactory';
import indices from '../../clientFactory/esIndices';

import Card from './Card';

class List extends React.Component {
  constructor() {
    super();

    this.state = {
      jobs: [],
    };

    this.clients = null;
    this.getJobs = this.getJobs.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getJobs();
  }

  getJobs() {
    return this.clients.public
      .search({
        index: indices.jobs,
        type: 'job',
        from: 0,
        size: 9,
      })
      .then(data => {
        const jobs = data.hits && data.hits.hits ? data.hits.hits : [];

        this.setState({ jobs });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  render() {
    const { jobs } = this.state;

    return jobs.length
      ? chunk(jobs, 3).map((group, k) => (
          <div key={k} className="ecl-row ecl-u-mt-l">
            {group.map((job, key) => (
              <Card key={key} job={job} />
            ))}
          </div>
        ))
      : 'No jobs for the moment.';
  }
}

export default List;
