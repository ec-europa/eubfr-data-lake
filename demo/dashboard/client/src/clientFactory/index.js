import elasticsearch from 'elasticsearch';

const getClients = () => {
  const {
    REACT_APP_ES_PRIVATE_ENDPOINT: privateApiEndpoint,
    REACT_APP_ES_PUBLIC_ENDPOINT: publicApiEndpoint,
  } = process.env;

  const privateClient = elasticsearch.Client({
    host: privateApiEndpoint,
    apiVersion: '6.5',
    log: 'warning',
  });

  const publicClient = elasticsearch.Client({
    host: publicApiEndpoint,
    apiVersion: '6.5',
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
