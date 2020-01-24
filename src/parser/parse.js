import * as errors from './errors';

function isEmptyString(str) {
    return str.trim().length === 0;
}

export function getAttributesInfo(attributesString) {
    // TODO: добавить булевые аттрибуты
    // TODO: Добавить валидацию
    let matches;
    const attributes = [];

    const singleQuoteAttributeRegexp = /([\w-]+?)='([^'"<>]+?)'/gi;
    while ((matches = singleQuoteAttributeRegexp.exec(attributesString)) !== null) {
        attributes.push({ name: matches[1], value: matches[2] });
    }

    const doubleQuoteAttributeRegexp = /([\w-]+?)="([^'"<>]+?)"/gi;
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

    // </div/>
    if (isCloseTag && isSelfClosed && tagName) {
        const error = new Error(errors.INVALID_TAG_DECLARATION.getMessage());
        error.code = errors.INVALID_TAG_DECLARATION.code;
        error.source = { startIndex, endIndex };
        throw error;
    }

    const attributesString = trimmedTagString.replace(/^\/?([^\s/]+)/i, '').replace(/\/$/i, '');

    return {
        role,
        type: 'tag',
        name: tagName,
        attributes: getAttributesInfo(attributesString),
        source: { startIndex, endIndex }
    };
}

// Возврращает массив тегов,
// это еще не ноды, просто список найденных тегов или стоковых нод
export function getTags(inputValue = '') {
    if (!inputValue.length) {
        return [];
    }

    let currentText = '';
    let currentTagStart = null;
    const foundTagItems = [];

    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === '<') {
            if (currentTagStart !== null) {
                // Начался новый тег, но предыдущий еще не закрыт ☹️
                const error = new Error(errors.WRONG_OPEN_TAG_SYMBOL.getMessage());
                error.code = errors.WRONG_OPEN_TAG_SYMBOL.code;
                error.source = { startIndex: i, endIndex: i };
                throw error;
            }

            // перед новым тегом была текстовая нода, надо закрыть её
            if (currentText && !isEmptyString(currentText)) {
                // проверяем, вдруг текстовая нода состояла только из пробелов
                foundTagItems.push({ type: 'text', text: currentText.trim() });
            }

            currentText = '';
            currentTagStart = i;
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

            foundTagItems.push(getTagInfo(currentText, currentTagStart, i));
            currentTagStart = null;
            currentText = '';
            continue;
        }

        // Мы находимся внутри тега или сейчас текстовая нода
        currentText = `${currentText}${inputValue[i]}`;
    }

    // прошлись по всей строке но текстовая нода не закрыта, значит на входе была просто строка
    if (currentText && !isEmptyString(currentText)) {
        // проверяем, вдруг текстовая нода состояла только из пробелов
        foundTagItems.push({ type: 'text', text: currentText });
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

export function getNodesMap(sourceTags) {
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

    for (let index = 0; index < tags.length; index++) {
        const currentTag = tags[index];
        const lastOpenTag = currentOpenTags[currentOpenTags.length - 1];

        if (currentTag.type === 'text') {
            if (lastOpenTag) {
                // Зачем текстовой ноде id родителя? О_о
                // будем искать по тексту?
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
            }
        }

        if (currentTag.role === 'open') {
            if (lastOpenTag) {
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
            }

            currentOpenTags.push(currentTag);
        }

        if (currentTag.role === 'open-close') {
            if (lastOpenTag) {
                currentTag.parentId = lastOpenTag.id;
                lastOpenTag.children.push(currentTag);
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

    return tagsMap;
}

export function getNodesTree(map) {
    return Object.values(map).find(node => !node.parentId);
}

// возвращает готовую AST
function parse(sourceString) {
    const tags = getTags(sourceString);
    const map = getNodesMap(tags);
    const tree = getNodesTree(map);

    return {
        tree,
        map // для простого поиска
    };
}

export default parse;
