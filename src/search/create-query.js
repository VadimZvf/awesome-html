import combinations from './combinators';
import * as errors from './errors';

const combinationsCutOff = [
    combinations.CHILD.cutOff,
    combinations.FIRST_CHILD.cutOff,
    combinations.NEXT_NODE.cutOff,
    combinations.CLASS_ATTR.cutOff,
    combinations.ID_ATTR.cutOff,
    combinations.TAG.cutOff
];

function prepareQueryString(sourceString) {
    return sourceString.replace(/ +(?= )/g, '').trim();
}

function parse(sourceString = '') {
    const preparedSource = prepareQueryString(sourceString);

    if (!preparedSource) {
        const error = new Error(errors.EMPTY_SELECTOR.getMessage());
        error.code = errors.EMPTY_SELECTOR.code;
        throw error;
    }

    let queryStringToParse = preparedSource;
    let query = [];

    while (queryStringToParse) {
        const prevSource = queryStringToParse;

        for (const cutOff of combinationsCutOff) {
            const result = cutOff({ sourceSelector: queryStringToParse, query });
            queryStringToParse = result.sourceSelector;
            query = result.query;
        }

        if (queryStringToParse === prevSource) {
            const error = new Error(errors.UNKNOWN_SELECTOR.getMessage(queryStringToParse));
            error.code = errors.UNKNOWN_SELECTOR.code;
            throw error;
        }
    }

    return query;
}

export default parse;
