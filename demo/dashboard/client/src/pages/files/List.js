import React, { Component } from 'react';
import elasticsearch from 'elasticsearch';
import FilesList from '../../components/FilesList';

import Spinner from '../../components/Spinner';

const metaApiEndpoint = `https://${process.env.REACT_APP_ES_META_ENDPOINT}`;
const metaIndex = `${process.env.REACT_APP_STAGE}-meta`;

class List extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      files: [],
      filesCount: 0,
    };

    this.esClient = null;
    this.loadFiles = this.loadFiles.bind(this);
  }

  componentDidMount() {
    this.esClient = elasticsearch.Client({
      host: metaApiEndpoint,
      apiVersion: '6.0',
      log: 'warning',
    });

    this.loadFiles();
  }

  loadFiles() {
    return this.setState(
      {
        loading: true,
      },
      () =>
        this.esClient
          .search({
            index: metaIndex,
            type: 'file',
            // q: `computed_key:"${computedKey}.ndjson"`,
          })
          .then(data =>
            this.setState({
              loading: false,
              files: data.hits.hits,
              filesCount: data.hits.total,
            })
          )
          .catch(error => {
            throw Error(`An error occured: ${error.message}`);
          })
    );
  }

  render() {
    const { loading, files } = this.state;

    if (loading) {
      return <Spinner />;
    }

    const RefreshButton = () => (
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
          <RefreshButton />
          <p className="ecl-paragraph">No files found</p>
        </div>
      );
    }

    return (
      <div className="files-list">
        <FilesList files={files} />
        <div className="ecl-u-mv-s">
          <RefreshButton />
        </div>
      </div>
    );
  }
}

export default List;
