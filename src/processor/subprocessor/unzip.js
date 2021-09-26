import { mkdtempSync, readdirSync } from 'fs';

import { tmpdir } from 'os';
import { join } from 'path';
import extract from 'extract-zip';
import { APP_PREFIX } from '../../constants';


export async function process(paths) {
  const tmpDir = mkdtempSync(join(tmpdir(), APP_PREFIX));
  
  await extract(paths[0], { dir: tmpDir });
  
  return readdirSync(tmpDir).map(fileName => join(tmpDir, fileName));
}

export const rank = Number.MIN_VALUE;
export const name = 'Descompressor';