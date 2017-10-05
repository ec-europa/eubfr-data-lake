const jestPlugin = require('serverless-jest-plugin');
const mod = require('../../src/handler');

const { lambdaWrapper } = jestPlugin;
const wrapped = lambdaWrapper.wrap(mod, { handler: 'onCreate' });

describe(`Ingestion manager onCreate()`, () => {
  beforeAll(done => {
    done();
  });

  test('The function expects a correct SNS record', () =>
    wrapped
      .run({})
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => expect(e).toBe('Bad record')));
});
