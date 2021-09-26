import { lstatSync, createReadStream, createWriteStream, readdirSync } from 'fs';
import { createInterface } from 'readline';
import { mkdtempSync } from 'fs';

import { tmpdir } from 'os';
import { join, sep as pathSeparator } from 'path';

const appPrefix = 'biblivre-backup-retrofitter';

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
    if (!lstatSync(path).isFile()) {
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

function _processFileOfInterest(path, dest) {
    const pathParts = path.split(pathSeparator);
    
    const fileName = pathParts[pathParts.length - 1];

    const destinationPath = join(dest, fileName)

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

    readInterface.on('close', () => destinationFile.close());
}

export const rank = 9.1;

export async function process(paths) {
    const tmpDir = mkdtempSync(join(tmpdir(), appPrefix));

    const resolvedPaths = await paths;

    resolvedPaths
        .filter(_isFileOfInterest)
        .forEach(path => _processFileOfInterest(path, tmpDir));

    return readdirSync(tmpDir).map(fileName => join(tmpDir, fileName));
}

export const name = 'Processador PostgreSQL 9.2';