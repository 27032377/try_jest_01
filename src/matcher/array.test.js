const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'beer'
];

test('数字对象中是否包含', () => {
    expect(shoppingList).toContain('beer');
    expect(shoppingList).toContain('abc');
});