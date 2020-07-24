# Jest 使用指南

## 匹配器 Matchers

### 普通匹配器

- toBe

`expect()` 返回一个期望值，`.toBe()` 是匹配器。`toBe` 使用 `Object.is` 来测试精确相等。

- toEqual

如果想要检查对象的值，可以使用 `toEqual` 代替。`toEqual` 递归检查对象或数组的每个字段。

### Truthiness

> 用于区分 `undefined`、`null` 和 `false`

- `toBeNull` 只匹配 `null`
- `toBeUndefined` 只匹配 `undefined`
- `toBeDefined` 与 `toBeUndefined` 相反
- `toBeTruthy` 匹配任何 `if` 语句为真
- `toBeFalsy` 匹配任何 `if` 语句为假

### 数字

> 由于浮点数有精度丢失的问题，使用 `toBeCloseTo` 而非 `toBe` 或者 `toEqual`。

### 字符串

> `toMatch` 检查具有正则表达式的字符串。

### Arrays and iterables

> 通过 `toContain` 来检查一个数组或可迭代对象是否包含某个特定项。

### Error

> 如果需要抛出一个特定错误，调用 `toThrow`，匹配上则 `pass`，如果是非预期错误，则 `fail`。

更多匹配器详见 [Expect](https://jestjs.io/docs/zh-Hans/expect)

## 异步测试 Testing Asynchronous Code

### 回调

> 使用另一种形式的 `test`，使用单个参数调用 `done`，而不是将测试放在一个空参数的函数。`Jest` 会等 `done` 回调函数执行结束后，结束测试。

详见路径 `/src/async/callback.test.js`

### Promises、Async、Await

*一定要把整个断言作为返回值返回，不可忘了 `retrun` ,在Promise 变更为 resovle、then 有机会执行前，测试就已经被视为执行完成了。*

常见形式:

- Promise.then `return async fn().then(data => expect(data).toXX)`
- expect().resolves `return expect(async fn()).resolves.toXX`

详见路径 `/src/async/promise.test.js`

## Setup and Teardown

### 为多次测试重复设置 beforeEach afterEach

> 主要应用为多次重复设置的工作，在每个测试前执行 `beforeEach`，测试后执行 `afterEach`。支持异步。

### 一次性测试 beforeAll afterAll

> 某些情况下，只需要在文件开头做一次设置。

*`beforeEach、afterEach` 在每次测试时都会执行，`beforeAll、afterAll` 仅执行一次，所有测试执行前与所有测试执行完成后。*

执行顺序：

***beforeAll > beforeEach_1 > test1 > afterEach_1 > beforeEach_1 > test2 > afterEach_1 > afterAll***

详见路径：`/src/setup-teardown/before_after.test.js`

### 作用域 describe

> 默认情况下，`before` 和 `after` 的块可以应用到文件中的每个测试。可以通过 `describe` 块来将测试分组。当 `before` 和 `after` 的块在 `describe` 块内部时，则其只适用于该 `describe` 块内的测试。

执行顺序：

***beforeAll > beforeAll_inner_1 > beforeEach_outer_1 > beforeEach_inner_1 > test1 > afterEach_inner_1 > afterEach_outer_1 > afterAll_inner_1 > beforeAll_inner_2 > beforeEach_outer_1 > beforeEach_inner_2 > test2 > afterEach_inner_2 > afterEach_outer_1 > afterAll_inner_2 > afterAll***

详见路径：`/src/setup-teardown/describe.test.js`

### 通用建议

> 如果测试失败，第一件要检查的事就是，当仅运行这条测试时，它是否仍然失败。如果单独运行时，它不会失败，最好考虑其他测试对这个测试影像。通常可以通过修改 `beforeEach` 来修复这种问题。

## Mock Functions

### 使用 `mock` 函数

> 假设我们要测试某个函数的内部实现，我们可以使用一个 `mock` 函数，然后检查 `mock` 函数的状态来确保回调函数的如期调用。

```
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
```

### `.mock` 属性

> 所有的 `mock` 函数都有这个特殊的 `.mock` 属性，保存了关于此函数如何被调用、调用时的返回值的信息。

*mock*值：
```
{
    // calls.length 为被调用次数，值为参数
    calls: [[...arg0], [...arg1], [...argN]],
    // 实例化的值
    instances: [instance1, instance2, ...],
    // 函数执行顺序，次数
    invocationCallOrder: [1, 2, ...],
    // 函数执行结果
    results: [
        { type: 'return', value: xx },
        ...
    ]
}
```

#### instances

`fn.mock` 中的 `instances` 属性是一个数组，数组指示 `jest.fn()` mock 函数的 `this` 指向。当 mock 函数当做普通函数调用时，`this` 指向 `undefined`；当 mock 函数当做构造函数被 `new` 实例化时，`this` 指向 `mockConstructor{}`。

### Mock 的返回值

> Mock 函数可以用于在测试期间将测试值注入代码

返回值常用属性为：`mockRetrunValueOnce、mockReturnValue`

```
const myMock = jest.fn();

myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

// Mock 的返回值
test('mock call', () => {
    expect.assertions(4);
    expect(myMock()).toBe(10);
    expect(myMock()).toBe('x');
    expect(myMock()).toBeTruthy();
    expect(myMock()).toBeTruthy();
})

const filterTestFn = jest.fn();

filterTestFn.mockReturnValueOnce(true).mockReturnValue(false);

const result = [11, 12].filter(number => filterTestFn(number));

test('mock call value', () => {
    expect(result).toEqual([11]);
    expect(filterTestFn.mock.calls.length).toBe(2);
})
```

*大多数现实世界例子中，实际是在依赖的组件上配一个模拟函数并配置它，但手法是相同的。在这些情况下，尽量避免在非真正想要进行测试的任何函数内实现逻辑。*

### 改变内部实现

> 在测试功能模块时，想省略某一执行步骤，不完全按照功能模块的代码逻辑执行，如果我们去改变功能模块的源代码，那是不可取的。为此，我们可以借助 Mock 函数，改变内部函数的实现。

核心API：`jest.mock(string)`、`mockImplementation`、`mockImplementationOnce`

```
// eg.js
exports.doSth = () => {
    console.log(2 + 2)
}
```
```
// mockFn.test.js
const { doSth } = require('./eg.js');

// 自动在文件中寻找 doSth 方法并 mock
jest.mock('./eg');

// 改变函数内部实现，返回期望结果
doSth.mockImplementation(() => {
    console.log(1111);
})

test('mockFn2', () => {
    doSth(); // 1111
    expect(doSth).toHaveBeenCalled();
})
```

### 创建 `__mocks__` 文件夹，改变内部实现

## 快照 Snapshot

> 我们在开发组件的过程中，往往需要为组件创建一份默认 `Props` 配置，在组件升级迭代时，我们有可能会增加或修改默认 `Props` 的配置，这样导致我们可能会修改错误某些配置而我们没有感知到，造成修改引入bug，为了避免这种情况，我们可以借助 `Snapshot` 生成文件快照历史记录，以便在每次修改时进行修改提示，使开发者感知修改。

如果修改后的文件内容与快照不匹配，如果我们确定需要更新修改，那么我们可以通过控制台进入 `Jest` 命令模式，输入 `jest -u` 来确定更新快照。

## 定时器 Timer

其实也可以考虑使用 `aysnc` 的方式去进行测试，如果定时器设置的 `时间过于大` 的话，我们去进行等待就是不合理的了。

### Timer Mocks

> 原生的定时器函数并不是很方便测试，因为程序需要等待响应的延时。通过使用 `jest.useFakeTimers()`；来模拟定时器函数。如果需要运行多次测试，可以手动添加或者在 `beforeEach` 中添加，如果不这样做，将导致内部的定时器不被重置。

```
// timerGame.js
function timerGame(callback) {
    console.log('Ready...go!');
    setTimeout(() => {
        console.log('Time\'s up -- stop!');
        callback && callback();
    }, 1000);
}

module.exports = timerGame;
```
```
// timerGame.test.js
describe('mock useFakeTimers', () => {
    jest.useFakeTimers();

    it('waits 1 second before ending the game', () => {
        const timerGame = require('./timerGame');
        // timerGame计时器内部的回调函数并没有执行，被 mock 了
        timerGame();
        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    })
})
```

### Run All Timers & Advance Timers By Time

快进并执行所有的定时器的回调函数

```
describe('Run All Timers', () => {
    it('calls the callback after 1s', () => {
        const timerGame = require('./timerGame');
        const callback = jest.fn();

        timerGame(callback);

        // 在这个时间点，定时器的回调不应该被执行
        expect(callback).not.toBeCalled();

        // "快进"时间使得所有定时器回调被执行
        // jest.runAllTimers();
        jest.advanceTimersByTime(1000);

        // 现在回调函数执行了
        expect(callback).toBeCalled();
        expect(callback).toHaveBeenCalledTimes(1);
    })
})
```

### Run Pending Timers

> 在某些场景下，可能还需要"循环定时器"——在定时器的 callback 函数中再次设置一个新的定时器，这时候定时器一致运行下去将陷入死循环，此场景下不应该使用 `jest.runAllTimers()`，而使用 `jest.runOnlyPendingTimers()`。

*jest.clearAllTimers() 清除所有 timers*