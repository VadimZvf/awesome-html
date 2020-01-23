function isEmptyString(str) {
    return str.trim().length === 0;
}

export function getAttributesInfo(attributesString) {
    // TODO: добавить булевые аттрибуты
    let matches;
    const attributes = [];

    const singleQuoteAttributeRegexp = /(\w+?)\='([\w\s]+?)'/gi;
    while ((matches = singleQuoteAttributeRegexp.exec(attributesString)) !== null) {
        attributes.push({ name: matches[1], value: matches[2] });
    }

    const doubleQuoteAttributeRegexp = /(\w+?)\="([\w\s]+?)"/gi;
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
    if (isSelfClosed) {
        role = 'open-close';
    } else if (isCloseTag) {
        role = 'close';
    }

    // TODO: добавить более подробные сорсы для тега
    const tagNameRegexp = /^\/?([^\s\/]+).*?\/?$/gi;
    const tagName = tagNameRegexp.exec(trimmedTagString)[1];

    const attributesString = trimmedTagString.replace(/^\/?([^\s\/]+)/i, '').replace(/\/$/i, '');

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
    let currentTagStart = 0;
    let currentTextNode = '';
    let isTagOpened = false;
    const foundTagItems = [];

    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] === '<') {
            // перед новым тегом была текстовая нода, надо закрыть её
            if (currentTextNode) {
                if (!isEmptyString(currentTextNode)) {
                    // проверяем, вдруг текстовая нода состояла только из пробелов
                    // TODO: add trimming
                    foundTagItems.push({ type: 'text', text: currentTextNode });
                }
                currentTextNode = '';
            }

            currentTagStart = i + 1;
            isTagOpened = true;
            continue;
        }

        if (inputValue[i] === '>') {
            isTagOpened = false;
            foundTagItems.push(getTagInfo(currentTag, currentTagStart, i - 1));
            currentTagStart = 0;
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
    // TODO: show error
    if (currentTag) {
        foundTagItems.push(getTagInfo(currentTag, currentTagStart, currentTagStart + currentTag.length - 1));
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

    const currentOpenTags = [];
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
            currentOpenTags.pop();
            // prevOpenTag
        }
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
