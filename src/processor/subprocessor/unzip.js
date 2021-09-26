import { readdirSync } from 'fs';

import { join } from 'path';
import extract from 'extract-zip';
import makeTempDirectory from '../../util/makeTempDirectory';


export async function process(paths) {
  const tmpDir = makeTempDirectory();
  
  await extract(paths[0], { dir: tmpDir });
  
  return readdirSync(tmpDir).map(fileName => join(tmpDir, fileName));
}

export const rank = Number.MIN_VALUE;
export const name = 'Descompressor';