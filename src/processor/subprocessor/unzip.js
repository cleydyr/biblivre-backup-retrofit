import extract from 'extract-zip';
import makeTempDirectory from '../../util/makeTempDirectory';


export async function process(path) {
  const tmpDir = makeTempDirectory();
  
  await extract(path, { dir: tmpDir });
  
  return tmpDir;
}

export const rank = Number.MIN_VALUE;
export const name = 'Descompressor';