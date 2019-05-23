import React, { Fragment } from 'react';
import { Link, NavLink, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import clients from '../../clientFactory';
import indices from '../../clientFactory/esIndices';

import handleErrors from '../../lib/handleErrors';
import getIcon from '../../lib/getIcon';

import Spinner from '../../components/Spinner';
import FormUpload from '../../components/FormUpload';

import LogsTab from './file/Logs';
import ProjectsTab from './file/Projects';
import ReportsTab from './file/Reports';
import EnrichmentTab from './file/Enrichment';

import './File.css';

const demoServerEndpoint = `https://${process.env.REACT_APP_DEMO_SERVER}/demo`;

class File extends React.Component {
  constructor() {
    super();

    this.state = {
      file: {}, // load file info and store it there
      fileLoading: false,
      link: '',
      linkLoading: false,
      projectsCount: 0,
      projectsCountLoading: true,
      status: {},
    };

    this.clients = null;
    this.deleteFile = this.deleteFile.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.loadStatus = this.loadStatus.bind(this);
    this.getProjectsCount = this.getProjectsCount.bind(this);
  }

  componentDidMount() {
    this.clients = clients.Create();
    this.loadFile();
    this.loadStatus();
    this.getProjectsCount();
  }

  getProjectsCount() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    return this.clients.public
      .count({
        index: indices.projects,
        type: 'project',
        q: `computed_key:"${computedKey}.ndjson"`,
      })
      .then(data =>
        this.setState({
          projectsCountLoading: false,
          projectsCount: data.count,
        })
      )
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  loadFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState({ fileLoading: true }, () =>
      this.clients.private
        .search({
          index: indices.meta,
          type: 'file',
          q: `computed_key:"${computedKey}"+producer_id:"${
            process.env.REACT_APP_PRODUCER
          }"`,
        })
        .then(data =>
          this.setState({
            fileLoading: false,
            file:
              data.hits &&
              data.hits.hits &&
              data.hits.hits[0] &&
              data.hits.hits[0]._source
                ? data.hits.hits[0]._source
                : null,
            // null because if (!file) later.
          })
        )
        .catch(error => {
          console.error(`An error occured: ${error.message}`);
        })
    );
  }

  loadStatus() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.clients.private
      .search({
        index: indices.logs,
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
          size: 1,
        },
      })
      .then(data => {
        this.setState({
          status: data.hits.hits[0]._source,
        });
      })
      .catch(error => {
        console.error(`An error occured: ${error.message}`);
      });
  }

  deleteFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this file?'
    );

    if (confirmDelete) {
      window
        .fetch(
          `${demoServerEndpoint}/delete?key=${encodeURIComponent(computedKey)}`
        )
        .then(handleErrors)
        .then(response => response.json())
        .then(() => this.props.history.push('/files'))
        .catch(error => {
          console.error(`An error occured: ${error.message}`);
        });
    }
  }

  generateLink() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState(
      {
        linkLoading: true,
      },
      () =>
        window
          .fetch(
            `${demoServerEndpoint}/download?key=${encodeURIComponent(
              computedKey
            )}`
          )
          .then(handleErrors)
          .then(response => response.json())
          .then(data =>
            this.setState({
              link: data.download,
              linkLoading: false,
            })
          )
          .catch(error => {
            console.error(`An error happened: ${error.message}`);
          })
    );
  }

  render() {
    const { match } = this.props;
    const {
      file,
      fileLoading,
      link,
      linkLoading,
      projectsCountLoading,
      projectsCount,
      status,
    } = this.state;

    if (fileLoading) {
      return <Spinner />;
    }

    if (!file) {
      return (
        <Fragment>
          <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
            File not found
          </h1>
          <Link to="/files" className="ecl-button ecl-button--secondary">
            <span className="ecl-icon ecl-icon--left" />
            Go Back to My Files
          </Link>
        </Fragment>
      );
    }

    const computedKey = decodeURIComponent(match.params.id);

    let message = 'Loading status...';
    let statusCode = 1;

    if (status && status.message) {
      message = status.message.status_message;
      statusCode = status.message.status_code;
    }

    return (
      <Fragment>
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          {file.original_key}
        </h1>
        <p>
          <b>Ingestions status</b>: {`${message} `}
          <span title={message} className={getIcon(statusCode)} />
        </p>
        <Link to="/files" className="ecl-button ecl-button--secondary">
          <span className="ecl-icon ecl-icon--left" />
          Go Back to My Files
        </Link>

        <div className="ecl-row ecl-u-mv-m">
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-baseline">
            <span className="ecl-u-fs-xxl">
              {projectsCountLoading ? '...' : projectsCount}
            </span>
            <span className="ecl-u-fs-l">&nbsp;projects</span>
          </div>
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-baseline">
            <span className="ecl-u-fs-xxl">
              {Math.floor(file.content_length / 1024) || 0}
            </span>{' '}
            <span className="ecl-u-fs-l">&nbsp;kB</span>
          </div>
          <div className="ecl-col-md-4 ecl-u-d-flex ecl-u-justify-content-center ecl-u-align-items-center">
            <span className="ecl-u-fs-l" title="Last update">
              {new Date(file.last_modified).toLocaleString()}
            </span>
          </div>
        </div>

        <nav className="ecl-navigation-list-wrapper">
          <h2 className="ecl-u-sr-only">Navigation Menu</h2>
          <ul className="ecl-navigation-list ecl-navigation-list--tabs">
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}`}
                exact
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Actions
              </NavLink>
            </li>
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}/projects`}
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Projects
              </NavLink>
            </li>
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}/logs`}
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Logs
              </NavLink>
            </li>
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}/enrichment`}
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Enrichment
              </NavLink>
            </li>
            <li className="ecl-navigation-list__item">
              <NavLink
                to={`${match.url}/reports`}
                className="ecl-navigation-list__link ecl-link"
                activeClassName="ecl-navigation-list__link--active"
              >
                Data quality report
              </NavLink>
            </li>
          </ul>
        </nav>

        <Route
          exact
          path={`${match.url}`}
          render={() => (
            <Fragment>
              <h3 className="ecl-heading ecl-heading--h3">Download</h3>
              {link ? (
                <a className="ecl-button ecl-button--secondary" href={link}>
                  <span className="ecl-icon ecl-icon--download" />
                  Download
                </a>
              ) : (
                <button
                  className="ecl-button ecl-button--secondary"
                  onClick={this.generateLink}
                  disabled={linkLoading}
                >
                  {linkLoading
                    ? 'Requesting download link...'
                    : 'Get download link'}
                </button>
              )}
              <h3 className="ecl-heading ecl-heading--h3">Update</h3>
              <FormUpload computedKey={computedKey} text="Select a file" />
              <h3 className="ecl-heading ecl-heading--h3">Delete</h3>
              <button
                className="ecl-button ecl-button--secondary"
                onClick={this.deleteFile}
              >
                Delete
              </button>
            </Fragment>
          )}
        />
        <Route
          path={`${match.url}/projects`}
          render={() => <ProjectsTab computedKey={computedKey} />}
        />
        <Route
          path={`${match.url}/enrichment`}
          render={() => <EnrichmentTab computedKey={computedKey} />}
        />
        <Route
          path={`${match.url}/reports`}
          render={() => <ReportsTab computedKey={computedKey} />}
        />
        <Route
          path={`${match.url}/logs`}
          render={() => <LogsTab computedKey={computedKey} />}
        />
      </Fragment>
    );
  }
}

File.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default File;
