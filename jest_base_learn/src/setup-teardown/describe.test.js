let cityData = {};

function fetchCityData () {
    const data = {
        Vienna: true
    }
    return Promise.resolve(data);
}

async function initalizeCityDatabase () {
    const data = await fetchCityData();
    Object.assign(cityData, data);
}

beforeAll(() => {
    console.log('beforeAll');
    console.log(Object.assign(cityData, { beforeAll: true }));
})

beforeEach(() => {
    console.log('beforeEach');
    console.log(Object.assign(cityData, { beforeEach: true }));
})

afterEach(() => {
    console.log('afterEach');
    console.log(Object.assign(cityData, { afterEach: true }));
})

afterAll(() => {
    console.log('afterAll');
    console.log(Object.assign(cityData, { afterAll: true }));
})

const isCity = name => !!cityData[name];

test('test1 in outer', () => {
    console.log('test1 in outer');
    console.log(cityData);
    expect(true).toBeTruthy();
})

describe('scope A', () => {
    beforeEach(async () => {
        await initalizeCityDatabase();
        console.log('A - beforeEach');
        console.log(Object.assign(cityData, { ABeforeEach: true }));
    })
    test('test city', () => {
        console.log('test in A');
        expect(isCity('Vienna')).toBeTruthy();
    })
    afterEach(() => {
        console.log('A - afterEach');
        cityData = { AAfterEach: true };
        console.log(cityData);
    })
})

test('test2 in outer', () => {
    console.log('test2 in outer');
    console.log(cityData);
    expect(true).toBeTruthy();
})

describe('scope B', () => {
    beforeEach(async () => {
        await initalizeCityDatabase();
        console.log('B - beforeEach');
        console.log(Object.assign(cityData, { BBeforeEach: true }));
    })
    test('test city', () => {
        console.log('test in B');
        expect(isCity('Vienna')).toBeTruthy();
    })
    afterEach(() => {
        console.log('B - afterEach');
        cityData = { BAfterEach: true };
        console.log(cityData);
    })
})