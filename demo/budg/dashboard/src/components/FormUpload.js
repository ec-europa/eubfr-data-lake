import React, { Component } from 'react';
import Uploader from 'react-s3-uploader';
import config from '../meta/server.json'; // eslint-disable-line import/no-unresolved

import handleErrors from '../lib/handleErrors';

const demoSignedUrl = `${config.ServiceEndpoint}/demo/signed_url`;

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
        <p>Disclaimer</p>
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

export default FormUpload;
