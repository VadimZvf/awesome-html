import parse from './create-query';

describe('parse', () => {
    test('Should create one selector query', () => {
        expect(parse('.className')).toStrictEqual([{ type: 'CLASS_ATTR', value: 'className' }]);
    });
    test('Should create multi selector query', () => {
        expect(parse('.className #foo bar')).toStrictEqual([
            { type: 'CHILD', value: { type: 'CLASS_ATTR', value: 'className' } },
            { type: 'CHILD', value: { type: 'ID_ATTR', value: 'foo' } },
            { type: 'TAG', value: 'bar' }
        ]);
    });
    test('Should validate selector', () => {
        expect(() => parse('&className')).toThrow('🤬 Ошибочка. Неизвестный селектор: "&className"');
    });
    test('Should handle empty selector', () => {
        expect(() => parse('')).toThrow('👻 Пустой селектор');
    });
});
