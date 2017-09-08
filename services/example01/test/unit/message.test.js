import getMessage from '../../src/message';

test(`getMessage('World') to return 'Hello World!'`, () => {
  expect(getMessage('World')).toBe('Hello World!');
});
