import attributes from '../attributes';
import * as errors from './errors';

function getSelectorType(selector) {
    const tagRegex = /^\w/;

    if (tagRegex.test(selector)) {
        return 'tag';
    }

    return 'attribute';
}

const selectorAttributesNames = {
    [attributes.class.querySymbol]: attributes.class.name,
    [attributes.id.querySymbol]: attributes.id.name
};

function getSelectorAttributeName(selector) {
    if (getSelectorType(selector) !== 'attribute') {
        return null;
    }

    const selectorSymbol = selector[0];

    if (selectorAttributesNames[selectorSymbol]) {
        return selectorAttributesNames[selectorSymbol];
    }

    const error = new Error(errors.UNKNOWN_SELECTOR.getMessage(selectorSymbol));
    error.code = errors.UNKNOWN_SELECTOR.code;
    throw error;
}

function getSelectorValue(selector) {
    if (getSelectorType(selector) === 'attribute') {
        return selector.substring(1);
    }

    return selector;
}

function parse(sourceString) {
    const selectors = sourceString
        .split(' ')
        .map(selector => selector.trim())
        .map(selector => {
            return {
                type: getSelectorType(selector),
                name: getSelectorAttributeName(selector),
                value: getSelectorValue(selector)
            };
        });

    return selectors;
}

export default parse;
