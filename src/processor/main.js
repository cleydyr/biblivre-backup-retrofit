const normalizedPath = require('path').join(__dirname, 'subprocessor');

const subprocessors = require('fs').readdirSync(normalizedPath).map(file => require("./subprocessor/" + file));

async function process(path, statusCallback) {
    return subprocessors
        .sort((s1, s2) => s1.rank - s2.rank)
        .reduce(async (acc, cur, index, array) => {
            console.log(cur.name);

            const data = {
                progress: 100*index/array.length,
                phase: `${cur.name} (${index + 1} de ${array.length})`,
                fileName: path,
            };

            statusCallback(data);

            const paths = await cur.process(acc, (percent) => statusCallback({
                progress: 100*index/array.length + percent/array.length,
                phase: `${cur.name} (${index + 1} de ${array.length})`,
                fileName: path,
            }));

            return paths;
        }, [path]);
}

module.exports = {process};