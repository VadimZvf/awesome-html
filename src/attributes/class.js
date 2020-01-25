export default {
    name: 'class',
    querySymbol: '.',
    isMatch: (stringValue, query) => {
        const classes = query.split('.');

        return classes.every(className => stringValue.includes(className));
    }
};
