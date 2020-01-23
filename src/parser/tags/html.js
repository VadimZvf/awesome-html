import * as errors from '../errors';

const allowedAttributes = ['class', 'id'];

export default {
    name: 'html',
    visitor: node => {
        const invalidAttribute = node.attributes.find(attr => !allowedAttributes.includes(attr.name));

        if (invalidAttribute) {
            const error = new Error(errors.HTML_WRONG_ATTRIBUTE.getMessage(invalidAttribute));
            error.code = errors.HTML_WRONG_ATTRIBUTE.code;
            error.source = node.source; // TODO: Добавить более точную подсветку для ошибки

            throw error;
        }

        if (node.parentId !== null) {
            const error = new Error(errors.HTML_WRONG_NESTING.getMessage(invalidAttribute));
            error.code = errors.HTML_WRONG_NESTING.code;
            error.source = node.source;

            throw error;
        }
    }
};
