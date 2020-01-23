export const WRONG_OPEN_TAG_SYMBOL = {
    code: 'WRONG_OPEN_TAG_SYMBOL',
    getMessage: () => `🥴 Символ открытия тега слишком рано. Предыдущий тег еще не закрыт`
};

export const WRONG_CLOSE_TAG_SYMBOL = {
    code: 'WRONG_CLOSE_TAG_SYMBOL',
    getMessage: () => `🥴 Символ закрытия тега слишком рано. Надо сначала открыть тег`
};

export const WRONG_CLOSE_TAG = {
    code: 'WRONG_CLOSE_TAG',
    getMessage: tag => `😱 Воу воу... Сначала надо открыть тег "${tag.name}"`
};

export const WRONG_OPEN_TAG = {
    code: 'WRONG_OPEN_TAG',
    getMessage: tag => `😭 Забыли закрыть тег "${tag.name}"`
};
