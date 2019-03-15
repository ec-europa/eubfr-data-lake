import React from 'react';
import Jobs from '../Jobs';

import clients from '../../clientFactory';
import indices from '../../clientFactory/esIndices';

class Main extends React.Component {
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
    return (
      <main className="ecl-u-pv-xl">
        <div className="ecl-container">
          {this.state.jobs.length ? (
            <Jobs jobs={this.state.jobs} />
          ) : (
            'There are no jobs to process at the moment.'
          )}
        </div>
      </main>
    );
  }
}

export default Main;
