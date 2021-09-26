import { createWriteStream, lstatSync, mkdtempSync, readdirSync } from 'fs';
import { tmpdir } from 'os';
import { join, sep as pathSeparator } from 'path';
import archiverFn from 'archiver';
import { APP_PREFIX } from '../../constants';

const archive = archiverFn('zip', {
    zlib: {
        level: 9
    }
});

function _isFolder(path) {
    console.log(`_isFolder(${path}): ${lstatSync(path).isDirectory()}`);

    return lstatSync(path).isDirectory();
}

export async function process(paths) {
    const resolvedPath = (await paths)[0];

    const lastIndexOfPathSeparator = resolvedPath.lastIndexOf(pathSeparator);

    const folderPath = resolvedPath.substring(0, lastIndexOfPathSeparator);

    const tmpDir = mkdtempSync(join(tmpdir(), APP_PREFIX));

    const backupPath = tmpDir + '/backup.b4bz';

    const output = createWriteStream(backupPath);

    output.on('close', () => {
    });

    archive.pipe(output);

    archive.directory(folderPath, false);

    readdirSync(folderPath)
        .filter(fileName => _isFolder(join(folderPath, fileName)))
        .forEach(folderName => archive.directory(join(folderPath, folderName), folderName));

    archive.finalize();

    return [backupPath];
}

export const name = 'Compressor';
export const rank = Number.MAX_VALUE;