const normalizedPath = require('path').join(__dirname, 'subprocessor');

const subprocessors = require('fs').readdirSync(normalizedPath).map(file => require("./subprocessor/" + file));

function process(path, statusCallback) {
    subprocessors
        .sort((s1, s2) => s1.rank - s2.rank)
        .reduce(async (acc, cur, index, array) => {
            console.log(cur.name);

            const paths = await cur.process(acc);

            console.log(paths);

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