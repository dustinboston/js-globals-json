import ts from "typescript";
import {
  formatName,
  getDeclarationName,
  hasConstructSignature,
  isContainerDeclaration,
  isDeclarationWithName,
} from "./utils.ts";
import { Ast } from "./ast.ts";
import { jsInterfaces } from "../data/interfaces.ts";

/** The AppCache stores objects that will be used while generating the JSON output. */
export class AppCache {
  /**
   * Map of variable declaration names to their types.
   * @example Array => ArrayConstructor
   */
  public variableNameToTypeMap = new Map<string, string>();

  /**
   * Map of types to their variable declaration names.
   * @example ArrayConstructor => Array
   */
  public variableTypeToNameMap = new Map<string, string>();

  /** Names of interfaces that are constructors */
  public constructors = new Set<string>();

  /** All Nodes by name with source file and node */
  public statementsCache = new Map<string, [ts.SourceFile, ts.Node][]>();

  /** VariableDeclaration, FunctionDeclaration, and ModuleDeclaration nodes */
  public declarations = new Set<string>();

  /** Cache type alias ASTs to avoid parsing them multiple times */
  public typeAliasDeclarations = new Map<string, Ast[]>();

  /** Type references that won't resolve or are global. */
  public dontParse = new Set<string>([
    ...Array(26).fill(0).map((_, i) => String.fromCharCode(65 + i)), // A-Z,
    ...jsInterfaces,
  ]);

  constructor(public program: ts.Program) {}

  /** Collects all of neccessary declarations in the program. */
  public initialize(): void {
    this.program.getSourceFiles().forEach((s) => this.visitChildren(s, s, ""));
  }

  /** Visits children of the given node */
  public visitChildren(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): void {
    ts.forEachChild(
      node,
      (child) => this.cacheDeclarations(child, sourceFile, globalPrefix),
    );
  }

  /** Caches nodes that have methods and properties of built-in JavaScript objects. */
  public cacheDeclarations(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): void {
    if (!isDeclarationWithName(node)) {
      return this.visitChildren(node, sourceFile, globalPrefix);
    }

    if (ts.isInterfaceDeclaration(node)) {
      this.cacheContainer(node, sourceFile, globalPrefix);
      this.cacheConstructor(node, sourceFile, globalPrefix);
      this.visitChildren(node, sourceFile, globalPrefix);
      return;
    }

    if (ts.isVariableDeclaration(node)) {
      this.cacheType(node, sourceFile, globalPrefix);
      return;
    }

    if (ts.isFunctionDeclaration(node)) {
      this.cacheType(node, sourceFile, globalPrefix);
      return;
    }

    if (ts.isModuleDeclaration(node) && node.body) {
      const name = getDeclarationName(node, sourceFile, globalPrefix);
      this.variableNameToTypeMap.set(name, name);
      this.cacheContainer(node, sourceFile, globalPrefix);
      if (ts.isModuleBlock(node.body)) {
        this.visitChildren(node, sourceFile, name);
      }
      return;
    }
  }

  /** Cache "containers", i.e. interfaces and modules. */
  public cacheContainer<T extends ts.Node>(
    node: T,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): void {
    if (!isDeclarationWithName(node) || !isContainerDeclaration(node)) return;
    const name = formatName(node.name.getText(sourceFile), globalPrefix);
    const statements = this.statementsCache.get(name) ?? [];

    // Avoid duplicates
    if (statements.some((s) => s[0] === sourceFile && s[1] === node)) return;

    statements.push([sourceFile, node]);
    this.statementsCache.set(name, statements);
  }

  /** Caches type information for a variable or function declaration. */
  public cacheType(
    node: ts.VariableDeclaration | ts.FunctionDeclaration | undefined,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): void {
    if (!node || !isDeclarationWithName(node)) return;
    const name = getDeclarationName(node, sourceFile, globalPrefix);

    let type = `Uhandled<unknown>`;
    if (
      node.type && ts.isTypeReferenceNode(node.type) &&
      ts.isVariableDeclaration(node)
    ) {
      type = formatName(node.type.typeName.getText(sourceFile), globalPrefix);
      this.variableTypeToNameMap.set(type, name); // Reverse lookup for constructors
    } else if (node.type && ts.isToken(node.type)) {
      type = formatName(node.type.getText(sourceFile), globalPrefix);
    } else if (node.type) {
      type = `Uhandled<${ts.SyntaxKind[node.type.kind]}>`;
    }

    this.variableNameToTypeMap.set(name, type);
  }

  /** Caches a constructor interface */
  public cacheConstructor<T extends ts.Node>(
    node: T,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): void {
    if (!isDeclarationWithName(node) || !hasConstructSignature(node)) return;
    this.constructors.add(getDeclarationName(node, sourceFile, globalPrefix));
  }

  /**
   * Given a variable name return its corresponding type name
   * @example Given `Name` of `var Name: Type`, return `Type`
   */
  public getVariableTypeFromName(variableName: string): string | undefined {
    return this.variableNameToTypeMap.get(variableName);
  }

  /**
   * Given a type name, returns its corresponding variable name.
   * @example Given `Type` from `var Name: Type`, return `Name`
   */
  public getVariableNameFromType(typeName: string): string | undefined {
    return this.variableTypeToNameMap.get(typeName);
  }

  /** Checks if the cache contains a variable with the given name. */
  public hasVariableName(nodeName: string) {
    return this.variableNameToTypeMap.has(nodeName);
  }

  /** Checks if the cache has a constructor with the given name. */
  public hasConstructor(constructorName: string): boolean {
    return this.constructors.has(constructorName);
  }

  /** Retrieves declarations for interfaces and modules. */
  public getContainer(containerName: string): [ts.SourceFile, ts.Node][] {
    return this.statementsCache.get(containerName) ?? [];
  }
}
