// The goal of this script is to collect all of the built-in objects, properties, methods,
// and events from the TypeScript declaration files and ouput them in a SIMPLE format.
// To that end, unparsed type information is included, but the parsed types are simplified
// to the closest primitive.
//
// NOTE: Use only _for_ loops instead of spread operators. Spreading values from a large
// array (e.g. `b.push(...oneBillionValues)`) will cause a stack overflow due to the size
// of the files being parsed. To keep things simple, _for_ loops are also used instead of
// maps, flatMaps, and reducers. Don't try to "fix" this with functional style methods.
//
// TODO: Verify that all children are hoisted up to the root
// TODO: Remove interfaces that are just types, and not globals
// TODO: Include type information as a string (untouched)
// TODO: Reduce parsed types to their most basic primitive form
// TODO: Move data back into the ast class to make minification easier
// TODO: Minify ASTs by removing unneceesary properties

import {
  ArrayTypeNode,
  type BindingName,
  CallSignatureDeclaration,
  ClassDeclaration,
  ConditionalTypeNode,
  ConstructorDeclaration,
  ConstructorTypeNode,
  ConstructSignatureDeclaration,
  ExpressionWithTypeArguments,
  FunctionDeclaration,
  FunctionTypeNode,
  Identifier,
  IndexedAccessTypeNode,
  IndexSignatureDeclaration,
  InterfaceDeclaration,
  IntersectionTypeNode,
  LeftHandSideExpression,
  LiteralTypeNode,
  MappedTypeNode,
  MethodDeclaration,
  MethodSignature,
  ModuleDeclaration,
  Node,
  ParameterDeclaration,
  ParenthesizedTypeNode,
  Project,
  PropertySignature,
  RestTypeNode,
  SourceFile,
  SyntaxKind,
  TemplateLiteralTypeNode,
  ThisTypeNode,
  ts,
  TupleTypeNode,
  type TypeElementTypes,
  TypeLiteralNode,
  TypeNode,
  TypeOperatorTypeNode,
  TypeParameterDeclaration,
  TypePredicateNode,
  TypeQueryNode,
  TypeReferenceNode,
  UnionTypeNode,
  VariableDeclaration,
} from "ts-morph";

export { Project } from "ts-morph";

export type Ast = {
  id: string;
  kind: string;
  name: string;
  generics: Ast[];
  meta: string[];
  params: Ast[];
  returns: Ast[];
  text: string | null;
  extends: string[];
  children: Ast[];
};

type DeclarationTypes =
  | ClassDeclaration
  | FunctionDeclaration
  | InterfaceDeclaration
  | ModuleDeclaration
  | VariableDeclaration;

type MemberTypes =
  | CallSignatureDeclaration
  | ConstructSignatureDeclaration
  | ConstructorDeclaration
  | FunctionDeclaration
  | MethodDeclaration
  | MethodSignature;

export class Collector {
  private sourceFiles: SourceFile[];
  private idCounter = 0;

  public constructor(private project: Project, paths: string[]) {
    this.project.addSourceFilesAtPaths(paths);
    this.sourceFiles = this.project.getSourceFiles();
  }

  public collectGlobals(): Record<string, Ast> {
    const groupedAsts: Record<string, Ast> = {};
    const builtins = this.processTopLevelDeclarations();

    for (const builtin of builtins) {
      if (builtin.name === "__EMPTY__") {
        if (builtin.children.length) {
          for (const member of builtin.children) {
            groupedAsts[member.name] = member;
          }
        }
      } else {
        if (!groupedAsts[builtin.name]) {
          groupedAsts[builtin.name] = builtin;
        }
        // Flatten the result by hoisting child nodes to the top level
        for (const member of builtin.children) {
          groupedAsts[member.name] = member;
        }
        // Since the children are now in the root, clear the children array.
        groupedAsts[builtin.name].children = [];
      }
    }
    return groupedAsts;
  }

  private emptyAst(children: Ast[] = []): Ast {
    return this.createAst("__EMPTY__", "__EMPTY__", {
      children,
    });
  }

  private processTopLevelDeclarations(): Ast[] {
    const builtins: Ast[] = [];
    const previouslyParsed: Set<DeclarationTypes> = new Set();

    for (const file of this.sourceFiles) {
      for (const declaration of file.getVariableDeclarations()) {
        if (previouslyParsed.has(declaration)) continue;
        const processed = this.processVariable(declaration);
        for (const builtin of processed) {
          builtins.push(builtin);
        }
        previouslyParsed.add(declaration);
      }

      for (const declaration of file.getFunctions()) {
        if (previouslyParsed.has(declaration)) continue;
        const processed = this.processFunction(declaration);
        builtins.push(processed);
        previouslyParsed.add(declaration);
      }

      for (const declaration of file.getModules()) {
        if (previouslyParsed.has(declaration)) continue;
        const processed = this.processModule(declaration);
        builtins.push(processed);
        previouslyParsed.add(declaration);
      }

      for (const declaration of file.getClasses()) {
        if (previouslyParsed.has(declaration)) continue;
        const processed = this.processClass(declaration);
        builtins.push(processed);
        previouslyParsed.add(declaration);
      }
    }
    return builtins;
  }

  private processVariable(declaration: VariableDeclaration, parentName = ""): Ast[] {
    const nameNode = declaration.getNameNode();
    const typeNode = declaration.getTypeNode();

    if (typeNode === undefined || ts.isTokenKind(typeNode.getKind())) {
      return [this.processBasicVariable(nameNode, typeNode, parentName)];
    }

    // TODO: Make this faster by...
    // 1) pre-caching unparsed initerfaces and
    // 2) using a map to look them up by name
    // private collectInterfaces(bindingNameNode: BindingName, typeNode?: TypeNode, parentName = ""): Ast[] {
    const builtins: Ast[] = [];
    const bindingName = nameNode.getText();
    const typeName = typeNode ? typeNode.getText() : null;

    // Look for interfaces that match the binding name or type name
    for (const sourceFile of this.sourceFiles) {
      for (const interfaceDeclaration of sourceFile.getInterfaces()) {
        // Don't format the name because processInterface needs it separately to do its checks.
        if (interfaceDeclaration.getName() === bindingName) {
          const processed = this.processInterface(interfaceDeclaration, bindingName, typeName, parentName);
          builtins.push(processed);
        } else if (typeName && interfaceDeclaration.getName() === typeName) {
          const processed = this.processInterface(interfaceDeclaration, bindingName, typeName, parentName);
          builtins.push(processed);
        }
      }
    }

    if (builtins.length === 0) {
      return [this.processBasicVariable(nameNode, typeNode, parentName)];
    }

    return builtins;
  }

  private processBasicVariable(nameNode: BindingName, typeNode: TypeNode | undefined, parentName = "") {
    const name = nameNode.getText();
    return this.createAst(this.formatName(name, parentName), "VariableDeclaration", {
      returns: [typeNode ? this.resolveType(typeNode) : this.createUndefinedKeywordAst()],
    });
  }

  private createUndefinedKeywordAst() {
    return this.createAst(this.getNextId(), "UndefinedKeyword", {
      text: "undefined",
    });
  }

  private processFunction(declaration: FunctionDeclaration, parentName = ""): Ast {
    return this.processMethod(declaration, parentName);
  }

  private processClass(declaration: ClassDeclaration, parentName = ""): Ast {
    const nameNode = declaration.getNameNode();
    if (!nameNode) return this.emptyAst(); // Classes can be anonymous, but top-level classes should always have a name.

    const classNameWithAncestry = this.formatName(nameNode.getText(), parentName);
    const extendsExpression = declaration.getExtends();
    const extendsName = extendsExpression ? [extendsExpression.getText()] : [];

    const builtin = this.createAst(classNameWithAncestry, declaration.getKindName(), { extends: extendsName });

    for (const ctor of declaration.getConstructors()) {
      const processed = this.processConstructor(ctor, classNameWithAncestry);
      builtin.children.push(processed);
    }

    for (const typeParameter of declaration.getTypeParameters()) {
      builtin.generics.push(this.handleTypeParameter(typeParameter));
    }

    for (const prop of this.processProperties(declaration, classNameWithAncestry)) {
      builtin.children.push(prop);
    }

    for (const method of this.processMethods(declaration, classNameWithAncestry)) {
      builtin.children.push(method);
    }

    return builtin;
  }

  private processModule(moduleDeclaration: ModuleDeclaration, parentName = ""): Ast {
    const previouslyParsed: Set<DeclarationTypes> = new Set();
    const moduleNameWithAncestry = this.formatName(moduleDeclaration.getName(), parentName);
    const ast = this.createAst(moduleNameWithAncestry, moduleDeclaration.getKindName(), {});

    for (const declaration of moduleDeclaration.getVariableDeclarations()) {
      if (previouslyParsed.has(declaration)) continue;
      const processed = this.processVariable(declaration, moduleNameWithAncestry);
      for (const builtin of processed) {
        ast.children.push(builtin);
      }
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getFunctions()) {
      if (previouslyParsed.has(declaration)) continue;
      const processed = this.processFunction(declaration, moduleNameWithAncestry);
      ast.children.push(processed);
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getModules()) {
      if (previouslyParsed.has(declaration)) continue;
      const processed = this.processModule(declaration, moduleNameWithAncestry);
      ast.children.push(processed);
      previouslyParsed.add(declaration);
    }

    for (const declaration of moduleDeclaration.getClasses()) {
      if (previouslyParsed.has(declaration)) continue;
      const processed = this.processClass(declaration, moduleNameWithAncestry);
      ast.children.push(processed);
      previouslyParsed.add(declaration);
    }

    return ast;
  }

  private isStaticInterface(interfaceName: string, bindingName: string, typeName: string | null) {
    return typeName !== null && interfaceName === typeName && interfaceName === bindingName;
  }

  private isInstanceInterface(interfaceName: string, bindingName: string) {
    return interfaceName === bindingName;
  }

  private isConstructorInterface(interfaceName: string, typeName: string | null) {
    return typeName !== null && interfaceName === typeName;
  }

  private processInterface(
    declaration: InterfaceDeclaration,
    bindingName: string,
    typeName: string | null,
    parentName = "",
  ): Ast {
    const interfaceName = declaration.getName();
    const bindingNameWithAncestry = this.formatName(bindingName, parentName);

    if (this.isStaticInterface(interfaceName, bindingName, typeName)) {
      return this.processStaticInterface(declaration, bindingNameWithAncestry);
    }

    if (this.isInstanceInterface(interfaceName, bindingName)) {
      return this.processInstanceInterface(interfaceName, bindingNameWithAncestry, declaration);
    }

    if (this.isConstructorInterface(interfaceName, typeName)) {
      return this.processConstructorInterface(declaration, bindingNameWithAncestry);
    }

    return this.emptyAst();
  }

  private processStaticInterface(
    interfaceDeclaration: InterfaceDeclaration,
    bindingNameWithAncestry: string,
  ): Ast {
    const builtin = this.createAst(bindingNameWithAncestry, "InterfaceDeclaration", {});

    const properties = this.processProperties(interfaceDeclaration, bindingNameWithAncestry);
    for (const property of properties) {
      builtin.children.push(property);
    }

    const methods = this.processMethods(interfaceDeclaration, bindingNameWithAncestry);
    for (const method of methods) {
      builtin.children.push(method);
    }

    return builtin;
  }

  private processInstanceInterface(
    interfaceName: string,
    bindingNameWithAncestry: string,
    declaration: InterfaceDeclaration,
  ): Ast {
    const formattedName = this.formatInstanceName(interfaceName, bindingNameWithAncestry);
    const builtin = this.createAst(bindingNameWithAncestry, "InterfaceDeclaration", {});

    const extendsList = declaration.getExtends();
    for (const extendedType of extendsList) {
      builtin.extends.push(extendedType.getText());
    }

    const constructSignatures = declaration.getConstructSignatures();
    const processedConstructSignatures = this.processConstructSignatures(constructSignatures, formattedName);
    for (const constructSignature of processedConstructSignatures) {
      builtin.children.push(constructSignature);
    }

    const callSignatures = declaration.getCallSignatures();
    const processedCallSignatures = this.processCallSignatures(callSignatures, formattedName);
    for (const callSignature of processedCallSignatures) {
      builtin.children.push(callSignature);
    }

    const properties = this.processProperties(declaration, interfaceName);
    for (const property of properties) {
      builtin.children.push(property);
    }

    const methods = this.processMethods(declaration, bindingNameWithAncestry);
    for (const method of methods) {
      builtin.children.push(method);
    }

    return builtin;
  }

  private processConstructorInterface(
    interfaceDeclaration: InterfaceDeclaration,
    bindingNameWithAncestry: string,
  ): Ast {
    const builtin = this.createAst(bindingNameWithAncestry, interfaceDeclaration.getKindName(), {});

    for (const extendsExpression of interfaceDeclaration.getExtends()) {
      builtin.extends.push(extendsExpression.getText());
    }

    const constructSignatures = interfaceDeclaration.getConstructSignatures();
    const processedConstructSignatures = this.processConstructSignatures(constructSignatures, bindingNameWithAncestry);
    for (const constructSignature of processedConstructSignatures) {
      builtin.children.push(constructSignature);
    }

    const callSignatures = interfaceDeclaration.getCallSignatures();
    const processedCallSignatures = this.processCallSignatures(callSignatures, bindingNameWithAncestry);
    for (const callSignature of processedCallSignatures) {
      builtin.children.push(callSignature);
    }

    const processedProperties = this.processProperties(interfaceDeclaration, bindingNameWithAncestry);
    for (const property of processedProperties) {
      builtin.children.push(property);
    }

    const processedMethods = this.processMethods(interfaceDeclaration, bindingNameWithAncestry);
    for (const method of processedMethods) {
      builtin.children.push(method);
    }

    return builtin;
  }

  private processConstructSignatures(constructSignatures: ConstructSignatureDeclaration[], parentName: string): Ast[] {
    const astArray: Ast[] = [];

    for (const constructSignature of constructSignatures) {
      const ast = this.createAst(`${parentName}.new`, constructSignature.getKindName(), {
        params: this.collectParams(constructSignature),
        returns: this.collectReturns(constructSignature),
        generics: this.collectGenerics(constructSignature),
      });

      astArray.push(ast);
    }

    return astArray;
  }

  private processCallSignatures(callSignatures: CallSignatureDeclaration[], parentName: string): Ast[] {
    const astArray: Ast[] = [];
    for (const callSignature of callSignatures) {
      const ast = this.createAst(parentName, callSignature.getKindName(), {
        params: this.collectParams(callSignature),
        returns: this.collectReturns(callSignature),
        generics: this.collectGenerics(callSignature),
      });
      astArray.push(ast);
    }
    return astArray;
  }

  private processConstructor(ctor: ConstructorDeclaration, parentName: string): Ast {
    return this.createAst(parentName, ctor.getKindName(), {
      params: this.collectParams(ctor),
      returns: this.collectReturns(ctor),
      generics: this.collectGenerics(ctor),
    });
  }

  private processProperties(
    interfaceOrClassDeclaration: InterfaceDeclaration | ClassDeclaration,
    parentName: string,
  ): Ast[] {
    const astArray: Ast[] = [];

    const properties = interfaceOrClassDeclaration.getProperties();
    for (const property of properties) {
      const typeNode = property.getTypeNode();
      const formattedName = this.formatName(property.getName(), parentName);
      const ast = this.createAst(formattedName, property.getKindName(), {
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });

      for (const modifier of property.getModifiers()) {
        ast.meta.push(modifier.getText());
      }

      astArray.push(ast);
    }

    return astArray;
  }

  private processMethods(
    interfaceOrClassDeclaration: InterfaceDeclaration | ClassDeclaration,
    parentName: string,
  ): Ast[] {
    const astArray: Ast[] = [];
    const methods = interfaceOrClassDeclaration.getMethods();
    for (const method of methods) {
      const processedMethod = this.processMethod(method, parentName);
      astArray.push(processedMethod);
    }

    return astArray;
  }

  private processMethod(node: FunctionDeclaration | MethodDeclaration | MethodSignature, parentName: string): Ast {
    const name = node.getName() ?? this.getNextId();
    return this.createAst(this.formatName(name, parentName), node.getKindName(), {
      params: this.collectParams(node),
      returns: this.collectReturns(node),
      generics: this.collectGenerics(node),
    });
  }

  private collectParams(ctor: MemberTypes): Ast[] {
    const astArray: Ast[] = [];

    const parameters = ctor.getParameters();
    for (const parameter of parameters) {
      const processedParameter = this.handleParameter(parameter);
      astArray.push(processedParameter);
    }

    return astArray;
  }

  private handleParameter(parameter: ParameterDeclaration) {
    const typeNode = parameter.getTypeNode();
    return this.createAst(parameter.getName(), parameter.getKindName(), {
      returns: typeNode ? [this.resolveType(typeNode)] : [],
      meta: this.getMeta(parameter),
    });
  }

  private collectReturns(ctor: MemberTypes): Ast[] {
    const node = ctor.getReturnTypeNode();
    return node ? [this.resolveType(node)] : [];
  }

  private collectGenerics(ctor: MemberTypes): Ast[] {
    const astArray: Ast[] = [];

    const typeParameters = ctor.getTypeParameters();
    for (const typeParameter of typeParameters) {
      const processedTypeParameter = this.handleTypeParameter(typeParameter);
      astArray.push(processedTypeParameter);
    }

    return astArray;
  }

  private formatName(name: string, parentName = "") {
    const prefix = this.stripDuplicatePrototypeFromParentName(name, parentName);
    return this.isSymbol(name) ? `${prefix}${name}` : parentName ? `${prefix}.${name}` : name;
  }

  private stripDuplicatePrototypeFromParentName(name: string, parentName = "") {
    return (name === "prototype" && parentName.endsWith(".prototype")) ? parentName.slice(0, -10) : parentName;
  }

  private formatInstanceName(name: string, parentName = "") {
    if (!parentName) return name;
    const prefix = this.stripDuplicatePrototypeFromParentName(name, parentName);
    return this.isSymbol(name) ? `${prefix}.prototype${name}` : `${prefix}.prototype.${name}`;
  }

  private isSymbol(name: string) {
    return name.startsWith("[") && name.endsWith("]");
  }

  private getAstDefaults() {
    return {
      id: "",
      kind: "Unknown",
      name: "",
      generics: [],
      meta: [],
      params: [],
      returns: [],
      text: null,
      children: [],
      extends: [],
    };
  }

  private createAst(id: string, kind: string, ast: Omit<Partial<Ast>, "id" | "name" | "kind"> = {}): Ast {
    return Object.assign({}, this.getAstDefaults(), ast, { id, kind, name: id });
  }

  private getMeta(param: ParameterDeclaration): string[] {
    const meta: string[] = [];
    const modifiers = param.getModifiers();
    for (const modifier of modifiers) {
      meta.push(modifier.getText());
    }

    if (param.isOptional()) meta.push("optional");
    if (param.isRestParameter()) meta.push("rest");

    return meta;
  }

  public resolveType(node: TypeNode): Ast {
    switch (node.getKind()) {
      case SyntaxKind.ArrayType:
        return this.handleNodeOrDefault(node, SyntaxKind.ArrayType, this.handleArrayType);
      case SyntaxKind.ConditionalType:
        return this.handleNodeOrDefault(node, SyntaxKind.ConditionalType, this.handleConditionalType);
      case SyntaxKind.ConstructorType:
        return this.handleNodeOrDefault(node, SyntaxKind.ConstructorType, this.handleConstructorType);
      case SyntaxKind.ExpressionWithTypeArguments:
        return this.handleNodeOrDefault(
          node,
          SyntaxKind.ExpressionWithTypeArguments,
          this.handleExpressionWithTypeArguments,
        );
      case SyntaxKind.FunctionType:
        return this.handleNodeOrDefault(node, SyntaxKind.FunctionType, this.handleFunctionType);
      case SyntaxKind.Identifier:
        return this.handleNodeOrDefault(node, SyntaxKind.Identifier, this.handleIdentifier);
      case SyntaxKind.IndexSignature:
        return this.handleNodeOrDefault(node, SyntaxKind.IndexSignature, this.handleIndexSignature);
      case SyntaxKind.IndexedAccessType:
        return this.handleNodeOrDefault(node, SyntaxKind.IndexedAccessType, this.handleIndexedAccessType);
      case SyntaxKind.IntersectionType:
        return this.handleNodeOrDefault(node, SyntaxKind.IntersectionType, this.handleIntersectionType);
      case SyntaxKind.LiteralType:
      case SyntaxKind.StringLiteral:
        return this.handleNodeOrDefault(node, SyntaxKind.LiteralType, this.handleLiteralType);
      case SyntaxKind.MappedType:
        return this.handleNodeOrDefault(node, SyntaxKind.MappedType, this.handleMappedType);
      case SyntaxKind.MethodSignature:
        return this.handleNodeOrDefault(node, SyntaxKind.MethodSignature, this.handleMethodSignature);
      case SyntaxKind.Parameter:
        return this.handleNodeOrDefault(node, SyntaxKind.Parameter, this.handleParameter);
      case SyntaxKind.ParenthesizedType:
        return this.handleNodeOrDefault(node, SyntaxKind.ParenthesizedType, this.handleParenthesizedType);
      case SyntaxKind.PropertySignature:
        return this.handleNodeOrDefault(node, SyntaxKind.PropertySignature, this.handlePropertySignature);
      case SyntaxKind.RestType:
        return this.handleNodeOrDefault(node, SyntaxKind.RestType, this.handleRestType);
      case SyntaxKind.TemplateLiteralType:
        return this.handleNodeOrDefault(node, SyntaxKind.TemplateLiteralType, this.handleTemplateLiteralType);
      case SyntaxKind.ThisType:
        return this.handleNodeOrDefault(node, SyntaxKind.ThisType, this.handleThisType);
      case SyntaxKind.TupleType:
        return this.handleNodeOrDefault(node, SyntaxKind.TupleType, this.handleTupleType);
      case SyntaxKind.TypeLiteral:
        return this.handleNodeOrDefault(node, SyntaxKind.TypeLiteral, this.handleTypeLiteral);
      case SyntaxKind.TypeOperator:
        return this.handleNodeOrDefault(node, SyntaxKind.TypeOperator, this.handleTypeOperator);
      case SyntaxKind.TypeParameter:
        return this.handleNodeOrDefault(node, SyntaxKind.TypeParameter, this.handleTypeParameter);
      case SyntaxKind.TypePredicate:
        return this.handleNodeOrDefault(node, SyntaxKind.TypePredicate, this.handleTypePredicate);
      case SyntaxKind.TypeQuery:
        return this.handleNodeOrDefault(node, SyntaxKind.TypeQuery, this.handleTypeQuery);
      case SyntaxKind.TypeReference:
        return this.handleNodeOrDefault(node, SyntaxKind.TypeReference, this.handleTypeReference);
      case SyntaxKind.UnionType:
        return this.handleNodeOrDefault(node, SyntaxKind.UnionType, this.handleUnionType);
      default: {
        if (ts.isTokenKind(node.getKind())) {
          return this.processToken(node);
        }

        return this.handleDefault(node);
      }
    }
  }

  private handleNodeOrDefault<T extends Node>(node: Node, kind: SyntaxKind, handler: (node: T) => Ast): Ast {
    const nodeOfKind = node.asKind(kind);
    return nodeOfKind ? handler.bind(this)(nodeOfKind as T) : this.handleDefault(node);
  }

  private processToken(node: TypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleUnionType(node: UnionTypeNode): Ast {
    const ast = this.createAst(this.getNextId(), node.getKindName(), {});

    const typeNodes = node.getTypeNodes();
    for (const typeNode of typeNodes) {
      const resolvedType = this.resolveType(typeNode);

      if (Array.isArray(resolvedType)) {
        for (const item of resolvedType) {
          ast.returns.push(item);
        }
      } else {
        ast.returns.push(resolvedType);
      }
    }

    return ast;
  }

  private handleArrayType(node: ArrayTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: [this.resolveType(node.getElementTypeNode())],
    });
  }

  private handleTypeReference(node: TypeReferenceNode): Ast {
    return this.createAst(node.getTypeName().getText(), node.getKindName(), {
      returns: node.getTypeArguments().map((t) => this.resolveType(t)),
    });
  }

  private handleIdentifier(node: Identifier): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleLiteralType(node: LiteralTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleFunctionType(node: FunctionTypeNode): Ast {
    const returnTypeNode = node.getReturnTypeNode();

    const ast = this.createAst(this.getNextId(), node.getKindName(), {
      returns: returnTypeNode ? [this.resolveType(returnTypeNode)] : [],
    });

    const parameters = node.getParameters();
    for (const parameter of parameters) {
      ast.params.push(this.getParameter(parameter));
    }

    const typeParameters = node.getTypeParameters();
    for (const typeParameter of typeParameters) {
      ast.generics.push(this.handleTypeParameter(typeParameter));
    }

    return ast;
  }

  private handleTypeLiteral(node: TypeLiteralNode): Ast {
    const ast = this.createAst(this.getNextId(), node.getKindName(), {});

    const typeMembers = node.getMembers();
    for (const member of typeMembers) {
      ast.returns.push(this.resolveMember(member));
    }

    return ast;
  }

  private resolveMember(node: TypeElementTypes): Ast {
    switch (node.getKind()) {
      case SyntaxKind.PropertySignature:
        return this.handleNodeOrDefault(node, SyntaxKind.PropertySignature, this.handlePropertySignature);
      case SyntaxKind.MethodSignature:
        return this.handleNodeOrDefault(node, SyntaxKind.MethodSignature, this.handleMethodSignature);
      case SyntaxKind.IndexSignature:
        return this.handleNodeOrDefault(node, SyntaxKind.IndexSignature, this.handleIndexSignature);
      default:
        return this.handleDefault(node);
    }
  }

  private handleTypeParameter(typeParameter: TypeParameterDeclaration): Ast {
    const constraint = typeParameter.getConstraint();
    const defaultType = typeParameter.getDefault();

    const modifiers: string[] = [];
    const typeModifiers = typeParameter.getModifiers();
    for (const modifier of typeModifiers) {
      modifiers.push(modifier.getText());
    }

    return this.createAst(
      typeParameter.getName(),
      typeParameter.getKindName(),
      constraint
        ? {
          meta: modifiers,
          text: typeParameter.getText(),
          returns: defaultType ? [this.resolveType(defaultType)] : [],
          generics: constraint ? [this.resolveType(constraint)] : [],
        }
        : {},
    );
  }

  private handleIntersectionType(node: IntersectionTypeNode): Ast {
    const resolvedTypes: Ast[] = [];

    const typeNodes = node.getTypeNodes();
    for (const typeNode of typeNodes) {
      const resolvedType = this.resolveType(typeNode);

      if (Array.isArray(resolvedType)) {
        for (const item of resolvedType) {
          resolvedTypes.push(item);
        }
      } else {
        resolvedTypes.push(resolvedType);
      }
    }

    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: resolvedTypes,
    });
  }

  private handleTypeOperator(node: TypeOperatorTypeNode): Ast {
    const operator = ts.tokenToString(node.getOperator());
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: [this.resolveType(node.getTypeNode())],
      meta: operator ? [operator] : [],
    });
  }

  private handleTupleType(node: TupleTypeNode): Ast {
    const resolvedElements: Ast[] = [];

    const elements = node.getElements();
    for (const element of elements) {
      const resolvedElement = this.resolveType(element);
      resolvedElements.push(resolvedElement);
    }

    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: resolvedElements,
    });
  }

  private handleRestType(node: RestTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      meta: ["rest"], // TODO: Get value, don't hardcode
      returns: [this.resolveType(node.getTypeNode())],
    });
  }

  private handleParenthesizedType(node: ParenthesizedTypeNode): Ast {
    return this.createAst(node.getText(), node.getKindName(), {
      returns: [this.resolveType(node.getTypeNode())],
    });
  }

  private handleIndexSignature(node: IndexSignatureDeclaration): Ast {
    return this.createAst(node.getKeyName(), node.getKindName(), {
      returns: [this.resolveType(node.getKeyTypeNode())],
    });
  }

  private handlePropertySignature(node: PropertySignature): Ast {
    return this.createAst(node.getName(), node.getKindName(), {
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: node.hasQuestionToken() ? ["optional"] : [],
    });
  }

  private handleMappedType(node: MappedTypeNode): Ast {
    const ast = this.createAst(this.getNextId(), node.getKindName(), {
      params: node.getTypeParameter() ? [this.handleTypeParameter(node.getTypeParameter()!)] : [],
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: [],
    });

    if (node.getQuestionToken()) ast.meta.push("optional");
    if (node.getReadonlyToken()) ast.meta.push("readonly");
    return ast;
  }

  private handleIndexedAccessType(node: IndexedAccessTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      params: [this.resolveType(node.getIndexTypeNode())],
      returns: [this.resolveType(node.getIndexTypeNode())],
    });
  }

  private handleMethodSignature(node: MethodSignature): Ast {
    const ast = this.createAst(node.getName(), node.getKindName(), {
      meta: node.hasQuestionToken() ? ["optional"] : [],
      returns: node.getReturnTypeNode() ? [this.resolveType(node.getReturnTypeNode()!)] : [],
    });

    const typeParameters = node.getTypeParameters();
    for (const typeParameter of typeParameters) {
      ast.generics.push(this.handleTypeParameter(typeParameter));
    }

    const parameters = node.getParameters();
    for (const parameter of parameters) {
      ast.params.push(this.getParameter(parameter));
    }

    return ast;
  }

  private handleExpressionWithTypeArguments(node: ExpressionWithTypeArguments): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      generics: node.getTypeArguments().map((arg) => this.resolveType(arg)),
      returns: node.getExpression() ? [this.resolveExpression(node.getExpression())] : [],
    });
  }

  // MAYBE: Handle each type of expression, e.g. Identifier, PropertyAccessExpression, etc.
  private resolveExpression(node: LeftHandSideExpression): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleThisType(node: ThisTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleConstructorType(node: ConstructorTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      params: node.getParameters().map((p) => this.getParameter(p)),
      returns: node.getReturnTypeNode() ? [this.resolveType(node.getReturnTypeNode()!)] : [],
    });
  }

  private handleTypePredicate(node: TypePredicateNode): Ast {
    return this.createAst(node.getParameterNameNode().getText(), node.getKindName(), {
      returns: node.getTypeNode() ? [this.resolveType(node.getTypeNode()!)] : [],
      meta: node.hasAssertsModifier() ? [node.getAssertsModifier()!.getText()] : [],
    });
  }

  private handleTypeQuery(node: TypeQueryNode): Ast {
    return this.createAst(node.getExprName().getText(), node.getKindName(), {});
  }

  private handleTemplateLiteralType(node: TemplateLiteralTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
    });
  }

  private handleConditionalType(node: ConditionalTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.getText(),
      params: [
        this.resolveType(node.getCheckType()),
        this.resolveType(node.getExtendsType()),
        this.resolveType(node.getTrueType()),
        this.resolveType(node.getFalseType()),
      ],
    });
  }

  private getParameter(node: ParameterDeclaration): Ast {
    return this.handleParameter(node);
  }

  private handleDefault(node: Node): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      text: node.isKind(SyntaxKind.Identifier) ? node.getText() : null,
    });
  }

  private getNextId() {
    return `_${++this.idCounter}`;
  }
}

if (import.meta.main) {
  const project = new Project({
    compilerOptions: { noLib: true },
  });

  const col = new Collector(project, [
    "./tslib/decorators.txt",
    "./tslib/decorators.legacy.txt",
    "./tslib/dom.generated.txt",
    "./tslib/es2015.symbol.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es5.txt",
    "./tslib/es2015.symbol.wellknown.txt",
    "./tslib/es2015.symbol.txt",
    "./tslib/es2015.reflect.txt",
    "./tslib/es2015.proxy.txt",
    "./tslib/es2015.promise.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es2015.generator.txt",
    "./tslib/es2015.core.txt",
    "./tslib/es2015.collection.txt",
    "./tslib/es2015.txt",
    "./tslib/es2016.array.include.txt",
    "./tslib/es2016.intl.txt",
    "./tslib/es2015.iterable.txt",
    "./tslib/es2016.txt",
    "./tslib/es2017.arraybuffer.txt",
    "./tslib/es2017.date.txt",
    "./tslib/es2017.intl.txt",
    "./tslib/es2017.object.txt",
    "./tslib/es2017.sharedmemory.txt",
    "./tslib/es2017.string.txt",
    "./tslib/es2017.typedarrays.txt",
    "./tslib/es2017.txt",
    "./tslib/es2018.asyncgenerator.txt",
    "./tslib/es2018.asynciterable.generated.txt",
    "./tslib/es2018.intl.txt",
    "./tslib/es2018.promise.txt",
    "./tslib/es2018.regexp.txt",
    "./tslib/es2018.txt",
    "./tslib/es2019.array.txt",
    "./tslib/es2019.intl.txt",
    "./tslib/es2019.object.txt",
    "./tslib/es2019.string.txt",
    "./tslib/es2019.symbol.txt",
    "./tslib/es2019.txt",
    "./tslib/es2020.bigint.txt",
    "./tslib/es2020.intl.txt",
    "./tslib/es2020.symbol.wellknown.txt",
    "./tslib/es2020.date.txt",
    "./tslib/es2020.number.txt",
    "./tslib/es2020.promise.txt",
    "./tslib/es2020.sharedmemory.txt",
    "./tslib/es2020.string.txt",
    "./tslib/es2020.txt",
    "./tslib/es2021.intl.txt",
    "./tslib/es2021.promise.txt",
    "./tslib/es2021.string.txt",
    "./tslib/es2021.weakref.txt",
    "./tslib/es2021.txt",
    "./tslib/es2022.array.txt",
    "./tslib/es2022.error.txt",
    "./tslib/es2022.intl.txt",
    "./tslib/es2022.object.txt",
    "./tslib/es2022.regexp.txt",
    "./tslib/es2022.string.txt",
    "./tslib/es2022.txt",
    "./tslib/es2023.array.txt",
    "./tslib/es2023.collection.txt",
    "./tslib/es2023.intl.txt",
    "./tslib/dom.asynciterable.generated.txt",
    "./tslib/dom.iterable.generated.txt",
    "./tslib/scripthost.txt",
    "./tslib/webworker.importscripts.txt",
    "./tslib/es2023.txt",
  ]);
  const globals = col.collectGlobals();
  console.log(JSON.stringify(globals, null, 2));
}
