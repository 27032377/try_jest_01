test('Number is not zero', () => {
    for (let a = 1; a < 3; a++) {
        for (let b = 1; b < 5; b++) {
            const sum = a + b;
            expect(sum).not.toBe(0);
        }
    }
})