import { lstatSync, createReadStream, createWriteStream, readdirSync } from 'fs';
import { createInterface } from 'readline';
import { mkdtempSync, copyFileSync } from 'fs';
import { copySync } from 'fs-extra';
import { tmpdir } from 'os';
import { join, sep as pathSeparator } from 'path';
import { APP_PREFIX } from '../../constants';

const acceptedConfigs = [
    'search_path',
    'default_tablespace',
    'temp_tablespaces',
    'check_function_bodies',
    'default_transaction_isolation',
    'default_transaction_read_only',
    'default_transaction_deferrable',
    'session_replication_role',
    'statement_timeout',
    'vacuum_freeze_table_age',
    'vacuum_freeze_min_age',
    'bytea_output',
    'xmlbinary',
    'xmloption',
    'DateStyle',
    'IntervalStyle',
    'TimeZone',
    'timezone_abbreviations',
    'extra_float_digits',
    'client_encoding',
    'lc_messages',
    'lc_monetary',
    'lc_numeric',
    'lc_time',
    'default_text_search_config',
    'dynamic_library_path',
    'gin_fuzzy_search_limit',
    'local_preload_libraries',
];

function _isFileOfInterest(path) {
    if (lstatSync(path).isDirectory()) {
        return false;
    }

    if (!path.endsWith('.b4b') && !path.endsWith('.b5b')) {
        return false;
    }

    return true;
}

function _isLineToBeRemoved(line) {
    if (!line.startsWith('SET ')) {
        return false;
    }

    const words = line.split(' ');

    const config = words[1];

    return !acceptedConfigs.includes(config);
}

function _getDestinationPath(path, dest) {
    const pathParts = path.split(pathSeparator);
    
    const fileName = pathParts[pathParts.length - 1];

    return join(dest, fileName)
}

function _processFileOfInterest(path, dest) {
    const destinationPath = _getDestinationPath(path, dest);

    const destinationFile = createWriteStream(destinationPath);

    const readInterface = createInterface({
        input: createReadStream(path),
        console: false
    });

    readInterface.on('line', (line) => {
        if (!_isLineToBeRemoved(line)) {
            destinationFile.write(line + '\n');
        }
    });

    return new Promise((resolve) => {
        readInterface.on('close', () => {
            destinationFile.close();
            resolve();
        });
    });
}

export const rank = 9.1;

export async function process(paths) {
    const tmpDir = mkdtempSync(join(tmpdir(), APP_PREFIX));

    const resolvedPaths = await paths;

    resolvedPaths
        .filter(path => !_isFileOfInterest(path))
        .forEach(path => {
            copySync(path, _getDestinationPath(path, tmpDir));
        });

    await Promise.all(resolvedPaths
        .filter(_isFileOfInterest)
        .map(path => _processFileOfInterest(path, tmpDir)));

    return readdirSync(tmpDir).map(fileName => join(tmpDir, fileName));
}

export const name = 'Processador PostgreSQL 9.2';