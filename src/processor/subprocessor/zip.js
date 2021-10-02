import { createWriteStream, readdirSync} from 'fs';
import archiverFn from 'archiver';
import makeTempDirectory from '../../util/makeTempDirectory';
import getFolderSize from 'get-folder-size';

export async function process(path, statusCallback) {
    const archive = archiverFn('zip', {
        zlib: {
            level: 1
        }
    });

    const folderPath = await path;

    const {size: folderSize} = await getFolderSize(folderPath);

    archive.on('progress', function (progress) {
        const percent = progress.fs.processedBytes / folderSize * 100;

        statusCallback(percent);
    });

    const tmpDir = makeTempDirectory();

    const versionNumber = readdirSync(folderPath).some(name => name.includes(".b5b")) ? 5 : 4;

    const backupPath = tmpDir + `/backup.b${versionNumber}bz`;

    const output = createWriteStream(backupPath);

    archive.pipe(output);

    archive.directory(folderPath, false);

    archive.finalize();

    return new Promise((resolve) => {
        output.on('close', () => {
            resolve(backupPath);
        });
    });
}

export const name = 'Compressor';
export const rank = Number.MAX_VALUE;