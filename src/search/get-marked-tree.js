import { getMatchedNode, combinatorsCodes } from './combinators';

export function isMatchNodeByQuery(node, map, query) {
    const [currentSelector, ...tail] = query;

    if (!currentSelector) {
        return true;
    }

    const matchedNode = getMatchedNode(node, map, currentSelector);

    if (matchedNode) {
        return isMatchNodeByQuery(matchedNode, map, tail);
    }

    return false;
}

// Возвращает дерево, с помеченными нодами
// в соответствии с исходным query
function getMarkedTree(map = {}, sourceQuery = []) {
    const query = [...sourceQuery];
    query.reverse();

    // Костыль для того чтобы находить только одну ноду по ID
    // TODO: Придумать что-нибудь получше
    const hasIdInQuery = query.some(selector => selector.type === combinatorsCodes.ID_ATTR);
    let foundSomeNode = false;

    // Помечаем найденную ноду
    const nodesArray = Object.values(map);
    const resultNodes = nodesArray.map(node => {
        if (node.type !== 'tag') {
            return node;
        }

        // В запросе был ID и мы уже что-то нашли
        // ТК Id уникальные значить искать дальше нет смысла
        if (hasIdInQuery && foundSomeNode) {
            node.isFound = false;
            return node;
        }

        if (isMatchNodeByQuery(node, map, query)) {
            node.isFound = true;
            foundSomeNode = true;
            return node;
        }
        node.isFound = false;
        return node;
    });

    // закрываем на всякий случай все ноды
    for (const node of nodesArray) {
        if (node.type === 'tag') {
            node.isOpen = false;
        }
    }

    // Раскрываем путь до ноды
    const foundNodes = resultNodes.filter(node => node.isFound);
    for (const foundNode of foundNodes) {
        if (foundNode && foundNode.parentId !== null) {
            let currentNodeToOpen = map[foundNode.parentId];
            while (currentNodeToOpen) {
                currentNodeToOpen.isOpen = true;
                currentNodeToOpen = map[currentNodeToOpen.parentId];
            }
        }
    }

    return {
        // only for simple render
        tree: resultNodes.find(node => !node.parentId),
        map: resultNodes.reduce((result, node) => ({ ...result, [node.id]: node }), {})
    };
}

export default getMarkedTree;
