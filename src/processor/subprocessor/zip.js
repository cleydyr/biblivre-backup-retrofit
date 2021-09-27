import { createWriteStream} from 'fs';
import { sep as pathSeparator } from 'path';
import archiverFn from 'archiver';
import makeTempDirectory from '../../util/makeTempDirectory';
import getFolderSize from 'get-folder-size';

export async function process(paths, statusCallback) {
    const archive = archiverFn('zip', {
        zlib: {
            level: 1
        }
    });

    const resolvedPath = (await paths)[0];

    const lastIndexOfPathSeparator = resolvedPath.lastIndexOf(pathSeparator);

    const folderPath = resolvedPath.substring(0, lastIndexOfPathSeparator);

    const {size: folderSize} = await getFolderSize(folderPath);

    archive.on('progress', function (progress) {
        const percent = progress.fs.processedBytes / folderSize * 100;

        statusCallback(percent);
    });

    const tmpDir = makeTempDirectory();

    const backupPath = tmpDir + '/backup.b4bz';

    const output = createWriteStream(backupPath);

    archive.pipe(output);

    archive.directory(folderPath, false);

    archive.finalize();

    return new Promise((resolve) => {
        output.on('close', () => {
            resolve([backupPath]);
        });
    });
}

export const name = 'Compressor';
export const rank = Number.MAX_VALUE;