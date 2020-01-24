import './index.css';
import parseHTML from './parser';

const input = document.getElementById('html-input');
// const queryInput = document.getElementById('query-input');
const submit = document.getElementById('submit');
// const search = document.getElementById('search');
const renderRoot = document.getElementById('render-root');

submit.addEventListener('click', () => {
    parseHTML(input.value)
        .then(({ tree, map }) => {
            console.log(tree, map);
            renderTree(tree);
        })
        .catch(error => {
            console.error(error);
            renderError(input.value, error);
        });
});

function renderError(sourceCode, error) {
    renderRoot.innerHTML = '';
    const codeWrap = document.createElement('pre');

    if (error.source) {
        const codeBeforeError = sourceCode.substring(0, error.source.startIndex);
        const invalidCode = sourceCode.substring(error.source.startIndex, error.source.endIndex + 1);
        const codeAfterError = sourceCode.substring(error.source.endIndex + 1);

        const invalidCodeWrapper = document.createElement('span');
        invalidCodeWrapper.className = 'invalid-code';
        invalidCodeWrapper.innerText = invalidCode;

        codeWrap.append(codeBeforeError);
        codeWrap.appendChild(invalidCodeWrapper);

        const errorText = document.createElement('span');
        errorText.className = 'error-text';
        errorText.innerText = `${error.message}`;

        const invalidLineEndIndex = codeAfterError.indexOf('\n');

        if (invalidLineEndIndex !== null) {
            const endOfInvalidLine = codeAfterError.substring(0, invalidLineEndIndex);
            const lastPathOfCode = codeAfterError.substring(invalidLineEndIndex);

            codeWrap.append(`${endOfInvalidLine}\n`);
            codeWrap.appendChild(errorText);
            codeWrap.append(lastPathOfCode);
        } else {
            codeWrap.appendChild(errorText);
            codeWrap.append(codeAfterError);
        }
    }

    renderRoot.appendChild(codeWrap);
}

function renderNode(node) {
    const wrap = document.createElement('div');
    wrap.className = 'node';

    if (node.type === 'text') {
        const textWrap = document.createElement('div');
        textWrap.className = 'node__text';
        textWrap.innerText = node.text;
        wrap.appendChild(textWrap);

        return wrap;
    }

    const titleWrap = document.createElement('div');
    titleWrap.className = 'node__title';

    const nameWrap = document.createElement('span');
    nameWrap.className = 'node__name';
    nameWrap.innerText = node.name;

    titleWrap.appendChild(nameWrap);

    if (node.attributes && node.attributes.length) {
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

    if (node.children && node.children.length) {
        node.children
            .map(child => renderNode(child))
            .map(childElement => {
                wrap.appendChild(childElement);
            });
    }
    return wrap;
}

function renderTree(tree) {
    renderRoot.innerHTML = '';
    const treeElement = renderNode(tree);

    renderRoot.appendChild(treeElement);
}
