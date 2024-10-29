import { assert } from "@std/assert";
import json from "../globals.json" with { type: "json" };
import * as types from "../src/types.ts";

type Globals = Record<string, types.Ast[]>;
const globals: Globals = json as Globals;
const allArrayKeys = globals.Array.map((item) => item.name);
const uniqueArrayKeys = new Set(allArrayKeys);

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

Deno.test('Instance property "Array.prototype.length" exists', () => {
  assert(uniqueArrayKeys.has("Array.prototype.length"));
});

Deno.test('Instance method "Array.prototype.splice" exists', () => {
  assert(uniqueArrayKeys.has("Array.prototype.splice"));
});

Deno.test('Constructor "Array.new" exists', () => {
  assert(uniqueArrayKeys.has("Array.new"));
});

Deno.test('Constructor function "Array" exists', () => {
  assert(uniqueArrayKeys.has("Array"));
});

Deno.test('Static property "Array.prototype" exists', () => {
  assert(uniqueArrayKeys.has("Array.prototype"));
});

Deno.test('Static property "Array[Symbol.species]" exists', () => {
  assert(uniqueArrayKeys.has("Array[Symbol.species]"));
});

Deno.test('Static method "Array.from" exists', () => {
  assert(uniqueArrayKeys.has("Array.from"));
});
