import './index.css';
import parseHTML from './parser';

const input = document.getElementById('input');
const submit = document.getElementById('submit');
const treeRoot = document.getElementById('render-tree-root');

submit.addEventListener('click', () => {
    parseHTML(input.value)
        .then(({ tree, map }) => {
            console.log(tree, map);
            renderTree(tree);
        })
        .catch(error => {
            console.error(error);
        });
});

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
    treeRoot.innerHTML = '';
    const treeElement = renderNode(tree);

    treeRoot.appendChild(treeElement);
}
