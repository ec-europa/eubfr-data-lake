import React, { Component } from 'react';
import FilesList from '../../components/FilesList';
import config from '../../meta/server.json'; // eslint-disable-line import/no-unresolved
import handleErrors from '../../lib/handleErrors';

const demoServer = `${config.ServiceEndpoint}/demo`;

class List extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      files: [],
    };

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

  render() {
    const { loading, files } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    const refreshButton = (
      <button
        className="ecl-button ecl-button--default"
        onClick={this.loadFiles}
      >
        Refresh
      </button>
    );

    if (files.length === 0) {
      return (
        <div>
          {refreshButton}
          <p className="ecl-paragraph">No file found</p>
        </div>
      );
    }

    return (
      <div className="files-list">
        {refreshButton}
        <FilesList files={files} />
      </div>
    );
  }
}

export default List;
