export default {
    name: 'class',
    querySymbol: '.',
    isMatch: (stringValue, query) => {
        return stringValue.includes(query);
    }
};
