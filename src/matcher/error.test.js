function compileCode () {
    throw new Error('you are wrong');
}

test('wrong', () => {
    // expect(compileCode).toThrow();  // pass
    // expect(compileCode).toThrow(Error);  // pass
    // expect(compileCode).toThrow('搞错了');  // fail
    expect(compileCode).toThrow(/wrong/);  // pass
})