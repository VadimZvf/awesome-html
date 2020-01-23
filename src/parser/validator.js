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
    const invalidNode = nodesArray.find(node => !validTagsNames.includes(node.name));
    if (invalidNode) {
        const error = new Error(errors.INVALID_TAG.getMessage(invalidNode));
        error.code = errors.INVALID_TAG.code;
        error.source = invalidNode.source;
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
