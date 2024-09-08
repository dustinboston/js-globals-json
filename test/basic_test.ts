import { assert } from '@std/assert';
import json from '../globals.json' with { type: 'json' };

Deno.test('Test AggregateError exists', () => {
    assert(Object.hasOwn(json, 'AggregateError'));
});

Deno.test('Test Array exists', () => {
    assert(Object.hasOwn(json, 'Array'));
});

Deno.test('Test ArrayBuffer exists', () => {
    assert(Object.hasOwn(json, 'ArrayBuffer'));
});

Deno.test('Test Atomics exists', () => {
    assert(Object.hasOwn(json, 'Atomics'));
});

Deno.test('Test BigInt exists', () => {
    assert(Object.hasOwn(json, 'BigInt'));
});

Deno.test('Test BigInt64Array exists', () => {
    assert(Object.hasOwn(json, 'BigInt64Array'));
});

Deno.test('Test BigUint64Array exists', () => {
    assert(Object.hasOwn(json, 'BigUint64Array'));
});

Deno.test('Test Boolean exists', () => {
    assert(Object.hasOwn(json, 'Boolean'));
});

Deno.test('Test DataView exists', () => {
    assert(Object.hasOwn(json, 'DataView'));
});

Deno.test('Test Date exists', () => {
    assert(Object.hasOwn(json, 'Date'));
});

Deno.test('Test decodeURI exists', () => {
    assert(Object.hasOwn(json, 'decodeURI'));
});

Deno.test('Test decodeURIComponent exists', () => {
    assert(Object.hasOwn(json, 'decodeURIComponent'));
});

Deno.test('Test encodeURI exists', () => {
    assert(Object.hasOwn(json, 'encodeURI'));
});

Deno.test('Test encodeURIComponent exists', () => {
    assert(Object.hasOwn(json, 'encodeURIComponent'));
});

Deno.test('Test Error exists', () => {
    assert(Object.hasOwn(json, 'Error'));
});

Deno.test('Test escape exists', () => {
    assert(Object.hasOwn(json, 'escape'));
});

Deno.test('Test eval exists', () => {
    assert(Object.hasOwn(json, 'eval'));
});

Deno.test('Test EvalError exists', () => {
    assert(Object.hasOwn(json, 'EvalError'));
});

Deno.test('Test FinalizationRegistry exists', () => {
    assert(Object.hasOwn(json, 'FinalizationRegistry'));
});

Deno.test('Test Float32Array exists', () => {
    assert(Object.hasOwn(json, 'Float32Array'));
});

Deno.test('Test Float64Array exists', () => {
    assert(Object.hasOwn(json, 'Float64Array'));
});

Deno.test('Test Function exists', () => {
    assert(Object.hasOwn(json, 'Function'));
});

Deno.test('Test Infinity exists', () => {
    assert(Object.hasOwn(json, 'Infinity'));
});

Deno.test('Test Int16Array exists', () => {
    assert(Object.hasOwn(json, 'Int16Array'));
});

Deno.test('Test Int32Array exists', () => {
    assert(Object.hasOwn(json, 'Int32Array'));
});

Deno.test('Test Int8Array exists', () => {
    assert(Object.hasOwn(json, 'Int8Array'));
});

Deno.test('Test isFinite exists', () => {
    assert(Object.hasOwn(json, 'isFinite'));
});

Deno.test('Test isNaN exists', () => {
    assert(Object.hasOwn(json, 'isNaN'));
});

Deno.test('Test JSON exists', () => {
    assert(Object.hasOwn(json, 'JSON'));
});

Deno.test('Test Map exists', () => {
    assert(Object.hasOwn(json, 'Map'));
});

Deno.test('Test Math exists', () => {
    assert(Object.hasOwn(json, 'Math'));
});

Deno.test('Test NaN exists', () => {
    assert(Object.hasOwn(json, 'NaN'));
});

Deno.test('Test Number exists', () => {
    assert(Object.hasOwn(json, 'Number'));
});

Deno.test('Test Object exists', () => {
    assert(Object.hasOwn(json, 'Object'));
});

Deno.test('Test parseFloat exists', () => {
    assert(Object.hasOwn(json, 'parseFloat'));
});

Deno.test('Test parseInt exists', () => {
    assert(Object.hasOwn(json, 'parseInt'));
});

Deno.test('Test Promise exists', () => {
    assert(Object.hasOwn(json, 'Promise'));
});

Deno.test('Test Proxy exists', () => {
    assert(Object.hasOwn(json, 'Proxy'));
});

Deno.test('Test RangeError exists', () => {
    assert(Object.hasOwn(json, 'RangeError'));
});

Deno.test('Test ReferenceError exists', () => {
    assert(Object.hasOwn(json, 'ReferenceError'));
});

Deno.test('Test RegExp exists', () => {
    assert(Object.hasOwn(json, 'RegExp'));
});

Deno.test('Test Set exists', () => {
    assert(Object.hasOwn(json, 'Set'));
});

Deno.test('Test SharedArrayBuffer exists', () => {
    assert(Object.hasOwn(json, 'SharedArrayBuffer'));
});

Deno.test('Test String exists', () => {
    assert(Object.hasOwn(json, 'String'));
});

Deno.test('Test Symbol exists', () => {
    assert(Object.hasOwn(json, 'Symbol'));
});

Deno.test('Test SyntaxError exists', () => {
    assert(Object.hasOwn(json, 'SyntaxError'));
});

Deno.test('Test TypeError exists', () => {
    assert(Object.hasOwn(json, 'TypeError'));
});

Deno.test('Test Uint16Array exists', () => {
    assert(Object.hasOwn(json, 'Uint16Array'));
});

Deno.test('Test Uint32Array exists', () => {
    assert(Object.hasOwn(json, 'Uint32Array'));
});

Deno.test('Test Uint8Array exists', () => {
    assert(Object.hasOwn(json, 'Uint8Array'));
});

Deno.test('Test Uint8ClampedArray exists', () => {
    assert(Object.hasOwn(json, 'Uint8ClampedArray'));
});

Deno.test('Test unescape exists', () => {
    assert(Object.hasOwn(json, 'unescape'));
});

Deno.test('Test URIError exists', () => {
    assert(Object.hasOwn(json, 'URIError'));
});

Deno.test('Test WeakMap exists', () => {
    assert(Object.hasOwn(json, 'WeakMap'));
});

Deno.test('Test WeakRef exists', () => {
    assert(Object.hasOwn(json, 'WeakRef'));
});

Deno.test('Test WeakSet exists', () => {
    assert(Object.hasOwn(json, 'WeakSet'));
});

// These classes are created through syntax and have been intentionally excluded.

Deno.test('Test AsyncFunction does NOT exist', () => {
    assert(!Object.hasOwn(json, 'AsyncFunction'));
});

Deno.test('Test AsyncGenerator does NOT exist', () => {
    assert(!Object.hasOwn(json, 'AsyncGenerator'));
});

Deno.test('Test AsyncGeneratorFunction does NOT exist', () => {
    assert(!Object.hasOwn(json, 'AsyncGeneratorFunction'));
});

Deno.test('Test AsyncIterator does NOT exist', () => {
    assert(!Object.hasOwn(json, 'AsyncIterator'));
});

Deno.test('Test Float16Array does NOT exist', () => {
    assert(!Object.hasOwn(json, 'Float16Array'));
});

Deno.test('Test Generator does NOT exist', () => {
    assert(!Object.hasOwn(json, 'Generator'));
});

Deno.test('Test GeneratorFunction DOES not exist', () => {
    assert(!Object.hasOwn(json, 'GeneratorFunction'));
});

Deno.test('Test Intl does NOT exist (Intl is a namespace)', () => {
    assert(!Object.hasOwn(json, 'Intl'));
});

Deno.test('Test Iterator does NOT exist', () => {
    assert(!Object.hasOwn(json, 'Iterator'));
});

Deno.test('Test Reflect does NOT exist', () => {
    assert(!Object.hasOwn(json, 'Reflect'));
});

Deno.test('Test TypedArray does NOT exist', () => {
    assert(!Object.hasOwn(json, 'TypedArray'));
});

Deno.test('Test undefined does NOT exist', () => {
    assert(!Object.hasOwn(json, 'undefined'));
});
