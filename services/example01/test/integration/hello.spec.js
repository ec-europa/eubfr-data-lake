const http = require('http');

function request(url) {
  return new Promise(resolve => {
    http.get(url, response => {
      let data = '';
      response.on('data', _data => {
        data += _data;
      });
      response.on('end', () => resolve(data));
    });
  });
}

it('works with promises', () => {
  expect.assertions(1);

  const name = 'test';

  return request(`http://localhost:4000/hello/${name}`).then(data =>
    expect(JSON.parse(data)).toEqual({ message: `Hello ${name}!` })
  );
});
