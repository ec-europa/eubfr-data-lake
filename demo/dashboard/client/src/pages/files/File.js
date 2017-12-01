import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import elasticsearch from 'elasticsearch';
import PropTypes from 'prop-types';
import FormUpload from '../../components/FormUpload';
import demoServer from '../../meta/server.json'; // eslint-disable-line import/no-unresolved
import projectsApi from '../../meta/projects.json'; // eslint-disable-line import/no-unresolved
import handleErrors from '../../lib/handleErrors';

import './File.css';

const demoServerEndpoint = `${demoServer.ServiceEndpoint}/demo`;
const projectsApiEndpoint = `https://${projectsApi.ServiceEndpoint}`;

class File extends React.Component {
  constructor() {
    super();

    this.state = {
      file: {}, // load file info and store it there
      fileLoading: false,
      link: '',
      linkLoading: false,
      relatedProjects: [],
      projectsLoading: false,
    };

    this.deleteFile = this.deleteFile.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
  }

  componentDidMount() {
    this.client = elasticsearch.Client({
      host: projectsApiEndpoint,
      apiVersion: '5.5',
      log: 'warning',
    });
    this.loadFile();
    this.loadProjects();
  }

  loadFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState(
      {
        fileLoading: true,
      },
      () => {
        window
          .fetch(
            `${demoServerEndpoint}/filemeta?key=${encodeURIComponent(
              computedKey
            )}`
          )
          .then(handleErrors)
          .then(response => response.json())
          .then(data =>
            this.setState({
              fileLoading: false,
              file: data[0],
            })
          )
          .catch(error => {
            console.log(`An error occured: ${error.message}`);
          });
      }
    );
  }

  // Load related Projects
  loadProjects() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    this.setState(
      {
        projectsLoading: true,
      },
      () =>
        this.client.indices
          .exists({
            index: 'projects',
          })
          .then(
            exists =>
              exists
                ? this.client
                    .search({
                      index: 'projects',
                      type: 'project',
                      q: `computed_key:"${computedKey}.ndjson"`,
                    })
                    .then(data => this.setProjects(data.hits.hits))
                    .catch(error => {
                      this.setProjects([]);
                      throw Error(`An error occured: ${error.message}`);
                    })
                : this.setProjects([])
          )
          .catch(() => {
            this.setProjects([]);
          })
    );
  }

  setProjects(relatedProjects) {
    this.setState({
      projectsLoading: false,
      relatedProjects,
    });
  }

  deleteFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    return window
      .fetch(
        `${demoServerEndpoint}/delete?key=${encodeURIComponent(computedKey)}`
      )
      .then(handleErrors)
      .then(response => response.json())
      .then(() => this.props.history.push('/files'))
      .catch(error => {
        console.log(`An error happened: ${error.message}`);
      });
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
              link: data.signedUrl,
              linkLoading: false,
            })
          )
          .catch(error => {
            console.log(`An error happened: ${error.message}`);
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
      relatedProjects,
      projectsLoading,
    } = this.state;

    const computedKey = decodeURIComponent(match.params.id);
    const className =
      file.status === 'parsed'
        ? 'ecl-icon ecl-icon--success ecl-u-color-primary'
        : 'ecl-icon ecl-icon--error ecl-u-color-error';

    return (
      <Fragment>
        <Link to="/files" className="ecl-navigation-list__link ecl-link">
          <span className="ecl-icon ecl-icon--left" />Go Back
        </Link>
        <h1>File info</h1>
        {link ? (
          <a className="ecl-link" href={link}>
            <span className="ecl-icon ecl-icon--download" />
            Download
          </a>
        ) : (
          <button
            className="ecl-button ecl-button--secondary"
            onClick={this.generateLink}
            disabled={linkLoading}
          >
            {linkLoading ? 'Loading' : 'Get download link'}
          </button>
        )}
        <button
          className="ecl-button ecl-button--secondary"
          onClick={this.deleteFile}
        >
          Delete
        </button>
        {fileLoading && <p>Updating info...</p>}
        <dl>
          <dt>Computed key</dt>
          <dd>{computedKey}</dd>
          <dt>Last update</dt>
          <dd>{new Date(file.last_modified).toLocaleString()}</dd>
          <dt>Size</dt>
          <dd>{Math.floor(file.content_length / 1024) || 0} kB</dd>
          <dt>Status</dt>
          <dd>
            <span className={className} />
            {file.message}
          </dd>
        </dl>
        <h2>Update</h2>
        <FormUpload computedKey={computedKey} text="Update this file" />
        <h2>Related projects</h2>
        {projectsLoading && <p>Loading related projects</p>}
        <p>Total: {relatedProjects.length}</p>
        <ul>
          {relatedProjects.map(project => (
            <li key={project._source.project_id}>{project._source.title}</li>
          ))}
        </ul>
      </Fragment>
    );
  }
}

File.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default File;