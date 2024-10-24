import ts from "npm:typescript@5.5.3";
import type { Meta, SerializedAst } from "./types.ts";
import { isValidMeta } from "./utils.ts";

/**
 * A builder class for constructing a serialized ast.
 */
export class Ast {
  /**
   * The id of the object. This is used to uniquely identify the object.
   * Prefixing it with an ~ lets us know not to add it to the globals (there are no global values that start with ~)
   * @todo Determin if both id and name should be used as they are often the same.
   */
  private id: string = "~" + crypto.randomUUID();

  /**
   * The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`
   */
  private kind?: ts.SyntaxKind;

  /**
   * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
   * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
   */
  private meta: Set<Meta> = new Set();

  /**
   * The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.
   */
  private name?: string;

  /**
   * @todo change name to `children` or `members`
   * An array of `Ast` objects that represent function/method parameters, OR members of an object.
   */
  private parameters: Ast[] = [];

  /**
   * Actual text of a language-defined keyword or token value, such as `string`, `await`.
   */
  private text?: string;

  /**
   * An array of `Ast` objects that represent the type(s) of an object, property, function return, etc.
   */
  private type: Ast[] = [];

  /**
   * An array of `Ast` objects that represent the type parameters of a generic type like `T`, `U`, etc.
   */
  private typeParameters: Ast[] = [];

  /**
   * Convert Ast instances into sparse objects.
   * @returns An object representation of the `Ast` instance.
   */
  public serialize(): SerializedAst {
    const sparse: SerializedAst = {};

    if (!this.id.startsWith("~")) {
      sparse.id = this.id;
    }

    if (this.kind !== undefined) {
      sparse.kind = ts.SyntaxKind[this.kind ?? 0];
    }

    if (this.meta.size > 0) {
      const metaNames: string[] = [];
      for (const metaKind of this.meta) {
        if (isValidMeta(metaKind)) {
          metaNames.push(ts.SyntaxKind[metaKind]);
        }
      }
      sparse.meta = metaNames;
    }

    if (this.name !== undefined) {
      sparse.name = this.name;
    }

    if (this.parameters.length > 0) {
      sparse.parameters = this.parameters.map((p) => p.serialize());
    }

    if (this.text !== undefined) {
      sparse.text = this.text;
    }

    if (this.type.length > 0) {
      sparse.type = this.type.map((t) => t.serialize());
    }

    if (this.typeParameters.length > 0) {
      sparse.typeParameters = this.typeParameters.map((p) => p.serialize());
    }

    return sparse;
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
      if (isValidMeta(meta)) {
        this.meta.add(meta);
      }
    }

    return this;
  }

  /**
   * Adds a new meta type to the ast.
   * @param metaType - The meta type to add to the ast.
   * @returns A reference to this ast instance for method chaining.
   */
  public addMeta(metaKind: Meta) {
    if (isValidMeta(metaKind)) {
      this.meta.add(metaKind);
    }
    return this;
  }

  /**
   * Checks if the ast has the specified meta type.
   * @param metaType - The meta type to check for.
   * @returns `true` if the ast has the specified meta type, `false` otherwise.
   */
  public hasMeta(metaKind: Meta) {
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
  public getType(): SerializedAst[] {
    return this.type.map((u) => u.serialize());
  }

  /**
   * Adds a new type to the Ast instance.
   * @param type - The type to add to the Ast.
   * @returns A reference to this Ast instance for method chaining.
   */
  public addType(type?: Ast) {
    if (type && type instanceof Ast) {
      this.type.push(type);
    }
    return this;
  }

  public getParameters(): Ast[] {
    return this.parameters;
  }

  /**
   * Sets the parameters for this object.
   * @param parameters - An array of ParameterBuilder instances to set as the parameters.
   * @returns A reference to this Ast instance for method chaining.
   */
  public setParameters(parameters: Ast[]) {
    if (parameters && Array.isArray(parameters)) {
      this.parameters = parameters;
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
      this.parameters.push(parameter);
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
      this.typeParameters = typeParameters;
    }
    return this;
  }

  /**
   * Adds a new type parameter to the Ast instance.
   * @param typeParameter - The ParameterBuilder instance to add as a type parameter.
   * @returns A reference to this Ast instance for method chaining.
   */
  public addTypeParameter(typeParameter: Ast) {
    if (typeParameter && typeParameter instanceof Ast) {
      this.typeParameters.push(typeParameter);
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
