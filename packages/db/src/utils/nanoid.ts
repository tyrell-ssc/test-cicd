import { customAlphabet } from 'nanoid';

const alphabet = '2346789abcdefghijkmnpqrtwxyzABCDEFGHJKLMNPQRTUVWXYZ';
export const nanoid = customAlphabet(alphabet, 12);
