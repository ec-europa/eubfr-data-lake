import React, { Component } from 'react';
import ReactS3Uploader from 'react-s3-uploader';

const demoSignedUrl = `http://localhost:4000/demo/signed_url`;

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
    fetch(demoSignedUrl)
      .then(data => data.json())
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

  onUploadFinish(signResult) {
    this.setState({
      message: signResult,
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
        <ReactS3Uploader
          server="https://foo.ecom"
          getSignedUrl={this.getSignedUrl}
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          signingUrlHeaders={{}}
          signingUrlWithCredentials={true}
          contentDisposition="auto"
        />
      </div>
    );
  }
}

export default FormUpload;
