import React, { Component } from 'react';
import elasticsearch from 'elasticsearch';
import Project from './Project';
import Spinner from './Spinner';

const apiEndpoint = `https://${process.env.REACT_APP_ES_PUBLIC_ENDPOINT}`;
const projectsIndex = `${process.env.REACT_APP_STAGE}-projects`;

class ProjectsList extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      projects: [],
    };

    this.loadProjects = this.loadProjects.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.setProjects = this.setProjects.bind(this);
  }

  componentDidMount() {
    this.client = new elasticsearch.Client({
      host: apiEndpoint,
      apiVersion: '6.3',
      log: 'warning',
    });

    this.loadProjects();
  }

  loadProjects() {
    this.setState({ loading: true }, () => this.getProjects());
  }

  getProjects() {
    this.client.indices
      .exists({
        index: projectsIndex,
      })
      .then(exists =>
        exists
          ? this.client
              .search({
                index: projectsIndex,
                type: 'project',
              })
              .then(data => this.setProjects(data.hits.hits))
              .catch(error => {
                this.setProjects([]);
                throw Error(error.message);
              })
          : this.setProjects([])
      )
      .catch(() => {
        this.setProjects([]);
      });
  }

  setProjects(projects) {
    this.setState({
      loading: false,
      projects,
    });
  }

  render() {
    const { loading, projects } = this.state;

    if (loading) {
      return <Spinner />;
    }

    const RefreshButton = () => (
      <button
        className="ecl-button ecl-button--default"
        onClick={this.loadProjects}
      >
        Refresh
      </button>
    );

    if (projects.length === 0) {
      return (
        <div>
          <RefreshButton />
          <p>No projects found</p>
        </div>
      );
    }

    return (
      <div>
        <RefreshButton />

        <ul className="ecl-listing ecl-u-mt-xs">
          {projects.map((project, index) => (
            <Project project={project} key={index} />
          ))}
        </ul>
      </div>
    );
  }
}

export default ProjectsList;
