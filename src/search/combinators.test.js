import combinations from './combinators';

describe('CHILD', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.CHILD.cutOff({
                sourceSelector: ' .someSecondClass',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [{ type: 'CHILD', value: { type: 'CLASS_ATTR', value: 'firstClass' } }]
        });

        expect(
            combinations.CHILD.cutOff({
                sourceSelector: ' .someSecondClass',
                query: [
                    { type: 'CLASS_ATTR', value: 'firstClass' },
                    { type: 'ID_ATTR', value: 'id' }
                ]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'CHILD', value: { type: 'ID_ATTR', value: 'id' } }
            ]
        });
    });
});

describe('FIRST_CHILD', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.FIRST_CHILD.cutOff({
                sourceSelector: '> .someSecondClass',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [{ type: 'FIRST_CHILD', value: { type: 'CLASS_ATTR', value: 'firstClass' } }]
        });

        expect(
            combinations.FIRST_CHILD.cutOff({
                sourceSelector: '> .someSecondClass',
                query: [
                    { type: 'CLASS_ATTR', value: 'firstClass' },
                    { type: 'ID_ATTR', value: 'id' }
                ]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'FIRST_CHILD', value: { type: 'ID_ATTR', value: 'id' } }
            ]
        });
    });
});

describe('NEXT_NODE', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.NEXT_NODE.cutOff({
                sourceSelector: '+ .someSecondClass',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [{ type: 'NEXT_NODE', value: { type: 'CLASS_ATTR', value: 'firstClass' } }]
        });

        expect(
            combinations.NEXT_NODE.cutOff({
                sourceSelector: '+ .someSecondClass',
                query: [
                    { type: 'CLASS_ATTR', value: 'firstClass' },
                    { type: 'ID_ATTR', value: 'id' }
                ]
            })
        ).toStrictEqual({
            sourceSelector: '.someSecondClass',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'NEXT_NODE', value: { type: 'ID_ATTR', value: 'id' } }
            ]
        });
    });
});

describe('ID_ATTR', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.ID_ATTR.cutOff({
                sourceSelector: '#someId',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: '',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'ID_ATTR', value: 'someId' }
            ]
        });

        expect(
            combinations.ID_ATTR.cutOff({
                sourceSelector: '#some-id',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: '',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'ID_ATTR', value: 'some-id' }
            ]
        });

        expect(
            combinations.ID_ATTR.cutOff({
                sourceSelector: '#someId .someSecondClass',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: ' .someSecondClass',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'ID_ATTR', value: 'someId' }
            ]
        });
    });
});

describe('CLASS_ATTR', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.CLASS_ATTR.cutOff({
                sourceSelector: '.someClass',
                query: [{ type: 'ID_ATTR', value: 'someId' }]
            })
        ).toStrictEqual({
            sourceSelector: '',
            query: [
                { type: 'ID_ATTR', value: 'someId' },
                { type: 'CLASS_ATTR', value: 'someClass' }
            ]
        });

        expect(
            combinations.CLASS_ATTR.cutOff({
                sourceSelector: '.someSecondClass #someId',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: ' #someId',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'CLASS_ATTR', value: 'someSecondClass' }
            ]
        });
    });
});

describe('TAG', () => {
    test('Should clip path from source selector', () => {
        expect(
            combinations.TAG.cutOff({
                sourceSelector: 'div',
                query: [{ type: 'ID_ATTR', value: 'someId' }]
            })
        ).toStrictEqual({
            sourceSelector: '',
            query: [
                { type: 'ID_ATTR', value: 'someId' },
                { type: 'TAG', value: 'div' }
            ]
        });

        expect(
            combinations.TAG.cutOff({
                sourceSelector: 'div #someId',
                query: [{ type: 'CLASS_ATTR', value: 'firstClass' }]
            })
        ).toStrictEqual({
            sourceSelector: ' #someId',
            query: [
                { type: 'CLASS_ATTR', value: 'firstClass' },
                { type: 'TAG', value: 'div' }
            ]
        });
    });
});
