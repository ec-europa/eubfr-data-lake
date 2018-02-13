import React from 'react';
import elasticsearch from 'elasticsearch';
import PropTypes from 'prop-types';
import Spinner from '../../../components/Spinner';

const publicApiEndpoint = `https://${process.env.REACT_APP_ES_PUBLIC_ENDPOINT}`;
const projectsIndex = `${process.env.REACT_APP_STAGE}-projects`;

class Projects extends React.Component {
  constructor() {
    super();

    this.state = {
      relatedProjects: [],
      projectsLoading: false,
      projectsCount: 0,
    };

    this.loadProjects = this.loadProjects.bind(this);
    this.setProjects = this.setProjects.bind(this);
    this.setEmptyProjects = this.setEmptyProjects.bind(this);
  }

  componentDidMount() {
    this.client = elasticsearch.Client({
      host: publicApiEndpoint,
      apiVersion: '6.0',
      log: 'warning',
    });

    this.loadProjects();
  }

  // Load related Projects
  loadProjects() {
    const { computedKey } = this.props;
    this.setState({ projectsLoading: true }, this.setProjects(computedKey));
  }

  setProjects(computedKey) {
    return () =>
      this.client.indices
        .exists({
          index: projectsIndex,
        })
        .then(
          exists =>
            exists
              ? this.client
                  .search({
                    index: projectsIndex,
                    type: 'project',
                    q: `computed_key:"${computedKey}.ndjson"`,
                  })
                  .then(data =>
                    this.setState({
                      projectsLoading: false,
                      relatedProjects: data.hits.hits,
                      projectsCount: data.hits.total,
                    })
                  )
                  .catch(error => {
                    this.setEmptyProjects();
                    throw Error(`An error occured: ${error.message}`);
                  })
              : this.setEmptyProjects()
        )
        .catch(() => {
          this.setEmptyProjects();
        });
  }

  setEmptyProjects() {
    this.setState({
      projectsLoading: false,
      relatedProjects: [],
      projectsCount: 0,
    });
  }

  render() {
    const { relatedProjects, projectsLoading, projectsCount } = this.state;

    if (projectsLoading) {
      return <Spinner />;
    }

    if (!relatedProjects || projectsCount === 0) {
      return (
        <h1 className="ecl-heading ecl-heading--h1 ecl-u-mt-none">
          No projects found
        </h1>
      );
    }

    return (
      <ul>
        {relatedProjects.map(project => (
          <li key={project._source.project_id}>{project._source.title}</li>
        ))}
      </ul>
    );
  }
}

Projects.propTypes = {
  computedKey: PropTypes.string,
};

export default Projects;
