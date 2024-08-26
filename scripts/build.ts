import fs from 'node:fs';
import { libs } from '../lib/mod.ts';
import { Parser } from '../src/parser.ts';
import { SerializedObjectProperty } from '../src/types.ts';

const parser = new Parser();

for (let i = 0; i < libs.length; i++) {
	const file = libs[i];
	const path = `./lib/${file}`;
	const data = fs.readFileSync(path, { encoding: 'utf8' });

	parser.parse(file, data);
}

const builtIns = parser.getBuiltIns();
const builtInsObject: Record<string, SerializedObjectProperty[]> = {};
for (const builtIn of builtIns) {
	const name = builtIn.name;
	if (!name) continue;
	if (!builtInsObject[name]) builtInsObject[name] = [];
	builtInsObject[name].push(builtIn);
}
console.log(JSON.stringify(builtInsObject, null, 2));
