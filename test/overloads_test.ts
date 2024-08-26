import { assert } from './deps.ts';
import globalsJson from '../js-globals.json' with { type: 'json' };
import { assertEquals } from './deps.ts';

Deno.test('new Array()', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Constructor' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta[0] === 'Optional'
        );
    });

    assert(found.length === 1);
});

Deno.test('new Array(n)', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Constructor' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta.length === 0
        );
    });

    assert(found.length === 1);
});

Deno.test('new Array(...rest)', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Constructor' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta[0] === 'Rest'
        );
    });

    assert(found.length === 1);
});

Deno.test('Array()', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Function' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta[0] === 'Optional'
        );
    });

    assert(found.length === 1);
});

Deno.test('Array(n)', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Function' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta.length === 0
        );
    });

    assert(found.length === 1);
});

Deno.test('Array(...rest)', () => {
    const globalArray = globalsJson['Array'];
    const found = globalArray.filter((a) => {
        return (
            a.kind === 'Function' &&
            a.parameters.length === 1 &&
            a.parameters[0] &&
            a.parameters[0].meta[0] === 'Rest'
        );
    });

    assert(found.length === 1);
});
