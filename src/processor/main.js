const normalizedPath = require('path').join(__dirname, 'subprocessor');

const subprocessors = require('fs').readdirSync(normalizedPath).map(file => require("./subprocessor/" + file));

async function process(path, statusCallback) {
    return subprocessors
        .sort((s1, s2) => s1.rank - s2.rank)
        .reduce(async (acc, cur, index, array) => {
            console.log(cur.name);

            const paths = await cur.process(acc);

            const data = {
                progress: 100*(index + 1)/array.length,
                phase: cur.name,
                fileName: path,
            };

            statusCallback(data);

            return paths;
        }, [path]);
}

module.exports = {process};