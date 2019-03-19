import React, { Fragment } from 'react';
import Pager from 'react-pager-component';
import { chunk } from 'lodash';

import clients from '../../clientFactory';
import indices from '../../clientFactory/esIndices';

import Card from './Card';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      length: 0,
      current: 1,
      jobs: [],
    };

    this.clients = null;
    this.getJobs = this.getJobs.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getJobs();
  }

  handlePageChange(newPage) {
    this.setState({ current: newPage }, this.getJobs);
  }

  getJobs() {
    const size = 9;
    const { current } = this.state;
    const from = (Number(current) - 1) * size;

    const params = {
      index: indices.jobs,
      type: 'job',
      from,
      size,
    };

    return this.clients.public
      .search(params)
      .then(data => {
        console.log(data);
        const jobs = data.hits && data.hits.hits ? data.hits.hits : [];
        const { total } = data.hits;
        const length = Math.ceil(Number(total) / size);

        this.setState({ jobs, total, length });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  render() {
    const { jobs, current, length } = this.state;

    return jobs.length ? (
      <Fragment>
        {chunk(jobs, 3).map((group, k) => (
          <div key={k} className="ecl-row ecl-u-mt-l ecl-u-mb-l">
            {group.map((job, key) => (
              <Card key={key} job={job} />
            ))}
          </div>
        ))}
        <Pager
          length={length}
          current={current}
          onChange={this.handlePageChange}
        />
      </Fragment>
    ) : (
      'No jobs for the moment.'
    );
  }
}

export default List;
