import createQuery from './create-query';
import getMarkedTree from './get-marked-tree';

function search(sourceMap, queryString) {
    return new Promise((resolve, reject) => {
        try {
            const query = createQuery(queryString);
            const { map, tree } = getMarkedTree(sourceMap, query);
            resolve({ map, tree });
        } catch (err) {
            reject(err);
        }
    });
}

export default search;
