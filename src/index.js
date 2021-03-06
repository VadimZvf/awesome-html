import './index.css';
import parseHTML from './parser';
import search from './search';

const input = document.getElementById('html-input');
const queryInput = document.getElementById('query-input');
const submit = document.getElementById('submit');
const searchButton = document.getElementById('search');
const searchError = document.getElementById('search-error');
const renderRoot = document.getElementById('render-root');

let lastMapState = null;

submit.addEventListener('click', () => {
    parseHTML(input.value)
        .then(({ tree, map }) => {
            lastMapState = map;
            renderTree(tree);
        })
        .catch(error => {
            lastMapState = null;
            console.error(error);
            renderError(input.value, error);
        });
});

searchButton.addEventListener('click', () => {
    searchError.innerText = '';
    search(lastMapState, queryInput.value)
        .then(({ tree, map }) => {
            lastMapState = map;
            renderTree(tree);
        })
        .catch(error => {
            console.error(error);
            searchError.innerText = error.message;
        });
});

function renderError(sourceCode, error) {
    renderRoot.innerHTML = '';
    const codeWrap = document.createElement('pre');

    const errorText = document.createElement('span');
    errorText.className = 'error-text';
    errorText.innerText = `${error.message}`;

    if (error.source) {
        const codeBeforeError = sourceCode.substring(0, error.source.startIndex);
        const invalidCode = sourceCode.substring(error.source.startIndex, error.source.endIndex + 1);
        const codeAfterError = sourceCode.substring(error.source.endIndex + 1);

        const invalidCodeWrapper = document.createElement('span');
        invalidCodeWrapper.className = 'invalid-code';
        invalidCodeWrapper.innerText = invalidCode;

        codeWrap.append(codeBeforeError);
        codeWrap.appendChild(invalidCodeWrapper);

        const invalidLineEndIndex = codeAfterError.indexOf('\n');

        const endOfInvalidLine = codeAfterError.substring(0, invalidLineEndIndex);
        const lastPathOfCode = codeAfterError.substring(invalidLineEndIndex);

        codeWrap.append(`${endOfInvalidLine}\n`);
        codeWrap.appendChild(errorText);
        codeWrap.append(lastPathOfCode);
    } else {
        codeWrap.append(`${sourceCode}\n`);
        codeWrap.append(errorText);
    }

    renderRoot.appendChild(codeWrap);
}

function renderNode(node) {
    const wrap = document.createElement('div');
    wrap.className = classNames('node', node.isOpen && 'node--open', node.isFound && 'node--found');

    if (node.type === 'text') {
        const textWrap = document.createElement('div');
        textWrap.className = 'node__text';
        textWrap.innerText = node.text;
        wrap.appendChild(textWrap);

        return wrap;
    }

    const canToggle = Boolean(node.children.length);

    const titleWrap = document.createElement('div');
    titleWrap.className = classNames('node__title', canToggle && 'node__title--toggle');

    if (canToggle) {
        titleWrap.addEventListener('click', () => {
            wrap.classList.toggle('node--open');
        });
    }

    const nameWrap = document.createElement('span');
    nameWrap.className = 'node__name';
    nameWrap.innerText = node.name;

    titleWrap.appendChild(nameWrap);

    if (Array.isArray(node.attributes)) {
        node.attributes.map(attr => {
            const attrWrap = document.createElement('div');
            attrWrap.className = 'node__attr';

            const attrNameWrap = document.createElement('span');
            attrNameWrap.className = 'node__attr-name';
            attrNameWrap.innerText = attr.name;

            const attrValueWrap = document.createElement('span');
            attrValueWrap.className = 'node__attr-value';
            attrValueWrap.innerText = `"${attr.value}"`;

            attrWrap.appendChild(attrNameWrap);
            attrWrap.appendChild(attrValueWrap);

            titleWrap.appendChild(attrWrap);
        });
    }

    wrap.appendChild(titleWrap);

    if (Array.isArray(node.children)) {
        node.children.map(childElement => {
            wrap.appendChild(renderNode(childElement));
        });
    }
    return wrap;
}

function renderTree(tree) {
    renderRoot.innerHTML = '';
    if (tree) {
        const treeElement = renderNode(tree);

        renderRoot.appendChild(treeElement);
    }
}

function classNames(...classes) {
    return classes
        .filter(Boolean)
        .map(cssClass => cssClass.trim())
        .join(' ');
}
