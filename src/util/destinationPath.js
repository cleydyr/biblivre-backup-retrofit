import {join} from 'path';
import fileName from './fileName';

export function destinationPath(source, dest) {
    return join(dest, fileName(source));
}