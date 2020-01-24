import attributes from '../attributes';

const attributesMatcher = {
    [attributes.class.name]: attributes.class.isMatch,
    [attributes.id.name]: attributes.id.isMatch
};

export function isMatchNode(map, node, query) {
    const [currentSelector, ...tail] = query;

    if (!currentSelector) {
        return true;
    }

    const isMatch = node.attributes.find(
        attr =>
            attr.name === currentSelector.name &&
            attributesMatcher[currentSelector.name](attr.value, currentSelector.value)
    );

    if (isMatch) {
        return isMatchNode(map, map[node.parentId], tail);
    }

    return false;
}

// Возвращает дерево, с помеченными нодами
// в соответствии с исходным query
export function getMarkedTree(map, sourceQuery) {
    const query = [...sourceQuery];
    query.reverse();

    // Помечаем найденную ноду
    const nodesArray = Object.values(map);
    const resultNodes = nodesArray.map(node => {
        if (isMatchNode(map, node, query)) {
            node.isFound = true;
            return node;
        }
        node.isFound = false;
        return node;
    });

    // закрываем на всякий случай все ноды
    for (const node of nodesArray) {
        node.isOpen = false;
    }

    // Раскрываем путь до ноды
    const foundNode = resultNodes.find(node => node.isFound);
    if (foundNode && foundNode.parentId !== null) {
        let currentNodeToOpen = map[foundNode.parentId];
        while (currentNodeToOpen) {
            currentNodeToOpen.isOpen = true;
            currentNodeToOpen = map[currentNodeToOpen.parentId];
        }
    }

    return {
        // only for simple render
        tree: resultNodes.find(node => !node.parentId),
        map: resultNodes.reduce((result, node) => ({ ...result, [node.id]: node }), {})
    };
}
