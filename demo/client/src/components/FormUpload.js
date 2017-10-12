import React, { Component } from 'react';
import ReactS3Uploader from 'react-s3-uploader';
import aws4 from 'aws-v4-sign-small';

const apiGatewayId = `z4ub7kq0ae`;
const service = `execute-api`;
const region = `eu-central-1`;
const stage = `chernka1`;
const endpoint = `/storage/signed_url`;
const path = `/${stage}${endpoint}`;
const host = `${apiGatewayId}.${service}.${region}.amazonaws.com`;

const accessKeyId = ``;
const secretAccessKey = ``;

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

  componentDidMount() {
    const opts = {
      host,
      method: 'GET',
      path,
      headers: {
        'x-amz-meta-producer-key': 'test.csv',
      },
    };

    aws4.sign(opts, {
      accessKeyId,
      secretAccessKey,
    });

    // fetch(
    //   ``
    // )
    //   .then(console.log)
    //   .catch(console.log);
  }

  // https://z4ub7kq0ae.execute-api.eu-central-1.amazonaws.com/chernka1/storage/signed_url

  /* eslint class-methods-use-this: "off" */
  getSignedUrl(file, callback) {
    console.log(file);
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
