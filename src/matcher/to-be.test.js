const sum = require('./to-be');

test('1 + 2 should be 3', () => {
    expect(sum(1, 2)).toBe(3);
})