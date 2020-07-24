function fetchData(callback) {
    callback && callback();
    return Promise.resolve({sourceFrom: '__mocks__'})
}

module.exports = fetchData;