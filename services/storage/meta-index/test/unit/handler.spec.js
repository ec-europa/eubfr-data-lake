import { lambdaWrapper } from 'serverless-jest-plugin';
import * as mod from '../../src/handler';

const wrapped = lambdaWrapper.wrap(mod, { handler: 'onObjectCreated' });

describe(`Fuction onObjectCreated() in "@eubfr/storage-meta-index"`, () => {
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
