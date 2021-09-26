import { mkdtempSync, readdirSync } from 'fs';

import { tmpdir } from 'os';
import { join } from 'path';
import extract from 'extract-zip';

const appPrefix = 'biblivre-backup-retrofitter';

export const rank = Number.MIN_VALUE;

export async function process(paths) {
  const tmpDir = mkdtempSync(join(tmpdir(), appPrefix));

  await extract(paths[0], { dir: tmpDir });

  return readdirSync(tmpDir).map(fileName => join(tmpDir, fileName));
}

export const name = 'Descompressor';