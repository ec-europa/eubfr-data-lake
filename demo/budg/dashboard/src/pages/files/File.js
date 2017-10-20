import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormUpload from '../../components/FormUpload';
import demoServer from '../../meta/server.json'; // eslint-disable-line import/no-unresolved
import projectsApi from '../../meta/projects.json'; // eslint-disable-line import/no-unresolved
import handleErrors from '../../lib/handleErrors';

const demoServerEndpoint = `${demoServer.ServiceEndpoint}/demo`;
const projectsApiEndpoint = `${projectsApi.ServiceEndpoint}/projects`;

class File extends React.Component {
  constructor() {
    super();

    this.state = {
      file: {}, // load file info and store it there
      fileLoading: false,
      link: '',
      linkLoading: false,
      projects: [],
      projectsLoading: false,
    };

    this.deleteFile = this.deleteFile.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.loadProjects = this.loadProjects.bind(this);
  }

  componentDidMount() {
    this.loadFile();
    this.loadProjects();
  }

  loadFile() {
    this.setState({
      fileLoading: true,
    });
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    return window
      .fetch(
        `${demoServerEndpoint}/filemeta?key=${encodeURIComponent(computedKey)}`
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
        console.log(`An error happened: ${error.message}`);
      });
  }

  loadProjects() {
    this.setState({
      projectsLoading: true,
    });
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    return window
      .fetch(`${projectsApiEndpoint}/${encodeURIComponent(computedKey)}`, {
        method: 'GET',
        mode: 'cors',
      })
      .then(handleErrors)
      .then(response => response.json())
      .then(data =>
        this.setState({
          projectsLoading: false,
          projects: data,
        })
      )
      .catch(error => {
        console.log(`An error happened: ${error.message}`);
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

    this.setState({
      linkLoading: true,
    });

    return window
      .fetch(
        `${demoServerEndpoint}/download?key=${encodeURIComponent(computedKey)}`
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
      });
  }

  render() {
    const { match } = this.props;
    const {
      file,
      fileLoading,
      link,
      linkLoading,
      projects,
      projectsLoading,
    } = this.state;
    const computedKey = decodeURIComponent(match.params.id);

    return (
      <div>
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
          <dt>Size</dt>
          <dd>{Math.floor(file.content_length / 1024)} kB</dd>
        </dl>
        <h2>Update</h2>
        <FormUpload computedKey={computedKey} />
        <h2>Related projects</h2>
        {projectsLoading && <p>Loading related projects</p>}
        <p>Total: {projects.length}</p>
        <ul>
          {projects.map(project => (
            <li key={project.project_id}>{project.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}

File.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default File;
