/**
 * @file Tests that interfaces and classes inherit properties, methods, and constructors from their extended interfaces and classes.
 *
 * Given the example types below, we expect the following methods, properties, and constructors in the final result
 *
 * **Constructors**
 *
 *   - `new AggregateError(errors: Iterable<any>, message?: string)`
 *   - `AggregateError(errors: Iterable<any>, message?: string)`
 *
 * **Instance Properties**
 *
 *   - `AggregateError.prototype.errors`
 *   - `Error.prototype.name`
 *   - `Error.prototype.message`
 *   - `Error.prototype.stack`
 *   - `Object.prototype.constructor`
 *
 * **Instance Methods**
 *
 *   - `AggregateError.prototype.toString()`
 *   - `Object.prototype.hasOwnProperty()`
 *   - `Object.prototype.isPrototypeOf()`
 *   - `Object.prototype.propertyIsEnumerable()`
 *   - `Object.prototype.toLocaleString()`
 *   - `Object.prototype.toString()`
 *   - `Object.prototype.valueOf()`
 *
 * **Static Properties**
 *
 *   - `AggregateError.prototype`
 *   - `Function.length`
 *   - `Function.name`
 *   - `Function.prototype`
 *
 * **Static Methods**
 *
 *   - `Object.assign()`
 *   - `Object.create()`
 *   - `Object.defineProperties()`
 *   - `Object.defineProperty()`
 *   - `Object.entries()`
 *   - `Object.freeze()`
 *   - `Object.fromEntries()`
 *   - `Object.getOwnPropertyDescriptor()`
 *   - `Object.getOwnPropertyDescriptors()`
 *   - `Object.getOwnPropertyNames()`
 *   - `Object.getOwnPropertySymbols()`
 *   - `Object.getPrototypeOf()`
 *   - `Object.groupBy()`
 *   - `Object.hasOwn()`
 *   - `Object.is()`
 *   - `Object.isExtensible()`
 *   - `Object.isFrozen()`
 *   - `Object.isSealed()`
 *   - `Object.keys()`
 *   - `Object.preventExtensions()`
 *   - `Object.seal()`
 *   - `Object.setPrototypeOf()`
 *   - `Object.values()`
 *   - `Function.apply()`
 *   - `Function.bind()`
 *   - `Function.call()`
 *   - `Function[Symbol.hasInstance]()`
 *   - `Function.toString()`
 *
 * @example
 * interface AggregateError extends Error {
 *   errors: any[];
 * }
 *
 * interface AggregateErrorConstructor {
 *   new (errors: Iterable<any>, message?: string): AggregateError;
 *   (errors: Iterable<any>, message?: string): AggregateError;
 *   readonly prototype: AggregateError;
 * }
 *
 * declare var AggregateError: AggregateErrorConstructor;
 *
 * interface Error {
 *   name: string;
 *   message: string;
 *   stack?: string;
 * }
 *
 * interface ErrorConstructor {
 *   new (message?: string): Error;
 *   (message?: string): Error;
 *   readonly prototype: Error;
 * }
 *
 * declare var Error: ErrorConstructor;
 *
 * interface Object {
 *   constructor: Function;
 *   toString(): string;
 *   toLocaleString(): string;
 *   valueOf(): Object;
 *   hasOwnProperty(v: PropertyKey): boolean;
 *   isPrototypeOf(v: Object): boolean;
 *   propertyIsEnumerable(v: PropertyKey): boolean;
 * }
 *
 * interface ObjectConstructor {
 *   new (value?: any): Object;
 *   (): any;
 *   (value: any): any;
 *   readonly prototype: Object;
 *   getPrototypeOf(o: any): any;
 *   getOwnPropertyDescriptor(o: any, p: PropertyKey): PropertyDescriptor | undefined;
 *   getOwnPropertyNames(o: any): string[];
 *   create(o: object | null): any;
 *   create(o: object | null, properties: PropertyDescriptorMap & ThisType<any>): any;
 *   defineProperty<T>(o: T, p: PropertyKey, attributes: PropertyDescriptor & ThisType<any>): T;
 *   defineProperties<T>(o: T, properties: PropertyDescriptorMap & ThisType<any>): T;
 *   seal<T>(o: T): T;
 *   freeze<T extends Function>(f: T): T;
 *   freeze<
 *   	T extends { [idx: string]: U | null | undefined | object },
 *   	U extends string | bigint | number | boolean | symbol,
 *   >(o: T): Readonly<T>;
 *   freeze<T>(o: T): Readonly<T>;
 *   preventExtensions<T>(o: T): T;
 *   isSealed(o: any): boolean;
 *   isFrozen(o: any): boolean;
 *   isExtensible(o: any): boolean;
 *   keys(o: object): string[];
 * }
 *
 * declare var Object: ObjectConstructor;
 *
 * interface Function {
 *   apply(this: Function, thisArg: any, argArray?: any): any;
 *   call(this: Function, thisArg: any, ...argArray: any[]): any;
 *   bind(this: Function, thisArg: any, ...argArray: any[]): any;
 *   toString(): string;
 *   prototype: any;
 *   readonly length: number;
 *   // Non-standard extensions
 *   arguments: any;
 *   caller: Function;
 * }
 *
 * interface FunctionConstructor {
 *   new (...args: string[]): Function;
 *   (...args: string[]): Function;
 *   readonly prototype: Function;
 * }
 *
 * declare var Function: FunctionConstructor;
 */

import { assert } from "@std/assert";
import globalsJson from "../globals.json" with { type: "json" };

const CONSTRUCTOR_FUNCTION_KEY = "__constructorFunction__";
const aggregateError = globalsJson["AggregateError"];
const keys = new Set(aggregateError.members.map((member) => {
  if (member.name) {
    return member.name;
  }
  if (member.kind === "Constructor") {
    return CONSTRUCTOR_FUNCTION_KEY;
  }
  return member.kind;
}));

Deno.test('AggregateError has constructor "new AggregateError(...)"', () => {
  const hasMember = keys.has("new");
  assert(hasMember);
});

Deno.test('AggregateError has callable constructor "AggregateError(...)"', () => {
  const hasMember = keys.has(CONSTRUCTOR_FUNCTION_KEY);
  assert(hasMember);
});

Deno.test('AggregateError has instance property "errors"', () => {
  const hasMember = keys.has("errors");
  assert(hasMember);
});

Deno.test('AggregateError has instance property "name"', () => {
  const hasMember = keys.has("name");
  assert(hasMember);
});

Deno.test('AggregateError has instance property "message"', () => {
  const hasMember = keys.has("message");
  assert(hasMember);
});

Deno.test('AggregateError has instance property "stack"', () => {
  const hasMember = keys.has("stack");
  assert(hasMember);
});

Deno.test('AggregateError has instance property "constructor"', () => {
  const hasMember = keys.has("constructor");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "toString"', () => {
  const hasMember = keys.has("toString");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "hasOwnProperty"', () => {
  const hasMember = keys.has("hasOwnProperty");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "isPrototypeOf"', () => {
  const hasMember = keys.has("isPrototypeOf");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "propertyIsEnumerable"', () => {
  const hasMember = keys.has("propertyIsEnumerable");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "toLocaleString"', () => {
  const hasMember = keys.has("toLocaleString");
  assert(hasMember);
});

Deno.test('AggregateError has instance method "valueOf"', () => {
  const hasMember = keys.has("valueOf");
  assert(hasMember);
});

Deno.test('AggregateError has static property "prototype"', () => {
  const hasMember = keys.has("prototype");
  assert(hasMember);
});

Deno.test('AggregateError has static property "length"', () => {
  const hasMember = keys.has("length");
  assert(hasMember);
});

Deno.test('AggregateError has static property "name"', () => {
  const hasMember = keys.has("name");
  assert(hasMember);
});

Deno.test('AggregateError has static method "assign"', () => {
  const hasMember = keys.has("assign");
  assert(hasMember);
});

Deno.test('AggregateError has static method "create"', () => {
  const hasMember = keys.has("create");
  assert(hasMember);
});

Deno.test('AggregateError has static method "defineProperties"', () => {
  const hasMember = keys.has("defineProperties");
  assert(hasMember);
});

Deno.test('AggregateError has static method "defineProperty"', () => {
  const hasMember = keys.has("defineProperty");
  assert(hasMember);
});

Deno.test('AggregateError has static method "entries"', () => {
  const hasMember = keys.has("entries");
  assert(hasMember);
});

Deno.test('AggregateError has static method "freeze"', () => {
  const hasMember = keys.has("freeze");
  assert(hasMember);
});

Deno.test('AggregateError has static method "fromEntries"', () => {
  const hasMember = keys.has("fromEntries");
  assert(hasMember);
});

Deno.test('AggregateError has static method "getOwnPropertyDescriptor"', () => {
  const hasMember = keys.has("getOwnPropertyDescriptor");
  assert(hasMember);
});

Deno.test('AggregateError has static method "getOwnPropertyDescriptors"', () => {
  const hasMember = keys.has("getOwnPropertyDescriptors");
  assert(hasMember);
});

Deno.test('AggregateError has static method "getOwnPropertyNames"', () => {
  const hasMember = keys.has("getOwnPropertyNames");
  assert(hasMember);
});

Deno.test('AggregateError has static method "getOwnPropertySymbols"', () => {
  const hasMember = keys.has("getOwnPropertySymbols");
  assert(hasMember);
});

Deno.test('AggregateError has static method "getPrototypeOf"', () => {
  const hasMember = keys.has("getPrototypeOf");
  assert(hasMember);
});

Deno.test('AggregateError has static method "groupBy"', () => {
  const hasMember = keys.has("groupBy");
  assert(hasMember);
});

Deno.test('AggregateError has static method "hasOwn"', () => {
  const hasMember = keys.has("hasOwn");
  assert(hasMember);
});

Deno.test('AggregateError has static method "is"', () => {
  const hasMember = keys.has("is");
  assert(hasMember);
});

Deno.test('AggregateError has static method "isExtensible"', () => {
  const hasMember = keys.has("isExtensible");
  assert(hasMember);
});

Deno.test('AggregateError has static method "isFrozen"', () => {
  const hasMember = keys.has("isFrozen");
  assert(hasMember);
});

Deno.test('AggregateError has static method "isSealed"', () => {
  const hasMember = keys.has("isSealed");
  assert(hasMember);
});

Deno.test('AggregateError has static method "keys"', () => {
  const hasMember = keys.has("keys");
  assert(hasMember);
});

Deno.test('AggregateError has static method "preventExtensions"', () => {
  const hasMember = keys.has("preventExtensions");
  assert(hasMember);
});

Deno.test('AggregateError has static method "seal"', () => {
  const hasMember = keys.has("seal");
  assert(hasMember);
});

Deno.test('AggregateError has static method "setPrototypeOf"', () => {
  const hasMember = keys.has("setPrototypeOf");
  assert(hasMember);
});

Deno.test('AggregateError has static method "values"', () => {
  const hasMember = keys.has("values");
  assert(hasMember);
});

Deno.test('AggregateError has static method "apply"', () => {
  const hasMember = keys.has("apply");
  assert(hasMember);
});

Deno.test('AggregateError has static method "bind"', () => {
  const hasMember = keys.has("bind");
  assert(hasMember);
});

Deno.test('AggregateError has static method "call"', () => {
  const hasMember = keys.has("call");
  assert(hasMember);
});

Deno.test('AggregateError has static method "[Symbol.hasInstance]"', () => {
  const hasMember = keys.has("[Symbol.hasInstance]");
  assert(hasMember);
});
