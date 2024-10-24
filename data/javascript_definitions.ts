/**
 * @file
 * This file defines various TypeScript types and enums for parameter and definition types,
 * as well as functions to inherit and define built-in properties and methods for JavaScript objects.
 */

// THEN: Do the same thing with a DOM-specific list of definitions.

import {
  any,
  arr,
  arrBuff,
  bigInt,
  bool,
  type BuiltinDefn,
  type Builtins,
  ctor,
  fn,
  iter,
  nil,
  num,
  obj,
  or,
  type ParamVisitor,
  promise,
  regex,
  set,
  str,
  sym,
  tuple,
  typedArr,
  undef,
} from "./params.ts";
import type { BaseObjects } from "./types.ts";

// TODO: Update the js interop file to use new definitions.
// TODO: Update the html definitions file to use the same approach.
// TODO: Update the html interop file to use the new definitions.

// MARK: ✅ BASE FN

/**
 * An object that contains the standard methods and properties from the Function object which all builtins inherit.
 * @param name - The name of the builtin that will inherit Function.
 * @returns A BuiltinCollection object containing the Function object's methods and properties.
 */
function inheritFunction(name: string): Builtins {
  const functionBuiltin: Builtins = {
    [`${name}.apply`]: {
      type: "StaticMethod",
      params: [
        ["thisArg", any()],
        ["argArray?", arr()],
      ],
      returns: any(),
      inherits: ["Function"],
    },
    [`${name}.bind`]: {
      type: "StaticMethod",
      params: [
        ["thisArg", any()],
        ["...argArray", arr()],
      ],
      returns: any(),
      inherits: ["Function"],
    },
    [`${name}.call`]: {
      type: "StaticMethod",
      params: [
        ["thisArg", any()],
        ["...argArray", arr()],
      ],
      returns: any(),
      inherits: ["Function"],
    },
    [`${name}[Symbol.hasInstance]`]: {
      type: "StaticMethod",
      params: [["value", any()]],
      returns: bool(),
      inherits: ["Function"],
    },
    [`${name}.toString`]: {
      type: "StaticMethod",
      params: [],
      returns: str(),
      inherits: ["Function"],
    },
    [`${name}.length`]: {
      type: "StaticProperty",
      params: [],
      returns: num(),
      inherits: ["Function"],
    },
    [`${name}.name`]: {
      type: "StaticProperty",
      params: [],
      returns: str(),
      inherits: ["Function"],
    },
    [`${name}.prototype`]: {
      type: "StaticProperty",
      params: [],
      returns: any(),
      inherits: ["Function"],
    },
    [`${name}.toString`]: {
      type: "InstanceMethod",
      params: [],
      returns: str(),
      inherits: ["Function"],
    },
    [`${name}.toLocaleString`]: {
      type: "InstanceMethod",
      params: [],
      returns: str(),
      inherits: ["Function"],
    },
    [`${name}.valueOf`]: {
      type: "InstanceMethod",
      params: [],
      returns: obj(),
      inherits: ["Function"],
    },
    [`${name}.length`]: {
      type: "InstanceProperty",
      params: [],
      returns: num(),
      inherits: ["Function"],
    },
    [`${name}.name`]: {
      type: "InstanceProperty",
      params: [],
      returns: str(),
      inherits: ["Function"],
    },
    [`${name}.constructor`]: {
      type: "InstanceProperty",
      params: [],
      returns: fn(),
      inherits: ["Function"],
    },
  };

  return functionBuiltin;
}

// MARK: ✅ FUNCTION

/**
 * Defines the built-in properties and methods for the Function object.
 * This includes constructors, static methods, instance methods, and instance properties.
 */
const functionBuiltin: Builtins = {
  ...inheritFunction("Function"),

  [`Function`]: {
    type: "Constructor",
    params: [["...args", arr(str())]],
    returns: ctor(),
    inherits: [],
  },
  [`Function.new`]: {
    type: "Constructor",
    params: [["...args", arr(str())]],
    returns: ctor(),
    inherits: [],
  },
};

// MARK: ✅ ARRAY

/**
 * Defines the built-in properties and methods for the Array object.
 * This includes constructors, static methods, instance methods, and instance properties.
 */
const arrayBuiltin: Builtins = {
  ...inheritFunction("Array"),

  [`Array`]: [
    {
      type: "Constructor",
      params: [],
      returns: arr(),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [["arrayLength", num()]],
      returns: arr(),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [["...items", arr()]],
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.new`]: [
    {
      type: "Constructor",
      params: [],
      returns: arr(),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [["arrayLength", num()]],
      returns: arr(),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [["...items", arr()]],
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.from`]: [
    {
      type: "StaticMethod",
      params: [["arrayLike", arr()]],
      returns: arr(),
      inherits: [],
    },
    {
      type: "StaticMethod",
      params: [
        ["arrayLike", arr()],
        ["mapfn", fn()], // (v: T, k: number) => U
        ["thisArg", any()],
      ],
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.fromAsync`]: [
    {
      type: "StaticMethod",
      params: [["iterableOrArrayLike", arr()]],
      returns: promise(arr()),
      inherits: [],
    },
    {
      type: "StaticMethod",
      params: [
        ["iterableOrArrayLike", arr()],
        ["mapFn", fn()], // Awaited<((v: T, k: number) => U)>
        ["thisArg?", any()],
      ],
      returns: promise(arr()), // Promise<Awaited<U>[]> | Promise<T[]>;
      inherits: [],
    },
  ],
  [`Array.isArray`]: {
    type: "StaticMethod",
    params: [["arg", any()]],
    returns: bool(),
    inherits: ["Function"],
  },
  [`Array.of`]: {
    type: "StaticMethod",
    params: [["...items", arr()]],
    returns: arr(),
    inherits: [],
  },
  // Disable Symbol.species to prevent arbitrary code execution.
  // > Warning: The existence of [Symbol.species] allows execution of arbitrary code and may create security vulnerabilities. It also makes certain
  // > optimizations much harder. Engine implementers are investigating whether to remove this feature. Avoid relying on it if possible.
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
  // [`Array[Symbol.species]`]: {
  //   type: DefinitionType.StaticProperty,
  //   parameters: [],
  //   returnValue: This, // Self
  //   inheritedFrom: [BaseObjects.None],
  // },
  [`Array.prototype.at`]: {
    type: "InstanceMethod",
    params: [["index", num()]],
    returns: or(any(), undef()),
    inherits: [],
  },
  [`Array.prototype.concat`]: {
    type: "InstanceMethod",
    params: [["...items", arr()]],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.copyWithin`]: {
    type: "InstanceMethod",
    params: [
      ["target", num()],
      ["start", num()],
      ["end?", num()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.entries`]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(
      tuple(num(), any()),
    ), // IterableIterator<[number, T]>
    inherits: [],
  },
  [`Array.prototype.every`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: bool(),
    inherits: [],
  },
  [`Array.prototype.fill`]: {
    type: "InstanceMethod",
    params: [
      ["value", any()],
      ["start?", num()],
      ["end?", num()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.filter`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.find`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: or(any(), undef()),
    inherits: [],
  },
  [`Array.prototype.findIndex`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.findLast`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: or(any(), undef()),
    inherits: [],
  },
  [`Array.prototype.findLastIndex`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.flat`]: {
    type: "InstanceMethod",
    params: [["depth?", num()]], // TODO: Add initializer, e.g. = 1
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.flatMap`]: {
    type: "InstanceMethod",
    params: [
      ["callback", fn()], // (T, number, T[]) => U
      ["thisArg?", arr()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.forEach`]: {
    type: "InstanceMethod",
    params: [
      ["callbackfn", fn()], // (value: T, index: number, array: T[]) => void
      ["thisArg?", any()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  [`Array.prototype.includes`]: {
    type: "InstanceMethod",
    params: [
      ["searchElement", any()],
      ["fromIndex?", num()],
    ],
    returns: bool(),
    inherits: [],
  },
  [`Array.prototype.indexOf`]: {
    type: "InstanceMethod",
    params: [
      ["searchElement", any()],
      ["fromIndex?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.join`]: {
    type: "InstanceMethod",
    params: [["separator?", str()]],
    returns: str(),
    inherits: [],
  },
  [`Array.prototype.keys`]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(num()), // IterableIterator<number>
    inherits: [],
  },
  [`Array.prototype.lastIndexOf`]: {
    type: "InstanceMethod",
    params: [
      ["searchElement", any()],
      ["fromIndex?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.map`]: {
    type: "InstanceMethod",
    params: [
      ["callbackfn", fn()], // (T, number, T[]) => U
      ["thisArg?", any()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.pop`]: {
    type: "InstanceMethod",
    params: [],
    returns: or(any(), undef()),
    inherits: [],
  },
  [`Array.prototype.push`]: {
    type: "InstanceMethod",
    params: [["...items", arr()]],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.reduce`]: [
    {
      // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T, initialValue: T): T;
      type: "InstanceMethod",
      params: [
        // ['context', arr()],
        [
          "callbackfn",
          fn(), // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
        ],
        ["initialValue", any()],
      ],
      returns: any(),
      inherits: [],
    },
    {
      // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: readonly T[]) => T): T;
      type: "InstanceMethod",
      params: [[
        "callbackfn",
        fn(), // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
      ]],
      returns: any(),
      inherits: [],
    },
  ],
  [`Array.prototype.reduceRight`]: [
    {
      type: "InstanceMethod",
      params: [
        [
          "callbackfn",
          fn(), // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
        ],
      ],
      returns: any(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        [
          "callbackfn",
          fn(), // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
        ],
        ["initialValue", any()],
      ],
      returns: any(),
      inherits: [],
    },
  ],
  [`Array.prototype.reverse`]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.shift`]: {
    type: "InstanceMethod",
    params: [],
    returns: or(any(), undef()),
    inherits: [],
  },
  [`Array.prototype.slice`]: {
    type: "InstanceMethod",
    params: [
      ["start?", num()],
      ["end?", num()],
    ],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.some`]: {
    type: "InstanceMethod",
    params: [
      ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
      ["thisArg?", any()],
    ],
    returns: bool(),
    inherits: [],
  },
  [`Array.prototype.sort`]: {
    type: "InstanceMethod",
    params: [["compareFn?", fn()]], // (a: T, b: T) => number,
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.splice`]: [
    {
      type: "InstanceMethod",
      params: [
        ["start", num()],
        ["deleteCount?", num()],
      ],
      returns: arr(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["start", num()],
        ["deleteCount", num()],
        ["...items", arr()],
      ],
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.prototype[Symbol.iterator]`]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(), // IterableIterator<T>
    inherits: [],
  },
  [`Array.prototype.toReversed`]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(),
    inherits: [],
  },
  [`Array.prototype.toSorted`]: [
    {
      type: "InstanceMethod",
      params: [],
      returns: arr(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [["compareFunction?", fn()]], // (a: T, b: T) => number,
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.prototype.toSpliced`]: [
    {
      type: "InstanceMethod",
      params: [
        ["start", num()],
        ["deleteCount", num()],
        ["...items", arr()],
      ],
      returns: arr(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["start", num()],
        ["deleteCount?", num()],
      ],
      returns: arr(),
      inherits: [],
    },
  ],
  [`Array.prototype.unshift`]: {
    type: "InstanceMethod",
    params: [["...items", arr()]],
    returns: num(),
    inherits: [],
  },
  [`Array.prototype.values`]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(), // IterableIterator<T>
    inherits: [],
  },
  [`Array.prototype.with`]: {
    type: "InstanceMethod",
    params: [
      ["index", num()],
      ["value", any()],
    ],
    returns: arr(),
    inherits: [],
  },
};

// MARK: ✅ TYPED ARRAY

/**
 * Defines the built-in properties and methods for the Typed Array classes such as Int16Array, Uint8Array, etc.
 * This includes constructors, static methods, instance methods, and instance properties.
 * @param typedArrayName - The name of the typed array class, e.g. "Int16Array", "Uint8Array", etc.
 * @param arrayType - The parameter type for the typed array, such as `PTInt16Array`.
 * @returns A `BuiltinCollection` object that contains the properties and methods for the specified typed array class.
 */
function inheritTypedArray(
  typedArrayName: string,
  arrayType: BaseObjects,
): Builtins {
  const builtIn: Builtins = {
    ...inheritFunction(typedArrayName),
    [`${typedArrayName}.new`]: [
      {
        type: "Constructor",
        params: [],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "Constructor",
        params: [["length", num()]],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "Constructor",
        params: [[
          "array",
          or(
            arr(num()),
            arrBuff(),
          ),
        ]],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "Constructor",
        params: [
          ["buffer", arrBuff()],
          ["byteOffset?", num()],
          ["length?", num()],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "Constructor",
        params: [
          ["elements", iter(num())],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.from`]: [
      {
        type: "StaticMethod",
        params: [["arrayLike", arr(num())]],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "StaticMethod",
        params: [
          ["arrayLike", iter(num())],
          ["mapfn?", fn()], // (v: T, k: number) => number
          ["baz?", any()],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "StaticMethod",
        params: [
          ["arrayLike", arr()],
          ["mapfn", fn()], // (v: T, k: number) => number
          ["thisArg?", any()],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.BYTES_PER_ELEMENT`]: {
      type: "StaticProperty",
      params: [],
      returns: num(),
      inherits: ["TypedArray"],
    },
    // Disable Symbol.species to prevent arbitrary code execution.
    // > Warning: The existence of [Symbol.species] allows execution of arbitrary code and may create security vulnerabilities. It also makes certain
    // > optimizations much harder. Engine implementers are investigating whether to remove this feature. Avoid relying on it if possible.
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
    // [`${name}[Symbol.species]`]: {
    //   type: DefinitionType.StaticProperty,
    //   parameters: [],
    //   returnValue: ctorFn(arrayType),
    //   inheritedFrom: [BaseObjects.TypedArray],
    // },
    [`${typedArrayName}.prototype.at`]: {
      type: "InstanceMethod",
      params: [["index", num()]],
      returns: or(num(), undef()),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.copyWithin`]: {
      type: "InstanceMethod",
      params: [
        ["target", num()],
        ["start", num()],
        ["end?", num()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.entries`]: {
      type: "InstanceMethod",
      params: [],
      returns: iter(
        tuple(num(), num()),
      ),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.every`]: {
      type: "InstanceMethod",
      params: [
        ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
        ["thisArg?", any()],
      ],
      returns: bool(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.fill`]: {
      type: "InstanceMethod",
      params: [
        ["value", any()],
        ["start?", num()],
        ["end?", num()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.filter`]: [
      {
        type: "InstanceMethod",
        params: [
          ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
          ["thisArg?", any()],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
          ["thisArg?", any()],
        ],
        returns: ctor(arrayType),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.find`]: {
      type: "InstanceMethod",
      params: [
        ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
        ["thisArg?", any()],
      ],
      returns: or(any(), undef()),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.findIndex`]: {
      type: "InstanceMethod",
      params: [
        ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
        ["thisArg?", any()],
      ],
      returns: num(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.findLast`]: {
      type: "InstanceMethod",
      params: [
        ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
        ["thisArg?", any()],
      ],
      returns: or(any(), undef()),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.findLastIndex`]: [
      {
        type: "InstanceMethod",
        params: [
          ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
          ["thisArg?", any()],
        ],
        returns: num(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
          ["thisArg?", any()],
        ],
        returns: num(),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.forEach`]: [
      {
        type: "InstanceMethod",
        params: [
          ["callbackfn", fn()], // (value: T, index: number, array: T[]) => void
          ["thisArg?", any()],
        ],
        returns: undef(), // void
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["callbackfn", fn()], // (value: T, index: number, array: T[]) => void
          ["thisArg?", any()],
        ],
        returns: undef(), // void
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.includes`]: [
      {
        type: "InstanceMethod",
        params: [
          ["searchElement", any()],
          ["fromIndex?", num()],
        ],
        returns: bool(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["searchElement", num()],
          ["fromIndex?", num()],
        ],
        returns: bool(),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.indexOf`]: [
      {
        type: "InstanceMethod",
        params: [
          ["searchElement", any()],
          ["fromIndex?", num()],
        ],
        returns: num(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["searchElement", num()],
          ["fromIndex?", num()],
        ],
        returns: num(),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.join`]: {
      type: "InstanceMethod",
      params: [["separator?", str()]],
      returns: str(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.keys`]: {
      type: "InstanceMethod",
      params: [],
      returns: arr(num()), // IterableIterator<number>
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.lastIndexOf`]: {
      type: "InstanceMethod",
      params: [
        ["searchElement", num()],
        ["fromIndex?", num()],
      ],
      returns: num(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.map`]: {
      type: "InstanceMethod",
      params: [
        ["callbackfn", fn()], // (T, number, T[]) => U
        ["thisArg?", any()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.reduce`]: [
      {
        type: "InstanceMethod",
        params: [["callbackfn", fn()]], // (previousValue: U, currentValue: number, currentIndex: number, array: Int16Array) => U
        returns: num(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["callbackfn", fn()], // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
          ["initialValue", any()],
        ],
        returns: any(),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.reduceRight`]: [
      {
        type: "InstanceMethod",
        params: [["callbackfn", fn()]], // (previousValue: U, currentValue: number, currentIndex: number, array: Int16Array) => U
        returns: num(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["callbackfn", fn()], // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
          ["initialValue", num()],
        ],
        returns: num(),
        inherits: ["TypedArray"],
      },
      {
        type: "InstanceMethod",
        params: [
          ["callbackfn", fn()], // '(previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T'
          ["initialValue", any()],
        ],
        returns: any(),
        inherits: ["TypedArray"],
      },
    ],
    [`${typedArrayName}.prototype.reverse`]: {
      type: "InstanceMethod",
      params: [],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.set`]: {
      type: "InstanceMethod",
      params: [
        ["array", arr(num())],
        ["offset?", num()],
      ],
      returns: undef(), // void
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.slice`]: {
      type: "InstanceMethod",
      params: [
        ["start?", num()],
        ["end?", num()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.some`]: {
      type: "InstanceMethod",
      params: [
        ["predicate", fn()], // (value: T, index: number, array: T[]) => unknown
        ["thisArg?", any()],
      ],
      returns: bool(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.sort`]: {
      type: "InstanceMethod",
      params: [
        ["compareFn?", fn()], // (a: T, b: T) => number
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.subarray`]: {
      type: "InstanceMethod",
      params: [
        ["begin?", num()],
        ["end?", num()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype[Symbol.iterator]`]: {
      type: "InstanceMethod",
      params: [],
      returns: arr(num()), // IterableIterator<number>
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.toLocaleString`]: {
      type: "InstanceMethod",
      params: [],
      returns: str(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.toReversed`]: {
      type: "InstanceMethod",
      params: [],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.toSorted`]: {
      type: "InstanceMethod",
      params: [
        ["compareFn?", fn()], // (value: T, index: number, array: T[]) => void
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.valueOf`]: {
      type: "InstanceMethod",
      params: [],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.values`]: {
      type: "InstanceMethod",
      params: [],
      returns: arr(num()), // IterableIterator<number>
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.with`]: {
      type: "InstanceMethod",
      params: [
        ["index", num()],
        ["value", num()],
      ],
      returns: ctor(arrayType),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.buffer`]: {
      type: "InstanceProperty",
      params: [],
      returns: arrBuff(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.byteLength`]: {
      type: "InstanceProperty",
      params: [],
      returns: num(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.byteOffset`]: {
      type: "InstanceProperty",
      params: [],
      returns: num(),
      inherits: ["TypedArray"],
    },
    [`${typedArrayName}.prototype.length`]: {
      type: "InstanceProperty",
      params: [],
      returns: num(),
      inherits: ["TypedArray"],
    },
  };

  // TODO: Find out why the Deno linter doesn't allow more than one argument to bind and call for most Typed Arrays.
  // Override the inherited Function methods bind and call to resolve the issue. (BigInt64Array, BigUint64Array is an exception)
  if (
    typedArrayName !== "BigInt64Array" && typedArrayName !== "BigUint64Array"
  ) {
    builtIn[`${typedArrayName}.bind`] = {
      type: "StaticMethod",
      params: [
        ["thisArg", any()],
        // ['...argArray', arr()]
      ],
      returns: any(),
      inherits: ["Function"],
    };
    builtIn[`${typedArrayName}.call`] = {
      type: "StaticMethod",
      params: [
        ["thisArg", any()],
        // ['...argArray', arr()]
      ],
      returns: any(),
      inherits: ["Function"],
    };
  }
  return builtIn;
}

// MARK INT8 ARRAY

const int8ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Int8Array", "Int8Array"),
};

// MARK: ✅ BIG INT 64 ARRAY

const bigint64ArrayBuiltin: Builtins = {
  ...inheritTypedArray("BigInt64Array", "BigInt64Array"),
};

// MARK: ✅ BIG UINT 64 ARRAY

const bigUint64ArrayBuiltin: Builtins = {
  ...inheritTypedArray("BigUint64Array", "BigUint64Array"),
};

// MARK: ✅ FLOAT 32 ARRAY

const float32ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Float32Array", "Float32Array"),
};

// MARK: ✅ FLOAT 64 ARRAY

const float64ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Float64Array", "Float64Array"),
};

// MARK: ✅ INT 16 ARRAY

const int16ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Int16Array", "Int16Array"),
};

// MARK: ✅ INT 32 ARRAY

const int32ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Int32Array", "Int32Array"),
};

// MARK: ✅ UINT 8 ARRAY

const uint8ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Uint8Array", "Uint8Array"),
};

// MARK: ✅ UINT 16 ARRAY

const uint16ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Uint16Array", "Uint16Array"),
};

// MARK: ✅ UINT 32 ARRAY

const uint32ArrayBuiltin: Builtins = {
  ...inheritTypedArray("Uint32Array", "Uint32Array"),
};

// MARK: ✅ UINT 8 CLAMPED ARRAY

const uint8ClampedArrayBuiltin: Builtins = {
  ...inheritTypedArray("Uint8ClampedArray", "Uint8ClampedArray"),
};

// MARK: ✅ ARRAY BUFFER
const arrayBufferBuiltin: Builtins = {
  ...inheritFunction("ArrayBuffer"),
  ["ArrayBuffer.new"]: {
    type: "Constructor",
    params: [["byteLength", num()]],
    returns: arrBuff(),
    inherits: ["Function"],
  },
  ["ArrayBuffer.isView"]: {
    type: "StaticMethod",
    params: [["arg", any()]],
    returns: bool(),
    inherits: ["Function"],
  },
  // TODO: Enable when ArrayBuffer.prototype.resize is available in Deno.
  // ['ArrayBuffer.prototype.resize']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['newByteLength', num()]],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
  ["ArrayBuffer.prototype.slice"]: {
    type: "InstanceMethod",
    params: [["begin", num()], ["end?", num()]],
    returns: arrBuff(),
    inherits: ["Function"],
  },
  // TODO: Enable when ArrayBuffer.prototype.transfer is available in Deno.
  // ['ArrayBuffer.prototype.transfer']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['newByteLength?', num()]],
  //   returnValue: arrBuff(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
  // TODO: Enable when ArrayBuffer.prototype.transfer is available in Deno.
  // ['ArrayBuffer.prototype.transferToFixedLength']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['newByteLength?', num()]],
  //   returnValue: arrBuff(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
  ["ArrayBuffer.prototype.byteLength"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: ["Function"],
  },
  // TODO: Enable when ArrayBuffer.prototype.transfer is available in Deno.
  // ['ArrayBuffer.detached']: {
  //   type: DefinitionType.InstanceProperty,
  //   parameters: [],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
  // TODO: Enable when ArrayBuffer.prototype.transfer is available in Deno.
  // ['ArrayBuffer.maxByteLength']: {
  //   type: DefinitionType.InstanceProperty,
  //   parameters: [],
  //   returnValue: num(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
  // TODO: Enable when ArrayBuffer.prototype.transfer is available in Deno.
  // ['ArrayBuffer.resizable']: {
  //   type: DefinitionType.InstanceProperty,
  //   parameters: [],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.Function],
  // },
};

// MARK: ✅ ATOMICS

const atomicsBuiltin: Builtins = {
  ["Atomics.add"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.and"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.compareExchange"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["expectedValue", num()],
      ["replacementValue", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.exchange"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.isLockFree"]: {
    type: "StaticMethod",
    params: [
      ["size", num()],
    ],
    returns: bool(),
    inherits: ["Function"],
  },
  ["Atomics.load"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.notify"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["count?", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.or"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.store"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.sub"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  ["Atomics.wait"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
      ["timeout?", num()],
    ],
    returns: str(),
    inherits: ["Function"],
  },
  ["Atomics.waitAsync"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
      ["timeout?", num()],
    ],
    returns: or(
      obj(),
      bool(),
      str(),
    ),
    inherits: ["Function"],
  },
  ["Atomics.xor"]: {
    type: "StaticMethod",
    params: [
      ["typedArray", typedArr()],
      ["index", num()],
      ["value", num()],
    ],
    returns: num(),
    inherits: ["Function"],
  },
  // ['Atomics[Symbol.toStringTag]']: {
  //   type: DefinitionType.StaticMethod,
  //   parameters: [],
  //   returnValue: str(),
  //   inheritedFrom: [BuiltinObject.None],
  // },
};

// MARK: ✅ BIGINT

const bigintBuiltin: Builtins = {
  ...inheritFunction("BigInt"),
  ["BigInt"]: {
    type: "Constructor",
    params: [
      [
        "value",
        or(
          bigInt(),
          bool(),
          str(),
        ),
      ],
    ],
    returns: bigInt(),
    inherits: ["Function"],
  },
  ["BigInt.asIntN"]: {
    type: "StaticMethod",
    params: [
      ["bits", num()],
      ["int", bigInt()],
    ],
    returns: bigInt(),
    inherits: ["Function"],
  },
  ["BigInt.asUintN"]: {
    type: "StaticMethod",
    params: [
      ["bits", num()],
      ["int", bigInt()],
    ],
    returns: bigInt(),
    inherits: ["Function"],
  },
};

// MARK: ✅ BOOLEAN

const booleanBuiltin: Builtins = {
  ...inheritFunction("Boolean"),
  ["Boolean"]: {
    type: "Constructor",
    params: [["value?", any()]],
    returns: bool(),
    inherits: ["Function"],
  },
  ["Boolean.new"]: {
    type: "Constructor",
    params: [["value?", any()]],
    returns: bool(),
    inherits: ["Function"],
  },
};

// MARK: ✅ DATA VIEW

const dataViewBuiltin: Builtins = {
  ...inheritFunction("DataView"),

  [`DataView.new`]: {
    type: "Constructor",
    params: [
      ["buffer", arrBuff()], // TODO: add `& { BYTES_PER_ELEMENT?: never }`
      ["byteOffset?", num()],
      ["byteLength?", num()],
    ],
    returns: ctor("DataView"),
    inherits: [],
  },
  ["DataView.prototype.getBigInt64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: bigInt(),
    inherits: [],
  },
  ["DataView.prototype.getBigUint64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: bigInt(),
    inherits: [],
  },
  ["DataView.prototype.getFloat32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getFloat64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getInt16"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getInt32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getInt8"]: {
    type: "InstanceMethod",
    params: [["byteOffset", num()]],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getUint16"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getUint32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["littleEndian?", bool()],
    ],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.getUint8"]: {
    type: "InstanceMethod",
    params: [["byteOffset", num()]],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.setBigInt64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setBigUint64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setFloat32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setFloat64"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setInt16"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setInt32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setInt8"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setUint16"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setUint32"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", bigInt()],
      ["littleEndian?", bool()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.setUint8"]: {
    type: "InstanceMethod",
    params: [
      ["byteOffset", num()],
      ["value", num()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["DataView.prototype.buffer"]: {
    type: "InstanceProperty",
    params: [],
    returns: arrBuff(),
    inherits: [],
  },
  ["DataView.prototype.byteLength"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["DataView.prototype.byteOffset"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ DATE

const dateBuiltin: Builtins = {
  ...inheritFunction("Date"),

  [`Date`]: [
    {
      type: "Constructor",
      params: [],
      returns: ctor("Date"),
      inherits: [],
    },
  ],
  [`Date.new`]: [
    {
      type: "Constructor",
      params: [],
      returns: ctor("Date"),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [["value", or(num(), str())]],
      returns: ctor("Date"),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [
        ["year", num()],
        ["monthIndex", num()],
        ["date?", num()],
        ["hours?", num()],
        ["minutes?", num()],
        ["seconds?", num()],
        ["ms?", num()],
      ],
      returns: ctor("Date"),
      inherits: [],
    },
  ],
  ["Date.now"]: {
    type: "StaticMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.parse"]: {
    type: "StaticMethod",
    params: [["dateString", str()]],
    returns: num(),
    inherits: [],
  },
  ["Date.UTC"]: {
    type: "StaticMethod",
    params: [
      ["year", num()],
      ["month", num()],
      ["date?", num()],
      ["hours?", num()],
      ["minutes?", num()],
      ["seconds?", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getDate"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getDay"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getFullYear"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getHours"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getMilliseconds"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getMinutes"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getMonth"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getSeconds"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getTime"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getTimezoneOffset"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCDate"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCDay"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCFullYear"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCHours"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCMilliseconds"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCMinutes"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCMonth"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.getUTCSeconds"]: {
    type: "InstanceMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setDate"]: {
    type: "InstanceMethod",
    params: [["date", num()]],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setFullYear"]: {
    type: "InstanceMethod",
    params: [
      ["year", num()],
      ["month?", num()],
      ["date?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setHours"]: {
    type: "InstanceMethod",
    params: [
      ["hours", num()],
      ["min?", num()],
      ["sec?", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setMilliseconds"]: {
    type: "InstanceMethod",
    params: [["ms", num()]],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setMinutes"]: {
    type: "InstanceMethod",
    params: [
      ["min", num()],
      ["sec?", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setMonth"]: {
    type: "InstanceMethod",
    params: [
      ["month", num()],
      ["date?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setSeconds"]: {
    type: "InstanceMethod",
    params: [
      ["sec", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setTime"]: {
    type: "InstanceMethod",
    params: [["time", num()]],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCDate"]: {
    type: "InstanceMethod",
    params: [["date", num()]],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCFullYear"]: {
    type: "InstanceMethod",
    params: [
      ["year", num()],
      ["month?", num()],
      ["date?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCHours"]: {
    type: "InstanceMethod",
    params: [
      ["hours", num()],
      ["min?", num()],
      ["sec?", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCMilliseconds"]: {
    type: "InstanceMethod",
    params: [["ms", num()]],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCMinutes"]: {
    type: "InstanceMethod",
    params: [
      ["min", num()],
      ["sec?", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCMonth"]: {
    type: "InstanceMethod",
    params: [
      ["month", num()],
      ["date?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.setUTCSeconds"]: {
    type: "InstanceMethod",
    params: [
      ["sec", num()],
      ["ms?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Date.prototype.toDateString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toISOString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toJSON"]: {
    type: "InstanceMethod",
    params: [["key?", any()]],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toLocaleDateString"]: [
    {
      type: "InstanceMethod",
      params: [],
      returns: str(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        [
          "locales?",
          or(str(), arr(str())),
        ],
        [
          "options?",
          obj(
            str(),
            or(
              str(),
              num(),
              undef(),
            ),
          ),
        ], // Intl.DateTimeFormatOptions
      ],
      returns: str(),
      inherits: [],
    },
  ],
  ["Date.prototype.toLocaleString"]: {
    type: "InstanceMethod",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toLocaleTimeString"]: {
    type: "InstanceMethod",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toTimeString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype.toUTCString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Date.prototype[Symbol.toPrimitive]"]: {
    type: "InstanceMethod",
    params: [["hint", str()]],
    returns: or(num(), str()),
    inherits: [],
  },
  // Override Function
  [`Date.bind`]: {
    type: "StaticMethod",
    params: [
      ["thisArg", any()],
      // ['...argArray', arr()]
    ],
    returns: any(),
    inherits: ["Function"],
  },
  [`Date.call`]: {
    type: "StaticMethod",
    params: [
      ["thisArg", any()],
      // ['...argArray', arr()]
    ],
    returns: any(),
    inherits: ["Function"],
  },
};

// MARK: ✅ ERROR BASE

function inheritError(name: string, arrayType: BaseObjects): Builtins {
  const builtIn: Builtins = {
    ...inheritFunction(name),

    [`${name}`]: {
      type: "Constructor",
      params: [["message?", str()]],
      returns: ctor(arrayType),
      inherits: ["Error"],
    },
    [`${name}.new`]: {
      type: "Constructor",
      params: [["message?", str()]],
      returns: ctor(arrayType),
      inherits: ["Error"],
    },
    [`${name}.prototype.message`]: {
      type: "InstanceProperty",
      params: [],
      returns: str(),
      inherits: ["Error"],
    },
    [`${name}.prototype.name`]: {
      type: "InstanceProperty",
      params: [],
      returns: str(),
      inherits: ["Error"],
    },
    [`${name}.prototype.cause`]: {
      type: "InstanceProperty",
      params: [],
      returns: any(),
      inherits: ["Error"],
    },
    [`${name}.prototype.stack`]: {
      type: "InstanceProperty",
      params: [],
      returns: str(),
      inherits: ["Error"],
    },
  };
  return builtIn;
}

// MARK: ✅ ERROR

const errorBuiltin: Builtins = {
  ...inheritError("Error", "Error"),
};

// MARK: ✅ AGGREGATE ERROR

const aggregateErrorBuiltin: Builtins = {
  ...inheritError("AggregateError", "AggregateError"),

  [`AggregateError.prototype.errors`]: {
    type: "InstanceProperty",
    params: [],
    returns: arr(),
    inherits: [],
  },
};

// MARK: ✅ EVAL ERROR

const evalErrorBuiltin: Builtins = {
  ...inheritError("EvalError", "EvalError"),
};

// MARK: ✅ RANGE ERROR

const rangeErrorBuiltin: Builtins = {
  ...inheritError("RangeError", "RangeError"),
};

// MARK: ✅ REFERENCE ERROR

const referenceErrorBuiltin: Builtins = {
  ...inheritError("ReferenceError", "ReferenceError"),
};

// MARK: ✅ SYNTAX ERROR

const syntaxErrorBuiltin: Builtins = {
  ...inheritError("SyntaxError", "SyntaxError"),
};

// MARK: ✅ TYPE ERROR

const typeErrorBuiltin: Builtins = {
  ...inheritError("TypeError", "TypeError"),
};

// MARK: ✅ URI ERROR

const uriErrorBuiltin: Builtins = {
  ...inheritError("URIError", "URIError"),
};

// MARK: ✅ FINALIZATION REG.

const finalizationRegistryBuiltin: Builtins = {
  ...inheritFunction("FinalizationRegistry"),

  ["FinalizationRegistry.new"]: {
    type: "Constructor",
    params: [["cleanupCallback", fn()]], // (heldValue: any) => void,
    returns: any(),
    inherits: [],
  },
  ["FinalizationRegistry.prototype.register"]: {
    type: "InstanceMethod",
    params: [
      ["target", or(sym(), obj())],
      ["heldValue", any()],
      ["unregisterToken?", or(sym(), obj())],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["FinalizationRegistry.prototype.unregister"]: {
    type: "InstanceMethod",
    params: [[
      "unregisterToken",
      or(sym(), obj()),
    ]],
    returns: bool(),
    inherits: [],
  },
};

// MARK: ✅ INTL

const intlBuiltin: Builtins = {
  ["Intl.getCanonicalLocales"]: {
    type: "InstanceMethod",
    params: [[
      "locale?",
      or(str(), arr(str())),
    ]],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.supportedValuesOf"]: {
    type: "InstanceMethod",
    params: [["key", str()]],
    returns: arr(str()),
    inherits: [],
  },
};

// MARK: ✅ INTL COLLATOR

const intlCollatorBuiltin: Builtins = {
  ...inheritFunction("Intl.Collator"),

  [`Intl.Collator`]: {
    type: "Constructor",
    params: [],
    returns: ctor("Intl.Collator"),
    inherits: [],
  },
  [`Intl.Collator.new`]: {
    type: "Constructor",
    params: [],
    returns: ctor("Intl.Collator"),
    inherits: [],
  },
  ["Intl.Collator.prototype.compare"]: {
    type: "InstanceMethod",
    params: [
      ["x", str()],
      ["y", str()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Intl.Collator.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(
      str(),
      or(str(), bool()),
    ), // ResolvedCollatorOptions
    inherits: [],
  },
  ["Intl.Collator.supportedLocalesOf"]: [
    {
      type: "StaticMethod",
      params: [[
        "locales?",
        or(str(), arr(str())),
      ]],
      returns: arr(str()),
      inherits: [],
    },
    {
      type: "StaticMethod",
      params: [
        [
          "locales?",
          or(str(), arr(str())),
        ],
        [
          "options",
          obj(
            str(),
            or(
              str(),
              bool(),
              undef(),
            ),
          ),
        ], // CollatorOptions
      ],
      returns: arr(str()),
      inherits: [],
    },
  ],
};

// MARK: ✅ INTL DATETIME FORMAT

const intlDateTimeFormatBuiltin: Builtins = {
  ...inheritFunction("Intl.DateTimeFormat"),

  [`Intl.DateTimeFormat`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: ctor("Intl.DateTimeFormat"),
    inherits: [],
  },
  [`Intl.DateTimeFormat.new`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: ctor("Intl.DateTimeFormat"),
    inherits: [],
  },
  ["Intl.DateTimeFormat.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.DateTimeFormat.prototype.format"]: {
    type: "InstanceMethod",
    params: [[
      "date?",
      or(
        ctor("Date"),
        num(),
      ),
    ]],
    returns: str(),
    inherits: [],
  },
  ["Intl.DateTimeFormat.prototype.formatRange"]: {
    type: "InstanceMethod",
    params: [
      [
        "startDate",
        or(
          ctor("Date"),
          num(),
          ctor("BigInt"),
        ),
      ],
      [
        "endDate",
        or(
          ctor("Date"),
          num(),
          ctor("BigInt"),
        ),
      ],
    ],
    returns: str(),
    inherits: [],
  },
  ["Intl.DateTimeFormat.prototype.formatRangeToParts"]: {
    type: "InstanceMethod",
    params: [
      [
        "startDate",
        or(
          ctor("Date"),
          num(),
          ctor("BigInt"),
        ),
      ],
      [
        "endDate",
        or(
          ctor("Date"),
          num(),
          ctor("BigInt"),
        ),
      ],
    ],
    returns: obj(
      str(),
      or(str(), num()),
    ), // DateTimeRangeFormatPart
    inherits: [],
  },
  ["Intl.DateTimeFormat.prototype.formatToParts"]: {
    type: "InstanceMethod",
    params: [[
      "date?",
      or(
        ctor("Date"),
        num(),
      ),
    ]],
    returns: obj(
      str(),
      or(str(), num()),
    ), // interface DateTimeFormatPart
    inherits: [],
  },
  ["Intl.DateTimeFormat.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(
      str(),
      or(str(), num()),
    ), // ResolvedDateTimeFormatOptions
    inherits: [],
  },
};

// MARK: ✅ INTL DISPLAY NAMES

const intlDisplayNamesBuiltin: Builtins = {
  ...inheritFunction("Intl.DisplayNames"),

  [`Intl.DisplayNames.new`]: {
    type: "Constructor",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      ["options?", obj(str(), str())], // DisplayNamesOptions
    ],
    returns: ctor("Intl.DisplayNames"),
    inherits: [],
  },
  ["Intl.DisplayNames.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      ["options?", obj(str(), str())],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.DisplayNames.prototype.of"]: {
    type: "InstanceMethod",
    params: [["code", str()]],
    returns: or(str(), undef()),
    inherits: [],
  },
  ["Intl.DisplayNames.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(str(), str()), // ResolvedDisplayNamesOptions
    inherits: [],
  },
  // Intl.DisplayNames.call takes 3 arguments
  [`Intl.DisplayNames.call`]: {
    type: "StaticMethod",
    params: [
      ["thisArg", any()],
      ["fnArg1", any()],
      ["fnArg2", any()],
    ],
    returns: any(),
    inherits: ["Function"],
  },
};

// MARK: ✅ INTL LIST FORMAT

const intlListFormatBuiltin: Builtins = {
  ...inheritFunction("Intl.ListFormat"),

  [`Intl.ListFormat.new`]: {
    type: "Constructor",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      [
        "options?",
        obj(
          str(),
          or(str(), undef()),
        ),
      ], // ListFormatOptions
    ],
    returns: ctor("Intl.ListFormat"),
    inherits: [],
  },
  ["Intl.ListFormat.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(str(), undef()),
        ),
      ],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.ListFormat.prototype.format"]: {
    type: "InstanceMethod",
    params: [["list", arr(str())]],
    returns: str(),
    inherits: [],
  },
  ["Intl.ListFormat.prototype.formatToParts"]: {
    type: "InstanceMethod",
    params: [["list", arr(str())]],
    returns: obj(str(), str()), // ListFormatPart
    inherits: [],
  },
  ["Intl.ListFormat.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(str(), str()), // ResolvedListFormatOptions
    inherits: [],
  },
};

// MARK: ✅ INTL LOCALE

const intlLocaleBuiltin: Builtins = {
  ...inheritFunction("Intl.Locale"),

  // new (tag: UnicodeBCP47LocaleIdentifier | Locale, options?: LocaleOptions): Locale;
  [`Intl.Locale.new`]: {
    type: "Constructor",
    params: [
      ["tag", obj(str(), str())],
      [
        "options?",
        obj(
          str(),
          or(str(), bool()),
        ),
      ], // LocaleOptions
    ],
    returns: ctor("Intl.Locale"),
    inherits: [],
  },
  ["Intl.Locale.prototype.getCalendars"]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Locale.prototype.getCollations"]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Locale.prototype.getHourCycles"]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Locale.prototype.getNumberingSystems"]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Locale.prototype.getTimeZones"]: {
    type: "InstanceMethod",
    params: [],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Locale.prototype.maximize"]: {
    type: "InstanceMethod",
    params: [],
    returns: ctor("Intl.Locale"),
    inherits: [],
  },
  ["Intl.Locale.prototype.minimize"]: {
    type: "InstanceMethod",
    params: [],
    returns: ctor("Intl.Locale"),
    inherits: [],
  },
  ["Intl.Locale.prototype.baseName"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.calendar"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.caseFirst"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.collation"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.hourCycle"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.language"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.numberingSystem"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.numeric"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["Intl.Locale.prototype.region"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Intl.Locale.prototype.script"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ INTL NUMBER FORMAT

const intlNumberFormatBuiltin: Builtins = {
  ...inheritFunction("Intl.NumberFormat"),

  [`Intl.NumberFormat`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            bool(),
            num(),
            undef(),
          ),
        ),
      ], // NumberFormatOptions
    ],
    returns: ctor("Intl.NumberFormat"),
    inherits: [],
  },
  [`Intl.NumberFormat.new`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            bool(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: ctor("Intl.NumberFormat"),
    inherits: [],
  },
  ["Intl.NumberFormat.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            bool(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.NumberFormat.prototype.format"]: {
    type: "InstanceMethod",
    params: [["number", num()]],
    returns: str(),
    inherits: [],
  },
  ["Intl.NumberFormat.prototype.formatRange"]: {
    type: "InstanceMethod",
    params: [
      ["startRange", num()],
      ["endRange", num()],
    ],
    returns: str(),
    inherits: [],
  },
  ["Intl.NumberFormat.prototype.formatRangeToParts"]: {
    type: "InstanceMethod",
    params: [
      ["startRange", num()],
      ["endRange", num()],
    ],
    returns: obj(
      str(),
      or(str(), num()),
    ),
    inherits: [],
  },
  ["Intl.NumberFormat.prototype.formatToParts"]: {
    type: "InstanceMethod",
    params: [["number", num()]],
    returns: arr(
      obj(str(), str()),
    ), // NumberFormatPart[]
    inherits: [],
  },
  ["Intl.NumberFormat.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(
      str(),
      or(str(), bool(), num()),
    ),
    inherits: [],
  },
};

// MARK: ✅ INTL PLURAL RULES

const intlPluralRulesBuiltin: Builtins = {
  ...inheritFunction("Intl.PluralRules"),

  [`Intl.PluralRules`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: ctor("Intl.PluralRules"),
    inherits: [],
  },
  [`Intl.PluralRules.new`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: ctor("Intl.PluralRules"),
    inherits: [],
  },
  ["Intl.PluralRules.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(
            str(),
            num(),
            undef(),
          ),
        ),
      ],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.PluralRules.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(str(), str()),
    inherits: [],
  },
  ["Intl.PluralRules.prototype.select"]: {
    type: "InstanceMethod",
    params: [["number", num()]],
    returns: str(),
    inherits: [],
  },
  ["Intl.PluralRules.prototype.selectRange"]: {
    type: "InstanceMethod",
    params: [
      ["startRange", num()],
      ["endRange", num()],
    ],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ INTL RELATIVE TIME FORMAT

const intlRelativeTimeFormatBuiltin: Builtins = {
  ...inheritFunction("Intl.RelativeTimeFormat"),

  [`Intl.RelativeTimeFormat.new`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      ["options?", obj(str(), str())],
    ],
    returns: ctor("Intl.RelativeTimeFormat"),
    inherits: [],
  },
  ["Intl.RelativeTimeFormat.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      ["options?", obj(str(), str())],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.RelativeTimeFormat.prototype.format"]: {
    type: "InstanceMethod",
    params: [
      ["value", num()],
      ["unit", str()],
    ],
    returns: str(),
    inherits: [],
  },
  ["Intl.RelativeTimeFormat.prototype.formatToParts"]: {
    type: "InstanceMethod",
    params: [
      ["value", num()],
      ["unit", str()],
    ],
    returns: obj(str(), str()),
    inherits: [],
  },
  ["Intl.RelativeTimeFormat.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(str(), str()),
    inherits: [],
  },
};

// MARK: ✅ INTL SEGMENTER

const intlSegmenterBuiltin: Builtins = {
  ...inheritFunction("Intl.Segmenter"),

  [`Intl.Segmenter.new`]: {
    type: "Constructor",
    params: [
      [
        "locales?",
        or(str(), arr(str())),
      ],
      [
        "options?",
        obj(
          str(),
          or(str(), undef()),
        ),
      ],
    ],
    returns: ctor("Intl.Segmenter"),
    inherits: [],
  },
  ["Intl.Segmenter.supportedLocalesOf"]: {
    type: "StaticMethod",
    params: [
      [
        "locales",
        or(
          str(),
          ctor("Intl.Locale"),
          arr(
            or(
              str(),
              ctor("Intl.Locale"),
            ),
          ),
        ),
      ],
      [
        "options?",
        obj(
          str(),
          or(str(), undef()),
        ),
      ],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["Intl.Segmenter.prototype.resolvedOptions"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(str(), str()),
    inherits: [],
  },
  ["Intl.Segmenter.prototype.segment"]: {
    type: "InstanceMethod",
    params: [["input", str()]],
    returns: arr(
      obj(str(), any()),
    ),
    inherits: [],
  },
};

// MARK: ✅ JSON

const jsonBuiltin: Builtins = {
  ["JSON.parse"]: {
    type: "StaticMethod",
    params: [
      ["text", str()],
      ["reviver?", fn()], // (key: string, value: any) => any
    ],
    returns: any(),
    inherits: [],
  },
  ["JSON.stringify"]: {
    type: "StaticMethod",
    params: [
      ["value", any()],
      ["replacer?", fn()], // (key: string, value: any) => any
      ["space?", or(str(), num())],
    ],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ MAP

const mapBuiltin: Builtins = {
  ...inheritFunction("Map"),

  [`Map.new`]: [
    {
      type: "Constructor",
      params: [],
      returns: new ParamTypeTs.MapParam(any(), any()),
      inherits: [],
    },
    {
      type: "Constructor",
      params: [
        [
          "entries?",
          or(
            arr(
              tuple(str(), str()),
            ),
            nil(),
          ),
        ],
      ],
      returns: ctor("Map"),
      inherits: [],
    },
  ],
  ["Map.prototype.delete"]: {
    type: "InstanceMethod",
    params: [["key", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Map.prototype.entries"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(
      tuple(any(), any()),
    ),
    inherits: [],
  },
  ["Map.prototype.forEach"]: {
    type: "InstanceMethod",
    params: [
      ["callback", fn()], // (value: V, key: K, map: ReadonlyMap<K, V>) => void
      ["thisArg?", any()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["Map.prototype.get"]: {
    type: "InstanceMethod",
    params: [["key", any()]],
    returns: any(),
    inherits: [],
  },
  ["Map.prototype.has"]: {
    type: "InstanceMethod",
    params: [["key", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Map.prototype.keys"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(any()),
    inherits: [],
  },
  ["Map.prototype.set"]: {
    type: "InstanceMethod",
    params: [
      ["key", any()],
      ["value", any()],
    ],
    returns: ctor("Map"),
    inherits: [],
  },
  ["Map.prototype.values"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(any()),
    inherits: [],
  },
  ["Map.prototype[Symbol.iterator]"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(
      tuple(any(), any()),
    ),
    inherits: [],
  },
  ["Map.prototype.size"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ MATH

const mathBuiltin: Builtins = {
  ["Math.abs"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.acos"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.acosh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.asin"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.asinh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.atan"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.atan2"]: {
    type: "StaticMethod",
    params: [
      ["y", num()],
      ["x", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Math.atanh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.cbrt"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.ceil"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.clz32"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.cos"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.cosh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.exp"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.expm1"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.floor"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.fround"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.hypot"]: {
    type: "StaticMethod",
    params: [["...values", arr(num())]],
    returns: num(),
    inherits: [],
  },
  ["Math.imul"]: {
    type: "StaticMethod",
    params: [
      ["a", num()],
      ["b", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Math.log"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.log10"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.log1p"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.log2"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.max"]: {
    type: "StaticMethod",
    params: [["...values", arr(num())]],
    returns: num(),
    inherits: [],
  },
  ["Math.min"]: {
    type: "StaticMethod",
    params: [["...values", arr(num())]],
    returns: num(),
    inherits: [],
  },
  ["Math.pow"]: {
    type: "StaticMethod",
    params: [
      ["base", num()],
      ["exponent", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["Math.random"]: {
    type: "StaticMethod",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.round"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.sign"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.sin"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.sinh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.sqrt"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.tan"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.tanh"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  ["Math.trunc"]: {
    type: "StaticMethod",
    params: [["x", num()]],
    returns: num(),
    inherits: [],
  },
  // Map Static Properties
  ["Math.E"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.LN10"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.LN2"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.LOG10E"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.LOG2E"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.PI"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.SQRT1_2"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Math.SQRT2"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ NUMBER

const numberBuiltin: Builtins = {
  ...inheritFunction("Number"),

  [`Number`]: {
    type: "Constructor",
    params: [["value", any()]],
    returns: num(),
    inherits: [],
  },
  [`Number.new`]: {
    type: "Constructor",
    params: [["value", any()]],
    returns: num(),
    inherits: [],
  },

  ["Number.isFinite"]: {
    type: "StaticMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Number.isInteger"]: {
    type: "StaticMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Number.isNaN"]: {
    type: "StaticMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Number.isSafeInteger"]: {
    type: "StaticMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Number.parseFloat"]: {
    type: "StaticMethod",
    params: [["string", str()]],
    returns: num(),
    inherits: [],
  },
  ["Number.parseInt"]: {
    type: "StaticMethod",
    params: [
      ["string", str()],
      ["radix?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  // Number Static properties
  ["Number.EPSILON"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.MAX_SAFE_INTEGER"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.MAX_VALUE"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.MIN_SAFE_INTEGER"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.MIN_VALUE"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.NaN"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.NEGATIVE_INFINITY"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["Number.POSITIVE_INFINITY"]: {
    type: "StaticProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  // Number Instance methods
  ["Number.prototype.toExponential"]: {
    type: "InstanceMethod",
    params: [["fractionDigits?", num()]],
    returns: str(),
    inherits: [],
  },
  ["Number.prototype.toFixed"]: {
    type: "InstanceMethod",
    params: [["digits?", num()]],
    returns: str(),
    inherits: [],
  },
  ["Number.prototype.toPrecision"]: {
    type: "InstanceMethod",
    params: [["precision?", num()]],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ OBJECT

const objectBuiltin: Builtins = {
  [`Object`]: {
    type: "Constructor",
    params: [["value", any()]],
    returns: obj(),
    inherits: [],
  },
  [`Object.new`]: {
    type: "Constructor",
    params: [["value", any()]],
    returns: obj(),
    inherits: [],
  },
  ["Object.assign"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      ["...sources", arr(obj())],
    ],
    returns: obj(),
    inherits: [],
  },
  ["Object.create"]: {
    type: "StaticMethod",
    params: [
      ["o", or(obj(), nil())],
      [
        "properties",
        obj(
          or(
            str(),
            num(),
            num(),
          ),
          obj(str(), any()),
        ),
      ],
    ],
    returns: obj(),
    inherits: [],
  },
  ["Object.defineProperties"]: {
    type: "StaticMethod",
    params: [
      ["o", any()],
      [
        "properties",
        obj(
          or(
            str(),
            num(),
            num(),
          ),
          obj(str(), any()),
        ),
      ],
    ],
    returns: any(),
    inherits: [],
  },
  ["Object.defineProperty"]: {
    type: "StaticMethod",
    params: [
      ["o", obj()],
      [
        "property",
        or(str(), num(), num()),
      ],
      ["descriptor", obj()],
    ],
    returns: obj(),
    inherits: [],
  },
  ["Object.entries"]: {
    type: "StaticMethod",
    params: [[
      "o",
      or(
        obj(str(), any()),
        arr(),
      ),
    ]],
    returns: arr(
      tuple(str(), any()),
    ),
    inherits: [],
  },
  ["Object.freeze"]: {
    type: "StaticMethod",
    params: [["o", obj()]],
    returns: obj(),
    inherits: [],
  },
  ["Object.fromEntries"]: [
    {
      type: "StaticMethod",
      params: [[
        "iterable",
        iter(
          tuple(
            or(
              (str(), sym(), num()),
            ),
            any(),
          ),
        ),
      ]],
      returns: obj(),
      inherits: [],
    },
    {
      type: "StaticMethod",
      params: [["iterable", iter(arr(any()))]],
      returns: obj(str(), any()),
      inherits: [],
    },
  ],
  ["Object.getOwnPropertyDescriptor"]: {
    type: "StaticMethod",
    params: [
      ["o", obj()],
      [
        "p",
        or(str(), num(), num()),
      ],
    ],
    returns: obj(str(), any()),
    inherits: [],
  },
  ["Object.getOwnPropertyDescriptors"]: {
    type: "StaticMethod",
    params: [["obj", obj()]],
    returns: obj(),
    inherits: [],
  },
  ["Object.getOwnPropertyNames"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: arr(str()),
    inherits: [],
  },
  ["Object.getOwnPropertySymbols"]: {
    type: "StaticMethod",
    params: [["o", obj()]],
    returns: arr(sym()),
    inherits: [],
  },
  ["Object.getPrototypeOf"]: {
    type: "StaticMethod",
    params: [["o", obj()]],
    returns: obj(),
    inherits: [],
  },
  ["Object.groupBy"]: {
    type: "StaticMethod",
    params: [
      ["items", iter(any())],
      ["keySelector", fn()], // (item: T, index: number) => K
    ],
    returns: obj(
      any(),
      arr(any()),
    ),
    inherits: [],
  },
  ["Object.hasOwn"]: {
    type: "StaticMethod",
    params: [
      ["o", obj()],
      [
        "v",
        or(str(), num(), num()),
      ],
    ],
    returns: bool(),
    inherits: [],
  },
  ["Object.is"]: {
    type: "StaticMethod",
    params: [
      ["value1", any()],
      ["value2", any()],
    ],
    returns: bool(),
    inherits: [],
  },
  ["Object.isExtensible"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Object.isFrozen"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Object.isSealed"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Object.keys"]: {
    type: "StaticMethod",
    params: [["o", obj()]],
    returns: arr(str()),
    inherits: [],
  },
  ["Object.preventExtensions"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: any(),
    inherits: [],
  },
  ["Object.seal"]: {
    type: "StaticMethod",
    params: [["o", any()]],
    returns: any(),
    inherits: [],
  },
  ["Object.setPrototypeOf"]: {
    type: "StaticMethod",
    params: [
      ["o", any()],
      ["proto", or(obj(), nil())],
    ],
    returns: any(),
    inherits: [],
  },
  ["Object.values"]: {
    type: "StaticMethod",
    params: [[
      "o",
      or(
        obj(str(), any()),
        arr(),
      ),
    ]],
    returns: arr(),
    inherits: [],
  },
  // ['Object.prototype.hasOwnProperty']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['v', new UnionParameter(str(), num(), num())]],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.None],
  // },
  // ['Object.prototype.isPrototypeOf']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['v', obj()]],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.None],
  // },
  // ['Object.prototype.propertyIsEnumerable']: {
  //   type: DefinitionType.InstanceMethod,
  //   parameters: [['v', new UnionParameter(str(), num(), num())]],
  //   returnValue: bool(),
  //   inheritedFrom: [BuiltinObject.None],
  // },
  ["Object.prototype.toLocaleString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Object.prototype.toString"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["Object.prototype.valueOf"]: {
    type: "InstanceMethod",
    params: [],
    returns: obj(),
    inherits: [],
  },
  ["Object.prototype.constructor"]: {
    type: "InstanceProperty",
    params: [],
    returns: fn(),
    inherits: [],
  },
};

// MARK: ✅ PROMISE

const promiseBuiltin: Builtins = {
  ...inheritFunction("Promise"),

  ["Promise.new"]: {
    type: "Constructor",
    params: [[
      "executor",
      fn(), // (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void)
    ]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.all"]: {
    type: "StaticMethod",
    params: [["values", arr()]],
    returns: promise(
      obj(str(), any()),
    ),
    inherits: [],
  },
  ["Promise.allSettled"]: {
    type: "StaticMethod",
    params: [["values", arr()]],
    returns: promise(
      obj(str(), any()),
    ),
    inherits: [],
  },
  ["Promise.any"]: {
    type: "StaticMethod",
    params: [["values", arr()]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.race"]: {
    type: "StaticMethod",
    params: [[
      "values",
      or(
        iter(any()),
        promise(any()),
      ),
    ]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.reject"]: {
    type: "StaticMethod",
    params: [["reason", any()]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.resolve"]: {
    type: "StaticMethod",
    params: [["value", any()]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.prototype.catch"]: {
    type: "InstanceMethod",
    params: [[
      "onRejected",
      or(
        fn(), // (reason: any) => TResult | PromiseLike<TResult2>
        undef(),
        nil(),
      ),
    ]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.prototype.finally"]: {
    type: "InstanceMethod",
    params: [[
      "onFinally",
      or(fn(), /* () => void */ nil()),
    ]],
    returns: promise(any()),
    inherits: [],
  },
  ["Promise.prototype.then"]: {
    type: "InstanceMethod",
    params: [
      [
        "onFulfilled",
        or(
          fn(), // (value: T) => TResult | PromiseLike<TResult1>
          undef(),
          nil(),
        ),
      ],
      [
        "onRejected",
        or(
          fn(), // (reason: any) => TResult | PromiseLike<TResult2>
          undef(),
          nil(),
        ),
      ],
    ],
    returns: promise(any()),
    inherits: [],
  },
};

// MARK: ✅ PROXY

const proxyBuiltin: Builtins = {
  [`Proxy.new`]: {
    type: "Constructor",
    params: [
      ["target", obj()],
      ["handler", obj(str(), any())],
    ],
    returns: obj(),
    inherits: [],
  },
  [`Proxy.revocable`]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      ["handler", obj(str(), any())],
    ],
    returns: obj(str(), any()),
    inherits: [],
  },
};

// MARK: ✅ REFLECT

const reflectBuiltin: Builtins = {
  ["Reflect.apply"]: {
    type: "StaticMethod",
    params: [
      [
        "target",
        or(
          fn(),
          fn(), // (this: T, ...args: A) => R
        ),
      ],
      ["thisArgument", any()],
      ["argumentsList", arr()],
    ],
    returns: any(),
    inherits: [],
  },
  ["Reflect.construct"]: {
    type: "StaticMethod",
    params: [
      ["target", ctor()],
      ["argumentsList", arr()],
      ["newTarget?", ctor()],
    ],
    returns: any(),
    inherits: [],
  },
  ["Reflect.defineProperty"]: {
    type: "StaticMethod",
    params: [
      ["o", obj()],
      [
        "property",
        or(str(), num(), num()),
      ],
      ["descriptor", obj()],
    ],
    returns: any(),
    inherits: [],
  },
  ["Reflect.deleteProperty"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      [
        "propertyKey",
        or(str(), num(), num()),
      ],
      // ['attributes', PTPropertyDescriptor],
    ],
    returns: bool(),
    inherits: [],
  },
  ["Reflect.get"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      [
        "propertyKey",
        or(str(), num(), num()),
      ],
      ["receiver?", any()],
    ],
    returns: any(),
    inherits: [],
  },
  ["Reflect.getOwnPropertyDescriptor"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      [
        "propertyKey",
        or(str(), num(), num()),
      ],
    ],
    returns: obj(str(), any()),
    inherits: [],
  },
  ["Reflect.getPrototypeOf"]: {
    type: "StaticMethod",
    params: [["target", obj()]],
    returns: or(obj(), nil()),
    inherits: [],
  },
  ["Reflect.has"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      [
        "propertyKey",
        or(str(), num(), num()),
      ],
    ],
    returns: bool(),
    inherits: [],
  },
  ["Reflect.isExtensible"]: {
    type: "StaticMethod",
    params: [["target", obj()]],
    returns: bool(),
    inherits: [],
  },
  ["Reflect.ownKeys"]: {
    type: "StaticMethod",
    params: [["target", obj()]],
    returns: or(
      str(),
      arr(sym()),
    ),
    inherits: [],
  },
  ["Reflect.preventExtensions"]: {
    type: "StaticMethod",
    params: [["target", obj()]],
    returns: bool(),
    inherits: [],
  },
  ["Reflect.set"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      [
        "propertyKey",
        or(str(), num(), num()),
      ],
      ["value", any()],
      ["receiver?", any()],
    ],
    returns: bool(),
    inherits: [],
  },
  ["Reflect.setPrototypeOf"]: {
    type: "StaticMethod",
    params: [
      ["target", obj()],
      ["proto", or(obj(), nil())],
    ],
    returns: bool(),
    inherits: [],
  },
};

// MARK: ✅ REGEXP

const regexpBuiltin: Builtins = {
  ...inheritFunction("RegExp"),

  [`RegExp`]: {
    type: "Constructor",
    params: [
      ["pattern", or(str(), regex())],
      ["flags?", str()],
    ],
    returns: ctor("RegExp"),
    inherits: [],
  },
  [`RegExp.new`]: {
    type: "Constructor",
    params: [
      ["pattern", or(str(), regex())],
      ["flags?", str()],
    ],
    returns: ctor("RegExp"),
    inherits: [],
  },
  ["RegExp.prototype.exec"]: {
    type: "InstanceMethod",
    params: [["string", str()]],
    returns: obj(
      str(),
      obj(str(), str()),
    ),
    inherits: [],
  },
  ["RegExp.prototype[Symbol.match]"]: {
    type: "InstanceMethod",
    params: [["string", str()]],
    returns: obj(
      str(),
      obj(str(), str()),
    ),
    inherits: [],
  },
  ["RegExp.prototype[Symbol.matchAll]"]: {
    type: "InstanceMethod",
    params: [["string", str()]],
    returns: obj(
      str(),
      obj(str(), str()),
    ),
    inherits: [],
  },
  ["RegExp.prototype[Symbol.replace]"]: [
    {
      type: "InstanceMethod",
      params: [
        ["string", str()],
        ["replaceValue", str()],
      ],
      returns: str(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["string", str()],
        ["replaceValue", fn()], // (substring: string, ...args: any[]) => string
      ],
      returns: str(),
      inherits: [],
    },
  ],
  ["RegExp.prototype[Symbol.search]"]: {
    type: "InstanceMethod",
    params: [["string", str()]],
    returns: num(),
    inherits: [],
  },
  ["RegExp.prototype[Symbol.split]"]: {
    type: "InstanceMethod",
    params: [
      ["string", str()],
      ["limit?", num()],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["RegExp.prototype.test"]: {
    type: "InstanceMethod",
    params: [["string", str()]],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.dotAll"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.flags"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["RegExp.prototype.global"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.hasIndices"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.ignoreCase"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.lastIndex"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["RegExp.prototype.multiline"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.source"]: {
    type: "InstanceProperty",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["RegExp.prototype.sticky"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.unicode"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["RegExp.prototype.unicodeSets"]: {
    type: "InstanceProperty",
    params: [],
    returns: bool(),
    inherits: [],
  },
};

// MARK: ✅ SET

const setBuiltin: Builtins = {
  ...inheritFunction("Set"),

  [`Set.new`]: {
    type: "Constructor",
    params: [["iterable?", or(iter(any()), nil())]], // Iterable<T> | null
    returns: set(any()),
    inherits: [],
  },
  ["Set.prototype.add"]: {
    type: "InstanceMethod",
    params: [["value", any()]],
    returns: set(any()),
    inherits: [],
  },
  ["Set.prototype.clear"]: {
    type: "InstanceMethod",
    params: [],
    returns: undef(), // void
    inherits: [],
  },
  ["Set.prototype.delete"]: {
    type: "InstanceMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Set.prototype.entries"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(tuple(any(), any())), // 'IterableIterator<[T, T]>'`;
    inherits: [],
  },
  ["Set.prototype.forEach"]: {
    type: "InstanceMethod",
    params: [
      ["callbackfn", fn()], // (value: T, value2: T, set: Set<T>) => void
      ["thisArg?", any()],
    ],
    returns: undef(), // void
    inherits: [],
  },
  ["Set.prototype.has"]: {
    type: "InstanceMethod",
    params: [["value", any()]],
    returns: bool(),
    inherits: [],
  },
  ["Set.prototype.keys"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(any()),
    inherits: [],
  },
  ["Set.prototype.values"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(any()),
    inherits: [],
  },
  ["Set.prototype[Symbol.iterator]"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(), // IterableIterator<T>
    inherits: [],
  },
  ["Set.prototype.size"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ SHARED ARRAY BUFFER

const sharedArrayBufferBuiltin: Builtins = {
  ...inheritFunction("SharedArrayBuffer"),

  [`SharedArrayBuffer.new`]: {
    type: "Constructor",
    params: [["byteLength", num()]],
    returns: ctor("SharedArrayBuffer"),
    inherits: [],
  },
  ["SharedArrayBuffer.prototype.slice"]: {
    type: "InstanceMethod",
    params: [
      ["begin", num()],
      ["end?", num()],
    ],
    returns: ctor("SharedArrayBuffer"),
    inherits: [],
  },
  ["SharedArrayBuffer.prototype.byteLength"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
};

// MARK: ✅ STRING

const stringBuiltin: Builtins = {
  ...inheritFunction("String"),

  [`String`]: {
    type: "Constructor",
    params: [["value?", any()]],
    returns: str(),
    inherits: [],
  },
  [`String.new`]: {
    type: "Constructor",
    params: [["value?", any()]],
    returns: str(),
    inherits: [],
  },
  ["String.fromCharCode"]: {
    type: "StaticMethod",
    params: [["...codeUnits", arr(num())]],
    returns: str(),
    inherits: [],
  },
  ["String.fromCodePoint"]: {
    type: "StaticMethod",
    params: [["...codePoints", arr(num())]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.at"]: {
    type: "InstanceMethod",
    params: [["index", num()]],
    returns: or(str(), undef()),
    inherits: [],
  },
  ["String.prototype.charAt"]: {
    type: "InstanceMethod",
    params: [["index", num()]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.charCodeAt"]: {
    type: "InstanceMethod",
    params: [["index", num()]],
    returns: num(),
    inherits: [],
  },
  ["String.prototype.codePointAt"]: {
    type: "InstanceMethod",
    params: [["index", num()]],
    returns: or(num(), undef()),
    inherits: [],
  },
  ["String.prototype.concat"]: {
    type: "InstanceMethod",
    params: [["...strings", arr(str())]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.endsWith"]: {
    type: "InstanceMethod",
    params: [
      ["searchString", str()],
      ["length?", num()],
    ],
    returns: bool(),
    inherits: [],
  },
  ["String.prototype.includes"]: {
    type: "InstanceMethod",
    params: [
      ["searchString", str()],
      ["position?", num()],
    ],
    returns: bool(),
    inherits: [],
  },
  ["String.prototype.indexOf"]: {
    type: "InstanceMethod",
    params: [
      ["searchString", str()],
      ["position?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["String.prototype.isWellFormed"]: {
    type: "InstanceMethod",
    params: [],
    returns: bool(),
    inherits: [],
  },
  ["String.prototype.lastIndexOf"]: {
    type: "InstanceMethod",
    params: [
      ["searchString", str()],
      ["position?", num()],
    ],
    returns: num(),
    inherits: [],
  },
  ["String.prototype.length"]: {
    type: "InstanceProperty",
    params: [],
    returns: num(),
    inherits: [],
  },
  ["String.prototype.localeCompare"]: [
    {
      type: "InstanceMethod",
      params: [
        ["that", str()],
      ],
      returns: num(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["that", str()],
        [
          "locales?",
          or(str(), arr(str())),
        ],
        [
          "options",
          obj(
            str(),
            or(
              str(),
              bool(),
              undef(),
            ),
          ),
        ],
      ],
      returns: num(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["that", str()],
        [
          "locales?",
          or(
            str(),
            ctor("Intl.Locale"),
            arr(
              or(
                str(),
                ctor("Intl.Locale"),
              ),
            ),
          ),
        ],
        [
          "options?",
          obj(
            str(),
            or(
              str(),
              bool(),
              undef(),
            ),
          ),
        ],
      ],
      returns: num(),
      inherits: [],
    },
  ],
  ["String.prototype.match"]: {
    type: "InstanceMethod",
    params: [["regexp", or(str(), regex())]],
    returns: obj(
      str(),
      obj(str(), str()),
    ),
    inherits: [],
  },
  ["String.prototype.matchAll"]: {
    type: "InstanceMethod",
    params: [["regexp", regex()]],
    returns: obj(
      str(),
      obj(str(), str()),
    ),
    inherits: [],
  },
  ["String.prototype.normalize"]: {
    type: "InstanceMethod",
    params: [["form?", str()]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.padEnd"]: {
    type: "InstanceMethod",
    params: [
      ["maxLength", num()],
      ["fillString?", str()],
    ],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.padStart"]: {
    type: "InstanceMethod",
    params: [
      ["maxLength", num()],
      ["fillString?", str()],
    ],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.repeat"]: {
    type: "InstanceMethod",
    params: [["count", num()]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.replace"]: [
    {
      type: "InstanceMethod",
      params: [
        ["string", or(str(), regex())],
        ["replaceValue", str()],
      ],
      returns: str(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["string", or(str(), regex())],
        ["replacer", fn()], // (substring: string, ...args: any[]) => string
      ],
      returns: str(),
      inherits: [],
    },
  ],
  ["String.prototype.replaceAll"]: [
    {
      type: "InstanceMethod",
      params: [
        ["string", or(str(), regex())],
        ["replaceValue", str()],
      ],
      returns: str(),
      inherits: [],
    },
    {
      type: "InstanceMethod",
      params: [
        ["string", or(str(), regex())],
        ["replacer", fn()], // (substring: string, ...args: any[]) => string
      ],
      returns: str(),
      inherits: [],
    },
  ],
  ["String.prototype.search"]: {
    type: "InstanceMethod",
    params: [["regexp", or(str(), regex())]],
    returns: num(),
    inherits: [],
  },
  ["String.prototype.slice"]: {
    type: "InstanceMethod",
    params: [
      ["start?", num()],
      ["end?", num()],
    ],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.split"]: {
    type: "InstanceMethod",
    params: [
      ["separator", or(str(), regex())],
      ["limit?", num()],
    ],
    returns: arr(str()),
    inherits: [],
  },
  ["String.prototype.startsWith"]: {
    type: "InstanceMethod",
    params: [
      ["searchString", str()],
      ["position?", num()],
    ],
    returns: bool(),
    inherits: [],
  },
  ["String.prototype.toLocaleLowerCase"]: {
    type: "InstanceMethod",
    params: [[
      "locales",
      or(
        str(),
        ctor("Intl.Locale"),
        arr(
          or(
            str(),
            ctor("Intl.Locale"),
          ),
        ),
      ),
    ]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.toLocaleUpperCase"]: {
    type: "InstanceMethod",
    params: [[
      "locales",
      or(
        str(),
        ctor("Intl.Locale"),
        arr(
          or(
            str(),
            ctor("Intl.Locale"),
          ),
        ),
      ),
    ]],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.toLowerCase"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.toUpperCase"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.toWellFormed"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.trim"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.trimEnd"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype.trimStart"]: {
    type: "InstanceMethod",
    params: [],
    returns: str(),
    inherits: [],
  },
  ["String.prototype[Symbol.iterator]"]: {
    type: "InstanceMethod",
    params: [],
    returns: iter(str()),
    inherits: [],
  },
  ["String.raw"]: {
    type: "StaticMethod",
    params: [
      [
        "template",
        obj(str(), arr(str())),
      ],
      ["...substitutions", arr()],
    ],
    returns: str(),
    inherits: [],
  },
};

// MARK: ✅ SYMBOL

const symbolBuiltin: Builtins = {
  ...inheritFunction("Symbol"),

  [`Symbol`]: {
    type: "Constructor",
    params: [["description?", or(str(), num())]],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.asyncIterator"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.for"]: {
    type: "StaticMethod",
    params: [["key", str()]],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.hasInstance"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.isConcatSpreadable"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.iterator"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.keyFor"]: {
    type: "StaticMethod",
    params: [["sym", sym()]],
    returns: or(str(), undef()),
    inherits: [],
  },
  ["Symbol.match"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.matchAll"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.prototype.description"]: {
    type: "InstanceProperty",
    params: [],
    returns: or(str(), undef()),
    inherits: [],
  },
  ["Symbol.prototype[Symbol.toPrimitive]"]: {
    type: "InstanceMethod",
    params: [["hint", str()]],
    returns: any(),
    inherits: [],
  },
  ["Symbol.replace"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.search"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  // Disable Symbol.species to prevent arbitrary code execution.
  // > Warning: The existence of [Symbol.species] allows execution of arbitrary code and may create security vulnerabilities. It also makes certain
  // > optimizations much harder. Engine implementers are investigating whether to remove this feature. Avoid relying on it if possible.
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
  // ['Symbol.species']: {
  //   type: DefinitionType.StaticProperty,
  //   parameters: [],
  //   returnValue: PTSymbol,
  //   inheritedFrom: [BaseObjects.None],
  // },
  ["Symbol.split"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.toPrimitive"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.toStringTag"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
  ["Symbol.unscopables"]: {
    type: "StaticProperty",
    params: [],
    returns: sym(),
    inherits: [],
  },
};

// MARK: ✅ WEAK MAP

const weakMapBuiltin: Builtins = {
  ...inheritFunction("WeakMap"),

  [`WeakMap.new`]: {
    type: "Constructor",
    params: [[
      "entries?",
      iter(tuple(any(), any())),
    ]],
    returns: ctor("WeakMap"),
    inherits: [],
  },
  ["WeakMap.prototype.delete"]: {
    type: "InstanceMethod",
    params: [["key", obj(str(), any())]],
    returns: bool(),
    inherits: [],
  },
  ["WeakMap.prototype.get"]: {
    type: "InstanceMethod",
    params: [["key", obj(str(), any())]],
    returns: or(any(), undef()),
    inherits: [],
  },
  ["WeakMap.prototype.has"]: {
    type: "InstanceMethod",
    params: [["key", obj(str(), any())]],
    returns: bool(),
    inherits: [],
  },
  ["WeakMap.prototype.set"]: {
    type: "InstanceMethod",
    params: [
      ["key", obj(str(), any())],
      ["value", any()],
    ],
    returns: ctor("WeakMap"),
    inherits: [],
  },
};

// MARK: ✅ WEAK REF

const weakRefBuiltin: Builtins = {
  ...inheritFunction("WeakRef"),

  [`WeakRef.new`]: {
    type: "Constructor",
    params: [["target", obj(str(), any())]],
    returns: ctor("WeakRef"),
    inherits: [],
  },
  ["WeakRef.prototype.deref"]: {
    type: "InstanceMethod",
    params: [],
    returns: or(any(), undef()),
    inherits: [],
  },
};

// MARK: ✅ WEAK SET

const weakSetBuiltin: Builtins = {
  ...inheritFunction("WeakSet"),

  [`WeakSet.new`]: {
    type: "Constructor",
    params: [[
      "values",
      arr(
        or(
          arr(or(any(), nil())),
        ),
      ),
    ]],
    returns: ctor("WeakSet"),
    inherits: [],
  },
  ["WeakSet.prototype.add"]: {
    type: "InstanceMethod",
    params: [["value", obj(str(), any())]],
    returns: ctor("WeakSet"),
    inherits: [],
  },
  ["WeakSet.prototype.delete"]: {
    type: "InstanceMethod",
    params: [["value", obj(str(), any())]],
    returns: bool(),
    inherits: [],
  },
  ["WeakSet.prototype.has"]: {
    type: "InstanceMethod",
    params: [["value", obj(str(), any())]],
    returns: bool(),
    inherits: [],
  },
};

// MARK: ✅ GLOBAL FUNCTIONS

const builtInGlobalFunctions: Builtins = {
  decodeURI: {
    type: "StaticMethod",
    params: [["encodedURI", str()]],
    returns: str(),
    inherits: [],
  },
  decodeURIComponent: {
    type: "StaticMethod",
    params: [["encodedURIComponent", str()]],
    returns: str(),
    inherits: [],
  },
  encodeURI: {
    type: "StaticMethod",
    params: [["uri", str()]],
    returns: str(),
    inherits: [],
  },
  encodeURIComponent: {
    type: "StaticMethod",
    params: [["uriComponent", str()]],
    returns: str(),
    inherits: [],
  },
  eval: {
    type: "StaticMethod",
    params: [["x", str()]],
    returns: any(),
    inherits: [],
  },
  isFinite: {
    type: "StaticMethod",
    params: [["number", num()]],
    returns: bool(),
    inherits: [],
  },
  isNaN: {
    type: "StaticMethod",
    params: [["number", str()]],
    returns: str(),
    inherits: [],
  },
  parseFloat: {
    type: "StaticMethod",
    params: [["string", str()]],
    returns: num(),
    inherits: [],
  },
  parseInt: {
    type: "StaticMethod",
    params: [
      ["string", str()],
      ["radix?", num()],
    ],
    returns: str(),
    inherits: [],
  },
};

// MARK: EXPORT

export const javascriptDefinitions: Builtins = {
  ...builtInGlobalFunctions,
  ...aggregateErrorBuiltin,
  ...arrayBuiltin,
  ...arrayBufferBuiltin,
  ...atomicsBuiltin,
  ...bigintBuiltin,
  ...bigint64ArrayBuiltin,
  ...bigUint64ArrayBuiltin,
  ...booleanBuiltin,
  ...dataViewBuiltin,
  ...dateBuiltin,
  ...errorBuiltin,
  ...evalErrorBuiltin,
  ...finalizationRegistryBuiltin,
  ...float32ArrayBuiltin,
  ...float64ArrayBuiltin,
  ...functionBuiltin,
  ...int8ArrayBuiltin,
  ...int16ArrayBuiltin,
  ...int32ArrayBuiltin,
  ...intlBuiltin,
  ...intlCollatorBuiltin,
  ...intlDateTimeFormatBuiltin,
  ...intlDisplayNamesBuiltin,
  ...intlListFormatBuiltin,
  ...intlLocaleBuiltin,
  ...intlNumberFormatBuiltin,
  ...intlPluralRulesBuiltin,
  ...intlRelativeTimeFormatBuiltin,
  ...intlSegmenterBuiltin,
  ...jsonBuiltin,
  ...mapBuiltin,
  ...mathBuiltin,
  ...numberBuiltin,
  ...objectBuiltin,
  ...promiseBuiltin,
  ...proxyBuiltin,
  ...rangeErrorBuiltin,
  ...referenceErrorBuiltin,
  ...reflectBuiltin,
  ...regexpBuiltin,
  ...setBuiltin,
  ...sharedArrayBufferBuiltin,
  ...stringBuiltin,
  ...symbolBuiltin,
  ...syntaxErrorBuiltin,
  ...typeErrorBuiltin,
  ...uriErrorBuiltin,
  ...uint8ArrayBuiltin,
  ...uint16ArrayBuiltin,
  ...uint32ArrayBuiltin,
  ...uint8ClampedArrayBuiltin,
  ...weakMapBuiltin,
  ...weakRefBuiltin,
  ...weakSetBuiltin,
};

const unique = new Set<string>();
function getDefns(_name: string, defns: BuiltinDefn, visitor: ParamVisitor) {
  defns.params.forEach(([_parameterName, parameterType]) => {
    unique.add(parameterType.accept(visitor));
  });
}

function logDefns() {
  const visitor = new ParamTypeTs.EnsembleVisitor();
  for (const [name, defns] of Object.entries(javascriptDefinitions)) {
    if (Array.isArray(defns)) {
      for (const defn of defns as BuiltinDefn[]) {
        getDefns(name, defn, visitor);
      }
    } else {
      const defn = defns as BuiltinDefn;
      getDefns(name, defn, visitor);
    }
  }
  for (const type of unique) {
    console.log(`  ${type}`);
  }
}

if (import.meta.main) {
  logDefns();
}
