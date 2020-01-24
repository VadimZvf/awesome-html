import { parse } from './create-query';

describe('parse', () => {
    test('Should create one selector query', () => {
        expect(parse('.className')).toStrictEqual([{ type: 'attribute', name: 'class', value: 'className' }]);
    });
    test('Should create multi selector query', () => {
        expect(parse('.className #foo bar')).toStrictEqual([
            { type: 'attribute', name: 'class', value: 'className' },
            { type: 'attribute', name: 'id', value: 'foo' },
            { type: 'tag', name: null, value: 'bar' }
        ]);
    });
    test('Should validate selector', () => {
        expect(() => parse('&className')).toThrow('🤬 Ошибочка. Неизвестный селектор: "&"');
    });
});
