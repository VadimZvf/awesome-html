export const WRONG_CLOSE_TAG = {
    code: 'WRONG_CLOSE_TAG',
    message: tag => `😱 Воу воу... Сначала надо открыть тег "${tag.name}"`
};

export const WRONG_OPEN_TAG = {
    code: 'WRONG_OPEN_TAG',
    message: tag => `😭 Забыли закрыть тег "${tag.name}"`
};
