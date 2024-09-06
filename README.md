# JavaScript Globals JSON

 > A machine-readable list of the standard JavaScript globals with type information as JSON.

## Rationale
 
 There are a few packages that appear to have this data, but are either incomplete or are not machine-readable. [mdn-data](https://github.com/mdn/data) only defines inheritance; [mdn-content](https://github.com/mdn/content) and [js-core](https://github.com/zloirock/core-js) are comprehensive, but not machine readable. However, all of this data is clearly encoded in TypeScript's lib files. This code uses the TypeScript API to parse the lib files and convert them into a simplified JSON format. Honestly, this seems like it must have already been solved and as if this is completely over-engineering the whole thing. So if you know of a better way, or some data that already exists, please leave an issue.

## Schema

### Ast Class

 A single object is used to represent the entirety of the JavaScript API as defined in Typescript. It has this structure:
 
```typescript
type Ast = {
	id: string;
	kind?: ts.SyntaxKind;
	meta: Set<Meta> = new Set();
	name?: string;
	parameters: Ast[] = [];
	text?: string;
	type: Ast[] = [];
	typeParameters: Ast[] = [];
}
```

### `id`

The id of the object. This is used to uniquely identify the object. Will be populated with a throwaway GUID if not provided.

### `kind`

The kind of the object. This is used to determine the type of the object. The `SyntaxKinds` object is defined in the TypeScript compiler API.

### `meta`

Meta information about the object as boolean flags (if present it's true, absent is false). 
This includes metadata about the object such as whether it is a declaration, extends another object, or is read-only.
This is mostly made up of TypeScript "modifiers" plus a few extra types that represent boollean values.

- `ts.SyntaxKind.AbstractKeyword`: indicates that a class is marked `abstract`
- `ts.SyntaxKind.AccessorKeyword`: indicates that a property is an accessor, e.g. `A[B]`
- `ts.SyntaxKind.AssertsKeyword`: indicates that the Ast is a type assertion, e.g. `asserts is Foo`
- `ts.SyntaxKind.AsyncKeyword`: indicates that a function is marked `async`
- `ts.SyntaxKind.ConstKeyword`: indicates that a value is a constant variabale, `const`
- `ts.SyntaxKind.DeclareKeyword`: indicates a variable or function declaration, `declare`
- `ts.SyntaxKind.DefaultKeyword`: indicates that a value is the default export `default`
- `ts.SyntaxKind.DotDotDotToken`: Extended value: indicates that a value is a **rest parameter**, marked with `...`
- `ts.SyntaxKind.ExportKeyword`: indicates that a value is exported, `export`
- `ts.SyntaxKind.ExtendsKeyword`: Extended value: Indicates that a value extends another, marked with `extends` 
- `ts.SyntaxKind.InKeyword`: indicates that a value is in a set, e.g. `a in b`
- `ts.SyntaxKind.OutKeyword`: indicates that a value is out of a set, e.g. `a out of b` 
- `ts.SyntaxKind.OverrideKeyword`: indiciates that a method overrides a method in a parent class, marked `override`
- `ts.SyntaxKind.PrivateKeyword`: indicates that a value is private, `private` (TODO: does this include `#`?)
- `ts.SyntaxKind.ProtectedKeyword`: indicates that a value is protected, `protected`
- `ts.SyntaxKind.PublicKeyword`: indicates that a value is public, `public`
- `ts.SyntaxKind.QuestionToken`: Extended vaue: indicates that a value is **optional**, marked with a `?`
- `ts.SyntaxKind.ReadonlyKeyword`: indicates that a value is read-only, `readonly`
- `ts.SyntaxKind.StaticKeyword`: indicates that a value is marked as static, `static`

### `name`

The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.

### `parameters`

An array of `Ast` objects that represent function/method parameters and sometimes general "children."

### `text`

Actual text of a language-defined keyword or token value, such as `string`, `await`.

### `type`

An array of `Ast` objects that represent the type(s) of an object, property, function return, etc.

### `typeParameters`

An array of `Ast` objects that represent the type parameters of a generic type like `T`, `U`, etc.

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
 
In the declaration for `String`, the `String` interface defines **instance** methods and properties accesed through the prototype, e.g. `String.protototype.toString`. The `StringConstructor` contains **static** methods accessed directly from the object, e.g. `String.fromCharCode(...)`.

We can tell the difference programmatically by checking each interface for the presence of the `new` function which TypeScript refers to as a `ConstructSignatureDeclaration`. On the other hand, if an interface name matches a declared variable name, we know that it is _not_ part of a constructor.  Detecting these difference gets a little tricky because TypeScript merges interfaces with the same name. To address this the code pre-caches all of the declarations in the program including whether interfaces are constructors. 
 
The code takes a shortcut with static interfaces like `Math`. If the declaration name, type and interface name are all the same, all of the interfaces members are treated as static.
 
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
 interface Date {
    setMonth(month: number, date?: number): number;
 }
 declare var Date: DateConstructor;
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

- The `Ast` class is **NOT STABLE**: 
  - The shape of the class might still change.
- The printed JSON is **NOT STABLE**: 
  - It currently contains global types (in addition to global objects) that need to be removed.
  - The JSON is not much simpler than the actual TypeScript ASTs and will be simplified.
  - Some globals with complex types may have partial type definitions.
- The tests are currently high-level and they do not test for edge cases.

## License

See [LICENSE](./LICENSE)