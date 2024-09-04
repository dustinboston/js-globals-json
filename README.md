# JavaScript Globals JSON

 > A machine-readable list of the standard JavaScript globals with type information as JSON.

## Rationale
 
 There are a few packages that appear to have this data, but are either incomplete or are not machine-readable. [mdn-data](https://github.com/mdn/data) only defines inheritance; [mdn-content](https://github.com/mdn/content) and [js-core](https://github.com/zloirock/core-js) are comprehensive, but not machine readable. However, all of this data is clearly encoded in TypeScript's lib files. This code uses the TypeScript API to parse the lib files and convert them into a simplified JSON format. Honestly, this seems like it must have already been solved and as if this is completely over-engineering the whole thing. So if you know of a better way, or some data that already exists, please leave an issue.

 ## Schema

 A single object is used to represent the entirety of the JavaScript API as defined in Typescript. It has this structure:
 
```typescript
type ObjectProperty = {
	id?: string;
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

The id of the object. This is used to uniquely identify the object.

### `kind`

The kind of the object. This is used to determine the type of the object. The `SyntaxKinds` object is defined in the TypeScript compiler API.

### `meta`

Meta information about the object as boolean flags (if present it's true, absent is false). 
This includes metadata about the object such as whether it is a declaration, extends another object, or is read-only.
THis is mostly made up of TypeScript "modifiers" plus a few extra types that represent boollean values.

- `ts.SyntaxKind.AbstractKeyword`: indicates that a class is marked `abstract`
- `ts.SyntaxKind.AccessorKeyword`: indicates that a property is an accessor, e.g. `A[B]`
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

An array of `Ast` objects that represent function/method parameters.

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

 - The `Ast` object is stable in that it represents all of the values it needs to, however, the names may change slightly.
 - The rendered JSON is **NOT STABLE**. At present there are missing values, or values associated with an incorrect property (e.g. `type` instead of `typeParameter`)
 - There aren't any tests at the moment.

 ## License

 See [LICENSE](./LICENSE)