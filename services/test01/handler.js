// handler.js

module.exports.hello = function(event, context, callback) {
  console.log(event); // Contains incoming request data (e.g., query params, headers and more)

  const response = {
    statusCode: 200,
    headers: {
      'x-custom-header': 'My Header Value',
    },
    body: JSON.stringify({ message: 'Hello World!' }),
  };

  callback(null, response);
};
