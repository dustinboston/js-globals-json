import tsMorph, {
  ArrayTypeNode,
  CallSignatureDeclaration,
  ConditionalTypeNode,
  ConstructorTypeNode,
  ConstructSignatureDeclaration,
  ExpressionWithTypeArguments,
  FunctionTypeNode,
  Identifier,
  IndexedAccessTypeNode,
  IndexSignatureDeclaration,
  IntersectionTypeNode,
  LeftHandSideExpression,
  LiteralTypeNode,
  MappedTypeNode,
  MethodSignature,
  Node,
  ParameterDeclaration,
  ParenthesizedTypeNode,
  PropertySignature,
  RestTypeNode,
  StringLiteral,
  SyntaxKind,
  TemplateLiteralTypeNode,
  ThisTypeNode,
  TupleTypeNode,
  TypeLiteralNode,
  TypeOperatorTypeNode,
  TypeParameterDeclaration,
  TypePredicateNode,
  TypeQueryNode,
  TypeReferenceNode,
  UnionTypeNode,
} from "ts-morph";
import Assertions from "./Assertions.ts";

export default class TypeParser {
  constructor(private verbose = false) {}

  public enableVerboseOutput() {
    this.verbose = true;
    return this;
  }

  public static getUndefinedType() {
    return "null";
  }

  public parse(node?: Node): string | null {
    if (!node) return null;
    Assertions.assertNode(node);

    if (Assertions.isArrayTypeNode(node)) {
      return this.getResolvedArrayType(node);
    } else if (Assertions.isConditionalTypeNode(node)) {
      return this.getResolvedConditionalType(node);
    } else if (Assertions.isConstructorTypeNode(node)) {
      return this.getResolvedConstructorType(node);
    } else if (Assertions.isConstructSignatureDeclaration(node)) {
      return this.getResolvedConstructorType(node);
    } else if (Assertions.isCallSignatureDeclaration(node)) {
      return this.getResolvedCallSignature(node);
    } else if (Assertions.isExpressionWithTypeArguments(node)) {
      return this.getResolvedExpressionWithTypeArguments(node);
    } else if (Assertions.isFunctionTypeNode(node)) {
      return this.getResolvedFunctionType(node);
    } else if (Assertions.isIdentifier(node)) {
      return this.getResolvedTypeForIdentifier(node);
    } else if (Assertions.isIndexSignatureDeclaration(node)) {
      return this.getResolvedIndexSignature(node);
    } else if (Assertions.isIndexedAccessTypeNode(node)) {
      return this.getResolvedIndexedAccessType(node);
    } else if (Assertions.isIntersectionTypeNode(node)) {
      return this.getResolvedIntersectionType(node);
    } else if (Assertions.isLiteralTypeNode(node)) {
      return this.getResolvedLiteralType(node);
    } else if (Assertions.isStringLiteral(node)) {
      return this.getResolvedStringLiteral(node);
    } else if (Assertions.isMappedTypeNode(node)) {
      return this.getResolvedMappedType(node);
    } else if (Assertions.isMethodSignature(node)) {
      return this.getResolvedMethodSignature(node);
    } else if (Assertions.isParameterDeclaration(node)) {
      return this.getResolvedParameter(node);
    } else if (Assertions.isParenthesizedTypeNode(node)) {
      return this.getResolvedParenthesizedType(node);
    } else if (Assertions.isPropertySignature(node)) {
      return this.getResolvedPropertySignature(node);
    } else if (Assertions.isRestTypeNode(node)) {
      return this.getResolvedRestType(node);
    } else if (Assertions.isTemplateLiteralTypeNode(node)) {
      return this.getResolvedTemplateLiteralType(node);
    } else if (Assertions.isThisTypeNode(node)) {
      return this.getResolvedThisType(node);
    } else if (Assertions.isTupleTypeNode(node)) {
      return this.getResolvedTupleType(node);
    } else if (Assertions.isTypeLiteral(node)) {
      return this.getResolvedTypeLiteral(node);
    } else if (Assertions.isTypeOperatorTypeNode(node)) {
      return this.parseTypeForTypeOperator(node);
    } else if (Assertions.isTypeParameterDeclaration(node)) {
      return this.getResolvedTypeParameter(node);
    } else if (Assertions.isTypePredicate(node)) {
      return this.getResolvedTypePredicate(node);
    } else if (Assertions.isTypeQuery(node)) {
      return this.getResolvedTypeQuery(node);
    } else if (Assertions.isTypeReference(node)) {
      return this.getResolvedTypeReference(node);
    } else if (Assertions.isUnionTypeNode(node)) {
      return this.getResolvedUnionType(node);
    } else if (Assertions.isTokenNode(node)) {
      return this.parseToken(node);
    } else {
      return `(error "unknown kind ${node.getKindName()}")`;
    }
  }

  protected getResolvedArrayType(node: ArrayTypeNode): string {
    Assertions.assertArrayTypeNode(node);

    const elementTypeNode = node.getElementTypeNode();
    const returnType = this.parse(elementTypeNode);
    const expression = `(array ${returnType})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedConditionalType(node: ConditionalTypeNode): string {
    Assertions.assertConditionalTypeNode(node);

    const checkType = this.parse(node.getCheckType());
    const extendsType = this.parse(node.getExtendsType());
    const trueType = this.parse(node.getTrueType());
    const falseType = this.parse(node.getFalseType());

    const expression = `(if (extends ${checkType} ${extendsType}) ${trueType} ${falseType})`;

    return this.verboseWrapper(expression, node);
  }

  /**
   * @todo Get type parameters
   * @param node
   * @returns
   */
  protected getResolvedConstructorType(node: ConstructorTypeNode | ConstructSignatureDeclaration) {
    Assertions.assertConstructorTypeNodeOrConstructSignatureDeclaration(node);

    const returnTypeNode = node.getReturnTypeNode();
    const returnType = this.parse(returnTypeNode);
    const nodeParameters = node.getParameters();
    const parameters = this.getResolvedParameters(nodeParameters);

    const expression = `(new ${parameters} ${returnType})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedCallSignature(node: CallSignatureDeclaration) {
    Assertions.assertCallSignatureDeclaration(node);

    const returnTypeNode = node.getReturnTypeNode();
    const returnType = this.parse(returnTypeNode);
    const nodeParameters = node.getParameters();
    const parameters = this.getResolvedParameters(nodeParameters);

    const expression = `(call ${parameters} ${returnType})`;

    return this.verboseWrapper(expression, node);
  }

  protected parseToken(node: Node): string {
    // Ensure the node is a token
    if (!Assertions.isTokenNode(node)) {
      throw new TypeError("Expected a token node.");
    }

    const expression = node.getText();

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedUnionType(node: UnionTypeNode): string {
    Assertions.assertUnionTypeNode(node);

    const typeNodes = node.getTypeNodes();
    const resolvedTypes = typeNodes.map((typeNode) => this.parse(typeNode));
    const expression = `(or ${resolvedTypes.join(" ")})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedTypeReference(node: TypeReferenceNode): string {
    Assertions.assertTypeReferenceNode(node);

    const typeName = node.getTypeName().getText();
    const typeArguments = node.getTypeArguments().map((arg) => this.parse(arg));
    const expression = typeArguments.length ? `${typeName}<${typeArguments.join(" ")}>` : `${typeName}`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedTypeForIdentifier(node: Identifier): string {
    Assertions.assertIdentifierNode(node);

    const name = node.getText();
    const expression = `${name}`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedLiteralType(node: LiteralTypeNode): string {
    Assertions.assertLiteralTypeNode(node);

    const literalText = node.getLiteral().getText();
    const expression = `${literalText}`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedStringLiteral(node: StringLiteral): string {
    Assertions.assertLiteralTypeNode(node);

    const literalText = node.getText();
    const expression = `"${literalText}"`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedFunctionType(node: FunctionTypeNode): string {
    Assertions.assertFunctionTypeNode(node);

    const parameterNodes = node.getParameters();
    const parameters = this.getResolvedParameters(parameterNodes);
    const returnType = this.parse(node.getReturnTypeNode());

    const expression = `(function ${parameters})<${returnType}>`;

    return this.verboseWrapper(expression, node);
  }

  /**
   * @todo If resolveType produces incorrect results, try resolveMember
   * @param node
   * @returns
   */
  protected getResolvedTypeLiteral(node: TypeLiteralNode) {
    Assertions.assertTypeLiteralNode(node);

    const memberNodes = node.getMembers();
    const members = memberNodes.map((member) => this.parse(member)).join(" ");

    const expression = `{${members}}`;

    return this.verboseWrapper(expression, node);
  }

  public getResolvedTypeParameters(typeParameters: TypeParameterDeclaration[]) {
    const astArray = typeParameters.reduce((acc: string[], typeParameter) => {
      const parsedTypeParameter = this.getResolvedTypeParameter(typeParameter);
      if (parsedTypeParameter) {
        acc.push(parsedTypeParameter);
      }
      return acc;
    }, []);

    return astArray.join(" ");
  }

  protected getResolvedTypeParameter(node: TypeParameterDeclaration): string {
    Assertions.assertTypeParameter(node);

    const name = node.getName();
    const constraint = node.getConstraint();
    const defaultType = node.getDefault();

    const parts: string[] = [`:name ${name}`];

    if (constraint) {
      const operator = constraint.getText();
      parts.push(`:constraint ${operator}`);

      const generic = this.parse(constraint);
      if (generic) {
        parts.push(`:type ${generic}`);
      }

      if (defaultType) {
        const returnType = this.parse(defaultType);
        parts.push(`:default ${returnType}`);
      }
    }

    const expression = `{${parts.join(" ")}}`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedIntersectionType(node: IntersectionTypeNode): string {
    Assertions.assertIntersectionTypeNode(node);

    const typeNodes = node.getTypeNodes();
    const resolvedTypes = typeNodes.map((typeNode) => this.parse(typeNode));
    const expression = `(intersect ${resolvedTypes.join(" ")})`;

    return this.verboseWrapper(expression, node);
  }

  /**
   * @param node
   * @returns
   */
  protected parseTypeForTypeOperator(node: TypeOperatorTypeNode): string {
    Assertions.assertTypeOperatorTypeNode(node);

    const operator = node.getText();
    const typeNode = node.getTypeNode();
    const targetType = this.parse(typeNode);

    const expression = `(${operator} ${targetType})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedTupleType(node: TupleTypeNode): string {
    Assertions.assertTupleTypeNode(node);

    const elements = node.getElements().map((el) => this.parse(el));
    const expression = `[${elements.join(" ")}]`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedRestType(node: RestTypeNode): string {
    Assertions.assertRestTypeNode(node);

    const typeNode = node.getTypeNode();
    const innerType = this.parse(typeNode);
    const expression = `& rest<${innerType}>`;

    return this.verboseWrapper(expression, node);
  }

  /**
   * @todo Determine whether to use "name": `const name = node.getText();`
   * @param node
   * @returns
   */
  protected getResolvedParenthesizedType(node: ParenthesizedTypeNode): string {
    Assertions.assertParenthesizedTypeNode(node);

    const typeNode = node.getTypeNode();
    const innerType = this.parse(typeNode);

    const expression = `(list ${innerType})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedIndexSignature(node: IndexSignatureDeclaration): string {
    Assertions.assertIndexSignatureNode(node);

    const keyTypeNode = node.getKeyTypeNode();
    const keyType = this.parse(keyTypeNode);
    const returnTypeNode = node.getReturnTypeNode();
    const valueType = this.parse(returnTypeNode);

    const expression = `{:key ${keyType} :value ${valueType}}`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedPropertySignature(node: PropertySignature): string {
    Assertions.assertPropertySignatureNode(node);

    const name = node.getName();
    const typeNode = node.getTypeNode();
    const type = this.parse(typeNode);
    const isOptional = node.hasQuestionToken();

    let expression = `(property {:${name} ${type}})`;
    if (isOptional) {
      expression = `(property (optional {:${name} ${type}}))`;
    }

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedMappedType(node: MappedTypeNode): string {
    Assertions.assertMappedTypeNode(node);

    const typeParameterNode = node.getTypeParameter();
    const typeParameter = this.getResolvedTypeParameter(typeParameterNode);
    const typeNode = node.getTypeNode();
    const valueType = this.parse(typeNode);
    const isOptional = node.getQuestionToken() !== undefined;

    let expression = `{:${typeParameter} ${valueType}}`;
    if (isOptional) {
      expression = `(optional {:${typeParameter} ${valueType}})`;
    }

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedIndexedAccessType(node: IndexedAccessTypeNode): string {
    Assertions.assertIndexedAccessTypeNode(node);

    const objectType = this.parse(node.getObjectTypeNode());
    const indexType = this.parse(node.getIndexTypeNode());
    const expression = `(get ${objectType} ${indexType})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedMethodSignature(node: MethodSignature): string {
    Assertions.assertMethodSignatureNode(node);

    const parameterNodes = node.getParameters();
    const parameters = this.getResolvedParameters(parameterNodes);
    const returnTypeNode = node.getReturnTypeNode();
    const returnType = this.parse(returnTypeNode);

    const expression = `(method ${parameters})<${returnType}>`;

    return this.verboseWrapper(expression, node);
  }

  protected getParsedExpressionsWithTypeArguments(nodes: ExpressionWithTypeArguments[]) {
    return nodes.map((node) => this.getResolvedExpressionWithTypeArguments(node)).join(" ");
  }

  protected getResolvedExpressionWithTypeArguments(node: ExpressionWithTypeArguments) {
    Assertions.assertExpressionWithTypeArguments(node);

    const expressionNode = node.getExpression();
    const expression = this.resolveExpression(expressionNode);
    const typeArgumentsNode = node.getTypeArguments();
    const typeArguments = typeArgumentsNode.map((arg) => this.parse(arg)).join(" ");

    return `${expression}<${typeArguments}>`; // e.g. Array<string>
  }

  protected resolveExpression(node: LeftHandSideExpression): string {
    Assertions.assertLeftHandSideExpression(node);

    return node.getText();
  }

  protected getResolvedThisType(node: ThisTypeNode) {
    Assertions.assertThisTypeNode(node);

    const expression = `(this)`;

    return this.verboseWrapper(expression, node);
  }

  protected parseModifiers(modifiers: Node<SyntaxKind>[]): string {
    const result: string[] = [];

    for (const modifier of modifiers) {
      const text = modifier.getText();
      result.push(text);
    }

    return `[${result.join(" ")}]`;
  }

  /**
   * @todo Rethink the type predicate syntax to include is
   * @param node
   * @returns
   */
  protected getResolvedTypePredicate(node: TypePredicateNode) {
    Assertions.assertTypePredicateNode(node);

    const name = node.getParameterNameNode().getText();
    const typeNode = node.getTypeNode();
    const type = this.parse(typeNode);
    const isTypeAssertion = node.hasAssertsModifier();

    const expression = isTypeAssertion ? `(asserts ${name} ${type})` : `(predicate ${name} ${type})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedTypeQuery(node: TypeQueryNode): string {
    Assertions.assertTypeQueryNode(node);

    const queryTarget = node.getExprName().getText();

    const expression = `(typeof ${queryTarget})`;

    return this.verboseWrapper(expression, node);
  }

  protected getResolvedTemplateLiteralType(node: TemplateLiteralTypeNode): string {
    Assertions.assertTemplateLiteralTypeNode(node);

    const templateSpanNodes = node.getTemplateSpans();

    const template = templateSpanNodes.map((span) => {
      const type = span.getType().getText();
      const text = span.getText();
      const expression = `{{${type}}}${text}`;
      return expression;
    }).join("");

    const expression = `"${template}"`;

    return this.verboseWrapper(expression, node);
  }

  protected getParameter(node: ParameterDeclaration) {
    Assertions.assertParameter(node);
    return this.getResolvedParameter(node);
  }

  protected getUnknownKindError(node: Node): string {
    Assertions.assertNode(node);

    const expression = `(error "unknown kind ${node.getKindName()}")`;
    return expression;
  }

  public getResolvedParameters(parameters: ParameterDeclaration[]): string {
    const joined = parameters.map((param) => this.getResolvedParameter(param)).join(" ");

    const expression = `[${joined}]`;

    return expression;
  }

  protected getResolvedParameter(node: ParameterDeclaration): string {
    Assertions.assertParameter(node);

    const typeNode = node.getTypeNode();
    const name = node.getName();
    const type = typeNode ? this.parse(typeNode) : "null";
    const isOptional = node.hasQuestionToken();
    const isRest = node.isRestParameter();

    let expression = `${name}<${type}>`;

    if (isRest) {
      expression = `(& rest<${expression}>)`;
    }

    if (isOptional) {
      expression = `(optional ${expression})`;
    }

    return this.verboseWrapper(expression, node);
  }

  protected verboseWrapper<T extends tsMorph.Node>(expression: string, node: T) {
    const kind = node.getKindName();

    let modifiers = "null";
    if (tsMorph.Node.isModifierable(node)) {
      const modifierNodes = node.getModifiers();
      modifiers = this.parseModifiers(modifierNodes);
    }

    if (this.verbose) {
      return `^{:kind ${kind} :modifiers ${modifiers}} ${expression}`;
    } else {
      return expression;
    }
  }
}
