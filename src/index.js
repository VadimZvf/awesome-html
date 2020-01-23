import parseHTML from './parser';

const input = document.getElementById('input');
const submit = document.getElementById('submit');

submit.addEventListener('click', () => {
    parseHTML(input.value)
        .then(({ tree, map }) => {
            console.log(tree, map);
        })
        .catch(error => {
            console.error(error);
        });
});
