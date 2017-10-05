import { promisify } from 'util';
import { onProjectsUpsert } from '../../src/handler';

const handler = promisify(onProjectsUpsert);

describe(`Fuction onProjectsUpsert() in "@eubfr/storage-signed-uploads"`, () => {
  test('The function expects a meta producer key in request header', () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    expect(result).resolves.toBeTruthy();
  });
});
