require('./extend');

const fuirtNum = () => ({
    apple: 3,
    orange: 20
})

test('range test', () => {
    expect(100).toBeWithinRange(90, 110);
    expect(fuirtNum()).toEqual({
        apple: expect.toBeWithinRange(1, 10),
        orange: expect.not.toBeWithinRange(1, 10)
    })
});