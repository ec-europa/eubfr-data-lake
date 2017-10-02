import mapper from '../src/transform';

test(`Throws an error on empty input`, () => {
  expect(mapper).toThrow();
});
