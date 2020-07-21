const data = require('./to-equal');

test('object assignment', () => {
    expect(data).toEqual({ one: 1, two: 2 });
})