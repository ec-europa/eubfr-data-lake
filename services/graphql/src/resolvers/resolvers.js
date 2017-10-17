import * as fetch from 'node-fetch';

// eslint-disable-next-line import/prefer-default-export
export const resolvers = {
  Query: {
    getProjects: () =>
      fetch(
        `https://v419aw81ag.execute-api.eu-central-1.amazonaws.com/chernka5/projects`
      ).then(res => res.json()),
  },
};
