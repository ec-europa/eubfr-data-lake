import React, { Component } from 'react';
import Uploader from 'react-s3-uploader';
import config from '../meta/server.json'; // eslint-disable-line import/no-unresolved

import handleErrors from '../lib/handleErrors';

const demoSignedUrl = `${config.ServiceEndpoint}/demo/signed_url`;

class FormUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageTitle: ``,
      messageBody: ``,
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
      .fetch(`${demoSignedUrl}?key=${encodeURIComponent(file.name)}`)
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
      messageTitle: 'Upload in progress',
      messageBody: `${status}: ${percent}%`,
      progress: 'info',
    });
  }

  onUploadError(status) {
    this.setState({
      messageTitle: 'Error',
      messageBody: status,
      progress: 'error',
    });
  }

  onUploadFinish() {
    this.setState({
      messageTitle: `Done!`,
      messageBody: `The file has been uploaded`,
      progress: 'success',
    });
  }

  render() {
    return (
      <div className="form-upload">
        <p className="ecl-paragraph">
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
        <p className="ecl-paragraph">
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

        <div className="ecl-file-upload ecl-u-mb-s">
          <label className="ecl-file-upload__label" htmlFor="dashboard-upload">
            <span
              className="ecl-button ecl-button--call ecl-button--block"
              role="button"
              aria-controls="dashboard-upload"
              tabIndex="0"
            >
              Upload a file
            </span>
          </label>
          <Uploader
            style={{ display: 'none' }}
            id="dashboard-upload"
            getSignedUrl={this.getSignedUrl}
            onProgress={this.onUploadProgress}
            onError={this.onUploadError}
            onFinish={this.onUploadFinish}
            signingUrlHeaders={{}}
            contentDisposition="auto"
          />
        </div>

        <div
          className={`${`ecl-u-mb-s ecl-message  ecl-message--`}${this.state
            .progress}`}
          role="alert"
        >
          <span className="ecl-u-sr-only">${this.state.progress} message</span>
          <div className="ecl-message__title">{this.state.messageTitle}</div>
          <div className="ecl-message__body ecl-u-pl-none">
            {this.state.messageBody}
          </div>
        </div>
      </div>
    );
  }
}

export default FormUpload;
