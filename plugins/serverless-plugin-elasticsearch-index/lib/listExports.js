// Inspired by serverless-export-env plugin.
function listExports(sdk, exports, nextToken) {
  // eslint-disable-next-line
  exports = exports || [];
  return sdk
    .request('CloudFormation', 'listExports', { NextToken: nextToken })
    .tap(response => {
      exports.push(...response.Exports);
      if (response.NextToken) {
        // Query next page
        return listExports(sdk, exports, response.NextToken);
      }

      return response;
    })
    .return(exports);
}

module.exports = listExports;
