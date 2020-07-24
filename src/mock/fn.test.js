function forEach(items, callback) {
    items.forEach(item => {
        callback(item)
    })
}

const mockCallback = jest.fn(x => 42 + x);
forEach([0, 1, 5], mockCallback);

test('mock call length', () => {
    console.log(mockCallback.mock);
    // 此函数被调用了两次
    expect(mockCallback.mock.calls.length).toBe(3);
    // 第一次调用函数时的第一个参数是 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);
    // 第二次调用函数时的第一个参数是 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);
    // 第二次调用函数的返回值的 43
    expect(mockCallback.mock.results[1].value).toBe(43);
})
