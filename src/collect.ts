// TODO:
// - So that, I can finish refactoring `params` in returns and params

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

type Ast = {
  id: string;
  kind: string;
  name: string;
  generics: Ast[];
  meta: string[];
  params: Ast[];
  returns: Ast[];
  text: string | null;
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

class Collector {
  private sourceFiles: SourceFile[];
  private globals: Record<string, Ast[]> = {};
  private idCounter = 0;

  // Track processed declarations to prevent infinite recursion
  private processedDeclarations: Set<DeclarationTypes> = new Set();

  constructor(private project: Project, paths: string[]) {
    this.project.addSourceFilesAtPaths(paths);
    this.sourceFiles = this.project.getSourceFiles();
  }

  public collectGlobals() {
    this.processTopLevelDeclarations();
    return this.globals;
  }

  private saveGlobal(ast: Ast) {
    const name = ast.name;
    if (!this.globals[name]) this.globals[name] = [];
    this.globals[name].push(ast);
  }

  private processTopLevelDeclarations() {
    this.sourceFiles.forEach((file) => {
      file.getVariableDeclarations().forEach((declaration) => this.processVariable(declaration));
      file.getFunctions().forEach((declaration) => this.processFunction(declaration));
      file.getModules().forEach((declaration) => this.processModule(declaration));
      file.getClasses().forEach((declaration) => this.processClass(declaration));
    });
  }

  private processVariable(declaration: VariableDeclaration) {
    if (this.processedDeclarations.has(declaration)) return;
    this.processedDeclarations.add(declaration);
    this.collectInterfaces(declaration.getNameNode(), declaration.getTypeNode());
  }

  private processFunction(declaration: FunctionDeclaration) {
    return this.processMethod(declaration, "");
  }

  private processClass(declaration: ClassDeclaration) {
    const nameNode = declaration.getNameNode();
    if (!nameNode) return; // Classes can be anonymous, but top-level classes should always have a name.
    const className = nameNode.getText();

    this.processProperties(declaration, className);
    this.processMethods(declaration, className);
    this.processConstructors(declaration.getConstructors(), className);

    // TODO: Pull in extended methods
    // const extended = decl.getExtends();
    // const implemented = decl.getImplements();
    // const generics = decl.getTypeParameters().map((tp) => this.resolveTypeParameter(tp)), // Generics
  }

  private processModule(declaration: ModuleDeclaration) {
    declaration.getVariableDeclarations().forEach((v) => this.processVariable(v));
    declaration.getFunctions().forEach((f) => this.processFunction(f));
    declaration.getModules().forEach((m) => this.processModule(m));
    declaration.getClasses().forEach((c) => this.processClass(c));
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

  private collectInterfaces(bindingNameNode: BindingName, typeNode?: TypeNode) {
    const bindingName = bindingNameNode.getText();
    const typeName = typeNode ? typeNode.getText() : null;

    this.sourceFiles.forEach((sourceFile) => {
      sourceFile.getInterfaces().forEach((interfaceDeclaration) => {
        return this.processInterface(interfaceDeclaration, bindingName, typeName);
      });
    });
  }

  private processInterface(interfaceDeclaration: InterfaceDeclaration, bindingName: string, typeName: string | null) {
    const interfaceName = interfaceDeclaration.getName();

    if (this.isStaticInterface(interfaceName, bindingName, typeName)) {
      this.processStaticInterface(interfaceDeclaration, bindingName);
      return;
    }

    if (this.isInstanceInterface(interfaceName, bindingName)) {
      this.processInstanceInterface(interfaceName, bindingName, interfaceDeclaration);
      return;
    }

    if (this.isConstructorInterface(interfaceName, typeName)) {
      this.processConstructorInterface(interfaceDeclaration, bindingName);
    }
  }

  private processConstructorInterface(interfaceDeclaration: InterfaceDeclaration, bindingName: string) {
    this.processConstructSignatures(interfaceDeclaration.getConstructSignatures(), bindingName);
    this.processCallSignatures(interfaceDeclaration.getCallSignatures(), bindingName);
    this.processProperties(interfaceDeclaration, bindingName);
    this.processMethods(interfaceDeclaration, bindingName);
  }

  private processInstanceInterface(interfaceName: string, bindingName: string, declaration: InterfaceDeclaration) {
    const formattedName = this.formatInstanceName(interfaceName, bindingName);
    this.processConstructSignatures(declaration.getConstructSignatures(), formattedName);
    this.processCallSignatures(declaration.getCallSignatures(), formattedName);
    this.processProperties(declaration, interfaceName);
    this.processMethods(declaration, bindingName);
  }

  private processStaticInterface(interfaceDeclaration: InterfaceDeclaration, bindingName: string) {
    this.processProperties(interfaceDeclaration, bindingName);
    this.processMethods(interfaceDeclaration, bindingName);
  }

  private processConstructSignatures(constructSignatures: ConstructSignatureDeclaration[], parentName: string) {
    constructSignatures.forEach((constructSignature) => {
      const ast = this.createAst(`${parentName}.new`, constructSignature.getKindName(), {
        params: this.collectParams(constructSignature),
        returns: this.collectReturns(constructSignature),
        generics: this.collectGenerics(constructSignature),
      });
      this.saveGlobal(ast);
    });
  }

  private processCallSignatures(callSignatures: CallSignatureDeclaration[], parentName: string) {
    callSignatures.forEach((callSignature) => {
      const ast = this.createAst(parentName, callSignature.getKindName(), {
        params: this.collectParams(callSignature),
        returns: this.collectReturns(callSignature),
        generics: this.collectGenerics(callSignature),
      });
      this.saveGlobal(ast);
    });
  }

  private processConstructors(constructors: ConstructorDeclaration[], parentName: string) {
    constructors.forEach((ctor) => this.processConstructor(ctor, parentName));
  }

  private processConstructor(ctor: ConstructorDeclaration, parentName: string) {
    const ast = this.createAst(parentName, ctor.getKindName(), {
      params: this.collectParams(ctor),
      returns: this.collectReturns(ctor),
      generics: this.collectGenerics(ctor),
    });
    this.saveGlobal(ast);
  }

  private processProperties(interfaceOrClassDeclaration: InterfaceDeclaration | ClassDeclaration, parentName: string) {
    interfaceOrClassDeclaration.getProperties().forEach((p) => {
      const typeNode = p.getTypeNode();
      const ast = this.createAst(this.formatName(p.getName(), parentName), p.getKindName(), {
        meta: p.getModifiers().map((m) => m.getText()),
        returns: typeNode ? [this.resolveType(typeNode)] : [],
      });
      this.saveGlobal(ast);
    });
  }

  private processMethods(interfaceOrClassDeclaration: InterfaceDeclaration | ClassDeclaration, parentName: string) {
    interfaceOrClassDeclaration.getMethods().forEach((m) => {
      this.processMethod(m, parentName);
    });
  }

  private processMethod(node: FunctionDeclaration | MethodDeclaration | MethodSignature, parentName: string) {
    const name = node.getName() ?? this.getNextId();
    const ast = this.createAst(this.formatName(name, parentName), node.getKindName(), {
      params: this.collectParams(node),
      returns: this.collectReturns(node),
      generics: this.collectGenerics(node),
    });
    this.saveGlobal(ast);
  }

  private collectParams(ctor: MemberTypes): Ast[] {
    return ctor.getParameters().map((p) => {
      return this.handleParameter(p);
    });
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

  private collectGenerics(ctor: MemberTypes) {
    return ctor.getTypeParameters().map((t) => {
      return this.handleTypeParameter(t);
    });
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
    };
  }

  private createAst(id: string, kind: string, ast: Omit<Partial<Ast>, "id" | "name" | "kind"> = {}): Ast {
    return { ...this.getAstDefaults(), ...ast, id, kind, name: id };
  }

  private getMeta(param: ParameterDeclaration) {
    const meta = param.getModifiers().map((m) => m.getText());
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
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: node.getTypeNodes().flatMap((t) => this.resolveType(t)),
    });
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
    return this.createAst(this.getNextId(), node.getKindName(), {
      params: node.getParameters().map((p) => this.getParameter(p)),
      returns: returnTypeNode ? [this.resolveType(returnTypeNode)] : [],
      generics: node.getTypeParameters().map((p) => this.handleTypeParameter(p)),
    });
  }

  private handleTypeLiteral(node: TypeLiteralNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: node.getMembers().map((m) => this.resolveMember(m)),
    });
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

    return this.createAst(
      typeParameter.getName(), // TODO: Format name
      typeParameter.getKindName(),
      constraint
        ? ({
          // TODO: Verify that this is what we want
          meta: typeParameter.getModifiers().map((m) => m.getText()),
          text: typeParameter.getText(),
          returns: defaultType ? [this.resolveType(defaultType)] : [],
          generics: constraint ? [this.resolveType(constraint)] : [],
        })
        : ({}),
    );
  }

  private handleIntersectionType(node: IntersectionTypeNode): Ast {
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: node.getTypeNodes().flatMap((t) => this.resolveType(t)),
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
    return this.createAst(this.getNextId(), node.getKindName(), {
      returns: node.getElements().map((e) => this.resolveType(e)),
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
    return this.createAst(node.getName(), node.getKindName(), {
      generics: node.getTypeParameters().map((t) => this.handleTypeParameter(t)),
      meta: node.hasQuestionToken() ? ["optional"] : [],
      params: node.getParameters().map((p) => this.getParameter(p)),
      returns: node.getReturnTypeNode() ? [this.resolveType(node.getReturnTypeNode()!)] : [],
    });
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
  const col = new Collector(
    new Project({ compilerOptions: { noLib: true } }),
    ["/home/db/Projects/ts/src/lib/es5.d.ts"],
  );
  const globals = col.collectGlobals();
  console.log(JSON.stringify(globals, null, 2));
}
