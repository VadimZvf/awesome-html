export const WRONG_OPEN_TAG_SYMBOL = {
    code: 'WRONG_OPEN_TAG_SYMBOL',
    getMessage: () => `🥴 Символ открытия тега слишком рано. Предыдущий тег еще не закрыт`
};

export const WRONG_CLOSE_TAG_SYMBOL = {
    code: 'WRONG_CLOSE_TAG_SYMBOL',
    getMessage: () => `🥴 Символ закрытия тега слишком рано. Надо сначала открыть тег`
};

export const UNCLOSED_TAG = {
    code: 'UNCLOSED_TAG',
    getMessage: () => `🥴 Забыли закрыть тег`
};

export const WRONG_CLOSE_TAG = {
    code: 'WRONG_CLOSE_TAG',
    getMessage: tag => `😱 Воу воу... Сначала надо открыть тег "${tag.name}"`
};

export const WRONG_OPEN_TAG = {
    code: 'WRONG_OPEN_TAG',
    getMessage: tag => `😭 Забыли закрыть тег "${tag.name}"`
};

export const INVALID_TAG = {
    code: 'INVALID_TAG',
    getMessage: node => `👽 Неизвестный тег "${node.name}"`
};

export const DIV_WRONG_ATTRIBUTE = {
    code: 'DIV_WRONG_ATTRIBUTE',
    getMessage: attr => `👽 Неизвестный аттрибут "${attr.name}". У тега div такого не бывает`
};

export const HTML_WRONG_ATTRIBUTE = {
    code: 'DIV_WRONG_ATTRIBUTE',
    getMessage: attr => `👽 Неизвестный аттрибут "${attr.name}". У тега html такого не бывает`
};

export const HTML_WRONG_NESTING = {
    code: 'DIV_WRONG_NESTING',
    getMessage: () => `👨🏾‍🦳 Тег html может быть только родителем`
};
