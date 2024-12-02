/**
 * @file Inheritance utility for managing and querying inheritance relationships
 *       of Web APIs and built-in JavaScript objects.
 *
 * This module processes inheritance data from the MDN `mdn-data` package
 * and provides static methods to check and retrieve inheritance information.
 *
 * @module Inheritance
 */

import _webApiInheritanceJson from "npm:mdn-data/api/inheritance.json" with { type: "json" };

export type InheritanceData = Record<string, string[]>;

/**
 * A mapping of Web APIs and their inheritance and implementation relationships.
 * @see {@link https://github.com/mdn/data} for source of inheritance data.
 */
const webApiInheritanceJson = _webApiInheritanceJson as Record<string, {
  /**
   * The name of the interface it inherits properties and methods from.
   * If null, it means it doesn't inherit from any interface.
   */
  inherits: string | null;

  /**
   * A list of mixins the interface implements. The array can be empty.
   */
  implements: string[];
}>;

/**
 * A utility class for managing and querying inheritance relationships for Web APIs and built-in JavaScript objects.
 */
export default class Inheritance {
  /**
   * A mapping of Web APIs and their inheritance and implementation relationships.
   */
  public static webApisInheritance: InheritanceData = Object.entries(webApiInheritanceJson).reduce((apis, [key, value]) => {
    const inheritanceSources = apis[key] ?? [];

    if (value.inherits) {
      inheritanceSources.push(value.inherits);
    }

    if (value.implements.length) {
      for (const impl of value.implements) {
        inheritanceSources.push(impl);
      }
    }

    apis[key] = inheritanceSources;
    return apis;
  }, {} as InheritanceData);

  /**
   * A mapping of built-in JavaScript objects and their inheritance relationships.
   */
  public static builtInObjectInheritance: InheritanceData = {
    AggregateError: ["Error", "Object", "Function"],
    Array: ["Object", "Function"],
    ArrayBuffer: ["Object", "Function"],
    AsyncFunction: ["Object", "Function"],
    AsyncGenerator: ["AsyncIterator", "Object", "Function"],
    AsyncGeneratorFunction: ["Object", "Function"],
    AsyncIterator: ["Object", "Function"],
    Atomics: [],
    BigInt: ["Object", "Function"],
    BigInt64Array: ["TypedArray", "Object", "Function"],
    BigUint64Array: ["TypedArray", "Object", "Function"],
    Boolean: ["Object", "Function"],
    DataView: ["Object", "Function"],
    Date: ["Object", "Function"],
    Error: ["Object", "Function"],
    EvalError: ["Error", "Object", "Function"],
    FinalizationRegistry: ["Object", "Function"],
    Float16Array: ["Object", "Function"],
    Float32Array: ["TypedArray", "Object", "Function"],
    Float64Array: ["TypedArray", "Object", "Function"],
    Function: ["Object"],
    Generator: ["Iterator", "Object", "Function"],
    GeneratorFunction: ["Object", "Function"],
    Int16Array: ["TypedArray", "Object", "Function"],
    Int32Array: ["TypedArray", "Object", "Function"],
    Int8Array: ["TypedArray", "Object", "Function"],
    Intl: [],
    "Intl.Collator": ["Object", "Function"],
    "Intl.DateTimeFormat": ["Object", "Function"],
    "Intl.DisplayNames": ["Object", "Function"],
    "Intl.DurationFormat": ["Object", "Function"],
    "Intl.ListFormat": ["Object", "Function"],
    "Intl.Locale": ["Object", "Function"],
    "Intl.NumberFormat": ["Object", "Function"],
    "Intl.PluralRules": ["Object", "Function"],
    "Intl.RelativeTimeFormat": ["Object", "Function"],
    "Intl.Segmenter": ["Object", "Function"],
    Iterator: ["Object", "Function"],
    JSON: [],
    Map: ["Object", "Function"],
    Math: [],
    Number: ["Object", "Function"],
    Object: ["Function"],
    Promise: ["Object", "Function"],
    Proxy: [],
    RangeError: ["Error", "Object", "Function"],
    ReferenceError: ["Error", "Object", "Function"],
    Reflect: [],
    RegExp: ["Object", "Function"],
    Set: ["Object", "Function"],
    SharedArrayBuffer: ["Object", "Function"],
    String: ["Object", "Function"],
    Symbol: ["Object", "Function"],
    SyntaxError: ["Error", "Object", "Function"],
    TypedArray: ["Object", "Function"],
    TypeError: ["Error", "Object", "Function"],
    Uint16Array: ["TypedArray", "Object", "Function"],
    Uint32Array: ["TypedArray", "Object", "Function"],
    Uint8Array: ["TypedArray", "Object", "Function"],
    Uint8ClampedArray: ["TypedArray", "Object", "Function"],
    URIError: ["Error", "Object", "Function"],
    WeakMap: ["Object", "Function"],
    WeakRef: ["Object", "Function"],
    WeakSet: ["Object", "Function"],
  } as const;

  /**
   * Checks if the given name is a Web API source.
   * @param name - The name of the Web API to check.
   * @returns `true` if the name exists in `webApisInheritance`, otherwise `false`.
   */
  public static isWebApiSource(name: string): boolean {
    return this.webApisInheritance[name] !== undefined;
  }

  /**
   * Checks if the given name is a built-in JavaScript object source.
   * @param name - The name of the built-in object to check.
   * @returns `true` if the name exists in `builtInObjectInheritance`, otherwise `false`.
   */
  public static isBuiltInObjectSource(name: string): boolean {
    return this.builtInObjectInheritance[name] !== undefined;
  }

  /**
   * Checks if the given name is a source in either Web APIs or built-in JavaScript objects.
   * @param name - The name of the source to check.
   * @returns `true` if the name exists in either `webApisInheritance` or `builtInObjectInheritance`, otherwise `false`.
   */
  public static hasSource(name: string): boolean {
    return this.isWebApiSource(name) || this.isBuiltInObjectSource(name);
  }

  /**
   * Finds the inheritance sources for the given name.
   * @param name - The name of the source to find.
   * @returns An array of inheritance sources if the name exists, or `undefined` if the name is not found.
   */
  public static findSource(name: string): string[] | undefined {
    if (this.isWebApiSource(name)) {
      return this.webApisInheritance[name];
    } else if (this.isBuiltInObjectSource(name)) {
      return this.builtInObjectInheritance[name];
    } else {
      return undefined;
    }
  }

  public static inheritsObject(name: string): boolean {
    const source = this.findSource(name);

    if (source) {
      const hasObject = source.includes("Object");
      return hasObject;
    }

    return false;
  }

  public static inheritsFunction(name: string): boolean {
    const source = this.findSource(name);

    if (source) {
      const hasObject = source.includes("Function");
      return hasObject;
    }

    return false;
  }
}
