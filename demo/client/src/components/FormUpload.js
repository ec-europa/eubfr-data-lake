import React, { Component } from 'react';
import ReactS3Uploader from 'react-s3-uploader';

class FormUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progressStatus: 'Ready for file uploads',
      progressStyle: 'clean',
    };

    this.onUploadStart = this.onUploadStart.bind(this);
    this.onUploadProgress = this.onUploadProgress.bind(this);
    this.onUploadError = this.onUploadError.bind(this);
    this.onUploadFinish = this.onUploadFinish.bind(this);
  }

  onUploadStart(file, next) {
    this.setState({
      progressStatus: 'Upload started ...',
      progressStyle: 'progress',
    });

    return next(file);
  }

  onUploadProgress(percent, status, file) {
    console.log(`progress .......................`);
    console.log(percent, status, file);
    this.setState({
      progressStatus: status,
      progressStyle: 'progress',
    });
  }

  onUploadError(status, file) {
    console.log(`error .......................`);
    console.log(status, file);
    this.setState({
      progressStatus: 'Error occured',
      progressStyle: 'error',
    });
  }

  onUploadFinish(signResult, file) {
    console.log(`finish .......................`);
    console.log(signResult, file);
    this.setState({
      progressStatus: 'Upload complete!',
      progressStyle: 'success',
    });
  }

  render() {
    return (
      <div className="App">
        <p>Disclaimer</p>
        <div className={`${`app-status `}${this.state.progressStyle}`}>
          {' '}
          {this.state.progressStatus}{' '}
        </div>
        <ReactS3Uploader
          server=""
          signingUrl="/storage/signed_url"
          preprocess={this.onUploadStart}
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
