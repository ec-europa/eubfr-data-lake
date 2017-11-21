import React, { Component } from 'react';
import config from '../meta/projects.json'; // eslint-disable-line
import Project from './Project';

const apiEndpoint = config.ServiceEndpoint;

const handleErrors = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

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
    this.loadProjects();
  }

  loadProjects() {
    this.setState({
      loading: true,
    });

    window
      .fetch(`${apiEndpoint}/projects`)
      .then(handleErrors)
      .then(response => response.json())
      .then(data => {
        this.setState({
          loading: false,
          projects: data,
        });

        return true;
      })
      .catch(error => {
        console.log(`An error happened: ${error.message}`);
      });
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
        <button
          className="ecl-button ecl-button--primary"
          onClick={this.loadProjects}
        >
          Refresh
        </button>

        <ul className="ecl-listing">
          {projects.map((project, index) => (
            <Project project={project} key={index} />
          ))}
        </ul>
      </div>
    );
  }
}

export default ProjectsList;
