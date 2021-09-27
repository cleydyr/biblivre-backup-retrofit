import { createWriteStream, lstatSync, mkdtempSync, readdirSync } from 'fs';
import { join, sep as pathSeparator } from 'path';
import archiverFn from 'archiver';
import makeTempDirectory from '../../util/makeTempDirectory';

const archive = archiverFn('zip', {
    zlib: {
        level: 1
    }
});

function _isFolder(path) {
    return lstatSync(path).isDirectory();
}

export async function process(paths) {
    const resolvedPath = (await paths)[0];

    const lastIndexOfPathSeparator = resolvedPath.lastIndexOf(pathSeparator);

    const folderPath = resolvedPath.substring(0, lastIndexOfPathSeparator);

    const tmpDir = makeTempDirectory();

    const backupPath = tmpDir + '/backup.b4bz';

    const output = createWriteStream(backupPath);

    archive.pipe(output);

    archive.directory(folderPath, false);

    readdirSync(folderPath)
        .filter(fileName => _isFolder(join(folderPath, fileName)))
        .forEach(folderName => archive.directory(join(folderPath, folderName), folderName));

    archive.finalize();

    return new Promise((resolve) => {
        output.on('close', () => {
            resolve([backupPath]);
        });
    });
}

export const name = 'Compressor';
export const rank = Number.MAX_VALUE;