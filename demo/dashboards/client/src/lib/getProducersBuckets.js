/**
 * Gets a list of S3 buckets which host demo dashboards and are thus producers/ETLs.
 */
const getProducers = async () => {
  const { REACT_APP_DASHBOARDS_SERVER, NODE_ENV } = process.env;

  const endpoint =
    NODE_ENV === 'development'
      ? 'http://localhost:4000'
      : `https://${REACT_APP_DASHBOARDS_SERVER}`;

  try {
    const response = await window.fetch(`${endpoint}/producers`);
    const data = await response.json();
    const { producers } = data.data;

    return producers;
  } catch (error) {
    return error;
  }
};

export default getProducers;
