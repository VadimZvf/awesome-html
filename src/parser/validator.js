import * as errors from './errors';

function getNodesByName(nodesArray, tagName) {
    return nodesArray.filter(node => {
        return node.name === tagName;
    });
}

function visitNodes(nodes, visitor, tree, map) {
    for (const node of nodes) {
        visitor(node, tree, map);
    }
}

function validate(tree, map, tags) {
    const nodesArray = Object.values(map);

    const validTagsNames = tags.map(tag => tag.name);
    const invalidNode = nodesArray.find(node => node.type === 'tag' && !validTagsNames.includes(node.name));
    if (invalidNode) {
        const error = new Error(errors.INVALID_TAG.getMessage(invalidNode));
        error.code = errors.INVALID_TAG.code;
        error.source = invalidNode.source;
        throw error;
    }

    const roots = nodesArray.filter(node => node.parentId === null);
    if (roots.length > 1) {
        const error = new Error(errors.TOO_MANY_ROOTS.getMessage());
        error.code = errors.TOO_MANY_ROOTS.code;
        error.source = roots[0].source;
        throw error;
    }

    for (const tag of tags) {
        const tagName = tag.name;

        const foundNodes = getNodesByName(nodesArray, tagName);
        visitNodes(foundNodes, tag.visitor, tree, map);
    }

    return true;
}

export default validate;
