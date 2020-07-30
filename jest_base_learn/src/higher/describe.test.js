// describe.each(table)(name, fn, timeout)
describe.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3]
])('.add(%i, %i)', (a, b, expected) => {
    it(`returns ${expected}`, () => {
        expect(a + b).toBe(expected);
    })
})

// describe.each`table`(name, fn, timeout)
describe.each`
 a      | b     | expected
 ${1}   | ${2}  | ${3}
 ${1}   | ${1}  | ${2}
 ${2}   | ${1}  | ${3}
`('$a + $b', ({ a, b, expected }) => {
    it(`return ${expected}`, () => {
        expect(a + b).toBe(expected);
    })
})

// describe.only(name, fn) same as fdescribe(name, fn)
// 只运行一个描述块，执行顺讯从上到下
describe.only('just run it', () => {
    test('xx', () => {
        expect(true).toBeTruthy();
    })
})

// 会被忽略，same as describe.skip
describe('skipped', () => {
    it('oo', () => {
        expect(1 + 1).toBe(2);
    })
})