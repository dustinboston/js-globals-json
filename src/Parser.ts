// The goal of this script is to collect all of the built-in objects, properties, methods,
// and events from the TypeScript declaration files and ouput them in a SIMPLE format.
// To that end, unparsed type information is included, but the parsed types are simplified
// to the closest primitive.
//
// NOTE: Use only _for_ loops instead ano no spread operators. Spreading values from a large
// array (e.g. `b.push(...oneBillionValues)`) will cause a stack overflow due to the size
// of the files being parsed. To keep things simple, _for_ loops are also used instead of
// maps, flatMaps, and reducers. Don't try to "fix" this with functional style methods.

import {
  BindingName,
  CallSignatureDeclaration,
  ClassDeclaration,
  ConstructorDeclaration,
  ConstructSignatureDeclaration,
  ExpressionWithTypeArguments,
  FunctionDeclaration,
  InterfaceDeclaration,
  LeftHandSideExpression,
  MethodDeclaration,
  MethodSignature,
  ModuleDeclaration,
  Node,
  ParameterDeclaration,
  Project,
  PropertyDeclaration,
  PropertySignature,
  SourceFile,
  TypeLiteralNode,
  TypeNode,
  TypeReferenceNode,
  VariableDeclaration,
} from "ts-morph";
import { SyntaxKind } from "typescript";
import Assertions from "./Assertions.ts";
import { Ancestry, GlobalMembers, Globals, MemberTypes, PreviouslyParsed, SerializedAst, VariableName, VariableType } from "./Types.ts";
import Ast from "./Ast.ts";
import { AstKind } from "./AstKind.ts";
import Inheritance from "./Inheritance.ts";
import TypeParser from "./TypeParser.ts";

export class Parser {
  protected readonly sourceFiles: SourceFile[];
  protected readonly variableNames: Set<string> = new Set();
  protected readonly PROTOTYPE = "::"; // Abbreviate "prototype" as "::" to save space in the final output
  protected readonly GLOBAL_THIS = "globalThis";
  protected readonly ENABLE_VERBOSE_TYPES = false;

  protected staticInterfaces: Set<string> = new Set();
  protected instanceInterfaces: Set<string> = new Set();
  protected variableTypeByVariableName: Map<VariableName, VariableType> = new Map();
  protected variableNameByVariableType: Map<VariableType, VariableName> = new Map();
  protected constructorInterfaces: Set<string> = new Set();
  protected globals = new Map<string, Ast>([[this.GLOBAL_THIS, Ast.createGlobalObject(this.GLOBAL_THIS)]]);

  public constructor(protected project: Project, protected paths: string[]) {
    Assertions.assertProject(project);
    Assertions.assertPaths(paths);

    this.project.addSourceFilesAtPaths(paths);
    this.sourceFiles = this.project.getSourceFiles();

    if (this.sourceFiles.length === 0) {
      throw new Error("No source files found");
    }
  }

  public parse() {
    this.preCacheVariables();
    this.preCacheInterfaces();
    this.saveRootDeclarations();
    this.resolveInheritance();

    return this.globals.entries().reduce((serializedGlobals, [name, ast]) => {
      serializedGlobals[name] = ast.serialize();

      return serializedGlobals;
    }, {} as Record<string, SerializedAst>);
  }

  protected saveGlobal(ast: Ast): void {
    const name = ast.getName();
    if (!name) return;
    if (!this.globals.has(name)) {
      this.globals.set(name, ast);
    }
  }

  protected saveGlobalMember(ast: Ast): void {
    const parentContextName = ast.getParentContextName();

    if (this.globals.has(parentContextName)) {
      const parentContextAst = this.globals.get(parentContextName)!;
      parentContextAst.addMember(ast);
    } else {
      this.saveGlobal(ast);
    }
  }

  workingGroupByInterface(asts: Ast[]): Globals {
    const globals: Globals = {};

    for (const ast of asts) {
      const memberName = ast.getFullyQualifiedName();

      if (!memberName) continue;

      const firstAncestor = ast.getFirstAncestor();

      if (!globals[firstAncestor]) {
        globals[firstAncestor] = {};
      }

      const globalMembers = globals[firstAncestor] as GlobalMembers;
      if (!globalMembers[memberName]) {
        globalMembers[memberName] = [];
      }

      if (Array.isArray(globalMembers[memberName])) {
        globalMembers[memberName].push(ast.serialize());
      } else {
        globalMembers[memberName] = [ast.serialize()];
      }
    }

    return globals;
  }

  protected resolveInheritance() {
    for (const globalObjectAst of this.globals.values()) {
      if (globalObjectAst.getKind() !== AstKind.GlobalObject) return;

      const sourcesToInheritFrom = globalObjectAst.getInheritanceSources();
      if (sourcesToInheritFrom.length > 0) {
        for (const sourceName of sourcesToInheritFrom) {
          const sourceAst = this.globals.get(sourceName);
          if (sourceAst) {
            this.applyInheritance(globalObjectAst, sourceAst);
          }
        }
      }
    }
  }

  protected applyInheritance(targetAst: Ast, sourceAst: Ast) {
    sourceAst.getMembers().forEach((member) => {
      targetAst.addMember(member);
    });
  }

  protected preCacheInterfaces(): void {
    for (const file of this.sourceFiles) {
      for (const interfaceDeclaration of file.getInterfaces()) {
        this.preCacheInterface(interfaceDeclaration);
      }
      for (const moduleDeclaration of file.getModules()) {
        this.preCacheModuleInterfaces(moduleDeclaration);
      }
    }
  }

  protected preCacheInterface(interfaceDeclaration: InterfaceDeclaration): void {
    const name = interfaceDeclaration.getName();
    if (this.isConstructorInterface(interfaceDeclaration)) {
      this.constructorInterfaces.add(name);
      this.staticInterfaces.add(name);
    } else if (this.variableNames.has(name)) {
      this.instanceInterfaces.add(name);
    } else {
      this.staticInterfaces.add(name);
    }
  }

  protected preCacheModuleInterfaces(moduleDeclaration: ModuleDeclaration): void {
    for (const interfaceDeclaration of moduleDeclaration.getInterfaces()) {
      this.preCacheInterface(interfaceDeclaration);
    }
  }

  protected isConstructorInterface(declaration: InterfaceDeclaration): boolean {
    if (this.constructorInterfaces.has(declaration.getName())) return true;
    return declaration.getConstructSignatures().length > 0 || declaration.getCallSignatures().length > 0;
  }

  protected preCacheVariables(): void {
    for (const file of this.sourceFiles) {
      for (const declaration of file.getVariableDeclarations()) {
        this.preCacheVariable(declaration);
      }
      for (const moduleDeclaration of file.getModules()) {
        for (const variableDeclaration of moduleDeclaration.getVariableDeclarations()) {
          this.preCacheVariable(variableDeclaration);
        }
      }
    }
  }

  protected preCacheVariable(declaration: VariableDeclaration): void {
    const variableName = declaration.getName();
    const variableTypeNode = declaration.getTypeNode();

    this.variableNames.add(variableName);

    if (TypeReferenceNode.isTypeReference(variableTypeNode)) {
      const variableTypeName = variableTypeNode.getTypeName().getText();
      if (variableTypeName === variableName) {
        this.staticInterfaces.add(variableName);
      } else {
        this.instanceInterfaces.add(variableName);
        this.staticInterfaces.add(variableTypeName);
      }

      this.variableNameByVariableType.set(variableTypeName, variableName);
      this.variableTypeByVariableName.set(variableName, variableTypeName);
    } else if (TypeLiteralNode.isTypeLiteral(variableTypeNode)) {
      this.staticInterfaces.add(variableName);
    }
  }

  protected saveRootDeclarations(): void {
    const previouslyParsed: PreviouslyParsed = new Set();
    for (const file of this.sourceFiles) {
      this.saveRootVariables(file, previouslyParsed);
      this.saveRootInterfaces(file, previouslyParsed);
      this.saveRootFunctions(file, previouslyParsed);
      this.saveRootModules(file, previouslyParsed);
      this.saveRootClasses(file, previouslyParsed);
    }
  }

  protected saveRootClasses(file: SourceFile, previouslyParsed: PreviouslyParsed): void {
    for (const classDeclaration of file.getClasses()) {
      if (previouslyParsed.has(classDeclaration)) continue;
      this.parseRootClass(classDeclaration);
      previouslyParsed.add(classDeclaration);
    }
  }

  protected saveRootModules(file: SourceFile, previouslyParsed: PreviouslyParsed): void {
    for (const moduleDeclaration of file.getModules()) {
      if (previouslyParsed.has(moduleDeclaration)) continue;
      this.parseRootModule(moduleDeclaration);
      previouslyParsed.add(moduleDeclaration);
    }
  }

  protected saveRootFunctions(file: SourceFile, previouslyParsed: PreviouslyParsed): void {
    for (const functionDeclaration of file.getFunctions()) {
      if (previouslyParsed.has(functionDeclaration)) continue;
      this.parseRootFunction(functionDeclaration);
      previouslyParsed.add(functionDeclaration);
    }
  }

  protected saveRootInterfaces(file: SourceFile, previouslyParsed: PreviouslyParsed): void {
    for (const interfaceDeclaration of file.getInterfaces()) {
      if (previouslyParsed.has(interfaceDeclaration)) continue;
      this.parseRootInterface(interfaceDeclaration);
      previouslyParsed.add(interfaceDeclaration);
    }
  }

  protected saveRootVariables(file: SourceFile, previouslyParsed: PreviouslyParsed): void {
    for (const declaration of file.getVariableDeclarations()) {
      if (previouslyParsed.has(declaration)) continue;
      this.parseRootVariable(declaration);
      previouslyParsed.add(declaration);
    }
  }

  protected parseRootVariable(variableDeclaration: VariableDeclaration): void {
    Assertions.assertVariableDeclaration(variableDeclaration);

    const nameNode = variableDeclaration.getNameNode();
    const name = nameNode.getText();
    const variableName = nameNode.getText();
    const typeNode = variableDeclaration.getTypeNode();

    if (typeNode === undefined) {
      const returnType = TypeParser.getUndefinedType();
      const ast = Ast.createGlobalVariable(name)
        .setIsStatic()
        .addReturn(returnType)
        .setSyntaxKind(SyntaxKind.VariableDeclaration);

      this.saveGlobalMember(ast);
    } else if (typeNode && this.isKeyword(typeNode)) {
      const returnType = this.resolveType(typeNode);
      const ast = Ast.createGlobalVariable(name)
        .setIsStatic()
        .addReturn(returnType)
        .setSyntaxKind(SyntaxKind.VariableDeclaration);

      this.saveGlobalMember(ast);
    } else if (typeNode && typeNode instanceof TypeLiteralNode) {
      const returnType = this.resolveType(typeNode);
      const ast = Ast.createGlobalVariable(variableName)
        .setSyntaxKind(SyntaxKind.TypeLiteral)
        .addReturn(returnType);

      this.saveGlobal(ast);
      this.parseTypeLiteralNode(typeNode, ast);
    } else if (typeNode) {
      const syntaxKind = variableDeclaration.getKind();

      const ast = Ast.createGlobalVariable(variableName)
        .setSyntaxKind(syntaxKind)
        .addReturn(this.resolveType(typeNode));

      this.saveGlobalMember(ast);
    } else {
      // In theory a variable without a type node should have a type of undefined.
      // But that doesn't seem very useful in this context.
    }
  }

  protected isKeyword(node: Node): boolean {
    return node.getKind() <= SyntaxKind.LastKeyword && node.getKind() >= SyntaxKind.FirstKeyword;
  }

  // This is intended for type literals that are the type node in a variable declaration, not for type resolution.
  // For type resolution, use resolveType (and createAstForTypeLiteral).
  protected parseTypeLiteralNode(typeNode: TypeLiteralNode, parentContextAst: Ast): void {
    Assertions.assertTypeLiteralNode(typeNode);

    for (const constructSignature of typeNode.getConstructSignatures()) {
      this.parseConstructSignature(constructSignature, parentContextAst);
    }

    for (const callSignature of typeNode.getCallSignatures()) {
      this.parseCallSignature(callSignature, parentContextAst);
    }

    for (const property of typeNode.getProperties()) {
      this.parseProperty(property, parentContextAst);
    }

    for (const method of typeNode.getMethods()) {
      this.parseMethod(method, parentContextAst);
    }
  }

  protected parseRootFunction(declaration: FunctionDeclaration): void {
    Assertions.assertFunctionDeclarationType(declaration);

    const name = declaration.getName() ?? null;
    if (name === null) return;

    const typeParser = this.getTypeParser();
    const parameters = typeParser.getResolvedParameters(declaration.getParameters());

    const ast = Ast.createMethod(name)
      .setParameters(parameters)
      .setReturns(this.collectReturns(declaration))
      .setTypeParameters(this.collectTypeParameters(declaration));

    this.saveGlobalMember(ast);
  }

  protected parseRootClass(classDeclaration: ClassDeclaration): void {
    Assertions.assertClassType(classDeclaration);

    const nameNode = classDeclaration.getNameNode();
    if (!nameNode) return;

    const className = nameNode.getText();
    const typeParameters = this.parseTypeParameters(classDeclaration);

    const ast = Ast.createGlobalObject(className)
      .setSyntaxKind(SyntaxKind.ClassDeclaration)
      .setTypeParameters(typeParameters);

    const inheritanceSources = this.getInheritanceSources(classDeclaration);
    ast.addInheritanceSources(inheritanceSources);

    this.saveGlobal(ast);

    this.parseClassConstructors(classDeclaration, ast);
    this.parseClassProperties(classDeclaration, ast);
    this.parseClassMethods(classDeclaration, ast);
  }

  protected parseRootModule(moduleDeclaration: ModuleDeclaration): void {
    Assertions.assertModuleType(moduleDeclaration);

    const previouslyParsed: PreviouslyParsed = new Set();
    const moduleName = moduleDeclaration.getName();

    const ast = Ast.createGlobalObject(moduleName).setNamespace(moduleName);

    this.saveGlobal(ast);

    this.parseModuleVariables(moduleDeclaration, ast, previouslyParsed);
    this.parseModuleFunctions(moduleDeclaration, ast, previouslyParsed);
    this.parseModuleInterfaces(moduleDeclaration, ast, previouslyParsed);
  }

  protected parseModuleFunctions(moduleDeclaration: ModuleDeclaration, parentContextAst: Ast, previouslyParsed: PreviouslyParsed): void {
    // const namespace = moduleDeclaration.getName();

    for (const declaration of moduleDeclaration.getFunctions()) {
      if (previouslyParsed.has(declaration)) continue;

      this.parseFunction(declaration, parentContextAst);

      previouslyParsed.add(declaration);
    }
  }

  protected parseModuleVariables(moduleDeclaration: ModuleDeclaration, parentContextAst: Ast, previouslyParsed: PreviouslyParsed): void {
    // const namespace = moduleDeclaration.getName();

    for (const declaration of moduleDeclaration.getVariableDeclarations()) {
      if (previouslyParsed.has(declaration)) continue;
      this.parseVariableDeclaration(declaration, parentContextAst);
      previouslyParsed.add(declaration);
    }
  }

  protected parseRootInterface(interfaceDeclaration: InterfaceDeclaration): void {
    Assertions.assertInterfaceLikeDeclaration(interfaceDeclaration);

    /** Name of the interface that was passed into the function, e.g. ArrayConstructor */
    const realInterfaceName = interfaceDeclaration.getName();

    /** When the interface is associated with a variable or is the type of an interface, e.g. Array */
    const effectiveInterfaceName = this.getEffectiveInterfaceName(realInterfaceName, interfaceDeclaration);
    if (!effectiveInterfaceName) return;

    // const ancestry = new Set<string>();
    const typeParameters = this.parseTypeParameters(interfaceDeclaration);

    const ast = Ast.createGlobalObject(effectiveInterfaceName)
      .setSyntaxKind(SyntaxKind.InterfaceDeclaration)
      .setTypeParameters(typeParameters);

    const inheritanceSources = Inheritance.findSource(effectiveInterfaceName);
    if (Array.isArray(inheritanceSources)) {
      ast.addInheritanceSources(inheritanceSources);
    }

    const parsedExtends = this.getInheritanceSources(interfaceDeclaration);
    if (parsedExtends.length > 0) {
      // TODO: parseExtends doesn't seem to be be working as expected
      for (const source of parsedExtends) {
        ast.addInheritanceSource(source);
      }
    }

    this.saveGlobal(ast);

    if (this.constructorInterfaces.has(realInterfaceName)) {
      // If the interface has constructors the interface is static
      ast.setIsStatic();

      // if (effectiveInterfaceName) {
      //   ancestry.add(effectiveInterfaceName);
      // }

      this.parseConstructSignatures(interfaceDeclaration, ast);
      this.parseCallSignatures(interfaceDeclaration, ast);
    } else if (this.variableNames.has(realInterfaceName)) {
      // If the interface is a variable name, the interface is an instance, uless both the real an effective names are the same
      if (effectiveInterfaceName === realInterfaceName) {
        ast.setIsStatic();
      } else {
        ast.setIsInstance();
      }
    }

    this.parseProperties(interfaceDeclaration, ast);
    this.parseMethods(interfaceDeclaration, ast);
  }

  protected parseConstructSignatures(interfaceDeclaration: InterfaceDeclaration, parentContextAst: Ast): void {
    const constructSignatures = interfaceDeclaration.getConstructSignatures();
    for (const constructSignature of constructSignatures) {
      this.parseConstructSignature(constructSignature, parentContextAst);
    }
  }

  /** Gets the name of a _variable_ from either the variable name interface or its type interface. e.g. realInterfaceName = ArrayConstructor, effectiveName = Array */
  protected getEffectiveInterfaceName(realInterfaceName: string, interfaceDeclaration: InterfaceDeclaration) {
    if (this.variableNames.has(realInterfaceName)) {
      return realInterfaceName;
    } else if (this.variableNameByVariableType.has(realInterfaceName)) {
      return this.variableNameByVariableType.get(interfaceDeclaration.getName())!;
    }
    return null;
  }

  protected parseVariableDeclaration(variableDeclaration: VariableDeclaration, parentContextAst: Ast): void {
    const nameNode = variableDeclaration.getNameNode();
    const typeNode = variableDeclaration.getTypeNode();

    let ast: Ast;
    if (typeNode === undefined) {
      ast = this.createAstForBasicVariable(nameNode, typeNode, parentContextAst);
    } else {
      const returnType = this.resolveType(typeNode);

      ast = Ast.createProperty(nameNode.getText())
        .setSyntaxKind(SyntaxKind.VariableDeclaration)
        .addReturn(returnType)
        .setParentContext(parentContextAst);
    }

    this.saveGlobalMember(ast);
  }

  protected createAstForBasicVariable(
    variableNameNode: BindingName,
    variableTypeNode: Node | TypeNode | undefined,
    parentContextAst?: Ast,
  ): Ast {
    Assertions.assertBindingName(variableNameNode);
    Assertions.assertNodeTypeNodeOrUndefined(variableTypeNode);

    const typeParser = this.getTypeParser();
    const returnType = variableTypeNode ? typeParser.parse(variableTypeNode) : null;

    const ast = Ast.createProperty(variableNameNode.getText())
      .setIsStatic()
      .addReturn(returnType)
      .setSyntaxKind(SyntaxKind.VariableDeclaration);

    if (parentContextAst) {
      ast.setParentContext(parentContextAst);
    }

    return ast;
  }

  protected parseInterface(interfaceDeclaration: InterfaceDeclaration | TypeLiteralNode, parentContextAst: Ast): void {
    Assertions.assertInterfaceLikeDeclaration(interfaceDeclaration);

    const realInterfaceName = interfaceDeclaration.getName();
    const effectiveInterfaceName = this.getEffectiveInterfaceName(realInterfaceName, interfaceDeclaration);
    if (!effectiveInterfaceName) return;

    const inheritanceSources = this.getInheritanceSources(interfaceDeclaration);
    const syntaxKind = interfaceDeclaration.getKind();

    const ast = Ast.createGlobalObject(effectiveInterfaceName)
      .setSyntaxKind(syntaxKind)
      .addInheritanceSources(inheritanceSources)
      .setParentContext(parentContextAst);

    this.saveGlobal(ast);

    if (this.constructorInterfaces.has(realInterfaceName)) {
      ast.setIsStatic();
      this.parseConstructSignatures(interfaceDeclaration, ast);
      this.parseCallSignatures(interfaceDeclaration, ast);
    } else {
      if (effectiveInterfaceName === realInterfaceName) {
        ast.setIsStatic();
      } else {
        ast.setIsInstance();
      }
    }

    this.parseProperties(interfaceDeclaration, ast);
    this.parseMethods(interfaceDeclaration, ast);
  }

  protected parseFunction(functionDeclaration: FunctionDeclaration, parentContextAst: Ast): void {
    Assertions.assertFunctionDeclarationType(functionDeclaration);

    const name = functionDeclaration.getName();
    if (!name) return;

    const returns = this.collectReturns(functionDeclaration);
    const typeParameters = this.collectTypeParameters(functionDeclaration);
    const syntaxKind = functionDeclaration.getKind();

    const params = functionDeclaration.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);

    const ast = Ast.createGlobalFunction(name ?? null)
      .setSyntaxKind(syntaxKind)
      .setParameters(parsedParams)
      .setReturns(returns)
      .setTypeParameters(typeParameters)
      .setParentContext(parentContextAst);

    this.saveGlobalMember(ast);
  }

  protected parseClass(classDeclaration: ClassDeclaration, ancestry: Ancestry): void {
    Assertions.assertClassType(classDeclaration);
    Assertions.assertAncestry(ancestry);

    const classNameNode = classDeclaration.getNameNode();
    if (!classNameNode) return;

    const className = classNameNode.getText();
    const extendsExpression = classDeclaration.getExtends();
    const inheritanceSources = this.getInheritanceSources(classDeclaration);
    const typeParameters = this.parseTypeParameters(classDeclaration);

    const ast = Ast.createGlobalObject(className)
      .setSyntaxKind(SyntaxKind.ClassDeclaration)
      .addInheritanceSources(inheritanceSources)
      .setTypeParameters(typeParameters);

    if (extendsExpression) {
      const parentName = extendsExpression.getText();
      ast.addInheritanceSource(parentName);
    }

    this.saveGlobal(ast);

    this.parseClassConstructors(classDeclaration, ast);
    this.parseClassProperties(classDeclaration, ast);
    this.parseClassMethods(classDeclaration, ast);
  }

  protected parseClassMethods(classDeclaration: ClassDeclaration, parentContextAst: Ast): void {
    const methods = classDeclaration.getMethods();
    for (const method of methods) {
      this.parseClassMethod(method, parentContextAst);
    }
  }

  protected parseClassMethod(method: MethodDeclaration, parentContextAst: Ast): void {
    Assertions.assertFunctionType(method);

    const name = method.getName();
    const returns = this.collectReturns(method);
    const typeParameters = this.collectTypeParameters(method);
    const isStatic = method.isStatic();

    const params = method.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);

    const ast = Ast.createMethod(name)
      .setSyntaxKind(SyntaxKind.MethodDeclaration)
      .setParameters(parsedParams)
      .setReturns(returns)
      .setTypeParameters(typeParameters)
      .setParentContext(parentContextAst);

    if (isStatic) {
      ast.setIsStatic();
    } else {
      ast.setIsInstance();
    }

    this.saveGlobalMember(ast);
  }

  protected parseClassProperties(classDeclaration: ClassDeclaration, parentContextAst: Ast): void {
    const properties = classDeclaration.getProperties();
    for (const property of properties) {
      this.parseClassProperty(property, parentContextAst);
    }
  }

  protected parseClassProperty(property: PropertyDeclaration, parentContextAst: Ast): void {
    const typeNode = property.getTypeNode();
    const name = property.getName();
    const syntaxKind = property.getKind();
    const isStatic = property.isStatic();

    const typeParser = this.getTypeParser();
    const returnType = typeNode ? typeParser.parse(typeNode) : null;

    const ast = Ast.createProperty(name)
      .setSyntaxKind(syntaxKind)
      .addReturn(returnType)
      .setParentContext(parentContextAst);

    if (isStatic) {
      ast.setIsStatic();
    } else {
      ast.setIsInstance();
    }

    this.saveGlobalMember(ast);
  }

  protected parseTypeParameters(classOrInterfaceDeclaration: ClassDeclaration | InterfaceDeclaration): string {
    const typeParameters = classOrInterfaceDeclaration.getTypeParameters();
    const typeParser = this.getTypeParser();
    const parentTypeParameters = typeParser.getResolvedTypeParameters(typeParameters);
    return parentTypeParameters;
  }

  /**
   * @param declaration
   * @returns
   */
  protected getInheritanceSources(declaration: ClassDeclaration | InterfaceDeclaration): string[] {
    const inheritanceSources: string[] = [];

    const knownSources = this.getKnownInheritanceSources(declaration);
    for (const source of knownSources) {
      inheritanceSources.push(source);
    }

    let expressionsWithTypeArguments = declaration.getExtends();
    if (expressionsWithTypeArguments) {
      if (!Array.isArray(expressionsWithTypeArguments)) {
        expressionsWithTypeArguments = [expressionsWithTypeArguments];
      }

      const parsedSources = this.parseExpressionWithTypeArguments(expressionsWithTypeArguments);
      for (const source of parsedSources) {
        inheritanceSources.push(source);
      }
    }

    return inheritanceSources;
  }

  /**
   * @summary Extract inheritance sources from `ExpressionsWithTypeArguments` nodes.
   * @param expressionsWithTypeArguments The node to extract inheritance sources from.
   * @returns An array of inheritance sources.
   */
  protected parseExpressionWithTypeArguments(expressionsWithTypeArguments: ExpressionWithTypeArguments[]): string[] {
    const inheritanceSources: string[] = [];

    for (const node of expressionsWithTypeArguments) {
      const expression = node.getExpression();
      const resolvedExpression = this.resolveExpression(expression);
      const expressionName = resolvedExpression.getLiteral();
      if (expressionName) {
        inheritanceSources.push(expressionName);
      }
    }

    return inheritanceSources;
  }

  /**
   * @summary Retrieves the known inheritance sources for a given interface or class declaration.
   * @param declaration - The interface or class declaration to analyze.
   * @returns An array of strings representing the known inheritance sources.
   */
  protected getKnownInheritanceSources(declaration: InterfaceDeclaration | ClassDeclaration) {
    const inheritanceSources: string[] = [];

    let name: string | null = null;
    if (Node.isInterfaceDeclaration(declaration)) {
      const realInterfaceName = declaration.getName();
      const effectiveInterfaceName = this.getEffectiveInterfaceName(realInterfaceName, declaration);
      if (effectiveInterfaceName) {
        name = effectiveInterfaceName;
      }
    } else {
      const nameNode = declaration.getNameNode();
      if (nameNode) {
        name = nameNode.getText();
      }
    }

    if (name) {
      const foundSources = Inheritance.findSource(name);
      if (Array.isArray(foundSources)) {
        for (const source of foundSources) {
          inheritanceSources.push(source);
        }
      }
    }

    return inheritanceSources;
  }

  protected parseClassConstructors(classDeclaration: ClassDeclaration, parentContextAst: Ast): void {
    for (const constructorDeclaration of classDeclaration.getConstructors()) {
      this.parseConstructorDeclaration(constructorDeclaration, parentContextAst);
    }
  }

  protected parseModuleInterfaces(moduleDeclaration: ModuleDeclaration, parentContextAst: Ast, previouslyParsed: PreviouslyParsed): void {
    for (const declaration of moduleDeclaration.getInterfaces()) {
      if (previouslyParsed.has(declaration)) continue;

      this.parseInterface(declaration, parentContextAst);

      previouslyParsed.add(declaration);
    }
  }

  protected parseConstructSignature(constructSignature: ConstructSignatureDeclaration, parentContextAst?: Ast): void {
    const params = constructSignature.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);
    const returnType = this.collectReturns(constructSignature);
    const typeParameters = this.collectTypeParameters(constructSignature);

    const ast = Ast.createNewableConstructor()
      .setSyntaxKind(SyntaxKind.ConstructSignature)
      .setParameters(parsedParams)
      .setReturns(returnType)
      .setTypeParameters(typeParameters);

    if (parentContextAst) {
      ast.setParentContext(parentContextAst);
    }

    this.saveGlobalMember(ast);
  }

  protected parseCallSignatures(interfaceDeclaration: InterfaceDeclaration, parentContextAst: Ast): void {
    Assertions.assertInterfaceLikeDeclaration(interfaceDeclaration);

    const callSignatures = interfaceDeclaration.getCallSignatures();
    for (const callSignature of callSignatures) {
      this.parseCallSignature(callSignature, parentContextAst);
    }
  }

  protected parseCallSignature(callSignature: CallSignatureDeclaration, parentContextAst: Ast): void {
    Assertions.assertCallSignature(callSignature);

    const name = parentContextAst.joinAncestry();
    const params = callSignature.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);
    const returnType = this.collectReturns(callSignature);
    const typeParameters = this.collectTypeParameters(callSignature);

    const ast = Ast.createConstructorFunction()
      .setName(name)
      .setSyntaxKind(SyntaxKind.CallSignature)
      .setParameters(parsedParams)
      .setReturns(returnType)
      .setTypeParameters(typeParameters)
      .setParentContext(parentContextAst);

    this.saveGlobalMember(ast);
  }

  protected parseConstructorDeclaration(declaration: ConstructorDeclaration, parentContextAst: Ast): void {
    Assertions.assertConstructorDeclaration(declaration);

    const params = declaration.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);
    const returnType = this.collectReturns(declaration);
    const typeParameters = this.collectTypeParameters(declaration);

    const ast = Ast.createNewableConstructor()
      .setSyntaxKind(SyntaxKind.Constructor)
      .setParameters(parsedParams)
      .setReturns(returnType)
      .setTypeParameters(typeParameters)
      .setParentContext(parentContextAst);

    this.saveGlobalMember(ast);
  }

  protected parseProperties(interfaceDeclaration: InterfaceDeclaration, parentContextAst: Ast): void {
    Assertions.assertInterfaceLikeDeclaration(interfaceDeclaration);

    const properties = interfaceDeclaration.getProperties();
    for (const propertySignature of properties) {
      this.parseProperty(propertySignature, parentContextAst);
    }
  }

  protected parseProperty(property: PropertySignature, parentContextAst: Ast): void {
    const typeNode = property.getTypeNode();

    const name = property.getName();
    const isOptional = property.getQuestionTokenNode() !== undefined;
    const isStatic = parentContextAst.getIsStatic();
    const typeParser = this.getTypeParser();
    const returnType = typeParser.parse(typeNode);

    const ast = Ast.createProperty(name)
      .addReturn(returnType)
      .setParentContext(parentContextAst)
      .setIsOptionalParam(isOptional);

    if (isStatic) {
      ast.setIsStatic();
    } else {
      ast.setIsInstance();
    }

    this.saveGlobalMember(ast);
  }

  protected parseMethods(interfaceDeclaration: InterfaceDeclaration, parentContextAst: Ast): void {
    Assertions.assertInterfaceLikeDeclaration(interfaceDeclaration);

    const methods = interfaceDeclaration.getMethods();
    for (const method of methods) {
      this.parseMethod(method, parentContextAst);
    }
  }

  protected parseMethod(method: MethodSignature, parentContextAst: Ast): void {
    Assertions.assertFunctionType(method);

    const name = method.getName();
    const syntaxKind = method.getKind();
    const params = method.getParameters();
    const typeParser = this.getTypeParser();
    const parsedParams = typeParser.getResolvedParameters(params);
    const returnType = this.collectReturns(method);
    const typeParameters = this.collectTypeParameters(method);
    const isStatic = method.getQuestionTokenNode() !== undefined;

    const ast = Ast.createMethod(name)
      .setSyntaxKind(syntaxKind)
      .setParameters(parsedParams)
      .setReturns(returnType)
      .setTypeParameters(typeParameters)
      .setParentContext(parentContextAst);

    if (isStatic) {
      ast.setIsStatic();
    } else {
      ast.setIsInstance();
    }

    this.saveGlobalMember(ast);
  }

  protected parseParameters(parameters: ParameterDeclaration[]): Ast[] {
    Assertions.assertParameters(parameters);

    const astArray: Ast[] = [];
    for (const parameter of parameters) {
      const parsedParameter = this.parseParameter(parameter);
      astArray.push(parsedParameter);
    }

    return astArray;
  }

  protected parseParameter(parameter: ParameterDeclaration) {
    Assertions.assertParameter(parameter);

    const typeNode = parameter.getTypeNode();
    const name = parameter.getName();
    const typeParser = this.getTypeParser();
    const returnType = typeParser.parse(typeNode);

    const ast = Ast.createRequiredParameter(name)
      .setSyntaxKind(SyntaxKind.Parameter)
      .addReturn(returnType);

    const meta = this.getMetaFromNode(parameter);
    if (meta !== undefined) {
      const isOptional = meta.isOptional ?? false;
      const isRest = meta.isRest ?? false;
      ast.setIsOptionalParam(isOptional).setIsRestParam(isRest);
    }

    return ast;
  }

  protected createUndefinedType(): Ast {
    const ast = Ast.createType().setLiteral("undefined").setSyntaxKind(SyntaxKind.UndefinedKeyword);
    return ast;
  }

  protected collectReturns(declaration: MemberTypes): string | null {
    Assertions.assertMemberType(declaration);

    const node = declaration.getReturnTypeNode();
    let returnType: string | null = null;

    if (node !== undefined) {
      const typeParser = this.getTypeParser();
      returnType = typeParser.parse(node);
    }

    return returnType;
  }

  protected collectTypeParameters(declaration: MemberTypes): string {
    Assertions.assertMemberType(declaration);

    const typeParameters = declaration.getTypeParameters();
    const typeParser = this.getTypeParser();
    const parameters = typeParser.getResolvedTypeParameters(typeParameters);

    return parameters;
  }

  protected getMetaFromNode(param: Node): { isOptional?: boolean; isRest?: boolean } | undefined {
    if (param instanceof ParameterDeclaration) {
      return { isOptional: param.isOptional(), isRest: param.isRestParameter() };
    }

    return;
  }

  public resolveType(node: Node): string | null {
    const typeParser = this.getTypeParser();
    const parsed = typeParser.parse(node);
    return parsed;
  }

  protected resolveExpression(node: LeftHandSideExpression): Ast {
    Assertions.assertLeftHandSideExpression(node);
    return Ast.createType().setSyntaxKind(node.getKind()).setLiteral(node.getText());
  }

  protected getParameter(node: ParameterDeclaration): Ast {
    Assertions.assertParameter(node);
    return this.parseParameter(node);
  }

  protected createAstForDefaultType(node: Node): Ast {
    Assertions.assertNode(node);

    return Ast.createType().setSyntaxKind(node.getKind())
      .setLiteral(node.isKind(SyntaxKind.Identifier) ? node.getText() : undefined);
  }

  protected getTypeParser(): TypeParser {
    return new TypeParser(this.ENABLE_VERBOSE_TYPES);
  }
}
