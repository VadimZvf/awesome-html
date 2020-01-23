import tags from './tags';
import validate from './validator';

const divNode = { name: 'div', type: 'tag', role: 'open', attributes: [], children: [] };
const htmlNode = { name: 'html', type: 'tag', role: 'open', attributes: [], children: [] };

test('Should be valid with simple template', () => {
    /**
     * <div>
     *    <div></div>
     * </div>
     */
    const tree = {
        ...divNode,
        id: 0,
        parentId: null,
        children: [{ ...divNode, id: 1, parentId: 0, children: [] }]
    };
    const map = {
        0: {
            ...divNode,
            id: 0,
            parentId: null,
            children: [{ ...divNode, id: 1, parentId: 0, children: [] }]
        },
        1: { ...divNode, id: 1, parentId: 0, children: [] }
    };
    expect(validate(tree, map, [tags.div, tags.html])).toEqual(true);

    const mockedTag = { ...tags.div, visitor: jest.fn() };
    expect(validate(tree, map, [mockedTag])).toEqual(true);
    expect(mockedTag.visitor).toHaveBeenCalledTimes(2);
});

test('Should be valid with nested tags', () => {
    /**
     * <html>
     *    <div></div>
     *    <div>
     *        <div></div>
     *    </div>
     * </html>
     */
    const tree = {
        ...htmlNode,
        id: 0,
        parentId: null,
        children: [
            { ...divNode, id: 1, parentId: 0 },
            { ...divNode, id: 3, parentId: 0, children: [{ ...divNode, id: 4, parentId: 3 }] }
        ]
    };
    const map = {
        0: {
            ...htmlNode,
            id: 0,
            parentId: null,
            children: [
                { ...divNode, id: 1, parentId: 0 },
                { ...divNode, id: 3, parentId: 0, children: [{ ...divNode, id: 4, parentId: 3 }] }
            ]
        },
        1: { ...divNode, id: 1, parentId: 0 },
        3: { ...divNode, id: 3, parentId: 0, children: [{ ...divNode, id: 4, parentId: 3 }] },
        4: { ...divNode, id: 4, parentId: 3 }
    };
    expect(validate(tree, map, [tags.div, tags.html])).toEqual(true);

    const mockedTag = { ...tags.div, visitor: jest.fn() };
    expect(validate(tree, map, [mockedTag, tags.html])).toEqual(true);
    expect(mockedTag.visitor).toHaveBeenCalledTimes(3);
});

test('Should find invalid attribute', () => {
    /**
     * <div class="foo" uglyAttr="bar"></div>
     */
    const tree = {
        ...divNode,
        id: 0,
        parentId: null,
        attributes: [
            { name: 'class', value: 'foo' },
            { name: 'uglyAttr', value: 'bar' }
        ],
        children: []
    };
    const map = {
        0: {
            ...divNode,
            id: 0,
            parentId: null,
            attributes: [
                { name: 'class', value: 'foo' },
                { name: 'uglyAttr', value: 'bar' }
            ],
            children: []
        }
    };

    expect(() => validate(tree, map, [tags.div])).toThrow(
        '👽 Неизвестный аттрибут "uglyAttr". У тега div такого не бывает'
    );
});

test('Should validate nesting', () => {
    /**
     * <div>
     *    <html></html>
     * </div>
     */
    const tree = {
        ...divNode,
        id: 0,
        parentId: null,
        attributes: [],
        children: [{ ...htmlNode, id: 1, parentId: 0 }]
    };
    const map = {
        0: {
            ...divNode,
            id: 0,
            parentId: null,
            attributes: [],
            children: [{ ...htmlNode, id: 1, parentId: 0 }]
        },
        1: { ...htmlNode, id: 1, parentId: 0 }
    };

    expect(() => validate(tree, map, [tags.div, tags.html])).toThrow('👨🏾‍🦳 Тег html может быть только родителем');
});
