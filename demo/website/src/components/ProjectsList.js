import React, { Component } from 'react';
import elasticsearch from 'elasticsearch';
import config from '../meta/projects.json'; // eslint-disable-line

const apiEndpoint = `https://${config.ServiceEndpoint}`;

class ProjectsList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      projects: [],
    };

    this.loadProjects = this.loadProjects.bind(this);
  }

  componentDidMount() {
    this.client = new elasticsearch.Client({
      host: apiEndpoint,
      apiVersion: '5.5',
      log: 'warning',
    });

    this.loadProjects();
  }

  loadProjects() {
    this.setState(
      {
        loading: true,
      },
      () =>
        this.client
          .search({
            q: 'projects',
          })
          .then(data =>
            this.setState({
              loading: false,
              projects: data.hits.hits,
            })
          )
          .catch(error => {
            throw Error(error.message);
          })
    );
  }

  render() {
    const { loading, projects } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    if (projects.length === 0) {
      return (
        <div>
          <button onClick={this.loadProjects}>Refresh</button>
          <p>No project found</p>
        </div>
      );
    }

    return (
      <div>
        <button onClick={this.loadProjects}>Refresh</button>

        {projects.map((project, index) => (
          <details key={index}>
            <summary>{project._source.title}</summary>
            <div
              dangerouslySetInnerHTML={{
                __html: project._source.description,
              }}
            />
          </details>
        ))}
      </div>
    );
  }
}

export default ProjectsList;
