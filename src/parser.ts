import ts from "typescript";

import { Ast, type SerializedAst } from "./ast.ts";
import { BooleanMetaValues } from "./types.ts";
import { formatId, formatName, isBooleanMetaValue } from "./utils.ts";
import type { TypeResolver } from "./type_resolver.ts";

/** The Parser class parses the TypeScript libs into a list of all built-in interfaces. */
export class Parser {
  private typeChecker: ts.TypeChecker;
  private idCounter = 0;

  constructor(private program: ts.Program, private typeResolver: TypeResolver) {
    this.typeChecker = program.getTypeChecker();
  }

  /** Parse the TypeScript libs and generate a list of all built-in interfaces. */
  public parse() {
    const everything: Record<string, SerializedAst[]> = {};
    this.program.getSourceFiles().forEach((sourceFile) => {
      sourceFile.forEachChild((node) => {
        this.parseStatements(node, sourceFile).flat().forEach((x) => {
          const id = x.getId();
          if (!everything[id]) everything[id] = [];
          everything[id].push(x.serialize());
        });
      });
    });
    return everything;
  }

  /** Parses top-level statements in a source file. */
  private parseStatements(node: ts.Node, source: ts.SourceFile, parent = ""): Ast[] {
    if (ts.isFunctionDeclaration(node)) {
      return this.parseFunctionDeclaration(node, source, parent);
    }
    if (ts.isModuleDeclaration(node)) {
      return this.parseModuleDeclaration(node, source, parent);
    }
    if (ts.isVariableStatement(node)) {
      return this.parseVariableStatement(node, source, parent);
    }

    return [];
  }

  // {{{ Children
  private parseChildren(node: ts.Node, source: ts.SourceFile, parent = ""): Ast[] {
    if (ts.isFunctionDeclaration(node)) {
      return this.parseFunctionDeclaration(node, source, parent);
    }
    if (ts.isVariableDeclaration(node)) {
      return this.parseVariableDeclaration(node, source, parent);
    }
    if (ts.isModuleDeclaration(node)) {
      return this.parseModuleDeclaration(node, source, parent);
    }
    if (ts.isVariableStatement(node)) {
      return this.parseVariableStatement(node, source, parent);
    }
    if (ts.isInterfaceDeclaration(node)) {
      return this.parseInterfaceDeclaration(node, source, parent);
    }
    if (ts.isMethodSignature(node)) {
      return this.parseMethodSignature(node, source, parent);
    }
    if (ts.isCallSignatureDeclaration(node)) {
      return this.parseCallSignatureDeclaration(node, source, parent);
    }
    if (ts.isConstructSignatureDeclaration(node)) {
      return this.parseConstructSignatureDeclaration(node, source, parent);
    }
    if (ts.isHeritageClause(node)) {
      return this.parseHeritageClause(node, source, parent);
    }
    if (ts.isIndexSignatureDeclaration(node)) {
      return this.parseIndexSignatureDeclaration(node, source, parent);
    }
    if (ts.isConstructorDeclaration(node)) {
      return this.parseConstructorDeclaration(node, source, parent);
    }
    if (ts.isPropertySignature(node)) {
      return this.parsePropertySignature(node, source, parent);
    }
    if (ts.isPropertyDeclaration(node)) {
      return this.parsePropertyDeclaration(node, source, parent);
    }
    if (ts.isSetAccessorDeclaration(node)) {
      return this.parseSetAccessorDeclaration(node, source, parent);
    }
    if (ts.isGetAccessorDeclaration(node)) {
      return this.parseGetAccessorDeclaration(node, source, parent);
    }
    if (ts.isClassDeclaration(node)) {
      return this.parseClassDeclaration(node, source, parent);
    }
    if (ts.isTypeAliasDeclaration(node)) {
      // TODO: Determine whether this should be returned (it was being returned previously).
      // return this.readTypeAliasDeclaration(node, sourceFile);
      return [];
    }
    if (node.kind === ts.SyntaxKind.EndOfFileToken) {
      return [];
    }

    return [];
  }
  // }}}

  // {{{ Namespaces (Intl.DateTimeFormat, Intl.NumberFormat, etc.)
  private parseModuleDeclaration(node: ts.ModuleDeclaration, file: ts.SourceFile, _parent = ""): Ast[] {
    if (!ts.isModuleDeclaration(node)) return [];
    const name = node.name.getText(file);

    const meta = this.getMeta(node.modifiers);
    const ast = new Ast(formatId(name, ""), formatName(name, ""), node.kind)
      .setMeta(meta);

    const statementAsts: Ast[] = [];
    if (node.body && ts.isModuleBlock(node.body)) {
      node.body.forEachChild((statement: ts.Node) => {
        const statementAst = this.parseChildren(statement, file, name);
        if (statementAst) statementAsts.push(...statementAst);
      });
      ast.setParameters(statementAsts);
    }

    return [ast];
  }
  // }}}

  // {{{ Object key ({ [key: string]: any })
  private parseIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration, file: ts.SourceFile, _parent = ""): Ast[] {
    if (!ts.isIndexSignatureDeclaration(node)) return [];
    const id = this.getNextId();
    const ast = new Ast(id, id, node.kind).addType(
      this.typeResolver.resolveType(node.type, file),
    );
    for (const parameter of node.parameters) {
      ast.addParameter(this.typeResolver.resolveType(parameter, file));
    }
    return [ast];
  }
  // }}}

  // {{{ Interfaces
  private parseInterfaceDeclaration(node: ts.InterfaceDeclaration, file: ts.SourceFile, parent = ""): Ast[] {
    if (!ts.isInterfaceDeclaration(node)) return [];

    const interfaceName = node.name.getText(file);
    const meta = this.getMeta(node.modifiers);
    const ast = new Ast(formatId(interfaceName, parent), formatName(interfaceName, parent), node.kind).setMeta(meta);

    const members: Ast[] = [];
    const memberParent = parent ? (this.getParentName(node, file) ?? interfaceName) : interfaceName;

    for (const member of [...node.members]) {
      const memberAst = this.parseChildren(member, file, memberParent);
      for (const statement of memberAst) {
        if (statement.getName()) {
          statement.changePrefix(interfaceName, memberParent);
        }
        members.push(statement);
      }
    }

    if (node.heritageClauses) {
      const name = formatName(interfaceName, parent);
      for (const heritageClause of node.heritageClauses) {
        const heritageAst = this.parseChildren(heritageClause, file, name);
        if (heritageAst) heritageAst.forEach((x) => ast.addType(x));
      }
    }

    return [ast, ...members];
  }
  // }}}

  // {{{ Classes
  private parseClassDeclaration(
    node: ts.ClassDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isClassDeclaration(node)) return [];
    const className = node.name?.getText(file);
    if (!className) return [];
    // const meta = this.getMeta(node.modifiers);
    // const ast = new Ast(formatId(className, ''), formatName(className, ''), node.kind).setMeta(meta);
    const members: Ast[] = [];
    const memberPrefix = this.getParentName(node, file) ?? "";

    for (const member of [...node.members]) {
      const memberAst = this.parseChildren(member, file, memberPrefix);
      if (memberAst && memberAst instanceof Ast) {
        if (memberAst.getName()) {
          if (parent) memberAst.changePrefix(className, parent);
          // this.saveGlobal(memberAst);
          // ast.addParameter(memberAst);
          members.push(memberAst);
        }
        // ast.addParameter(memberAst);
      }
    }

    if (node.heritageClauses) {
      for (const heritageClause of node.heritageClauses) {
        const name = formatName(className, parent);
        const heritageAst = this.parseChildren(heritageClause, file, name);
        if (heritageAst) members.push(...heritageAst); // ast.addType(heritageAst);
      }
    }
    return members;
  }
  // }}}

  // {{{ Inheritance
  private parseHeritageClause(
    node: ts.HeritageClause,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isHeritageClause(node)) return [];
    const ast = new Ast(parent, parent, node.kind);
    for (const type of node.types) {
      ast.addType(this.typeResolver.resolveType(type, file));
    }
    return [ast];
  }

  /** Constructor function without the `new` keyword, e.g. Array(5) */
  private parseCallSignatureDeclaration(
    node: ts.CallSignatureDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isCallSignatureDeclaration(node)) return [];
    if (!parent) return [];

    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.typeResolver.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );

    const ast = new Ast(parent, parent, node.kind).setParameters(parameters)
      .setTypeParameters(
        typeParameters,
      );

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    // GlobalObject constructors can receive a "value" argument
    parameters.unshift(new Ast("value", "value", ts.SyntaxKind.Identifier));
    return [ast];
  }
  // }}}

  // {{{ Constructor Functions (new Map(), Array())
  private parseConstructSignatureDeclaration(
    node: ts.ConstructSignatureDeclaration | ts.Node,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isConstructSignatureDeclaration(node)) return [];
    if (!node.parent || !ts.isInterfaceDeclaration(node.parent)) return [];
    parent = parent ?? node.parent.name?.getText(file);

    const bindingId = `${parent}.new`;
    const bindingName = `${parent}`;
    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.typeResolver.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );
    const ast = new Ast(bindingId, bindingName, node.kind);
    ast.setParameters(parameters).setTypeParameters(typeParameters);

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));
    return [ast];
  }

  //private parseConstructSignatureSymbols(
  //  constructors: ts.Signature[],
  //  file: ts.SourceFile,
  //  prefix = "",
  //  parentNode: ts.Node,
  //) {
  //  return constructors.reduce<Ast[]>((acc, curr) => {
  //    const ast = new Ast(formatId(name, prefix), formatName(name, prefix), ts.SyntaxKind.ConstructSignature);
  //    ast.setParameters(this.getParametersFromSymbols(curr.getParameters(), file));
  //    ast.addType(this.getReturnTypeFromSymbol(curr.getReturnType(), file, parentNode));
  //
  //    return [...acc, ast];
  //  }, []);
  //}
  // }}}

  // {{{ Methods
  private parseMethodSignature(
    node: ts.MethodSignature | ts.MethodDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isMethodSignature(node)) return [];

    const methodName = node.name.getText(file);
    if (!methodName) return [];

    const id = methodName;
    const bindingName = methodName;

    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.typeResolver.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );

    const ast = new Ast(
      formatId(id, parent),
      formatName(bindingName, parent),
      node.kind,
    ).setParameters(
      parameters,
    ).setTypeParameters(
      typeParameters,
    );

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    // const baseType = globalPrefix ? globalPrefix.split('.')[0] : `typeof ${ast.getName()}`;
    // if (globalPrefix) parameters.unshift(new Ast('ctx', 'ctx', ts.SyntaxKind.Identifier).setText(baseType)); // WAS .addType(new Ast().text(baseType))

    return [ast];
  }
  // }}}

  // {{{ Class constructors
  private parseConstructorDeclaration(
    node: ts.ConstructorDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isConstructorDeclaration(node)) return [];
    // Duplicates parseMethod
    const methodName = node.name?.getText(file);
    if (!methodName) return [];

    const id = methodName;
    const bindingName = methodName;
    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.typeResolver.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );
    const ast = new Ast(formatId(id, parent), formatName(bindingName, parent), node.kind)
      .setParameters(parameters)
      .setTypeParameters(typeParameters);

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    // const baseType = globalPrefix ? globalPrefix.split('.')[0] : `typeof ${ast.getName()}`;
    // if (globalPrefix) parameters.unshift(new Ast('ctx', 'ctx', ts.SyntaxKind.Identifier).setText(baseType)); // WAS .addType(new Ast().text(baseType))

    return [ast];
  }
  // }}}

  // {{{ Functions
  private parseFunctionDeclaration(node: ts.FunctionDeclaration, file: ts.SourceFile, parent = ""): Ast[] {
    if (!ts.isFunctionDeclaration(node)) return [];
    if (!node.name) return [];

    const functionName = node.name.getText(file);
    const name = formatName(functionName, parent);
    // const hasPrefix = globalPrefix !== '';

    // if (hasName || hasPrefix) {
    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.typeResolver.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );

    const ast = new Ast(formatId(functionName, parent), name, node.kind)
      .setParameters(parameters)
      .setTypeParameters(typeParameters)
      .setMeta(this.getMeta(node.modifiers));

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    // this.saveGlobal(ast);
    return [ast];
    // }
  }
  // }}}

  // {{{ Properties
  private parsePropertySignature(
    node: ts.PropertySignature | ts.PropertyDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isPropertySignature(node)) return [];
    if ((node.getFullText(file)).includes("@deprecated")) return [];

    const propertyName = node.name.getText(file);
    if (!this.isValidVariableName(propertyName)) return [];

    const id = formatId(propertyName, parent);
    const name = formatName(propertyName, parent);
    const ast = new Ast(id, name, node.kind).setMeta(
      this.getMeta(node.modifiers),
    );

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    return [ast];
  }
  // }}}

  // {{{ Class properties
  //private parsePropertyDeclaration(
  //  node: ts.PropertyDeclaration,
  //  file: ts.SourceFile,
  //  parent = "",
  //): Ast[] {
  //  if (!ts.isPropertyDeclaration(node)) return [];
  //  // Duplicates parseProperty
  //  if ((node.getFullText(file)).includes("@deprecated")) return [];
  //
  //  const propertyName = node.name.getText(file);
  //  if (!this.isValidVariableName(propertyName)) return [];
  //
  //  const id = formatId(propertyName, parent);
  //  const name = formatName(propertyName, parent);
  //  const ast = new Ast(id, name, node.kind).setMeta(
  //    this.getMeta(node.modifiers),
  //  );
  //
  //  if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));
  //
  //  return [ast];
  //}
  // }}}

  // {{{ Variable Declarations
  private parseVariableDeclaration(node: ts.VariableDeclaration, file: ts.SourceFile, prefix = ""): Ast[] {
    if (!ts.isVariableDeclaration(node)) return [];

    const nameSymbol = this.typeChecker.getSymbolAtLocation(node.name);
    if (nameSymbol && node.type) {
      const name = nameSymbol.getName();
      const decls = nameSymbol.getDeclarations();
      let declAsts: Ast[] = [];
      if (decls) {
        declAsts = decls.reduce<Ast[]>((acc, decl) => {
          if (ts.isMethodSignature(decl) || ts.isMethodDeclaration(decl)) {
            return [...acc, ...this.parseMethodSignature(decl, file, name)];
          }
          if (ts.isPropertyDeclaration(decl) || ts.isPropertySignature(decl)) {
            return [...acc, ...this.parsePropertySignature(decl, file, name)];
          }
          return acc;
        }, []);
      }

      // TODO: Refactor into parseConstructSignatures
      const type = this.typeChecker.getTypeAtLocation(node.type);
      const ctorAsts: Ast[] = type.getConstructSignatures().reduce<Ast[]>((acc, _ctor) => {
        const ast = new Ast(formatId("new", prefix), formatName("new", prefix), ts.SyntaxKind.Constructor);
        // TODO: const params = ctor.getParameters()
        return [...acc, ast];
      }, []);

      return [...ctorAsts, ...declAsts];
    }
    return [];
  }

  private _parseVariableDeclarationSymbol(node: ts.Declaration): Ast[] {
    if (!ts.isDeclarationStatement(node) || !node.name) return [];

    const nameSymbol = this.typeChecker.getSymbolAtLocation(node.name);
    if (!nameSymbol) return [];

    const name = nameSymbol.getName();
    const ast = new Ast(formatId(name), formatName(name), ts.SyntaxKind.VariableDeclaration);
    return [ast];
  }
  // }}}

  // {{{ Variable statements (declare var ...)
  private parseVariableStatement(node: ts.VariableStatement, file: ts.SourceFile, parent = ""): Ast[] {
    if (!ts.isVariableStatement(node)) return [];
    return node.declarationList.declarations.reduce<Ast[]>((acc, curr) => {
      return [...acc, ...this.parseVariableDeclaration(curr, file, parent)];
    }, []);
  }
  // }}}

  // {{{ Getters
  private parseGetAccessorDeclaration(
    node: ts.GetAccessorDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isGetAccessorDeclaration(node)) return [];
    const name = node.name.getText(file);
    const ast = new Ast(
      formatId(name, parent),
      formatName(name, parent),
      node.kind,
    );

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    return [ast];
  }
  // }}}

  // {{{ Setters
  private parseSetAccessorDeclaration(
    node: ts.SetAccessorDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): Ast[] {
    if (!ts.isSetAccessorDeclaration(node)) return [];
    const name = node.name.getText(file);
    const ast = new Ast(
      formatId(name, parent),
      formatName(name, parent),
      node.kind,
    );

    if (node.type) ast.addType(this.typeResolver.resolveType(node.type, file));

    return [ast];
  }
  // }}}

  // {{{ Helpers
  /** Extracts modifiers as a set of boolean meta values */
  private getMeta(
    modifiers: ts.NodeArray<ts.ModifierLike> | undefined,
  ): BooleanMetaValues[] {
    if (!modifiers) return [];
    const meta = new Set<BooleanMetaValues>();
    for (const modifier of modifiers) {
      if (isBooleanMetaValue(modifier.kind)) {
        meta.add(modifier.kind);
      }
    }
    return [...meta];
  }

  private getParameters(
    params: ts.NodeArray<ts.ParameterDeclaration>,
    file: ts.SourceFile,
  ): Ast[] {
    if (!params) return [];

    const asts: Ast[] = [];
    for (const param of params) {
      const parameter = this.getParameter(param, file);
      asts.push(parameter);
    }
    return asts;
  }

  private getParameter(param: ts.ParameterDeclaration, file: ts.SourceFile) {
    const name = param.name.getText(file);
    const ast = new Ast(name, name, param.kind);

    if (param.questionToken !== undefined) {
      ast.addMeta(ts.SyntaxKind.QuestionToken);
    }

    if (param.dotDotDotToken !== undefined) {
      ast.addMeta(ts.SyntaxKind.DotDotDotToken);
    }

    // TODO: Set initializer

    if (param.type) {
      const childParameter = this.typeResolver.resolveType(param.type, file);
      ast.addType(childParameter);
    }

    return ast;
  }

  private getParametersFromSymbols(symbols: ts.Symbol[], file: ts.SourceFile) {
    return symbols.flatMap((param) => {
      const declarations = ts.factory.createNodeArray((param.getDeclarations() ?? []) as ts.ParameterDeclaration[]);
      return this.getParameters(declarations, file);
    });
  }

  //private getReturnTypeFromSymbol(type: ts.Type, file: ts.SourceFile, parentNode: ts.Node) {
  //  const typeNode = this.typeChecker.typeToTypeNode(type, parentNode, undefined) as ts.Node;
  //  return this.typeResolver.resolveType(typeNode, file);
  //}

  private getParentName(
    node: ts.InterfaceDeclaration | ts.ClassDeclaration,
    file: ts.SourceFile,
    parent = "",
  ): string | undefined {
    // const name = node.name?.getText(file);
    // if (!name || !this.isValidVariableName(name)) return;

    let name = "";
    if (ts.isInterfaceDeclaration(node)) {
      name = node.name.getText(file);
      if (!this.hasConstructorFn(node) && !this.isDeclaredVariable(name)) {
        name += ".prototype";
      }
    }

    if (ts.isClassDeclaration(node)) {
      name = node.name?.getText(file) ?? "";
    }

    return parent ? `${parent}.${name}` : name;
  }

  private hasConstructorFn(node: ts.InterfaceDeclaration): boolean {
    return node.members.some((member) => ts.isConstructSignatureDeclaration(member));
  }

  /** Gets the name of an interface by its constructor interface */
  //private getVariableName(constructorName: string): string | undefined {
  //  const visit = (node: ts.Node, sourceFile: ts.SourceFile) => {
  //    if (
  //      ts.isVariableDeclaration(node) &&
  //      node.type?.getText(sourceFile) === constructorName
  //    ) {
  //      return node.name.getText(sourceFile);
  //    }
  //    node.forEachChild((child) => visit(child, sourceFile));
  //  };
  //
  //  this.program.getSourceFiles().forEach((sourceFile) => sourceFile.forEachChild((node) => visit(node, sourceFile)));
  //
  //  return undefined;
  //}

  private isDeclaredVariable(interfaceName: string): boolean {
    const visit = (node: ts.Node, sourceFile: ts.SourceFile) => {
      if (
        ts.isVariableDeclaration(node) &&
        node.name.getText(sourceFile) === interfaceName
      ) {
        return true;
      }
      node.forEachChild((child) => visit(child, sourceFile));
    };

    this.program.getSourceFiles().forEach((sourceFile) => sourceFile.forEachChild((node) => visit(node, sourceFile)));

    return false;
  }

  private isValidVariableName(name: string): boolean {
    const isValidVariable = new RegExp(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/);
    return isValidVariable.test(name);
  }

  private getNextId() {
    return `_${++this.idCounter}`;
    // return `~${crypto.randomUUID()}`;
  }
  // }}}
}
