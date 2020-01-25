import * as errors from './errors';

const whitespace = '[\\x20\\t\\r\\n\\f]';

export const combinatorsCodes = {
    CHILD: 'CHILD',
    FIRST_CHILD: 'FIRST_CHILD',
    NEXT_NODE: 'NEXT_NODE',
    ID_ATTR: 'ID_ATTR',
    CLASS_ATTR: 'CLASS_ATTR',
    TAG: 'TAG'
};

export default {
    CHILD: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp(`^(${whitespace}+)`);

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            resultSourceSelector = sourceSelector.slice(match[0].length);

            if (!query.length) {
                const error = new Error(errors.INVALID_CHILD_COMBINATOR.getMessage());
                error.code = errors.INVALID_CHILD_COMBINATOR.code;

                throw error;
            }

            const lastSelector = query[query.length - 1];

            const validParentCombinators = [
                combinatorsCodes.ID_ATTR,
                combinatorsCodes.CLASS_ATTR,
                combinatorsCodes.TAG
            ];

            if (!validParentCombinators.includes(lastSelector.type)) {
                const error = new Error(errors.INVALID_PARENT_FOR_CHILD_COMBINATOR.getMessage());
                error.code = errors.INVALID_PARENT_FOR_CHILD_COMBINATOR.code;

                throw error;
            }

            const newQuery = [...query.slice(0, -1), { type: combinatorsCodes.CHILD, value: lastSelector }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }

        // visitor: (node, map) => {}
    },

    FIRST_CHILD: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp(`^(${whitespace}*>${whitespace}*)`);

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            resultSourceSelector = sourceSelector.slice(match[0].length);

            if (!query.length) {
                const error = new Error(errors.INVALID_FIRST_CHILD_COMBINATOR.getMessage());
                error.code = errors.INVALID_FIRST_CHILD_COMBINATOR.code;

                throw error;
            }

            const lastSelector = query[query.length - 1];

            const validParentCombinators = [
                combinatorsCodes.ID_ATTR,
                combinatorsCodes.CLASS_ATTR,
                combinatorsCodes.TAG
            ];

            if (!validParentCombinators.includes(lastSelector.type)) {
                const error = new Error(errors.INVALID_PARENT_FOR_FIRST_CHILD_COMBINATOR.getMessage());
                error.code = errors.INVALID_PARENT_FOR_FIRST_CHILD_COMBINATOR.code;

                throw error;
            }

            const newQuery = [...query.slice(0, -1), { type: combinatorsCodes.FIRST_CHILD, value: lastSelector }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }
    },

    NEXT_NODE: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp(`^(${whitespace}*\\+${whitespace}*)`);

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            resultSourceSelector = sourceSelector.slice(match[0].length);

            if (!query.length) {
                const error = new Error(errors.INVALID_NEXT_NODE_COMBINATOR.getMessage());
                error.code = errors.INVALID_NEXT_NODE_COMBINATOR.code;

                throw error;
            }

            const lastSelector = query[query.length - 1];

            const validParentCombinators = [
                combinatorsCodes.ID_ATTR,
                combinatorsCodes.CLASS_ATTR,
                combinatorsCodes.TAG
            ];

            if (!validParentCombinators.includes(lastSelector.type)) {
                const error = new Error(errors.INVALID_PARENT_FOR_NEXT_NODE_COMBINATOR.getMessage());
                error.code = errors.INVALID_PARENT_FOR_NEXT_NODE_COMBINATOR.code;

                throw error;
            }

            const newQuery = [...query.slice(0, -1), { type: combinatorsCodes.NEXT_NODE, value: lastSelector }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }
    },

    ID_ATTR: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp('^(#\\w+)');

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            const matchedString = match[0];
            const targetId = matchedString.substring(1); // remove "#" symbol
            resultSourceSelector = sourceSelector.slice(matchedString.length);

            const newQuery = [...query, { type: combinatorsCodes.ID_ATTR, value: targetId }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }
    },

    CLASS_ATTR: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp('^(\\.\\w+)');

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            const matchedString = match[0];
            const targetClass = matchedString.substring(1); // remove "." symbol
            resultSourceSelector = sourceSelector.slice(matchedString.length);

            const newQuery = [...query, { type: combinatorsCodes.CLASS_ATTR, value: targetClass }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }
    },

    TAG: {
        cutOff: ({ sourceSelector, query }) => {
            let resultSourceSelector = sourceSelector;

            const regexp = new RegExp('^(\\w+)');

            const match = regexp.exec(sourceSelector);

            if (!match) {
                return { sourceSelector, query };
            }

            const tagName = match[0];
            resultSourceSelector = sourceSelector.slice(tagName.length);

            const newQuery = [...query, { type: combinatorsCodes.TAG, value: tagName }];

            return { sourceSelector: resultSourceSelector, query: newQuery };
        }
    }
};
