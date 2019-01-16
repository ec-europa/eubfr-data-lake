/**
 * Sends feedback about a given error to both front-end client apps and code using the helper.
 *
 * @param {Object} inputConfig
 *  Input configuration object consisted of the following:
 *   - `messanger`: object containing a client instance of `@eubfr/logger-messenger/src/lib/MessengerFactory`.
 *   - `key`: string containing the S3 file name key to report an error about.
 *   - `statusCode`: integer containing status code from `@eubfr/logger-messenger/src/lib/status`.
 *
 * @param {Object} errorConfig
 *  Error configuration object consisted of the following:
 *   - `error`: object containing the error.
 *   - `callback`: function communicating the error, usually the `reject` from a `Promise`.
 */
const handleError = async (
  { messenger, key, statusCode },
  { error, callback }
) => {
  await messenger.send({
    message: {
      computed_key: key,
      status_message: error.message,
      status_code: statusCode,
    },
    to: ['logs'],
  });

  return callback(error);
};

export default handleError;
