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