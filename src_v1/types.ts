import ts from "npm:typescript@5.5.3";

/**
 * Represents a serialized ast, which can include information about the property's kind, metadata, name, parameters, type, and type parameters.
 */
export type SerializedAst = Partial<{
  /**
   * The id of the object. This is used to uniquely identify the object.
   */
  id: string;

  /**
   * The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`
   */
  kind: string;

  /**
   * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
   * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
   */
  meta: string[];

  /**
   * The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.
   */
  name: string;

  /**
   * An array of `Ast` objects that represent function/method parameters.
   */
  parameters: SerializedAst[];

  /**
   * Actual text of a language-defined keyword or token value, such as `string`, `await`.
   */
  text: string;

  /**
   * An array of `Ast` objects that represent the type(s) of an object, property, function return, etc.
   */
  type: SerializedAst[];

  /**
   * An array of `Ast` objects that represent the type parameters of a generic type like `T`, `U`, etc.
   */
  typeParameters: SerializedAst[];
}>;

/**
 * The set of valid meta values that represent boolean flags for TypeScript AST nodes.
 * These values are used to indicate properties such as whether a class is abstract,
 * a property is an accessor, or a variable is declared as const, private, etc.
 */
export const metaValues = [
  ts.SyntaxKind.AbstractKeyword, // indicates that a class is marked `abstract`
  ts.SyntaxKind.AccessorKeyword, // indicates that a property is an accessor, e.g. `A[B]`
  ts.SyntaxKind.AssertsKeyword, // indicates that the Ast is a type assertion, e.g. `asserts is Foo`
  ts.SyntaxKind.AsyncKeyword, // indicates that a function is marked `async`
  ts.SyntaxKind.ConstKeyword, // indicates that a value is a constant variabale, `const`
  ts.SyntaxKind.DeclareKeyword, // indicates a variable or function declaration, `declare`
  ts.SyntaxKind.DefaultKeyword, // indicates that a value is the default export `default`
  ts.SyntaxKind.DotDotDotToken, // Extended value: indicates that a value is a **rest parameter**, marked with `...`
  ts.SyntaxKind.ExportKeyword, // indicates that a value is exported, `export`
  ts.SyntaxKind.ExtendsKeyword, // Extended value: Indicates that a value extends another, marked with `extends`
  ts.SyntaxKind.InKeyword, // indicates that a value is in a set, e.g. `a in b`
  ts.SyntaxKind.OutKeyword, // indicates that a value is out of a set, e.g. `a out of b`
  ts.SyntaxKind.OverrideKeyword, // indiciates that a method overrides a method in a parent class, marked `override`
  ts.SyntaxKind.PrivateKeyword, // indicates that a value is private, `private` (TODO: does this include `#`?)
  ts.SyntaxKind.ProtectedKeyword, // indicates that a value is protected, `protected`
  ts.SyntaxKind.PublicKeyword, // indicates that a value is public, `public`
  ts.SyntaxKind.QuestionToken, // Extended vaue: indicates that a value is **optional**, marked with a `?`
  ts.SyntaxKind.ReadonlyKeyword, // indicates that a value is read-only, `readonly`
  ts.SyntaxKind.StaticKeyword, // indicates that a value is marked as static, `static`
] as const; // 'as const' ensures that the values have literal types

/**
 * The type of a valid meta value, which is a member of the `metaValues` array.
 */
export type Meta = typeof metaValues[number];

export type DeclarationWithName =
  | ts.InterfaceDeclaration
  | ts.VariableDeclaration
  | (ts.FunctionDeclaration & { name: ts.Identifier })
  | ts.ModuleDeclaration;

export type DeclarationWithType =
  & (ts.VariableDeclaration | ts.FunctionDeclaration)
  & {
    type: ts.TypeReferenceType | ts.Token<ts.SyntaxKind>;
  };

export type DeclarationWithConstructor = ts.InterfaceDeclaration & {
  members: ts.NodeArray<ts.ConstructSignatureDeclaration>;
};

export type ContainerDeclaration =
  | ts.InterfaceDeclaration
  | ts.ModuleDeclaration;
