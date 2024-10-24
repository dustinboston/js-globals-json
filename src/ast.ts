import ts from "typescript";
import type { BooleanMetaValues } from "./types.ts";
import { getBooleanMetaValue, getKindName, isBooleanMetaValue } from "./utils.ts";
//import { jsInterfaces } from "../data/interfaces.ts";

//const dontExpandInterfaces = new Set([
//  "A",
//  "B",
//  "C",
//  "D",
//  "E",
//  "F",
//  "G",
//  "H",
//  "I",
//  "J",
//  "K",
//  "L",
//  "M",
//  "N",
//  "O",
//  "P",
//  "Q",
//  "R",
//  "S",
//  "T",
//  "U",
//  "V",
//  "W",
//  "X",
//  "Y",
//  "Z",
//  ...jsInterfaces,
//]);

export type MemberKind =
  | "Constructor"
  | "StaticMethod"
  | "InstanceMethod"
  | "StaticProperty"
  | "InstanceProperty"
  | "Event";

/** A condensed, stringifiable representation of the TypeScript node. */
export type SerializedAst = {
  kind: string;
  id: string;
  name: string;
  returns: SerializedAst[];
  params: SerializedAst[];
  generics: SerializedAst[];
  text: string | null;
  meta: string[];
};

/** Minified AST renames kinds, collapses as many properties as it can, and removes empty properties. */
export type MinifiedAst = {
  kind?: string;
  id?: string;
  name?: string;
  returns?: string | MinifiedAst | (string | MinifiedAst)[];
  params?: MinifiedAst | MinifiedAst[];
  generics?: MinifiedAst | MinifiedAst[];
  text?: string;
  meta?: string;
} | string;

/**
 * A builder class for constructing a serialized ast.
 */
export class Ast {
  /**
   * The id of the object. This is used to uniquely identify the object.
   * Prefixing it with an ~ lets us know not to add it to the globals (there are no global values that start with ~)
   */
  private id: string = "";

  /** The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds` */
  private kind: ts.SyntaxKind;

  /**
   * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
   * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
   */
  private meta: Set<BooleanMetaValues> = new Set();

  /** The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`. */
  private name: string;

  /** An array of `Ast` objects that represent function/method parameters, OR members of an object. */
  private params: Ast[] = [];

  /** Actual text of a language-defined keyword or token value, such as `string`, `await`. */
  private text?: string;

  /** An array of `Ast` objects that represent the type(s) of an object, property, function return, etc. */
  private returns: Ast[] = [];

  /** An array of `Ast` objects that represent the type parameters of a generic type like `T`, `U`, etc. */
  private generics: Ast[] = [];

  constructor(id: string, name: string, kind: number) {
    if (!id) throw new TypeError("Ast requires an id");
    if (!name) throw new TypeError("Ast requires a name");
    if (!kind) throw new TypeError("Ast requires a kind");

    this.id = id;
    this.name = name;
    this.kind = kind;
  }

  public serialize() {
    const obj: SerializedAst = {
      id: this.id,
      kind: getKindName(this.kind),
      meta: [],
      name: this.name,
      params: [],
      text: null,
      returns: [],
      generics: [],
    };

    if (this.returns.length) {
      obj.returns = this.returns.map((p) => p.serialize());
    } else {
      obj.returns = [];
    }

    if (this.params.length) {
      const params = this.params.map((p) => p.serialize());
      obj.params = params;
    } else {
      obj.params = [];
    }

    if (this.generics.length) {
      obj.generics = this.generics.map((p) => p.serialize());
    } else {
      obj.generics = [];
    }

    if (this.meta.size) {
      obj.meta = Array.from(this.meta).map((m) => getBooleanMetaValue(m)).filter((v) => v !== undefined);
    }

    obj.text = (this.text) ? this.text : null;
    return obj;
  }

  public minify(): MinifiedAst {
    const obj: MinifiedAst = {
      kind: this.getGenericKind(),
    };

    // Unminified name
    obj.name = this.name;

    // Minified name
    //if (this.name && !this.name.startsWith("~")) {
    //  obj.name = this.name;
    //}

    // Unminified id
    obj.id = this.id;

    // Minified id
    //if (this.id && this.id !== this.name && !this.id.startsWith("~")) {
    //  obj.id = this.id;
    //}
    //

    // Unminified type
    obj.returns = this.returns.map((p) => {
      if (typeof obj.returns === "string" && obj.kind === "ArrayType") {
        return obj.returns + "[]";
      }
      return p.minify();
    });

    // Minified type
    //if (this.returns.length) {
    //  const type = this.returns.map((p) => {
    //    if (
    //      !p.id && !p.returns.length && !p.generics.length &&
    //      !p.params.length && p.text
    //    ) return p.text;
    //    return p.minify();
    //  });
    //
    //  obj.returns = (type.length === 1) ? type[0] : type;
    //}

    // Unminified params
    obj.params = this.params.map((p) => p.minify());

    // Minified params
    //if (this.params.length) {
    //  const params = this.params.map((p) => {
    //    const minified = p.minify();
    //    if (
    //      typeof minified !== "string" &&
    //      minified.kind === getKindName(ts.SyntaxKind.Parameter)
    //    ) {
    //      // We don't need to know that this is a parameter because we're in the params key.
    //      delete minified.kind;
    //    }
    //    return minified;
    //  });
    //  obj.params = (params.length === 1) ? params[0] : params;
    //}

    // Unminified generics
    obj.generics = this.generics.map((p) => p.minify());

    // Minified generics
    //if (this.generics.length) {
    //  const typeParams = this.generics.map((p) => p.minify());
    //  obj.generics = (typeParams.length === 1) ? typeParams[0] : typeParams;
    //}

    if (this.meta.size) {
      if (this.meta.has(ts.SyntaxKind.DotDotDotToken)) {
        obj.name = `...${obj.name ?? obj.id ?? ""}`;
      }
      if (this.meta.has(ts.SyntaxKind.QuestionToken)) {
        obj.name = `${obj.name ?? obj.id ?? ""}?`;
      }
    }

    // Unminified text
    if (obj.kind?.endsWith("Keyword") && this.text) {
      obj.text = this.minifyText(this.text);
    } else if (this.text !== undefined) {
      obj.text = this.minifyText(this.text);
    }

    // Minified text
    //if (obj.kind?.endsWith("Keyword") && this.text) {
    //  return this.minifyText(this.text);
    //} else if (obj.kind === "ArrayType" && typeof obj.returns === "string") {
    //  return obj.returns + "[]";
    //} else if (this.text !== undefined) {
    //  obj.text = this.minifyText(this.text);
    //}

    return obj;
  }

  minifyText(type: string) {
    switch (type) {
      case "void":
        return "undefined";
      default:
        return type;
    }
  }

  /**
   * Changes the prefix of an Ast object's name and ID.
   *
   * @param fromOldPrefix - The old prefix to replace.
   * @param toNewPrefix - The new prefix to use.
   */
  public changePrefix(fromOldPrefix: string, toNewPrefix: string): void {
    if (!fromOldPrefix || !toNewPrefix) return;

    if (this.name && this.name.startsWith(fromOldPrefix)) {
      this.name = this.name.replaceAll(fromOldPrefix, toNewPrefix);
    }

    if (this.id.startsWith(fromOldPrefix)) {
      const newId = this.id.replaceAll(fromOldPrefix, toNewPrefix);
      this.id = newId;
    }
  }

  /**
   * Sets the unique identifier for this object.
   * @param id The new identifier for this object.
   * @returns A reference to this object for method chaining.
   */
  public setId(id?: string): this {
    if (id) {
      this.id = id;
    }
    return this;
  }

  public getId(): string {
    return this.id;
  }

  /**
   * Sets the kind of the Ast instance.
   * @param kind The new kind to set for this Ast.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setKind(kind: number) {
    if (typeof kind === "number") {
      this.kind = kind;
    }
    return this;
  }

  /**
   * Gets the kind of the Ast instance.
   * @returns The kind of the Ast instance.
   */
  public getKind() {
    return this.kind;
  }

  /**
   * Sets the meta types for this ast.
   * @param metaTypes - An array of meta types to set for this ast.
   * @returns A reference to this ast instance for method chaining.
   */
  public setMeta(metaTypes?: ts.SyntaxKind[]) {
    if (!metaTypes) return this;

    for (const meta of metaTypes) {
      if (isBooleanMetaValue(meta)) {
        this.meta.add(meta);
      }
    }

    return this;
  }

  public getGenericKind(): string {
    const prefix = this.name.includes(".prototype.") ? "Instance" : "Static";
    const classPrefix = this.meta.has(ts.SyntaxKind.StaticKeyword) ? "Static" : "Instance";

    switch (this.kind) {
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
      case ts.SyntaxKind.PropertySignature: // could be a function
        return `${prefix}Property`;
      case ts.SyntaxKind.PropertyDeclaration:
        return `${classPrefix}Property`;
      case ts.SyntaxKind.MethodSignature:
      case ts.SyntaxKind.MethodDeclaration:
        return `${prefix}Method`;
      case ts.SyntaxKind.CallSignature:
      case ts.SyntaxKind.ConstructSignature:
      case ts.SyntaxKind.Constructor:
        return "Constructor";
      case ts.SyntaxKind.FunctionDeclaration: // Top-level
        return "StaticMethod";

      case ts.SyntaxKind.VariableDeclaration:
      case ts.SyntaxKind.InterfaceDeclaration:
      case ts.SyntaxKind.TypeAliasDeclaration:
      case ts.SyntaxKind.ClassDeclaration:
      case ts.SyntaxKind.ModuleDeclaration:
      default:
        return getKindName(this.kind);
    }
  }

  /**
   * Adds a new meta type to the ast.
   * @param metaType - The meta type to add to the ast.
   * @returns A reference to this ast instance for method chaining.
   */
  public addMeta(metaKind: BooleanMetaValues | number) {
    if (isBooleanMetaValue(metaKind)) {
      this.meta.add(metaKind);
    }
    return this;
  }

  /**
   * Checks if the ast has the specified meta type.
   * @param metaType - The meta type to check for.
   * @returns `true` if the ast has the specified meta type, `false` otherwise.
   */
  public hasMeta(metaKind: BooleanMetaValues | number) {
    return this.meta.has(metaKind);
  }

  /**
   * Sets the name of the Ast instance.
   * @param name - The new name to set for this Ast.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setName(name?: string) {
    if (name) {
      this.name = name;
    }
    return this;
  }

  /**
   * Gets the name of the Ast instance.
   * @returns The name of the Ast instance.
   */
  public getName() {
    return this.name;
  }

  /**
   * Gets an array of serialized Ast instances representing the types of this Ast.
   * @returns An array of serialized Ast instances.
   */
  public getType(): Ast[] {
    return this.returns;
  }

  /**
   * Adds a new type to the Ast instance.
   * @param type - The type to add to the Ast.
   * @returns A reference to this Ast instance for method chaining.
   */
  public addType(type?: Ast) {
    if (type && type instanceof Ast) {
      this.returns.push(type);
    }
    return this;
  }

  public getParameters(): Ast[] {
    return this.params;
  }

  /**
   * Sets the parameters for this object.
   * @param parameters - An array of ParameterBuilder instances to set as the parameters.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setParameters(parameters: Ast[]) {
    if (parameters && Array.isArray(parameters)) {
      this.params = parameters;
    }
    return this;
  }

  /**
   * Adds a new parameter to the Ast instance.
   * @param parameter - The ParameterBuilder instance to add as a parameter.
   * @returns A reference to this Ast instance for method chaining.
   */
  public addParameter(parameter: Ast) {
    if (parameter && parameter instanceof Ast) {
      this.params.push(parameter);
    }
    return this;
  }

  /**
   * Sets the type parameters for this Ast instance.
   * @param typeParameters - An array of ParameterBuilder instances to set as the type parameters.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setTypeParameters(typeParameters: Ast[]) {
    if (typeParameters && Array.isArray(typeParameters)) {
      this.generics = typeParameters;
    }
    return this;
  }

  /**
   * Gets the type parameters for this Ast instance.
   * @returns An array of Ast instances representing the type parameters.
   */
  public getTypeParameters(): Ast[] {
    return this.generics;
  }

  /**
   * Adds a new type parameter to the Ast instance.
   * @param typeParameter - The ParameterBuilder instance to add as a type parameter.
   * @returns A reference to this Ast instance for method chaining.
   */
  public addTypeParameter(typeParameter: Ast) {
    if (typeParameter && typeParameter instanceof Ast) {
      this.generics.push(typeParameter);
    }
    return this;
  }

  /**
   * Sets the text property of this object.
   * @param text - The new text value to set, or undefined to clear the text.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setText(text?: string) {
    if (text) {
      this.text = text;
    }
    return this;
  }
}
