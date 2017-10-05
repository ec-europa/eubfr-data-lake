import { lambdaWrapper } from 'serverless-jest-plugin';
import * as mod from '../../src/handler';

const wrapped = lambdaWrapper.wrap(mod, { handler: 'onProjectsUpsert' });

describe(`Fuction onProjectsUpsert() in "@eubfr/storage-signed-uploads"`, () => {
  beforeAll(done => {
    done();
  });

  test('The function expects a meta producer key in request header', () =>
    wrapped
      .run({})
      .then(response => {
        // Either a null, error or a rejected promise because of bad input.
        expect(response).toBeFalsy();
      })
      .catch(e => {
        expect(e).toThrow();
      }));
});
