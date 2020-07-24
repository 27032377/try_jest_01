let cityData = {};

function initial () {
    const initialData = {
        Vienna: true
    }
    return Promise.resolve(initialData);
}

async function initilaizeCityDatabase () {
    try {
        const data = await initial();
        Object.assign(cityData, data);
    } catch (err) {
        throw new Error('get city data error');
    }
}

function clearCityDatabase () {
    cityData = {};
}

beforeEach(async () => {
    console.log('beforeEach');
    await initilaizeCityDatabase();
})

afterEach(() => {
    console.log('afterEach');
    clearCityDatabase();
})

beforeAll(() => {
    console.log('beforeAll');
})

afterAll(() => {
    console.log('afterAll');
})

function isCity (name) {
    return !!cityData[name];
}

test('Vienna is a city', () => {
    console.log('test-01');
    console.log(cityData);
    expect(isCity('Vienna')).toBeTruthy();
})

test('xx is not a city', () => {
    expect(isCity('xx')).toBeFalsy();
    console.log('test-02');
    console.log(cityData);
})