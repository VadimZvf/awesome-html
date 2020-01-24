import createQuery from './create-query';
import getMarkedTree from './getMarkedTree';

function search(sourceMap, queryString) {
    const query = createQuery(queryString);
    const { map, tree } = getMarkedTree(sourceMap, query);

    return { map, tree };
}

export default search;
