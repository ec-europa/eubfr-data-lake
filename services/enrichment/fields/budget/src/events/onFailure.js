export const handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  callback();
};

export default handler;
