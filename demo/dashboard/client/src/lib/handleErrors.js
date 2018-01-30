export default response => {
  if (!response.ok) {
    return new Error(response.statusText);
  }
  return response;
};
