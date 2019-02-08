const resolvers = {
  Query: {
    ping: (root, args) => {
      console.log(root, args);
      return 'pong';
    },
  },
};

export default resolvers;
