// import axios from 'axios';
const axios = require('axios');

function fetchData() {
    return axios.get('https://jsonplaceholder.typicode.com/users')
}

// fetchData().then(data => {
//     console.log(data);
// })

jest.mock('axios');

test('trans the response', async () => {
    // expect.assertions(1);
    const response = {
        success: true,
        size: 'bigger'
    }
    // 改变了 axios.get 函数内部实现
    await axios.get.mockResolvedValue(response);
    return fetchData().then(data => expect(data).toEqual(response));
})

const mockFn1 = jest.fn(cb => cb(null, true));
mockFn1((err, val) => console.log(val));

test('mockFn1', () => {
    expect(mockFn1).toHaveBeenCalled();
})

const { doSth } = require('./eg.js');

// 自动在文件中寻找 doSth 方法并 mock
jest.mock('./eg');
doSth.mockImplementation(() => {
    console.log(1111);
})
test('mockFn2', () => {
    doSth(); // 1111
    expect(doSth).toHaveBeenCalled();
})

// complex
const mockFn3 = jest.fn(() => {
    console.log('default');
})
    .mockImplementationOnce(cb => cb(null, '1st'))
    .mockImplementationOnce(cb => cb(null, '2nd'));

mockFn3((err, val) => console.log(val));
mockFn3((err, val) => console.log(val));
mockFn3((err, val) => console.log(val));

it('mockFn3', () => {
    expect(mockFn3).toHaveBeenCalledTimes(3);
})

// .mockReturnThis 返回 this，链式调用 chain
const myObj = {
    myMethod: jest.fn().mockReturnThis()
}
// is the same as
const otherObj = {
    myMeTHod: jest.fn(function() {
        return this;
    })
}