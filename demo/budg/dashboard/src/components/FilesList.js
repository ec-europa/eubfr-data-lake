import React, { Component } from 'react';
import config from '../meta/server.json'; // eslint-disable-line import/no-unresolved

import handleErrors from '../lib/handleErrors';

const demoServer = `${config.ServiceEndpoint}/demo`;

class FilesList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      files: [],
      links: {},
    };

    this.generateLink = this.generateLink.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.loadFiles = this.loadFiles.bind(this);
  }

  componentDidMount() {
    this.loadFiles();
  }

  loadFiles() {
    this.setState({
      loading: true,
    });

    window
      .fetch(`${demoServer}/meta`)
      .then(handleErrors)
      .then(response => response.json())
      .then(data =>
        this.setState({
          loading: false,
          files: data,
        })
      )
      .catch(error => {
        console.log(`An error happened: ${error.message}`);
      });
  }

  deleteFile(key) {
    return () => {
      window
        .fetch(`${demoServer}/delete?key=${encodeURIComponent(key)}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(this.loadFiles)
        .catch(error => {
          console.log(`An error happened: ${error.message}`);
        });
    };
  }

  generateLink(key) {
    return () => {
      window
        .fetch(`${demoServer}/download?key=${encodeURIComponent(key)}`)
        .then(handleErrors)
        .then(response => response.json())
        .then(data =>
          this.setState(state => ({
            links: Object.assign(state.links, {
              [key]: data.signedUrl,
            }),
          }))
        )
        .catch(error => {
          console.log(`An error happened: ${error.message}`);
        });
    };
  }

  render() {
    const { loading, files, links } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (files.length === 0) {
      return (
        <div>
          <button onClick={this.loadFiles}>Refresh</button>
          <p>No file found</p>
        </div>
      );
    }

    return (
      <div className="files-list">
        <button onClick={this.loadFiles}>Refresh</button>
        <table>
          <thead>
            <tr>
              <th>Original name</th>
              <th>Computed key</th>
              <th>Content length</th>
              <th colSpan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file.computed_key}>
                <td>{file.original_key || 'unknown'}</td>
                <td>{file.computed_key}</td>
                <td>{Math.floor(file.content_length / 1024)} kB</td>
                <td>
                  {links[file.computed_key] ? (
                    <a href={links[file.computed_key]}>Download</a>
                  ) : (
                    <button onClick={this.generateLink(file.computed_key)}>
                      Get download link
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={this.deleteFile(file.computed_key)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default FilesList;
