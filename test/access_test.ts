import { assert, assertEquals } from "@std/assert";
import globals from "../globals.json" with { type: "json" };
import { AstKind } from "../src/AstKind.ts";

const array = globals["Array"];
const keys = new Set(array.members.map((member) => member.name));

/*
interface Array<T> {
  length: number;
  splice(start: number, deleteCount?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
}

interface ArrayConstructor {
  new (arrayLength?: number): any[];
  new <T>(arrayLength: number): T[];
  new <T>(...items: T[]): T[];
  (arrayLength?: number): any[];
  <T>(arrayLength: number): T[];
  <T>(...items: T[]): T[];
  readonly prototype: any[];
  from<T>(arrayLike: ArrayLike<T>): T[];
  from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[];
}

declare var Array: ArrayConstructor;

interface Array<T> {
  includes(searchElement: T, fromIndex?: number): boolean;
}
*/

Deno.test('Instance property "Array::length" exists', () => {
  assert(keys.has("length"));
});

Deno.test('Instance method "Array::splice" exists', () => {
  assert(keys.has("splice"));
});

Deno.test('Constructor "Array.new" exists', () => {
  assert(keys.has("new"));
});

Deno.test('Constructor function "Array" exists', () => {
  const constructorFunctions = array.members.filter((member) => member.kind === AstKind[AstKind.Constructor] && member.name === undefined);
  assertEquals(constructorFunctions.length, 3);
});

Deno.test('Static property "Array::" exists', () => {
  assert(keys.has("prototype"));
});

Deno.test('Static property "Array[Symbol.species]" exists', () => {
  assert(keys.has("[Symbol.species]"));
});

Deno.test('Static method "Array.from" exists', () => {
  assert(keys.has("from"));
});
