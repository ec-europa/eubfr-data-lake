import { promisify } from 'util';
import projectsUpsert from '../../../src/api/projectsUpsert';

const handler = promisify(projectsUpsert);

describe(`Function projectsUpsert in "@eubfr/storage-signed-uploads"`, () => {
  test('The function expects a meta producer key in request header', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    expect(result).resolves.toBeTruthy();
  });
});
