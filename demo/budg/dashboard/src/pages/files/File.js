import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormUpload from '../../components/FormUpload';
import config from '../../meta/server.json'; // eslint-disable-line import/no-unresolved
import handleErrors from '../../lib/handleErrors';

const demoServer = `${config.ServiceEndpoint}/demo`;

class File extends React.Component {
  constructor() {
    super();

    this.state = {
      link: '',
      linkLoading: false,
    };

    this.deleteFile = this.deleteFile.bind(this);
    this.generateLink = this.generateLink.bind(this);
  }

  deleteFile() {
    const { match } = this.props;
    const computedKey = decodeURIComponent(match.params.id);

    return window
      .fetch(`${demoServer}/delete?key=${encodeURIComponent(computedKey)}`)
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
      .fetch(`${demoServer}/download?key=${encodeURIComponent(computedKey)}`)
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
    const { link, linkLoading } = this.state;
    const computedKey = decodeURIComponent(match.params.id);

    return (
      <div>
        <Link to="/files" className="ecl-navigation-list__link ecl-link">
          <span className="ecl-icon ecl-icon--left" />Go Back
        </Link>
        <h1>File info</h1>
        <p>Computed key: {computedKey}</p>
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
        <hr />
        <h2>File</h2>
        <FormUpload computedKey={computedKey} />
      </div>
    );
  }
}

File.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
};

export default File;
