expect.extend({
    toBeWithinRange(received, floor, ceiling) {
        const pass = received >= floor && received <= ceiling;
        /**
         * @desc Custom Matchers API
         * @param {pass} Boolean 表示是否匹配
         * @param {message} String 提供一个没有参数的函数，在出现故障时返回错误消息。
         * 所以pass=false，message应该返回匹配正确的信息；pass=true时，返回没有匹配上的信息。
         */
        if (pass) {
            return {
                message: () => `expected ${received} not to be within range`,
                pass: true
            }
        } else {
            return {
                message: () => `expected ${received} to be within range`,
                pass: false
            }
        }
    }
})