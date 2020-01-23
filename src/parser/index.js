import parse from './parser';
import validate from './validator';
import tags from './tags';

const tagsToCheck = [tags.html, tags.div];

function parseHTML(htmlString) {
    return new Promise((resolve, reject) => {
        try {
            const { tree, map } = parse(htmlString);
            validate(tree, map, tagsToCheck);

            resolve({ tree, map });
        } catch (err) {
            reject(err);
        }
    });
}

export default parseHTML;
