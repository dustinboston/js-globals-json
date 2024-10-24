import { assert } from "@std/assert";
import globalsJson from "../globals.json" with { type: "json" };

Deno.test('Static method "Array.from" exists', () => {
  assert(Object.hasOwn(globalsJson, "Array.from"));
});

Deno.test('Static property "Array[Symbol.species]" exists', () => {
  assert(Object.hasOwn(globalsJson, "Array[Symbol.species]"));
});

Deno.test('Instance method "Array.prototype.at" exists', () => {
  assert(Object.hasOwn(globalsJson, "Array.prototype.at"));
});

Deno.test('Instance property "Array.prototype.length" exists', () => {
  assert(Object.hasOwn(globalsJson, "Array.prototype.length"));
});
