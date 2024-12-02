## Technical Specification: JS-GLOBALS-JSON

### Overview

The parser analyzes TypeScript lib files to produce a comprehensive catalog of JavaScript global objects, their properties, methods, constructors, and
inheritance hierarchies in a simple, easy to understand format. The output is serialized as a `globals.json` file, providing structured data suitable for
further processing or integration.

---

### Functional Requirements

#### Input

1. **TypeScript Lib Files**: The parser should process `.d.ts` files that define global JavaScript objects, including:
   - Built-in objects like `Array`, `Object`, `Math`.
   - DOM interfaces like `Console`, `Navigator`, `Window`.
   - Extended interfaces from `HTML`, `CSS`, `SVG`, `MathML`, and other Web APIs.

2. **Predefined Objects**: The parser should account for essential built-ins (e.g., `Object`, `Function`) that may not explicitly declare inheritance in
   TypeScript libs.

#### Output

1. A single `globals.json` file containing:
   - A list of global variables, interfaces, classes, and modules.
   - For each object:
     - `extends` array with the name of each inherited object
     - `generics` any type parameters simplified to the closest JavaScript built-in type or primitive
     - `kind` simplified to one of Constructor, Static Method, Static Property, Instance Method, or Instance Property
     - `name` of the actual object, method, or property including its full ancestry, such as `Array.prototype.slice`
     - `params` list including name and type simplified to the closest JavaScript built-in type or primitive
     - `return` type simplified to the closest JavaScript built-in type or primitive
     - `text` which defines literal values such as `string`, `1`, `"foo"`, etc.

---

### Design Requirements

#### Architecture

There are three primary components:

1. **Tokenizer (`tokenizer.ts`)**
   - Parses the raw Typescript lib files.
   - Resolves Typescript Interfaces and Modules across multiple lib files.
   - Collects object declarations, properties, methods, constructors, and inheritance relationships.
   - Converts collected data into `Token` objects that define Builtins, Methods, Properties, and Constructors

1. **Token (`token.ts`)**:
   - Encapsulates primitive data about Builtins, Methods, Properties, and Constructors
   - Includes names of extended Builtins but does not resolve inheritance
   - Resolves parameters, returns, generics
   - Captures declaration source name from variables, interfaces, classes, functions, and modules
   - Captures whether the object is an instance member or a static member

1. **Parser (`parser.ts`)**:
   - Converts `Token` instances into `AST` objects
   - Creates a map of Builtins.
   - Maps properties, methods, and constructors to their corresponding Builtin.
   - Resolves inheritance by cloning and remapping parent Builtins onto the Builtin.
   - Manages deduplication of inherited members.
   - Creates a single Abstract Syntax Tree (AST) of `AST` nodes.

1. **AST (`ast.ts`)**:
   - Encapsulates builtins and their members (properties, methods, constructors) in a consistent, simple, format (as compared to Typescript).
   - Serializes objects into JSON that is both human and machine readable.

---

### Detailed Functional Specification

#### Tokenization

1. Traverse TypeScript AST nodes for:
   - Classes, interfaces, modules, variables, and type aliases.
   - Create Tokens for built-in objects, properties, methods, and constructors
   - Capture and label properties as `StaticProperty` or `InstanceProperty`.
   - Catpure and label Methods as `StaticMethod` or `InstanceMethod`.
   - Capture call signatures, constructor declarations, etc. and label as `Constructor`
   - Catpure `extends` relationships for inheritance.
   - Capture and resolve `name`, `generics`, `kind`, `params`, `return`, and `text`

2. Create a list of all tokens
   - Tokens don't have children or nesting
   - They should be added to a single Set that can be passed to the parser for further processing

3. Handle definitions split across multiple files:
   - Merge partial declarations for the same object?

#### Parsing

1. Create builtin object AST
   - Top level builtins (e.g. Array, Window, HTMLElement) should have an AST

2. Assign child properties, methods, and constructors to the correct builtin
   - Via an AST method such as `addStaticProperty`, `addConstructor`, etc.

3. Register each built-in object in a **Global Registry map**.
   - Use the object, property, or method name as the key and the AST as the value.
   - Each of the top-level built-ins may include a map of child ASTs, if applicapble
   - The children map should use the name of the child as the key and the value will be an array of ASTs which define the child.
     - This is because every constructor, property, or method can have multiple definitions (overloads) Consolidate properties, methods, and constructors.

4. Resolve inheritance
   - See Inheritance resolution

#### Inheritance Resolution

1. **Resolve Extends**:
   - After parsing, resolve the extends for every top-level object.
   - Recursively traverse the `extends` chain for each object by selecting the object from the **Global Registry map**.
   - Rename each property and method with the ancestry of the parent object (not the extended object)
     - Example: given the `Array` object which extends `Function`, `Function.prototype.apply` would become `Array.prototype.apply`
   - Merge inherited members (properties and methods) into the child object.

#### Output Serialization

1. Serialize each AST to JSON with:
   - `children`: for top-level objects, an object of methods, properties, and constructors.
   - `extends`: for top-level objects, an array with the name of each inherited object
   - `generics`: any type parameters simplified to the closest JavaScript built-in type or primitive
   - `kind`: simplified to one of Constructor, Static Method, Static Property, Instance Method, or Instance Property
   - `name`: of the actual object, method, or property including its full ancestry, such as `Array.prototype.slice`
   - `params`: list including name and type simplified to the closest JavaScript built-in type or primitive
   - `returns`: type simplified to the closest JavaScript built-in type or primitive
   - `text`: which defines literal values such as `string`, `1`, `"foo"`, etc.

2. Write the complete catalog to `globals.json`.
   - The output should be formatted as an object with the names of top-level builtins as the keys and the serialized AST as the value
   - Top level objects with children should have the `children` with an object of children
   - The `children` object should contains keys with all of the children of the object.
   - Each child value will consist of an array of serialized ASTs, one for each unique definition.

---

### Data Models

#### Token

```typescript
export class Ast {
  private name: string | null;
  private kind: string;
  private params?: TBD;
  private text?: string;
  private returns?: TBD;
  private generics: Ast[];
  private ancestry: Set<string>; // ?
  private extends: Set<string>;
}
```

#### AST

```typescript
export class Ast {
  private name: string | null;
  private kind: string;
  private meta: Set<string>;
  private params: Ast[];
  private text?: string;
  private returns: Ast[];
  private generics: Ast[];
  private ancestry: Set<string>;
  // Used for top level builtins
  private children: Ast[];
  private extends: Set<string>;
  // Type parameters declared on a parent class or interface, e.g. class Foo<T> {} or interface Foo<D> {}
  private parentGenerics: Ast[];
}
```

---

### Algorithm Description

#### Parsing Algorithm

1. Parse each TypeScript lib file to generate an AST.
2. For each `class`, `interface`, or `type` node:
   - Extract name, `extends` (if present), and members.
   - Register the object in the global registry.
3. For each `member` node (property, method, constructor):
   - Determine its type (static/instance).
   - Store in the corresponding object in the registry.

#### Inheritance Resolution

1. Traverse all registered objects.
2. For each object:
   - If it extends another object, fetch the parent’s members.
   - Recursively merge inherited members into the current object.

#### Serialization

1. Serialize the global registry into JSON.
2. Write to `globals.json`.

---

### Error Handling

1. **Missing Parent Definitions**:
   - If an `extends` reference cannot be resolved, log a warning and continue.

2. **Circular Inheritance**:
   - Detect loops in the `extends` chain and log an error.

3. **Duplicate Members**:
   - Ensure inherited members do not overwrite existing ones unless explicitly redefined.

---

### Sample Output

#### globals.json

```json
```

---

### Future Enhancements

1. **Support for Namespaces**:
   - Parse namespaces and include their declarations in the output.

2. **Advanced Type Resolution**:
   - Handle complex types like generics, unions, and intersections.

3. **Custom Configurations**:
   - Allow filtering objects or specifying output formats via configuration files.

---

### Performance Considerations

- Use a global registry with O(1) lookups for efficient inheritance resolution.
- Optimize serialization by pre-computing inherited members during parsing.

---

This specification encapsulates the current functionality and structure of your parser while laying the groundwork for future extensibility and robustness.
