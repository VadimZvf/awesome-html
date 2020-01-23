import * as errors from './errors';

function isEmptyString(str) {
    return str.trim().length === 0;
}

export function getAttributesInfo(attributesString) {
    // TODO: добавить булевые аттрибуты
    // TODO: Добавить валидацию
    let matches;
    const attributes = [];

    const singleQuoteAttributeRegexp = /(\w+?)='([\w\s]+?)'/gi;
    while ((matches = singleQuoteAttributeRegexp.exec(attributesString)) !== null) {
        attributes.push({ name: matches[1], value: matches[2] });
    }

    const doubleQuoteAttributeRegexp = /(\w+?)="([\w\s]+?)"/gi;
    while ((matches = doubleQuoteAttributeRegexp.exec(attributesString)) !== null) {
        attributes.push({ name: matches[1], value: matches[2] });
    }

    return attributes;
}

export function getTagInfo(tagString, startIndex, endIndex) {
    const trimmedTagString = tagString.trim();

    let isCloseTag = /^\/.*$/.test(trimmedTagString); // </div>
    let isSelfClosed = /^.*\/$/.test(trimmedTagString); // <div/>
    let role = 'open';
    if (isCloseTag) {
        role = 'close';
    } else if (isSelfClosed) {
        role = 'open-close';
    }

    // TODO: добавить более подробные сорсы для тега
    const tagNameRegexp = /^\/?([^\s/]+).*?\/?$/gi;
    const tagNameMatch = tagNameRegexp.exec(trimmedTagString);
    const tagName = tagNameMatch ? tagNameMatch[1] : '';

    const attributesString = trimmedTagString.replace(/^\/?([^\s/]+)/i, '').replace(/\/$/i, '');

    return {
        role,
        type: 'tag',
        name: tagName,
        attributes: getAttributesInfo(attributesString),
        source: {
            startIndex,
            endIndex
        }
    };
}

// Возврращает массив тегов,
// это еще не ноды, просто список найденных тегов или стоковых нод
export function getTags(inputValue = '') {
    if (!inputValue.length) {
        return [];
    }

    let currentTag = '';
    let currentTagStart = null;
    let currentTextNode = '';
    let isTagOpened = false;
    const foundTagItems = [];

    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === '<') {
            if (currentTag) {
                // Начался новый тег, но предыдущий еще не закрыт ☹️
                const error = new Error(errors.WRONG_OPEN_TAG_SYMBOL.getMessage());
                error.code = errors.WRONG_OPEN_TAG_SYMBOL.code;
                error.source = { startIndex: i, endIndex: i };
                throw error;
            }

            // перед новым тегом была текстовая нода, надо закрыть её
            if (currentTextNode) {
                if (!isEmptyString(currentTextNode)) {
                    // проверяем, вдруг текстовая нода состояла только из пробелов
                    // TODO: add trimming
                    foundTagItems.push({ type: 'text', text: currentTextNode });
                }
                currentTextNode = '';
            }

            currentTagStart = i;
            isTagOpened = true;
            continue;
        }

        if (inputValue[i] === '>') {
            if (currentTagStart === null) {
                // Перед символом закрытия тега не оказалось символа открытия тега
                const error = new Error(errors.WRONG_CLOSE_TAG_SYMBOL.getMessage());
                error.code = errors.WRONG_CLOSE_TAG_SYMBOL.code;
                error.source = { startIndex: i, endIndex: i };
                throw error;
            }

            isTagOpened = false;
            foundTagItems.push(getTagInfo(currentTag, currentTagStart, i));
            currentTagStart = null;
            currentTag = '';
            continue;
        }

        if (isTagOpened) {
            // Мы находимся внутри тега
            currentTag = `${currentTag}${inputValue[i]}`;
            continue;
        } else {
            // видимо тестовая нода, раз никакой тег не открывался
            currentTextNode = `${currentTextNode}${inputValue[i]}`;
        }
    }

    // прошлись по всей строке но текстовая нода не закрыта, значит на входе была просто строка
    if (currentTextNode) {
        if (!isEmptyString(currentTextNode)) {
            // проверяем, вдруг текстовая нода состояла только из пробелов
            foundTagItems.push({ type: 'text', text: currentTextNode });
        }
    }

    // прошлись по всей строке но один тег не закрылся(
    if (currentTagStart !== null) {
        const error = new Error(errors.UNCLOSED_TAG.getMessage());
        error.code = errors.UNCLOSED_TAG.code;
        error.source = { startIndex: currentTagStart, endIndex: currentTagStart };
        throw error;
    }

    return foundTagItems;
}

function getPreparedTags(sourceTags) {
    return sourceTags.map((tag, index) => ({ ...tag, id: index, parentId: null, children: [] }));
}

// ПРавильно ли это называть AST? O_O
// получаем дерево из списка тегов
export function getAST(sourceTags) {
    const tags = getPreparedTags(sourceTags);
    const tagsMap = {};

    // делаем простой словарик, чтобы легко получать элемент
    for (const tag of tags) {
        // сохраняем только теги открытия, тк дубли не нужны
        if (tag.role === 'open') {
            tagsMap[tag.id] = tag;
        }

        if (tag.role === 'open-close') {
            tagsMap[tag.id] = tag;
        }

        if (tag.type === 'text') {
            tagsMap[tag.id] = tag;
        }
    }

    // список последних открытых тегов
    const currentOpenTags = [];
    // дерево. которое мы и хотим получить
    let tree = null;

    for (let index = 0; index < tags.length; index++) {
        const currentTag = tags[index];
        const lastOpenTag = currentOpenTags[currentOpenTags.length - 1];

        if (currentTag.type === 'text') {
            if (lastOpenTag) {
                // Зачем текстовой ноде id родителя? О_о
                // будем искать по тексту?
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
            } else {
                // это первая нода в дереве
                tree = currentTag;
            }
        }

        if (currentTag.role === 'open') {
            if (lastOpenTag) {
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
            } else {
                // это первая нода в дереве
                tree = currentTag;
            }

            currentOpenTags.push(currentTag);
        }

        if (currentTag.role === 'open-close') {
            if (lastOpenTag) {
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
            } else {
                // это первая нода в дереве
                tree = currentTag;
            }
        }

        if (currentTag.role === 'close') {
            if (!lastOpenTag || lastOpenTag.name !== currentTag.name) {
                const error = new Error(errors.WRONG_CLOSE_TAG.getMessage(currentTag));
                error.code = errors.WRONG_CLOSE_TAG.code;
                error.source = currentTag.source;

                throw error;
            }

            currentOpenTags.pop();
            // prevOpenTag
        }
    }

    if (currentOpenTags.length) {
        const notClosedTag = currentOpenTags[currentOpenTags.length - 1];
        const error = new Error(errors.WRONG_OPEN_TAG.getMessage(notClosedTag));
        error.code = errors.WRONG_OPEN_TAG.code;
        error.source = notClosedTag.source;

        throw error;
    }

    return {
        tree, // для рендера
        map: tagsMap // для простого поиска
    };
}

// возвращает готовую AST
function parse() {
    return 1;
}

export default parse;
