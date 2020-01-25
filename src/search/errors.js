export const UNKNOWN_SELECTOR = {
    code: 'UNKNOWN_SELECTOR',
    getMessage: selector => `🤬 Ошибочка. Неизвестный селектор: "${selector}"`
};

export const EMPTY_SELECTOR = {
    code: 'EMPTY_SELECTOR',
    getMessage: () => '👻 Пустой селектор'
};

export const INVALID_CHILD_COMBINATOR = {
    code: 'INVALID_CHILD_COMBINATOR',
    getMessage: () => '👻 Перед комбинатором потомка должен быть селектор радителя'
};

export const INVALID_PARENT_FOR_CHILD_COMBINATOR = {
    code: 'INVALID_PARENT_FOR_CHILD_COMBINATOR',
    getMessage: () => '👻 Перед комбинатором потомка должен быть селектор по id, class или tag. И ничего другого'
};

export const INVALID_FIRST_CHILD_COMBINATOR = {
    code: 'INVALID_FIRST_CHILD_COMBINATOR',
    getMessage: () => '👻 Перед комбинатором первого потомка ">" должен быть селектор радителя'
};

export const INVALID_PARENT_FOR_FIRST_CHILD_COMBINATOR = {
    code: 'INVALID_PARENT_FOR_FIRST_CHILD_COMBINATOR',
    getMessage: () =>
        '👻 Перед комбинатором первого потомка ">" должен быть селектор по id, class или tag. И ничего другого'
};

export const INVALID_NEXT_NODE_COMBINATOR = {
    code: 'INVALID_NEXT_NODE_COMBINATOR',
    getMessage: () => '👻 Перед комбинатором следующего элемента "+" должен быть селектор'
};

export const INVALID_PARENT_FOR_NEXT_NODE_COMBINATOR = {
    code: 'INVALID_PARENT_FOR_NEXT_NODE_COMBINATOR',
    getMessage: () =>
        '👻 Перед комбинатором следующего элемента "+" должен быть селектор по id, class или tag. И ничего другого'
};
