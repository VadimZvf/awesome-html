import parse from '../parser/parse';
import getMarkedTree from './getMarkedTree';

const divNode = { name: 'div', type: 'tag', role: 'open', attributes: [], children: [] };
// const htmlNode = { name: 'html', type: 'tag', role: 'open', attributes: [], children: [] };
// const textNode = { type: 'text', text: 'some text' };

const classSelector = { type: 'attribute', name: 'class', value: 'classSelector' };
// const idSelector = { type: 'attribute', name: 'id', value: 'foo' };
// const tagSelector = { type: 'tag', name: null, value: 'bar' };

describe('getMarkedTree', () => {
    test('Should mark simple tree', () => {
        /**
         * <div>
         *    <div class="classSelector"></div>
         * </div>
         */

        const targetDivNode = {
            ...divNode,
            id: 1,
            parentId: 0,
            attributes: [{ name: 'class', value: 'classSelector' }]
        };
        const map = {
            0: { ...divNode, id: 0, parentId: null, children: [targetDivNode] },
            1: targetDivNode
        };

        expect(getMarkedTree(map, [classSelector])).toStrictEqual({
            tree: {
                ...divNode,
                id: 0,
                parentId: null,
                isFound: false,
                isOpen: true,
                children: [{ ...targetDivNode, isOpen: false, isFound: true }]
            },
            map: {
                0: {
                    ...divNode,
                    id: 0,
                    parentId: null,
                    isFound: false,
                    isOpen: true,
                    children: [{ ...targetDivNode, isOpen: false, isFound: true }]
                },
                1: { ...targetDivNode, isOpen: false, isFound: true }
            }
        });
    });
    test('Should search by two selectors', () => {
        // ".bar .baz"
        const query = [
            { ...classSelector, value: 'bar' },
            { ...classSelector, value: 'baz' }
        ];

        const bazDivNode = {
            ...divNode,
            id: 2,
            parentId: 1,
            isFound: false,
            isOpen: false,
            source: { endIndex: 75, startIndex: 59 },
            attributes: [{ name: 'class', value: 'baz' }]
        };
        const fooDivNode = {
            ...divNode,
            id: 1,
            parentId: 0,
            isFound: false,
            isOpen: false,
            source: { endIndex: 42, startIndex: 26 },
            attributes: [{ name: 'class', value: 'foo' }],
            children: [bazDivNode]
        };
        const secondBazDivNode = {
            ...divNode,
            id: 6,
            parentId: 5,
            isFound: true,
            isOpen: false,
            source: { endIndex: 161, startIndex: 145 },
            attributes: [{ name: 'class', value: 'baz' }]
        };
        const barDivNode = {
            ...divNode,
            id: 5,
            parentId: 0,
            isFound: false,
            isOpen: true,
            source: { endIndex: 128, startIndex: 112 },
            attributes: [{ name: 'class', value: 'bar' }],
            children: [secondBazDivNode]
        };
        const rootNode = {
            ...divNode,
            id: 0,
            parentId: null,
            isFound: false,
            isOpen: true,
            source: { endIndex: 13, startIndex: 9 },
            children: [fooDivNode, barDivNode]
        };

        const { map } = parse(`
        <div>
           <div class="foo">
               <div class="baz"></div>
           </div>
           <div class="bar">
               <div class="baz"></div>
           </div>
        </div>
        `);

        expect(getMarkedTree(map, query)).toStrictEqual({
            tree: rootNode,
            map: {
                0: rootNode,
                1: fooDivNode,
                2: bazDivNode,
                5: barDivNode,
                6: secondBazDivNode
            }
        });
    });
});