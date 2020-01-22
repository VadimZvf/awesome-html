import parser, { getTags, getTagInfo, getAttributesInfo } from './parser';

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
                {
                    name: 'class',
                    value: 'wow'
                },
                {
                    name: 'id',
                    value: 'wow'
                }
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
        expect(getTagInfo('/div class="wow" id="wow"', 0, 23)).toStrictEqual({
            type: 'tag',
            role: 'close',
            name: 'div',
            attributes: [
                {
                    name: 'class',
                    value: 'wow'
                },
                {
                    name: 'id',
                    value: 'wow'
                }
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
                {
                    name: 'class',
                    value: 'wow'
                },
                {
                    name: 'id',
                    value: 'wow'
                }
            ],
            source: { startIndex: 0, endIndex: 23 }
        });
    });
});

describe('getAttributesInfo', () => {
    test('Should get class', () => {
        expect(getAttributesInfo('class="wow"')).toStrictEqual([
            {
                name: 'class',
                value: 'wow'
            }
        ]);
    });
    test('Should get class and id', () => {
        expect(getAttributesInfo('class="wow" id="wow id"')).toStrictEqual([
            {
                name: 'class',
                value: 'wow'
            },
            {
                name: 'id',
                value: 'wow id'
            }
        ]);
    });
    test('Should get attribute with single comma', () => {
        expect(getAttributesInfo("class='wow' id='wow id'")).toStrictEqual([
            {
                name: 'class',
                value: 'wow'
            },
            {
                name: 'id',
                value: 'wow id'
            }
        ]);
    });
});

describe('getTags', () => {
    test('Should return a tag', () => {
        expect(getTags('<div>')).toStrictEqual([
            { name: 'div', type: 'tag', role: 'open', attributes: [], source: { startIndex: 1, endIndex: 3 } }
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
