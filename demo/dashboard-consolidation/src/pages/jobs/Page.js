import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Highlight from 'react-highlight';
import 'highlight.js/styles/a11y-light.css';

import clients from '../../clientFactory';
import indices from '../../clientFactory/esIndices';

class Page extends React.Component {
  constructor() {
    super();

    this.state = {
      job: {},
    };

    this.clients = null;
    this.getJob = this.getJob.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.getJob();
  }

  getJob() {
    const { match } = this.props;
    const { id } = match.params;

    return this.clients.public
      .get({
        index: indices.jobs,
        type: 'job',
        id,
      })
      .then(data => {
        const job = data._source ? data._source : {};

        this.setState({ job });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  render() {
    const { job } = this.state;
    console.log(job);
    const hasDuplicates = job['CONTAINS DUPLICATES ?'] || '';
    const sameComputedKey = job['SAME JSON? (computed key)'] || '';
    const javaJob = job['JAVA JOB RESULT '] ? job['JAVA JOB RESULT '] : '';
    const kibanaLinks = job['KIBANA LINKS TO SAVED SEARCHES']
      ? job['KIBANA LINKS TO SAVED SEARCHES']
      : '';

    return job['JAVA JOB RESULT '] ? (
      <Fragment>
        <div>Has duplicates: {hasDuplicates}</div>
        <div>Same JSON (computed key): {sameComputedKey}</div>
        <br />
        <div>Result to evaluate:</div>
        <Highlight>{javaJob}</Highlight>
        <div>Kibana links:</div>
        <Highlight>{kibanaLinks}</Highlight>
      </Fragment>
    ) : (
      'Loading ...'
    );
  }
}

Page.propTypes = {
  match: PropTypes.object,
};

export default Page;
