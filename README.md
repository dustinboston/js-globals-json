# JavaScript Globals JSON

 > A machine-readable list of the standard JavaScript globals with type information as JSON.

## Rationale
 
 There are a few packages that appear to have this data, but are either incomplete or are not machine-readable. [mdn-data](https://github.com/mdn/data) only defines inheritance; [mdn-content](https://github.com/mdn/content) and [js-core](https://github.com/zloirock/core-js) are comprehensive, but not machine readable. However, all of this data is clearly encoded in TypeScript's lib files. This code uses the TypeScript API to parse the lib files and convert them into a simplified JSON format. Honestly, this seems like it must have already been solved and as if this is completely over-engineering the whole thing. So if you know of a better way, or some data that already exists, please leave an issue.

 ## Schema

 A single object is used to represent the entirety of the JavaScript API as defined in Typescript. It has this structure:
 
```typescript
type ObjectProperty = {
	id?: string;
	kind?: KindsEnum;
	meta: Set<MetaEnum> = new Set();
	name?: string;
	/** Function parameters and nothing else */
	parameters: ObjectProperty[] = [];
	text?: string;
	/** The type of thing (can be return type, or simply type) */
	type: ObjectProperty[] = [];
	typeParameters: ObjectPropert[] = [];
}
```

### `id`

The id of the object. This is used to uniquely identify the object.

### `kind`

The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`. Here are the types with examples of each:

- **Array:** a value followed by brackets, e.g. `string[]`
- **Constructor:** a constructor interface, e.g. `new (...args: any[]) => any`
- **Function:** a function with parameters and a return type, e.g. `(a: string, b: string) => number`
- **Identifier:** the name of an object or property. This is always represented by a string value, not an object.
- **IndexAccess:** a type with a type surrounded by brackets, e.g. `A[B]`
- **IndexSignature:** parameters surrounded by brackets, followed by a type, e.g. `[key: string]: number`
- **Intersection:** an list of types separated by `&`, e.g. `{ foo: true } & { bar: false }`
- **Literal:** A literal value, e.g. `"default"`
- **Mapped:** a map of parameters, each surrounded by brackets, followed by a type, e.g. `{ [A]?: B }`
- **Method:** a method with parameters and a return type, e.g. `A(B): C`
- **Operator:** a type preceded by an operator, e.g. `readonly A`, `keyof A`, `unique A`
- **Parenthesized:** a type surrounded by parentheses, e.g. `(A)`
- **Property:** a property with a type, e.g. `A: B`
- **Reference:** a reference to another interface, e.g. `Array<T>` or `ArrayConstructor`
- **This:** The literal `this` which will probably be removed in favor of Token for simplicity.
- **Token:** language-defined words such as `number`, `void`, `any`, etc.
- **Tuple:** elements surrounded by brackets and separated by commas, e.g. `[string, number, boolean]`
- **Type:** currently a catch-all for any unhandled values. This should be better specified as the type of an object or property.
- **TypeLiteral:** object-literal notation (members surrounded by braces), e.g. `{ a: string, b: number }`
- **Union:** `string | number | boolean`
- **Variable:** a variable declaration, usually preceded by the `declare` modifier, e.g. `declare var a: string`

### `meta`

Meta information about the object as boolean flags (if present it's true, absent is false) This includes metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:

- **Abstract:** indicates that a class is marked `abstract`
- **Accessor:** indicates that a property is an accessor, e.g. `A[B]`
- **Async:** indicates that a function is marked `async`
- **Const:** indicates that a value is a constant variabale, `const`
- **Declare:** indicates a variable or function declaration, `declare`
- **Default:** indicates that a value is the default export `default`
- **Export:** indicates that a value is exported, `export`
- **Extends:** indicates that an object extends another object, marked `extends`
- **Generator:** indicates that a function is a generator function, marked with an `*`
- **In:** indicates that a value is in a set, e.g. `a in b`
- **Optional:** indicates that a value is optional, marked with a `?`
- **Out:** indicates that a value is out of a set, e.g. `a out of b`
- **Override:** indiciates that a method overrides a method in a parent class, marked `override`
- **Private:** indicates that a value is private, `private` (TODO: does this include `#`?)
- **Protected:** indicates that a value is protected, `protected`
- **Public:** indicates that a value is public, `public`
- **ReadOnly:** indicates that a value is read-only, `readonly`
- **Rest:** indicates that a value is a rest parameter, marked with `...`
- **Static:** indicates that a value is marked as static, `static`

### `name`

The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.

### `parameters`

An array of `ObjectProperty` objects that represent function/method parameters.

### `text`

Actual text of a language-defined keyword or token value, such as `string`, `await`.

### `type`

An array of `ObjectProperty` objects that represent the type(s) of an object, property, function return, etc.

### `typeParameters`

An array of `ObjectProperty` objects that represent the type parameters of a generic type like `T`, `U`, etc.

 ## Parsing

 A note on static methods/properties and instance methods/properties.
 Given this abbreviated String definition from lib.es5.d.ts:
 
 ```typescript
 interface String {
     toString(): string;
     charAt(pos: number): string;
     readonly length: number;
 }
 
 interface StringConstructor {
     new (value?: any): String;
     (value?: any): string;
     readonly prototype: String;
     fromCharCode(...codes: number[]): string;
 }
 
 declare var String: StringConstructor;
 ```
 
 In the declaration for `String`, the `String` interface defines **instance** methods and properties accesed
 through the prototype, e.g. `String.protototype.toString`. The `StringConstructor` contains **static** methods
 accessed directly from the object, e.g. `String.fromCharCode(...)`.
 
 More generically speaking, if the name of an interface is the same as the name of a variable declaration, the
 interface defines **instance** methods and properties. If the interface contains a `prototype` with a type that
 matches the variable declaration name, the interface defines **static** methods and properties.
 
 There is one exception: If the interface, declaration name, and declaration type have the same, the methods and
 properties defined in the interface name interface are static.
 
 The code uses a shorthand for this:
 - The variable declaration **name** defines an instance and its members.
 - The variable declaration **type** defines the object's static members.
 - If var name, type name, and interface name are equal the interface defines static members.
 
 ### Example: Static members

 In this example `abs` is static (Math.abs) because the interface, var, and type have the same name.
 
 ```typescript
 interface Math {
     abs(x: number): number;
 }
 declare var Math: Math;
 ```
 
### Example: Instance members

 In this example, `setMonth` is an instance method (Date.prototype.setMonth) because the interface and var have the
 same name, but the type is different.
 
 ```typescript
 interface Math {
     abs(x: number): number;
 }
 declare var Math: Math;
 ```
 
### Example: Constructors
 
 In this example `isArray` is static because it is defined in an interface with a different name than the var.
 
 ```typescript
 interface ArrayConstructor {
     isArray(arg: any): arg is any[];
 }
 declare var Array: ArrayConstructor
 ```
 
 ## Stability

 - The `ObjectProperty` object is stable in that it represents all of the values it needs to, however, the names may change slightly.
 - The rendered JSON is **NOT STABLE**. At present there are missing values, or values associated with an incorrect property (e.g. `type` instead of `typeParameter`)
 - There aren't any tests at the moment.

 ## License

 See [LICENSE](./LICENSE)