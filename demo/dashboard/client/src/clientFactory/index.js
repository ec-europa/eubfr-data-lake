import elasticsearch from 'elasticsearch';

const getClients = () => {
  const privateApiEndpoint = `https://${
    process.env.REACT_APP_ES_PRIVATE_ENDPOINT
  }`;

  const publicApiEndpoint = `https://${
    process.env.REACT_APP_ES_PUBLIC_ENDPOINT
  }`;

  const privateClient = elasticsearch.Client({
    host: privateApiEndpoint,
    apiVersion: '6.3',
    log: 'warning',
  });

  const publicClient = elasticsearch.Client({
    host: publicApiEndpoint,
    apiVersion: '6.3',
    log: 'warning',
  });

  return {
    public: publicClient,
    private: privateClient,
  };
};

const clientsFactory = {
  Create() {
    return getClients();
  },
};

export default clientsFactory;
