import * as fetch from 'node-fetch';

const projectsApi = process.env.PROJECTS_API;

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getProjects: () => fetch(`${projectsApi}/projects`).then(res => res.json()),
  },
};
