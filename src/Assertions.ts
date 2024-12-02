import * as tsMorph from "ts-morph";
import * as types from "./Types.ts";
import Ast from "./Ast.ts";
import { SyntaxKind } from "ts-morph";

export default class Assertions {
  public static isArrayTypeNode = tsMorph.ArrayTypeNode.isArrayTypeNode;

  public static isConditionalTypeNode = tsMorph.ConditionalTypeNode.isConditionalTypeNode;

  public static isConstructorTypeNode = tsMorph.ConstructorTypeNode.isConstructorTypeNode;

  public static isExpressionWithTypeArguments = tsMorph.ExpressionWithTypeArguments.isExpressionWithTypeArguments;

  public static isFunctionTypeNode = tsMorph.FunctionTypeNode.isFunctionTypeNode;

  public static isIdentifier = tsMorph.Identifier.isIdentifier;

  public static isIndexSignatureDeclaration = tsMorph.IndexSignatureDeclaration.isIndexSignatureDeclaration;

  public static isIndexedAccessTypeNode = tsMorph.IndexedAccessTypeNode.isIndexedAccessTypeNode;

  public static isIntersectionTypeNode = tsMorph.IntersectionTypeNode.isIntersectionTypeNode;

  public static isLiteralTypeNode = tsMorph.LiteralTypeNode.isLiteralTypeNode;

  public static isStringLiteral = tsMorph.StringLiteral.isStringLiteral;

  public static isMappedTypeNode = tsMorph.MappedTypeNode.isMappedTypeNode;

  public static isMethodSignature = tsMorph.MethodSignature.isMethodSignature;

  public static isParameterDeclaration = tsMorph.ParameterDeclaration.isParameterDeclaration;

  public static isParenthesizedTypeNode = tsMorph.ParenthesizedTypeNode.isParenthesizedTypeNode;

  public static isPropertySignature = tsMorph.PropertySignature.isPropertySignature;

  public static isRestTypeNode = tsMorph.RestTypeNode.isRestTypeNode;

  public static isTemplateLiteralTypeNode = tsMorph.TemplateLiteralTypeNode.isTemplateLiteralTypeNode;

  public static isThisTypeNode = tsMorph.ThisTypeNode.isThisTypeNode;

  public static isTupleTypeNode = tsMorph.TupleTypeNode.isTupleTypeNode;

  public static isTypeLiteral = tsMorph.TypeLiteralNode.isTypeLiteral;

  public static isTypeOperatorTypeNode = tsMorph.TypeOperatorTypeNode.isTypeOperatorTypeNode;

  public static isTypeParameterDeclaration = tsMorph.TypeParameterDeclaration.isTypeParameterDeclaration;

  public static isTypePredicate = tsMorph.TypePredicateNode.isTypePredicate;

  public static isTypeQuery = tsMorph.TypeQueryNode.isTypeQuery;

  public static isTypeReference = tsMorph.TypeReferenceNode.isTypeReference;

  public static isUnionTypeNode = tsMorph.UnionTypeNode.isUnionTypeNode;

  public static isConstructSignatureDeclaration = tsMorph.ConstructSignatureDeclaration.isConstructSignatureDeclaration;

  public static isCallSignatureDeclaration = tsMorph.CallSignatureDeclaration.isCallSignatureDeclaration;

  // public static isToken = ts.isToken;
  public static isTokenNode(node: tsMorph.Node) {
    const kind = node.getKind();
    if (kind >= SyntaxKind.FirstToken && kind <= SyntaxKind.LastToken) {
      return true;
    }
    return false;
  }

  public static assertVariableDeclaration(declaration: unknown): asserts declaration is tsMorph.VariableDeclaration {
    if (!(declaration instanceof tsMorph.VariableDeclaration)) {
      throw new TypeError(`Declaration must be a VariableDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertBindingName(bindingName: unknown): asserts bindingName is tsMorph.BindingName {
    if (
      !(bindingName instanceof tsMorph.Identifier || bindingName instanceof tsMorph.ObjectBindingPattern || bindingName instanceof tsMorph.ArrayBindingPattern)
    ) {
      throw new TypeError(`Expected BindingName, received ${typeof bindingName}`);
    }
  }
  public static assertTypeNode(typeNode: unknown): asserts typeNode is tsMorph.TypeNode {
    if (!(typeNode instanceof tsMorph.TypeNode)) {
      console.error("The following error was called with a value of:", typeNode);
      throw new TypeError(`Expected TypeNode, received ${typeof typeNode}`);
    }
  }
  public static assertFunctionDeclarationType(declaration: unknown): asserts declaration is tsMorph.FunctionDeclaration {
    if (!(declaration instanceof tsMorph.FunctionDeclaration)) {
      throw new TypeError(`Declaration must be a FunctionDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertModuleType(declaration: unknown): asserts declaration is tsMorph.ModuleDeclaration {
    if (!(declaration instanceof tsMorph.ModuleDeclaration)) {
      throw new TypeError(`Declaration must be a ModuleDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertInterfaceLikeDeclaration(declaration: unknown): asserts declaration is tsMorph.InterfaceDeclaration {
    if (!(declaration instanceof tsMorph.InterfaceDeclaration)) {
      throw new TypeError(`Declaration must be an InterfaceDeclaration, received ${typeof declaration}`);
    }
  }

  public static assertStringOrNull(value: unknown): asserts value is string | null {
    if (typeof value !== "string" && value !== null) {
      throw new TypeError(`Expected value to be a string or null, received ${typeof value}`);
    }
  }
  public static assertTypeNodeOrUndefined(typeNode: unknown): asserts typeNode is tsMorph.TypeNode | undefined {
    if (typeNode !== undefined && !(typeNode instanceof tsMorph.TypeNode)) {
      throw new TypeError(`Expected TypeNode or undefined, received ${(typeNode as tsMorph.Node).getKindName()}`);
    }
  }
  public static assertNodeTypeNodeOrUndefined(typeNode: unknown): asserts typeNode is tsMorph.TypeNode | undefined {
    if (typeNode !== undefined && !(typeNode instanceof tsMorph.TypeNode) && !(typeNode instanceof tsMorph.Node)) {
      throw new TypeError(`Expected node to be a Node, TypeNode, or undefined, received ${typeof typeNode}`);
    }
  }
  public static assertConstructSignatures(constructSignatures: unknown): asserts constructSignatures is tsMorph.ConstructSignatureDeclaration[] {
    if (!Array.isArray(constructSignatures) || !constructSignatures.every((sig) => sig instanceof tsMorph.ConstructSignatureDeclaration)) {
      throw new TypeError(`Expected constructSignatures to be an array of ConstructSignatureDeclaration, received ${typeof constructSignatures}`);
    }
  }
  public static assertConstructSignatureDeclaration(constructSignature: unknown): asserts constructSignature is tsMorph.ConstructSignatureDeclaration {
    if (constructSignature instanceof tsMorph.ConstructSignatureDeclaration) {
      console.error("The following error was called with a value of:", constructSignature);
      throw new TypeError(`Expected constructSignature to be a ConstructSignatureDeclaration, received ${typeof constructSignature}`);
    }
  }
  public static assertCallSignatures(callSignatures: unknown): asserts callSignatures is tsMorph.CallSignatureDeclaration[] {
    if (!Array.isArray(callSignatures) || !callSignatures.every((sig) => sig instanceof tsMorph.CallSignatureDeclaration)) {
      throw new TypeError(`Expected callSignatures to be an array of CallSignatureDeclaration, received ${typeof callSignatures}`);
    }
  }
  public static assertCallSignature(callSignature: unknown): asserts callSignature is tsMorph.CallSignatureDeclaration {
    if (!(callSignature instanceof tsMorph.CallSignatureDeclaration)) {
      throw new TypeError(`Declaration must be a CallSignatureDeclaration, received ${typeof callSignature}`);
    }
  }
  public static assertConstructorDeclaration(declaration: unknown): asserts declaration is tsMorph.ConstructorDeclaration {
    if (!(declaration instanceof tsMorph.ConstructorDeclaration)) {
      throw new TypeError(`Declaration must be a ConstructorDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertCallSignatureDeclaration(callSignature: unknown): asserts callSignature is tsMorph.CallSignatureDeclaration {
    if (!(callSignature instanceof tsMorph.CallSignatureDeclaration)) {
      throw new TypeError(`Declaration must be a CallSignatureDeclaration, received ${typeof callSignature}`);
    }
  }
  public static assertProperty(property: unknown): asserts property is tsMorph.PropertyDeclaration | tsMorph.PropertySignature {
    if (!(property instanceof tsMorph.PropertyDeclaration || property instanceof tsMorph.PropertySignature)) {
      console.error("The following error was called with a value of:", property);
      throw new TypeError(`Declaration must be a PropertyDeclaration or PropertySignature, received ${typeof property}`);
    }
  }
  public static assertProperties(variables: unknown): asserts variables is (tsMorph.PropertySignature | tsMorph.PropertyDeclaration)[] {
    if (
      !Array.isArray(variables) ||
      !variables.every((variable) => variable instanceof tsMorph.PropertySignature || variable instanceof tsMorph.PropertyDeclaration)
    ) {
      throw new TypeError(`Expected variables to be an array of PropertySignature, received ${typeof variables}`);
    }
  }

  public static assertInterfaceOrClassType(declaration: unknown): asserts declaration is tsMorph.InterfaceDeclaration | tsMorph.ClassDeclaration {
    if (!(declaration instanceof tsMorph.InterfaceDeclaration || declaration instanceof tsMorph.ClassDeclaration)) {
      throw new TypeError(`Declaration must be an InterfaceDeclaration or ClassDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertFunctionType(declaration: unknown): asserts declaration is types.FunctionTypes {
    if (
      !(declaration instanceof tsMorph.FunctionDeclaration || declaration instanceof tsMorph.MethodDeclaration ||
        declaration instanceof tsMorph.MethodSignature)
    ) {
      throw new TypeError(`Declaration must be one of FunctionDeclaration, MethodDeclaration, or MethodSignature, received ${typeof declaration}`);
    }
  }
  public static assertParameter(declaration: unknown): asserts declaration is tsMorph.ParameterDeclaration {
    if (!(declaration instanceof tsMorph.ParameterDeclaration)) {
      console.log("The following error was called with a value of:", declaration);
      throw new TypeError(`alsdlfkjParameter must be a ParameterDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertParameters(parameters: unknown): asserts parameters is tsMorph.ParameterDeclaration[] {
    if (!Array.isArray(parameters) || !parameters.every((parameter) => parameter instanceof tsMorph.ParameterDeclaration)) {
      throw new TypeError(`Parameters must be of type ParameterDeclaration, received ${typeof parameters}`);
    }
  }
  public static assertMemberType(member: unknown): asserts member is types.MemberTypes {
    if (
      !(
        member instanceof tsMorph.CallSignatureDeclaration ||
        member instanceof tsMorph.ConstructSignatureDeclaration ||
        member instanceof tsMorph.ConstructorDeclaration ||
        member instanceof tsMorph.FunctionDeclaration ||
        member instanceof tsMorph.MethodDeclaration ||
        member instanceof tsMorph.MethodSignature
      )
    ) {
      console.error("The following error was called with a value of:", member);
      throw new TypeError(`Declaration must be a MemberType, received ${typeof member}`);
    }
  }
  public static assertAncestry(ancestry: unknown): asserts ancestry is Set<string> {
    if (!(ancestry instanceof Set)) {
      throw new TypeError(`Ancestry must be a Set, received ${typeof ancestry} with value of ${String(ancestry)}`);
    }
  }

  public static assertName(name: unknown): asserts name is string {
    if (typeof name !== "string") {
      throw new TypeError(`Expected name to be a string, received ${typeof name} with value of ${String(name)}`);
    }
  }
  // TODO: Validate against the Ast class once it is implemented.
  public static assertAst(ast: unknown): asserts ast is Ast {
    if (typeof ast !== "object" || ast === null) {
      throw new TypeError(`Expected ast to be an object, received ${typeof ast}`);
    }
  }
  public static assertNode(node: unknown): asserts node is tsMorph.Node {
    if (!(node instanceof tsMorph.Node)) {
      throw new TypeError(`Expected node to be an instance of Node, received ${typeof node}`);
    }
  }

  public static assertKind(kind: unknown): asserts kind is tsMorph.SyntaxKind {
    if (typeof kind !== "number") {
      throw new TypeError(`Expected kind to be a SyntaxKind, received ${typeof kind}`);
    }
  }

  public static assertHandler(handler: unknown): asserts handler is (node: tsMorph.Node) => Ast {
    if (typeof handler !== "function") {
      throw new TypeError(`Expected handler to be a function, received ${typeof handler}`);
    }
  }
  public static assertUnionTypeNode(node: unknown): asserts node is tsMorph.UnionTypeNode {
    if (!(node instanceof tsMorph.UnionTypeNode)) {
      throw new TypeError(`Expected node to be a UnionTypeNode, received ${typeof node}`);
    }
  }
  public static assertTypeReferenceNode(node: unknown): asserts node is tsMorph.TypeReferenceNode {
    if (!(node instanceof tsMorph.TypeReferenceNode)) {
      throw new TypeError(`Expected node to be a TypeReferenceNode, received ${typeof node}`);
    }
  }
  public static assertLiteralTypeNode(node: unknown): asserts node is tsMorph.LiteralTypeNode {
    if (!(node instanceof tsMorph.LiteralTypeNode)) {
      throw new TypeError(`Expected node to be a LiteralTypeNode, received ${typeof node}`);
    }
  }
  public static assertFunctionTypeNode(node: unknown): asserts node is tsMorph.FunctionTypeNode {
    if (!(node instanceof tsMorph.FunctionTypeNode)) {
      throw new TypeError(`Expected node to be a FunctionTypeNode, received ${typeof node}`);
    }
  }
  public static assertTypeLiteralNode(node: unknown): asserts node is tsMorph.TypeLiteralNode {
    if (!(node instanceof tsMorph.TypeLiteralNode)) {
      throw new TypeError(`Expected node to be a TypeLiteralNode, received ${typeof node}`);
    }
  }
  public static assertTypeElementTypes(node: unknown): asserts node is tsMorph.TypeElementTypes {
    if (
      !(node instanceof tsMorph.CallSignatureDeclaration || node instanceof tsMorph.ConstructSignatureDeclaration || node instanceof tsMorph.MethodSignature ||
        node instanceof tsMorph.PropertySignature || node instanceof tsMorph.IndexSignatureDeclaration || node instanceof tsMorph.GetAccessorDeclaration ||
        node instanceof tsMorph.SetAccessorDeclaration)
    ) {
      throw new TypeError(`Expected node to be of type TypeElementTypes, received ${typeof node}`);
    }
  }
  public static assertTypeParameter(node: unknown): asserts node is tsMorph.TypeParameterDeclaration {
    if (!(node instanceof tsMorph.TypeParameterDeclaration)) {
      throw new TypeError(`Expected node to be a TypeParameterDeclaration, received ${typeof node}`);
    }
  }
  public static assertIntersectionTypeNode(node: unknown): asserts node is tsMorph.IntersectionTypeNode {
    if (!(node instanceof tsMorph.IntersectionTypeNode)) {
      throw new TypeError(`Expected node to be an IntersectionTypeNode, received ${typeof node}`);
    }
  }
  public static assertTypeOperatorTypeNode(node: unknown): asserts node is tsMorph.TypeOperatorTypeNode {
    if (!(node instanceof tsMorph.TypeOperatorTypeNode)) {
      throw new TypeError(`Expected node to be a TypeOperatorTypeNode, received ${typeof node}`);
    }
  }
  public static assertClassType(declaration: unknown): asserts declaration is tsMorph.ClassDeclaration {
    if (!(declaration instanceof tsMorph.ClassDeclaration)) {
      throw new TypeError(`Declaration must be a ClassDeclaration, received ${typeof declaration}`);
    }
  }
  public static assertTupleTypeNode(node: unknown): asserts node is tsMorph.TupleTypeNode {
    if (!(node instanceof tsMorph.TupleTypeNode)) {
      throw new TypeError(`Expected node to be a TupleTypeNode, received ${typeof node}`);
    }
  }
  public static assertRestTypeNode(node: unknown): asserts node is tsMorph.RestTypeNode {
    if (!(node instanceof tsMorph.RestTypeNode)) {
      throw new TypeError(`Expected node to be a RestTypeNode, received ${typeof node}`);
    }
  }
  public static assertParenthesizedTypeNode(node: unknown): asserts node is tsMorph.ParenthesizedTypeNode {
    if (!(node instanceof tsMorph.ParenthesizedTypeNode)) {
      throw new TypeError(`Expected node to be a ParenthesizedTypeNode, received ${typeof node}`);
    }
  }
  public static assertIndexSignatureNode(node: unknown): asserts node is tsMorph.IndexSignatureDeclaration {
    if (!(node instanceof tsMorph.IndexSignatureDeclaration)) {
      throw new TypeError(`Expected node to be an IndexSignatureDeclaration, received ${typeof node}`);
    }
  }
  public static assertPropertySignatureNode(node: unknown): asserts node is tsMorph.PropertySignature {
    if (!(node instanceof tsMorph.PropertySignature)) {
      throw new TypeError(`Expected node to be a PropertySignature, received ${typeof node}`);
    }
  }
  public static assertMappedTypeNode(node: unknown): asserts node is tsMorph.MappedTypeNode {
    if (!(node instanceof tsMorph.MappedTypeNode)) {
      throw new TypeError(`Expected node to be a MappedTypeNode, received ${typeof node}`);
    }
  }
  public static assertIndexedAccessTypeNode(node: unknown): asserts node is tsMorph.IndexedAccessTypeNode {
    if (!(node instanceof tsMorph.IndexedAccessTypeNode)) {
      throw new TypeError(`Expected node to be an IndexedAccessTypeNode, received ${typeof node}`);
    }
  }
  public static assertMethodSignatureNode(node: unknown): asserts node is tsMorph.MethodSignature {
    if (!(node instanceof tsMorph.MethodSignature)) {
      throw new TypeError(`Expected node to be a MethodSignature, received ${typeof node}`);
    }
  }
  public static assertExpressionWithTypeArguments(node: unknown): asserts node is tsMorph.ExpressionWithTypeArguments {
    if (!(node instanceof tsMorph.ExpressionWithTypeArguments)) {
      throw new TypeError(`Expected node to be an ExpressionWithTypeArguments, received ${typeof node}`);
    }
  }
  public static assertLeftHandSideExpression(node: unknown): asserts node is tsMorph.LeftHandSideExpression {
    if (!(node instanceof tsMorph.LeftHandSideExpression)) {
      throw new TypeError(`Expected node to be a LeftHandSideExpression, received ${typeof node}`);
    }
  }
  public static assertThisTypeNode(node: unknown): asserts node is tsMorph.ThisTypeNode {
    if (!(node instanceof tsMorph.ThisTypeNode)) {
      throw new TypeError(`Expected node to be a ThisTypeNode, received ${typeof node}`);
    }
  }
  public static assertConstructorTypeNode(node: unknown): asserts node is tsMorph.ConstructorTypeNode {
    if (!(node instanceof tsMorph.ConstructorTypeNode)) {
      throw new TypeError(`Expected node to be a ConstructorTypeNode, received ${typeof node}`);
    }
  }
  public static assertConstructorTypeNodeOrConstructSignatureDeclaration(
    node: unknown,
  ): asserts node is tsMorph.ConstructorTypeNode | tsMorph.ConstructSignatureDeclaration {
    if (!(node instanceof tsMorph.ConstructorTypeNode || node instanceof tsMorph.ConstructSignatureDeclaration)) {
      throw new TypeError(`Expected node to be a ConstructorTypeNode or ConstructSignatureDeclaration, received ${typeof node}`);
    }
  }
  public static assertTypePredicateNode(node: unknown): asserts node is tsMorph.TypePredicateNode {
    if (!(node instanceof tsMorph.TypePredicateNode)) {
      throw new TypeError(`Expected node to be a TypePredicateNode, received ${typeof node}`);
    }
  }
  public static assertTypeQueryNode(node: unknown): asserts node is tsMorph.TypeQueryNode {
    if (!(node instanceof tsMorph.TypeQueryNode)) {
      throw new TypeError(`Expected node to be a TypeQueryNode, received ${typeof node}`);
    }
  }
  public static assertTemplateLiteralTypeNode(node: unknown): asserts node is tsMorph.TemplateLiteralTypeNode {
    if (!(node instanceof tsMorph.TemplateLiteralTypeNode)) {
      throw new TypeError(`Expected node to be a TemplateLiteralTypeNode, received ${typeof node}`);
    }
  }
  public static assertConditionalTypeNode(node: unknown): asserts node is tsMorph.ConditionalTypeNode {
    if (!(node instanceof tsMorph.ConditionalTypeNode)) {
      throw new TypeError(`Expected node to be a ConditionalTypeNode, received ${typeof node}`);
    }
  }
  public static assertArrayTypeNode(node: tsMorph.ArrayTypeNode): asserts node is tsMorph.ArrayTypeNode {
    if (!(node instanceof tsMorph.ArrayTypeNode)) {
      throw new TypeError(`Expected ArrayTypeNode, received ${typeof node}`);
    }
  }
  public static assertIdentifierNode(node: tsMorph.Node): asserts node is tsMorph.Identifier {
    if (!(node instanceof tsMorph.Identifier)) {
      throw new Error(`Expected Identifier node, but received ${node.getKindName()}`);
    }
  }
  public static assertResolvableType(node: unknown): asserts node is types.ResolvableTypes {
    if (!(node instanceof tsMorph.TypeNode || node instanceof tsMorph.Expression)) {
      throw new TypeError(`Expected node to be a TypeNode or Expression, received ${typeof node}`);
    }
  }
  public static assertToken(node: tsMorph.ts.Node): asserts node is tsMorph.ts.Token<tsMorph.ts.TokenSyntaxKind> {
    if (!tsMorph.ts.isToken(node)) {
      throw new TypeError(`Expected a token, received ${typeof node}`);
    }
  }
  public static assertPropertySignatures(properties: tsMorph.PropertySignature[]): asserts properties is tsMorph.PropertySignature[] {
    if (!Array.isArray(properties) || !properties.every((property) => tsMorph.ts.isPropertySignature(property.compilerNode))) {
      throw new TypeError(`Expected properties to be an array of PropertySignature, received ${typeof properties}`);
    }
  }
  public static assertMethods(methods: unknown): asserts methods is (tsMorph.MethodSignature | tsMorph.MethodDeclaration)[] {
    if (!Array.isArray(methods) || !methods.every((method) => method instanceof tsMorph.MethodSignature || method instanceof tsMorph.MethodDeclaration)) {
      console.error("The following error was called with a value of:", methods);
      throw new Error(`Expected methods to be an array of MethodSignature or MethodDeclaration, received ${typeof methods}`);
    }
  }

  public static assertMetaType(metaNode: unknown): asserts metaNode is types.MetaTypes {
    if (
      !(
        metaNode instanceof tsMorph.MethodDeclaration ||
        metaNode instanceof tsMorph.MethodSignature ||
        metaNode instanceof tsMorph.ParameterDeclaration ||
        metaNode instanceof tsMorph.PropertyDeclaration ||
        metaNode instanceof tsMorph.PropertySignature
      )
    ) {
      console.error("The following error was called with a value of:", metaNode);
      throw new TypeError(`Declaration must be a MetaType, received ${typeof metaNode}`);
    }
  }
  public static assertProject(project: unknown): asserts project is tsMorph.Project {
    if (!(project instanceof tsMorph.Project)) {
      throw new TypeError(`Expected project to be an instance of Project, received ${typeof project}`);
    }
  }

  public static assertPaths(paths: unknown): asserts paths is string[] {
    if (!Array.isArray(paths) || !paths.every((path) => typeof path === "string")) {
      throw new TypeError(`Expected paths to be an array of strings, received ${typeof paths}`);
    }
  }

  public static assertExpression(expression: unknown): asserts expression is tsMorph.Expression {
    if (!(expression instanceof tsMorph.Expression)) {
      throw new TypeError(`Expected expression to be an instance of Expression, received ${typeof expression}`);
    }
  }
}
