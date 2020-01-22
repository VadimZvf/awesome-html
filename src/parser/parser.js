function isEmptyString(str) {
    return str.replace(/\s/g, '').length === 0;
}

export function getAttributesInfo(attributesString) {
    // TODO: добавить булевые аттрибуты
    const attributeRegexp = /(\w+?)\=["']([\w\s]+?)["']/gi;
    let matches;
    const attributes = [];

    while ((matches = attributeRegexp.exec(attributesString)) !== null) {
        attributes.push({ name: matches[1], value: matches[2] });
    }

    return attributes;
}

export function getTagInfo(tagString, startIndex, endIndex) {
    let isCloseTag = /^\/.*$/.test(tagString); // </div>
    let isSelfClosed = /^.*\/$/.test(tagString); // <div/>
    let role = 'open';
    if (isSelfClosed) {
        role = 'open-close';
    } else if (isCloseTag) {
        role = 'close';
    }

    // TODO: добавить более подробные сорсы для тега
    const tagNameRegexp = /^\/?([^\s\/]+).*?\/?$/gi;
    const tagName = tagNameRegexp.exec(tagString)[1];

    const attributesString = tagString.replace(/^\/?([^\s\/]+)/gi, '').replace(/\/$/gi, '');

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

// возвращает готовую AST
function parse() {
    return 1;
}

export default parse;
