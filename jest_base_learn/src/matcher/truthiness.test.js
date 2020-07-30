let a = [1, 2, 3];

a.forEach(() => {
    test('if 语句为真', () => {
        expect(a.length === 3).toBeTruthy();
    })
    a.shift();
})