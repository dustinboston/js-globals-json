import * as tsMorph from "ts-morph";

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
  private name: string;
  private kind: tsMorph.SyntaxKind;
  private meta: Set<string> = new Set();
  private params: Ast[] = [];
  private text?: string;
  private returns: Ast[] = [];
  private generics: Ast[] = [];

  constructor(name: string, kind: tsMorph.SyntaxKind) {
    if (!name) throw new TypeError("Ast requires a name");
    if (!kind) throw new TypeError("Ast requires a kind");

    this.name = name;
    this.kind = kind;
  }

  public serialize() {
    const obj: SerializedAst = {
      id: this.name,
      kind: this.kind.getKindName(),
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
      obj.meta = Array.from(this.meta);
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
    obj.id = this.name;

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
      if (this.meta.has("rest")) {
        obj.name = `...${obj.name ?? obj.id ?? ""}`;
      }
      if (this.meta.has("optional")) {
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

    if (this.name.startsWith(fromOldPrefix)) {
      const newId = this.name.replaceAll(fromOldPrefix, toNewPrefix);
      this.name = newId;
    }
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
  public setMeta(metaTypes?: string[]) {
    if (!metaTypes) return this;

    for (const meta of metaTypes) {
      this.meta.add(meta);
    }

    return this;
  }

  public getGenericKind(): string {
    const prefix = this.name.includes(".prototype.") ? "Instance" : "Static";
    const classPrefix = this.meta.has("static") ? "Static" : "Instance";

    switch (this.kind) {
      case "GetAccessor":
      case "SetAccessor":
      case "PropertySignature":
        return `${prefix}Property`;
      case "PropertyDeclaration":
        return `${classPrefix}Property`;
      case "MethodSignature":
      case "MethodDeclaration":
        return `${prefix}Method`;
      case "CallSignature":
      case "ConstructSignature":
      case "Constructor":
        return "Constructor";
      case "FunctionDeclaration":
        return "StaticMethod";
      case "VariableDeclaration":
      case "InterfaceDeclaration":
      case "TypeAliasDeclaration":
      case "ClassDeclaration":
      case "ModuleDeclaration":
      default:
        return this.kind.getKindName();
    }
  }

  public addMeta(metaKind: string) {
    this.meta.add(metaKind); // TODO: Validate input
    return this;
  }

  public hasMeta(metaKind: string) {
    return this.meta.has(metaKind);
  }

  public getName() {
    return this.name;
  }

  public getReturns(): Ast[] {
    return this.returns;
  }

  public addReturns(type?: Ast) {
    if (type && type instanceof Ast) {
      this.returns.push(type);
    }
    return this;
  }

  public getParameters(): Ast[] {
    return this.params;
  }

  public setParameters(parameters: Ast[]) {
    if (parameters && Array.isArray(parameters)) {
      this.params = parameters;
    }
    return this;
  }

  public addParameter(parameter: Ast) {
    if (parameter && parameter instanceof Ast) {
      this.params.push(parameter);
    }
    return this;
  }

  public setGenerics(typeParameters: Ast[]) {
    if (typeParameters && Array.isArray(typeParameters)) {
      this.generics = typeParameters;
    }
    return this;
  }

  public getGenerics(): Ast[] {
    return this.generics;
  }

  public addGeneric(typeParameter: Ast) {
    if (typeParameter && typeParameter instanceof Ast) {
      this.generics.push(typeParameter);
    }
    return this;
  }

  public setText(text?: string) {
    if (text) {
      this.text = text;
    }
    return this;
  }
}
