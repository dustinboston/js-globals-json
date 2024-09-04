import { assert } from './deps.ts';
import json from '../js-globals.json' with { type: 'json' };

Deno.test('The json is a list of key/value pairs', () => {
    assert(json !== null && typeof json === 'object');
    assert(Object.hasOwn(json, 'eval'));
});

Deno.test('Declarations are not double-posted', () => {
    assert(json.eval.length === 1);
});
