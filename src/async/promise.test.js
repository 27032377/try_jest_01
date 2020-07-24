function fetchData () {
    return Promise.resolve('get it');
}

function fetchReject () {
    return Promise.reject('get none');
}

test('async promise', () => {
    // 切记使用 return
    // 在fetchData返回的这个Promise被resolve、then()有机会执行前，测试就已经被视为已经完成了
    // fulfilled态的Promise不会让测试失败
    return fetchData().then(data => {
        expect(data).toBe('get it');
    })
})

/**
 * @desc expect.assertions()
 * @param {number} number 验证测试期间是否调用了一定数量的断言
 * 这在测试异步代码时通常很有用，以确保实际调用了回调中的断言
 */
test('async wrong', () => {
    expect.assertions(1);
    return fetchData().then(data => {
        expect(data).toBe('get it');
    })
    // return fetchData().catch(e => expect(e).toMatch('error'));
})

test('async test', () => {
    return expect(fetchData()).resolves.toBe('get it');
})

test('async function', async () => {
    const data = await fetchData();
    expect(data).toBe('get it');
})

test('try async await function', async () => {
    expect.assertions(3);
    try {
        // await fetchData();
        throw new Error('xxx');
        // const data = await fetchData();
        // expect(data).toBe('get it');
    } catch (err) {
        expect(() => {
            throw new Error('error')
        }).toThrow('error');
        expect(err).toEqual(Error('xxx'));
        const errStr = err.toString();
        expect(errStr).toMatch('xxx');
    }
})

test('combine resolves', async () => {
    expect.assertions(1);
    await expect(fetchData()).resolves.toBe('get it');
})

test('combine rejects', async () => {
    expect.assertions(1);
    await expect(fetchReject()).rejects.toBe('get none');
})
