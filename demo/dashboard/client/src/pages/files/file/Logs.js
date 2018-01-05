/* eslint-disable no-underscore-dangle */

import React from 'react';
import elasticsearch from 'elasticsearch';
import PropTypes from 'prop-types';
import Spinner from '../../../components/Spinner';

const logsApiEndpoint = `https://${process.env.REACT_APP_ES_LOGS_ENDPOINT}`;
const logsIndex = `${process.env.REACT_APP_STAGE}-logs`;

class Logs extends React.Component {
  constructor() {
    super();

    this.state = {
      logs: [],
      logsLoading: false,
      logsCount: 0,
    };

    this.loadLogs = this.loadLogs.bind(this);
    this.setLogs = this.setLogs.bind(this);
    this.setEmptyLogs = this.setEmptyLogs.bind(this);
  }

  componentDidMount() {
    this.logClient = elasticsearch.Client({
      host: logsApiEndpoint,
      apiVersion: '5.5',
      log: 'warning',
    });

    this.loadLogs();
  }

  // Load related logs
  loadLogs() {
    const { computedKey } = this.props;

    this.setState({ logsLoading: true }, this.setLogs(computedKey));
  }

  setLogs(computedKey) {
    return () =>
      this.logClient.indices
        .exists({
          index: logsIndex,
        })
        .then(
          exists =>
            exists
              ? this.logClient
                  .search({
                    index: logsIndex,
                    type: 'file',
                    body: {
                      query: {
                        nested: {
                          path: 'message',
                          query: {
                            match: {
                              'message.computed_key': computedKey,
                            },
                          },
                        },
                      },
                      sort: [{ time: { order: 'desc' } }],
                    },
                  })
                  .then(data => {
                    this.setState({
                      logsLoading: false,
                      logs: data.hits.hits,
                      logsCount: data.hits.total,
                    });
                  })
                  .catch(error => {
                    this.setEmptyLogs();
                    throw Error(`An error occured: ${error.message}`);
                  })
              : this.setEmptyLogs()
        )
        .catch(() => {
          this.setEmptyLogs();
        });
  }

  setEmptyLogs() {
    this.setState({
      logs: [],
      logsLoading: false,
      logsCount: 0,
    });
  }

  render() {
    const { logs, logsLoading, logsCount } = this.state;

    if (logsLoading) {
      return <Spinner />;
    }

    if (!logs || logsCount === 0) {
      return (
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          Logs not found
        </h1>
      );
    }

    return (
      <table className="ecl-table ecl-u-mt-m">
        <thead>
          <tr>
            <th>Time</th>
            <th width="15%">Severity</th>
            <th width="60%">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log._id}>
              <td>
                <time dateTime={log._source.time}>
                  {new Date(log._source.time).toLocaleString()}
                </time>
              </td>
              <td>{log._source.level}</td>
              <td>{log._source.message.status_message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Logs.propTypes = {
  computedKey: PropTypes.string,
};

export default Logs;
