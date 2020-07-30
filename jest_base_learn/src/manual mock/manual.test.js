jest.mock('./fetchData');
const fetchData = require('./fetchData');

describe('manual mock test', () => {
    const mock = jest.fn(() => console.log('mock enter'));
    it('what is the sourceFrom ?', async () => {
        expect.assertions(1);
        try {
            const { sourceFrom } = await fetchData(mock);
            console.log(`sourceFrom is: ${sourceFrom}`);
            expect(sourceFrom).toEqual('__mocks__');
        } catch (err) {
            console.info(err);
        }
    })
})