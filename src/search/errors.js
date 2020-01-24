export const UNKNOWN_SELECTOR = {
    code: 'UNKNOWN_SELECTOR',
    getMessage: selector => `🤬 Ошибочка. Неизвестный селектор: "${selector}"`
};

export const EMPTY_SELECTOR = {
    code: 'EMPTY_SELECTOR',
    getMessage: () => '☹️ Пустой селектор'
};
