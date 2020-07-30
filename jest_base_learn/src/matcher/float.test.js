test('两个浮点数相加', () => {
    const value = 0.1 + 0.2;
    // bad:
    // expect(value).toBe(0.3);
    // good:
    expect(value).toBeCloseTo(0.3);
});