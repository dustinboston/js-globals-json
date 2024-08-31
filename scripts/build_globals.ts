import { libs } from '../lib/mod.ts';
import { Parser } from '../src/parser.ts';

const libFiles = libs.map((file) => `./lib/${file}`);
const parser = new Parser(libFiles);
const result = parser.parse();
console.log(JSON.stringify(result, null, 2));
