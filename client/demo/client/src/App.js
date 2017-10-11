import React, { Component } from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import './App.css';

class App extends Component {
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

  onUploadStart(e) {
    console.log(`started .......................`);
    console.log(e);
    this.setState({
      progressStatus: 'Upload started ...',
      progressStyle: 'progress',
    });
  }

  onUploadProgress(e) {
    console.log(`progress .......................`);
    console.log(e);
    this.setState({
      progressStatus: 'Uploading ...',
      progressStyle: 'progress',
    });
  }

  onUploadError(e) {
    console.log(`error .......................`);
    console.log(e);
    this.setState({
      progressStatus: 'Error occured',
      progressStyle: 'error',
    });
  }

  onUploadFinish(e) {
    console.log(`finish .......................`);
    console.log(e);
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
          server="http://localhost:4000"
          signingUrl="/storage/signed_url"
          signingUrlMethod="PUT"
          preprocess={this.onUploadStart}
          onProgress={this.onUploadProgress}
          onError={this.onUploadError}
          onFinish={this.onUploadFinish}
          signingUrlHeaders={{
            'x-amz-meta-producer-key': 'EUBFRSchema.png',
          }}
          signingUrlWithCredentials={true}
          contentDisposition="auto"
        />
      </div>
    );
  }
}

export default App;
