const { generateProps } = require('./generateProps');

it('Snapshot快照测试', () => {
    expect(generateProps()).toMatchSnapshot();
})