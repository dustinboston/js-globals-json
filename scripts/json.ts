import { libs } from '../lib/mod.ts';
import { Parser } from '../src/parser.ts';
import { SerializedAst } from '../src/types.ts';

const libFiles = libs.map((file) => `./lib/${file}`);
const parser = new Parser(libFiles);
const result = parser.parse();

// For regular serialized:
const obj: Record<string, SerializedAst[]> = {};
for (const [k, v] of Object.entries(result)) {
    obj[k] = v.map((x) => x.serialize());
}
console.log(JSON.stringify(obj, null, 2));
