export default {
    name: 'id',
    querySymbol: '#',
    isMatch: (stringValue, query) => {
        return stringValue === query;
    }
};
