import * as errors from '../errors';

const allowedAttributes = ['class', 'id'];

export default {
    name: 'div',
    visitor: node => {
        const invalidAttribute = node.attributes.find(attr => !allowedAttributes.includes(attr.name));

        if (invalidAttribute) {
            const error = new Error(errors.DIV_WRONG_ATTRIBUTE.getMessage(invalidAttribute));
            error.code = errors.DIV_WRONG_ATTRIBUTE.code;
            error.source = node.source; // TODO: Добавить более точную подсветку для ошибки

            throw error;
        }
    }
};
