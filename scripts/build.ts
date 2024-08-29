import { libs } from '../lib/mod.ts';
import { Parser } from '../src/parser.ts';

const parser = new Parser(libs.map((file) => `./lib/${file}`));
const result = parser.parse();
console.log(JSON.stringify(result, null, 2));
