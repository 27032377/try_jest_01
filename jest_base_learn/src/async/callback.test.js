function fetchData(cb) {
    setTimeout(() => {
        cb('get it')
    }, 5000)
}

/**
 * @warning 不推荐此种回调写法
 * 默认情况下，Jest 测试一旦执行到末尾就会完成，那意味着测试将不会按预期工作
 * 一旦 fetchData 执行结束，此测试就在没有调用回调函数前结束
 */
test('async callback', () => {
    function callback(data) {
        expect(data).toBe('get it');
    }
    fetchData(callback);
});

/**
 * @desc 推荐如下写法
 * 使用单个参数调用done。Jest 会等 done 回调函数执行结束后，结束测试。
 * 若 done() 函数从未被调用，测试用例会执行失败(显示超时错误)
 * 若 expect 执行失败，它会抛出一个错误，后面的 done 不会执行
 * 如果想知道测试用例为何失败，就需要使用try...catch
 */
test('async callback', done => {
    function callback(data) {
        try {
            expect(data).toBe('get it');
            done();
        } catch (error) {
            done(error);
        }
    }
    fetchData(callback);
});