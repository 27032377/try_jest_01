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

let cityData = {};
function fetchData(callback) {
    cityData.wuhan = true;
    callback(cityData);
}

const cityMock = jest.fn(city => {
    console.log(city.wuhan);
});

test('mock been call', () => {
    fetchData(cityMock);
    console.log(cityMock.mock);
    expect(cityMock).toHaveBeenCalled();
})
