import ts from "typescript";
import { AstKind } from "./AstKind.ts";
import { Ancestry, SerializedAst } from "./Types.ts";
import Inheritance from "./Inheritance.ts";

export default class Ast {
  private readonly GLOBAL_THIS = "globalThis";
  private readonly ENABLE_VERBOSE_TYPES = true;

  private syntaxKind: ts.SyntaxKind = ts.SyntaxKind.Unknown;

  // Members
  private literal?: string;
  private returnType: string = "";
  private typeParameters: string = "";
  private parameters: string = "";

  /**
   * Represents the `Ast` "parent" context that defines or contains members of global objects.
   *
   * - For static members, this is the defining constructor (e.g., `Array` for `Array.from`).
   * - For instance or prototype members, this is the prototype context (e.g., `Array.prototype` for `fill` or `slice`).
   */
  private parentContextAst: Ast | null = null;

  // Meta
  private isOptionalParam: boolean = true;
  private isRestParam: boolean = false;
  private isAsync: boolean = false;

  /**
   * Sets whether the interface is a static interface or member.
   * If false, the interface is an instance interface or member.
   */
  private isStatic: boolean = false;
  private isTypeAssertion: boolean = false;

  // Objects
  private memberAsts: Set<Ast> = new Set<Ast>();
  private ancestry: Set<string> = new Set<string>();
  private inheritanceSources: Set<string> = new Set<string>();
  private namespace: string | null = null;

  // Ast factory functions
  static createGlobalObject(name: string) {
    return new Ast(name, AstKind.GlobalObject);
  }

  static createGlobalFunction(name: string) {
    return new Ast(name, AstKind.Method);
  }

  static createGlobalVariable(name: string) {
    return new Ast(name, AstKind.Property);
  }

  static createMethod(name: string) {
    return new Ast(name, AstKind.Method);
  }

  static createProperty(name: string) {
    return new Ast(name, AstKind.Property);
  }

  static createEvent(name: string) {
    return new Ast(name, AstKind.Event);
  }

  static createConstructorFunction() {
    return new Ast(null, AstKind.Constructor);
  }

  static createNewableConstructor() {
    return new Ast("new", AstKind.Constructor);
  }

  static createReturnType() {
    return new Ast(null, AstKind.ReturnType);
  }

  static createGeneric() {
    return new Ast(null, AstKind.Generic);
  }

  static createRequiredParameter(name: string) {
    return new Ast(name, AstKind.Parameter);
  }

  static createOptionalParameter(name: string) {
    return new Ast(name, AstKind.Parameter).setIsOptionalParam();
  }

  static createType() {
    return new Ast(null, AstKind.Type);
  }

  /**
   * Creates a new Ast instance.
   *
   * @example Create a new Ast instance
   * ```typescript
   * import { Ast, AstKind } from "./src/Ast.ts";
   *
   * const ast = new Ast("foo", AstKind.Method);
   * ```
   *
   * @param name - Name of the Ast instance, can be null.
   * @param kind - The AstKind that represents this Ast.
   */
  constructor(private name: string | null, private kind: AstKind) {
    if (!this.kind) {
      throw new TypeError("kind is required");
    }

    if (this.name && this.kind === AstKind.GlobalObject) {
      const source = Inheritance.findSource(this.name);
      if (source) {
        source.forEach((source) => this.addInheritanceSource(source));
      }
    }
  }

  public serialize() {
    const serialized: SerializedAst = {
      kind: AstKind[this.kind],
    };

    if (this.name) {
      serialized.name = this.name;
    }

    if (this.isAsync) {
      serialized.isAsync = this.isAsync;
    }

    if (this.literal) {
      serialized.literal = this.literal;
    }

    if (this.memberAsts.size) {
      serialized.members = Array.from(this.memberAsts).map((member) => member.serialize());
    }

    if (this.namespace) {
      serialized.namespace = this.namespace;
    }

    if (this.inheritanceSources.size) {
      serialized.inheritanceSources = Array.from(this.inheritanceSources);
    }

    if (this.kind === AstKind.Method || this.kind === AstKind.Property) {
      serialized.isStatic = this.isStatic;
    }

    if (this.kind === AstKind.Parameter) {
      serialized.isOptionalParam = this.isOptionalParam;
      serialized.isRestParam = this.isRestParam;
    }

    if (this.parameters?.length) {
      if (this.parameters) {
        serialized.params = this.parameters;
      }
    }

    if (this.returnType?.length) {
      serialized.returnType = this.returnType;
    }

    return serialized;
  }

  // KIND
  // --------------------------------------------------------------------------

  /**
   * Gets the kind of the Ast instance.
   */
  public getKind() {
    return this.kind;
  }

  public setSyntaxKind(syntaxKind: ts.SyntaxKind) {
    this.syntaxKind = syntaxKind;
    return this;
  }

  public getSyntaxKind() {
    return this.syntaxKind;
  }

  // NAME
  // --------------------------------------------------------------------------

  public getName() {
    return this.name;
  }

  public setName(name: string) {
    if (name) {
      this.name = name;
    }
    return this;
  }

  public hasName() {
    return this.name !== null;
  }

  // RETURNS
  // --------------------------------------------------------------------------

  /**
   * @wasReturn Ast[] {
   */
  public getReturns(): string | null {
    return this.returnType;
  }

  /**
   * @param type
   */
  public addReturn(type?: string | null) {
    if (type) {
      this.returnType += type;
    }

    return this;
  }

  /**
   * @param types
   */
  public setReturns(types?: string | null) {
    if (types) {
      this.returnType = types;
    }

    return this;
  }

  // PARAMS
  // --------------------------------------------------------------------------

  public getParameters(): string {
    return this.parameters;
  }

  /**
   * @param parameters
   */
  public setParameters(parameters: string): this {
    if (parameters) {
      this.parameters = parameters;
    }

    return this;
  }

  /**
   * @param parameter
   */
  public addParameter(parameter: string) {
    if (parameter) { // && parameter instanceof Ast
      this.parameters += " " + parameter;
    }

    return this;
  }

  // GENERICS (TYPE PARAMETERS)
  // --------------------------------------------------------------------------

  public setTypeParameters(typeParameters: string) {
    if (typeParameters) {
      this.typeParameters = typeParameters;
    }

    return this;
  }

  public getTypeParameters(): string | null {
    return this.typeParameters;
  }

  /**
   * @param typeParameter
   */
  public addTypeParameters(typeParameter: string) {
    if (typeParameter) {
      this.typeParameters += " " + typeParameter;
    }
    return this;
  }

  // CONTEXT INSTANCE (PARENT)
  // --------------------------------------------------------------------------

  /**
   * Sets the `Ast` instance that defines this member.
   *
   * @param contextAst - The `Ast` instance representing the context in which this member is defined.
   *                  For static members, this is the defining constructor (e.g., `Array` for `Array.from`).
   *                  For prototype or instance members, this is typically the prototype context
   *                  (e.g., `Array.prototype` for `fill` or `slice`).
   */
  public setParentContext(contextAst: Ast) {
    this.parentContextAst = contextAst;

    if (contextAst.getParentContext() === null) {
      // Global members are static by default
      this.isStatic = true;
    }

    return this;
  }

  /**
   * Gets the `Ast` instance that defines this member.
   *
   *          For static members, this is the defining constructor (e.g., `Array` for `Array.from`).
   *          For prototype or instance members, this is the prototype context
   *          (e.g., `Array.prototype` for `fill` or `slice`).
   */
  public getParentContext(): Ast | null {
    return this.parentContextAst;
  }

  public getParentContextName() {
    if (this.parentContextAst && this.parentContextAst.hasName()) {
      return this.parentContextAst.getName()!;
    } else {
      return this.GLOBAL_THIS;
    }
  }

  // TEXT
  // --------------------------------------------------------------------------

  public setLiteral(literal?: string) {
    if (literal) {
      this.literal = literal;
    }
    return this;
  }

  public getLiteral() {
    return this.literal;
  }

  // MEMBERS
  // --------------------------------------------------------------------------

  public addMember(member: Ast) {
    if (member) {
      this.memberAsts.add(member);
    }
    return this;
  }

  public setMembers(members: Ast[]) {
    if (members && Array.isArray(members)) {
      this.memberAsts = new Set<Ast>(members);
    }
    return this;
  }

  public addMembers(members: Ast[]) {
    if (members && Array.isArray(members)) {
      members.forEach((member) => this.memberAsts.add(member));
    }

    return this;
  }

  public getMembers(): Ast[] {
    return Array.from(this.memberAsts);
  }

  public hasMembers() {
    return this.memberAsts.size > 0;
  }

  // INHERITANCE SOURCES
  // --------------------------------------------------------------------------

  public addInheritanceSource(sourceName: string) {
    if (sourceName) {
      this.inheritanceSources.add(sourceName);
    }

    return this;
  }

  public addInheritanceSources(sourceNames: string[]) {
    if (sourceNames.length) {
      sourceNames.forEach((sourceName) => this.inheritanceSources.add(sourceName));
    }

    return this;
  }

  public getInheritanceSources(): string[] {
    return Array.from(this.inheritanceSources);
  }

  // NAMESPACE (MODULE)
  // --------------------------------------------------------------------------

  public setNamespace(namespace: string) {
    if (namespace) {
      this.namespace = namespace;
    }
    return this;
  }

  public getNamespace() {
    return this.namespace;
  }

  // ANCESTRY
  // --------------------------------------------------------------------------

  public addAncestor(ancestor: string) {
    if (ancestor) {
      this.ancestry.add(ancestor);
    }
    return this;
  }

  public setAncestry(ancestry: Set<string>) {
    if (ancestry instanceof Set) {
      this.ancestry = new Set(ancestry); // Copy the set
    }
    return this;
  }

  public getAncestry(): Set<string> {
    return this.ancestry;
  }

  public getParentContextAncestry(ancestry: Ancestry = new Set<string>()) {
    if (this.parentContextAst) {
      if (this.hasParentContextAncestry()) {
        const parentAncestry = this.parentContextAst.getParentContextAncestry();
        parentAncestry.forEach((ancestor) => ancestry.add(ancestor));
      }
    }
    return ancestry;
  }

  public hasParentContextAncestry() {
    return this.parentContextAst && this.parentContextAst.getAncestry().size > 0;
  }

  // META
  // --------------------------------------------------------------------------

  public setIsOptionalParam(isOptional: boolean = true) {
    this.isOptionalParam = isOptional;
    return this;
  }

  public getIsOptionalParam() {
    return this.isOptionalParam;
  }

  public setIsRestParam(isRest: boolean = true) {
    if (isRest) this.isRestParam = isRest;
    return this;
  }

  public getIsRestParam() {
    return this.isRestParam;
  }

  public setIsStatic() {
    this.isStatic = true;
    return this;
  }

  public setIsInstance() {
    // Global members are static by default - don't let it be set to false if it's a global member
    if (this.getParentContextName() === this.GLOBAL_THIS) {
      this.isStatic = true;
    } else {
      this.isStatic = false;
    }

    return this;
  }

  public getIsStatic() {
    return this.isStatic;
  }

  public getIsInstance() {
    return !this.isStatic;
  }

  public setIsAsync(isAsync: boolean = true) {
    this.isAsync = isAsync;
    return this;
  }

  public getIsAsync() {
    return this.isAsync;
  }

  public setIsTypeAssertion(isTypeAssertion: boolean = true) {
    this.isTypeAssertion = isTypeAssertion;
    return this;
  }

  public getIsTypeAssertion() {
    return this.isTypeAssertion;
  }

  /**
   * Returns the name of the Ast instance with its ancestry.
   *
   * @example
   * ```
   * Name: "foo"
   * Ancestry: ["Bar"]
   * Returns: "Bar.foo"
   * ```
   *
   * @example Ast with name "prototype" returns the joined ancestry and name
   * ```
   * Name: "prototype"
   * Ancestry: ["Function"]
   * Returns: "Function.prototype"
   * ```
   *
   * * @example Duplicate prototypes are removed
   * ```
   * Name: "prototype"
   * Ancestry: ["Function", "prototype"]
   * Returns: "Function.prototype"
   * ```
   *
   * @example Ancestry is properly joined
   * ```
   * Name: "bar"
   * Ancestry: ["Foo", "prototype"]
   * Returns: "Foo.prototype.bar"
   * ```
   *
   * @example Accounts for bracketed symbol names
   * ```
   * Name: "[Symbol.name]"
   * Ancestry: ["Foo"]
   * Returns: "Foo[Symbol.name]"
   * ```
   *
   * @example Accounts for bracketed symbol names with prototypes
   * ```
   * Name: "[Symbol.name]"
   * Ancestry: ["Foo", "prototype"]
   * Returns: "Foo.prototype[Symbol.name]"
   * ```
   */
  public getFullyQualifiedName() {
    if (this.name === null) return null;

    if (this.ancestry.size === 1 && this.ancestry.has(this.name)) {
      return this.name;
    }

    return this.formatName(this.name, new Set(this.ancestry));
  }

  private formatName(name: string, ancestry: Set<string>) {
    const prefix = this.joinAncestry(ancestry);
    return this.isSymbol(name) ? `${prefix}${name}` : ancestry.size ? `${prefix}.${name}` : name;
  }

  private isSymbol(name: string) {
    return name.startsWith("[") && name.endsWith("]");
  }

  public joinAncestry(ancestry: Set<string> = this.ancestry): string {
    return Array.from(ancestry).join(".");
  }

  public abbreviatePrototype(name?: string | null) {
    if (!name) return null;
    return name
      .replace(".prototype.", "::")
      .replace(".prototype[", "::[")
      .replace(/\.prototype$/, "::");
  }

  public cloneAncestry(): Set<string> {
    return new Set(this.ancestry); // Detach from the Ast
  }

  public getFirstAncestor(): string {
    return this.namespace ?? this.ancestry.values().next().value ?? this.GLOBAL_THIS;
  }
}
