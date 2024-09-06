import ts from 'npm:typescript@5.5.3';
import { libs } from '../lib/mod.ts';
import { Parser } from '../src/parser.ts';
import { SerializedAst } from '../src/types.ts';

const libFiles = libs.map((file) => `./lib/${file}`);
const program = ts.createProgram(libFiles, { noLib: true });
const parser = new Parser(program);
const result = parser.parse();

// For regular serialized:
const obj: Record<string, SerializedAst[]> = {};
for (const [k, v] of Object.entries(result)) {
    obj[k] = v.map((x) => x.serialize());
}
console.log(JSON.stringify(obj, null, 2));
