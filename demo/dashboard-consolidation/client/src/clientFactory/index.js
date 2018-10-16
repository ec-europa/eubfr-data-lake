import elasticsearch from 'elasticsearch';

const getClients = () => {
  const publicApiEndpoint = `https://${
    process.env.REACT_APP_ES_PUBLIC_ENDPOINT
  }`;

  const publicClient = elasticsearch.Client({
    host: publicApiEndpoint,
    apiVersion: '6.2',
    log: 'warning',
  });

  return {
    public: publicClient,
  };
};

const clientsFactory = {
  Create() {
    return getClients();
  },
};

export default clientsFactory;
