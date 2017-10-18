import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Uploader from 'react-s3-uploader';
import config from '../meta/server.json'; // eslint-disable-line import/no-unresolved

import handleErrors from '../lib/handleErrors';

const demoSignedUrl = config.ServiceEndpoint;

const getUrl = (computedKey, file) => {
  if (computedKey)
    return `${demoSignedUrl}/demo/update?key=${encodeURIComponent(
      computedKey
    )}`;

  return `${demoSignedUrl}/demo/signed_url?key=${encodeURIComponent(
    file.name
  )}`;
};

class FormUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ``,
      progress: 'clean',
    };

    this.getSignedUrl = this.getSignedUrl.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onUploadError = this.onUploadError.bind(this);
    this.onUploadFinish = this.onUploadFinish.bind(this);
  }

  /* eslint class-methods-use-this: "off" */
  getSignedUrl(file, callback) {
    window
      .fetch(getUrl(this.props.computedKey, file))
      .then(handleErrors)
      .then(data => data.json())
      .then(j => {
        const url = j.signedUrl;
        // Remove the additional double quote from start and end.
        // It messes with the way createCORSRequest() works internally for ReactS3Uploader
        return {
          signedUrl: url.replace(/['"]+/g, ''),
        };
      })
      .then(callback)
      .catch(callback);
  }

  onUploadProgress(percent, status) {
    this.setState({
      message: `${status}: ${percent}`,
      progress: 'progress',
    });
  }

  onUploadError(status) {
    this.setState({
      message: status,
      progress: 'error',
    });
  }

  onUploadFinish() {
    this.setState({
      message: `Done!`,
      progress: 'success',
    });
  }

  render() {
    return (
      <div className="App">
        <p>
          <strong>WARNING!</strong>
          <br />
          You are about to send data to a platform hosted outside the European
          Commission network.<br />
          The purpose of this platform is the dissemination of information
          toward third parties and citizens. All information on this platform
          should be considered as public.<br />
          Please make sure you have checked the content of the file(s) you are
          about to send and that you have all authorization to proceed.
        </p>
        <p>
          <strong>ATTENTION!</strong>
          <br />
          Vous êtes sur le point de transmettre des informations sur une
          plateforme à l{"'"}extérieur du réseau de la Commission Européenne.<br />
          Cette plateforme est utilisée pour le partage d{"'"}information vers
          des tiers et vers le public. Toute information contenue dans cette
          plateforme est considérée comme publique.<br />
          Veuillez-vous assurez que vous avez vérifié le contenu des fichiers
          que vous voulez transmettre et que vous avez l{"'"}autorisation de le
          faire.
        </p>
        <div className={`${`app-status `}${this.state.progress}`}>
          {this.state.message}
        </div>
        <Uploader
          getSignedUrl={this.getSignedUrl}
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          signingUrlHeaders={{}}
          contentDisposition="auto"
        />
      </div>
    );
  }
}

FormUpload.propTypes = {
  computedKey: PropTypes.string,
};

export default FormUpload;
