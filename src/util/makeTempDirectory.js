import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { APP_PREFIX } from '../constants';

export default function () {
    return mkdtempSync(join(tmpdir(), APP_PREFIX));
}