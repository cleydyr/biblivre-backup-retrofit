import {sep as pathSeparator} from 'path';

export default function fileName(path) {
    const fileParts = path.split(pathSeparator);

    return fileParts[fileParts.length - 1];
}