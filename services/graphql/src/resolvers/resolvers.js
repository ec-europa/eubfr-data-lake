import * as fetch from 'node-fetch';

const API = process.env.PROJECTS_API;

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getProjects: () => fetch(`${API}/projects`).then(res => res.json()),
  },
};
