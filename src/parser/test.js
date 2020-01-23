import parser, { getTags, getTagInfo, getAttributesInfo, getAST } from './parser';

describe('getTagInfo', () => {
    test('Should detect open tag', () => {
        expect(getTagInfo('div', 0, 2)).toStrictEqual({
            type: 'tag',
            role: 'open',
            name: 'div',
            attributes: [],
            source: { startIndex: 0, endIndex: 2 }
        });
        expect(getTagInfo('div class="wow" id="wow"', 0, 22)).toStrictEqual({
            type: 'tag',
            role: 'open',
            name: 'div',
            attributes: [
                { name: 'class', value: 'wow' },
                { name: 'id', value: 'wow' }
            ],
            source: { startIndex: 0, endIndex: 22 }
        });
    });
    test('Should detect close tag', () => {
        expect(getTagInfo('/div', 0, 3)).toStrictEqual({
            type: 'tag',
            role: 'close',
            name: 'div',
            attributes: [],
            source: { startIndex: 0, endIndex: 3 }
        });
        expect(getTagInfo('/div class="wow" id="wow1"', 0, 23)).toStrictEqual({
            type: 'tag',
            role: 'close',
            name: 'div',
            attributes: [
                { name: 'class', value: 'wow' },
                { name: 'id', value: 'wow1' }
            ],
            source: { startIndex: 0, endIndex: 23 }
        });
    });
    test('Should detect open/close tag', () => {
        expect(getTagInfo('div/', 0, 3)).toStrictEqual({
            type: 'tag',
            role: 'open-close',
            name: 'div',
            attributes: [],
            source: { startIndex: 0, endIndex: 3 }
        });
        expect(getTagInfo('div class="wow" id="wow"/', 0, 23)).toStrictEqual({
            type: 'tag',
            role: 'open-close',
            name: 'div',
            attributes: [
                { name: 'class', value: 'wow' },
                { name: 'id', value: 'wow' }
            ],
            source: { startIndex: 0, endIndex: 23 }
        });
    });
});

describe('getAttributesInfo', () => {
    test('Should get class', () => {
        expect(getAttributesInfo('class="wow"')).toStrictEqual([{ name: 'class', value: 'wow' }]);
    });
    test('Should get class and id', () => {
        expect(getAttributesInfo('class="wow" id="wow id"')).toStrictEqual([
            { name: 'class', value: 'wow' },
            { name: 'id', value: 'wow id' }
        ]);
    });
    test('Should get attribute with single quota', () => {
        expect(getAttributesInfo("class='wow' id='wow id'")).toStrictEqual([
            { name: 'class', value: 'wow' },
            { name: 'id', value: 'wow id' }
        ]);
    });
    test('Should check quota type for attributes value', () => {
        expect(getAttributesInfo("class='wow\" id='wow id'")).toStrictEqual([{ name: 'id', value: 'wow id' }]);
    });
});

describe('getTags', () => {
    test('Should return a tag', () => {
        expect(getTags('<div>')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 3 } }
        ]);
    });
    test('Should trim string tag', () => {
        expect(getTags('<   div    >  ')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 10 } }
        ]);
        expect(getTags('<   div    />  ')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open-close', attributes: [], source: { startIndex: 1, endIndex: 11 } }
        ]);
    });
    test('Should return two tag', () => {
        expect(getTags('<div><span>')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 3 } },
            { name: 'span', type: 'tag', role: 'open', attributes: [], source: { startIndex: 6, endIndex: 9 } }
        ]);
    });
    test('Should handle empty string', () => {
        expect(getTags('')).toStrictEqual([]);
    });
    test('Should find a text nodes', () => {
        expect(getTags('some long text')).toStrictEqual([{ type: 'text', text: 'some long text' }]);
    });
    test('Should return tags with text nodes', () => {
        expect(getTags('<div><span>some text</span></div>')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 3 } },
            { name: 'span', type: 'tag', role: 'open', attributes: [], source: { startIndex: 6, endIndex: 9 } },
            { type: 'text', text: 'some text' },
            { name: 'span', type: 'tag', role: 'close', attributes: [], source: { startIndex: 21, endIndex: 25 } },
            { name: 'div', type: 'tag', role: 'close', attributes: [], source: { startIndex: 28, endIndex: 31 } }
        ]);
    });
    test('Should handle multiline string', () => {
        expect(
            getTags(`
            <div>
                <span>
                    some text
                </span>
            </div>
        `)
        ).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 14, endIndex: 16 } },
            { name: 'span', type: 'tag', role: 'open', attributes: [], source: { startIndex: 36, endIndex: 39 } },
            {
                type: 'text',
                text: `
                    some text
                `
            },
            { name: 'span', type: 'tag', role: 'close', attributes: [], source: { startIndex: 89, endIndex: 93 } },
            { name: 'div', type: 'tag', role: 'close', attributes: [], source: { startIndex: 109, endIndex: 112 } }
        ]);
    });
    test('Should handle unclosed tag', () => {
        expect(getTags('<div')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 3 } }
        ]);
    });
});

describe('getAST', () => {
    const textNode = { type: 'text', text: 'some text' };
    const openDivTag = { name: 'div', type: 'tag', role: 'open' };
    const closeDivTag = { name: 'div', type: 'tag', role: 'close' };
    const openCloseDivTag = { name: 'div', type: 'tag', role: 'open-close' };

    const openSpanTag = { name: 'span', type: 'tag', role: 'open' };
    const closeSpanTag = { name: 'span', type: 'tag', role: 'close' };
    const openCloseSpanTag = { name: 'span', type: 'tag', role: 'open-close' };

    test('should return simple nodes', () => {
        /**
         * <div>
         *    <div></div>
         * </div>
         */
        expect(getAST([openDivTag, openDivTag, closeDivTag, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [{ ...openDivTag, id: 1, parentId: 0, children: [] }]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [{ ...openDivTag, id: 1, parentId: 0, children: [] }]
                },
                1: { ...openDivTag, id: 1, parentId: 0, children: [] }
            }
        });
        /**
         * <div>
         *    <div></div>
         *    <div></div>
         * </div>
         */
        expect(getAST([openDivTag, openDivTag, closeDivTag, openDivTag, closeDivTag, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [
                    { ...openDivTag, id: 1, parentId: 0, children: [] },
                    { ...openDivTag, id: 3, parentId: 0, children: [] }
                ]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [
                        { ...openDivTag, id: 1, parentId: 0, children: [] },
                        { ...openDivTag, id: 3, parentId: 0, children: [] }
                    ]
                },
                1: { ...openDivTag, id: 1, parentId: 0, children: [] },
                3: { ...openDivTag, id: 3, parentId: 0, children: [] }
            }
        });
        /**
         * <div>
         *    <div>
         *        <div></div>
         *    </div>
         * </div>
         */
        expect(getAST([openDivTag, openDivTag, openDivTag, closeDivTag, closeDivTag, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [
                    {
                        ...openDivTag,
                        id: 1,
                        parentId: 0,
                        children: [{ ...openDivTag, id: 2, parentId: 1, children: [] }]
                    }
                ]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [
                        {
                            ...openDivTag,
                            id: 1,
                            parentId: 0,
                            children: [{ ...openDivTag, id: 2, parentId: 1, children: [] }]
                        }
                    ]
                },
                1: {
                    ...openDivTag,
                    id: 1,
                    parentId: 0,
                    children: [{ ...openDivTag, id: 2, parentId: 1, children: [] }]
                },
                2: { ...openDivTag, id: 2, parentId: 1, children: [] }
            }
        });
        /**
         * <div>
         *    <div/>
         * </div>
         */
        expect(getAST([openDivTag, openCloseDivTag, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [{ ...openCloseDivTag, id: 1, parentId: 0, children: [] }]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [{ ...openCloseDivTag, id: 1, parentId: 0, children: [] }]
                },
                1: { ...openCloseDivTag, id: 1, parentId: 0, children: [] }
            }
        });
    });

    test('should handle text nodes', () => {
        /**
         * <div>some text</div>
         */
        expect(getAST([openDivTag, textNode, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [{ ...textNode, id: 1, parentId: 0, children: [] }]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [{ ...textNode, id: 1, parentId: 0, children: [] }]
                },
                1: { ...textNode, id: 1, parentId: 0, children: [] }
            }
        });
        /**
         * some text
         */
        expect(getAST([textNode])).toStrictEqual({
            tree: { ...textNode, id: 0, parentId: null, children: [] },
            map: {
                0: { ...textNode, id: 0, parentId: null, children: [] }
            }
        });
        /**
         * <div>
         *     some text
         *     <div></div>
         * </div>
         */
        expect(getAST([openDivTag, textNode, openDivTag, closeDivTag, closeDivTag])).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [
                    { ...textNode, id: 1, parentId: 0, children: [] },
                    { ...openDivTag, id: 2, parentId: 0, children: [] }
                ]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [
                        { ...textNode, id: 1, parentId: 0, children: [] },
                        { ...openDivTag, id: 2, parentId: 0, children: [] }
                    ]
                },
                1: { ...textNode, id: 1, parentId: 0, children: [] },
                2: { ...openDivTag, id: 2, parentId: 0, children: [] }
            }
        });
    });

    test('should create two branches', () => {
        /**
         * <div>
         *     <div>some text</div>
         *     <div><div/></div>
         * </div>
         */
        expect(
            getAST([
                openDivTag,
                openDivTag,
                textNode,
                closeDivTag,
                openDivTag,
                openCloseDivTag,
                closeDivTag,
                closeDivTag
            ])
        ).toStrictEqual({
            tree: {
                ...openDivTag,
                id: 0,
                parentId: null,
                children: [
                    {
                        ...openDivTag,
                        id: 1,
                        parentId: 0,
                        children: [{ ...textNode, id: 2, parentId: 1, children: [] }]
                    },
                    {
                        ...openDivTag,
                        id: 4,
                        parentId: 0,
                        children: [{ ...openCloseDivTag, id: 5, parentId: 4, children: [] }]
                    }
                ]
            },
            map: {
                0: {
                    ...openDivTag,
                    id: 0,
                    parentId: null,
                    children: [
                        {
                            ...openDivTag,
                            id: 1,
                            parentId: 0,
                            children: [{ ...textNode, id: 2, parentId: 1, children: [] }]
                        },
                        {
                            ...openDivTag,
                            id: 4,
                            parentId: 0,
                            children: [{ ...openCloseDivTag, id: 5, parentId: 4, children: [] }]
                        }
                    ]
                },
                1: {
                    ...openDivTag,
                    id: 1,
                    parentId: 0,
                    children: [{ ...textNode, id: 2, parentId: 1, children: [] }]
                },
                2: { ...textNode, id: 2, parentId: 1, children: [] },
                4: {
                    ...openDivTag,
                    id: 4,
                    parentId: 0,
                    children: [{ ...openCloseDivTag, id: 5, parentId: 4, children: [] }]
                },
                5: { ...openCloseDivTag, id: 5, parentId: 4, children: [] }
            }
        });
    });

    test('should validate invalid close tag', () => {
        /**
         * <div></span>
         */
        expect(() => getAST([openDivTag, closeSpanTag])).toThrow('😱 Воу воу... Сначала надо открыть тег "span"');
        /**
         * <div></div></div>
         */
        expect(() => getAST([openDivTag, closeDivTag, closeDivTag])).toThrow(
            '😱 Воу воу... Сначала надо открыть тег "div"'
        );

        const openDivTagWithSCR = { ...openDivTag, source: { start: 1, end: 3 } };
        const closeSpanTagWithSRC = { ...closeSpanTag, source: { start: 7, end: 11 } };

        try {
            getAST([openDivTagWithSCR, closeSpanTagWithSRC]);
        } catch (err) {
            // Должен передать и source чтобы мы смогли отрисовать ошибку
            expect(err.source).toStrictEqual(closeSpanTagWithSRC.source);
        }
    });

    test('should validate invalid open tag', () => {
        /**
         * <div></div><div>
         */
        expect(() => getAST([openDivTag, closeDivTag, openDivTag])).toThrow('😭 Забыли закрыть тег "div"');
        /**
         * <div><div></div>
         */
        expect(() => getAST([openDivTag, openDivTag, closeDivTag])).toThrow('😭 Забыли закрыть тег "div"');

        const openDivTagWithSRC = { ...openDivTag, source: { start: 7, end: 11 } };

        try {
            getAST([openDivTag, closeDivTag, openDivTagWithSRC]);
        } catch (err) {
            // Должен передать и source чтобы мы смогли отрисовать ошибку
            expect(err.source).toStrictEqual(openDivTagWithSRC.source);
        }
    });
});
