export const handler = (event, context, callback) => {
  JSON.stringify(event);
  callback();
};

export default handler;
