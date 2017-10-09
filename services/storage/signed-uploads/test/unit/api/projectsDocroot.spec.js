import { promisify } from 'util';
import projectsDocroot from '../../../src/api/projectsDocroot';

const handler = promisify(projectsDocroot);

describe(`Function projectsDocroot in "@eubfr/storage-signed-uploads"`, () => {
  test('The function is alive so that users are kindly redirected to other endpoints', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    expect(result).resolves.toBeTruthy();
  });
});
