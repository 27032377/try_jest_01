// const axios = require('axios');

function fetchData(callback) {
    // return axios.get('/abc').then(res => {
    //     callback && callback();
    //     return res;
    // })
    callback && callback();
    return Promise.resolve({
        sourceFrom: 'model'
    })
}

module.exports = fetchData;