import * as tsMorph from "ts-morph";
import * as types from "./types.ts";

export function assertVariableDeclaration(declaration: unknown): asserts declaration is tsMorph.VariableDeclaration {
  if (!(declaration instanceof tsMorph.VariableDeclaration)) {
    throw new TypeError(`Declaration must be a VariableDeclaration, received ${typeof declaration}`);
  }
}
export function assertBindingName(bindingName: unknown): asserts bindingName is tsMorph.BindingName {
  if (
    !(bindingName instanceof tsMorph.Identifier || bindingName instanceof tsMorph.ObjectBindingPattern || bindingName instanceof tsMorph.ArrayBindingPattern)
  ) {
    throw new TypeError(`Expected BindingName, received ${typeof bindingName}`);
  }
}
export function assertTypeNode(typeNode: unknown): asserts typeNode is tsMorph.TypeNode {
  if (!(typeNode instanceof tsMorph.TypeNode)) {
    console.error("The following error was called with a value of:", typeNode);
    throw new TypeError(`Expected TypeNode, received ${typeof typeNode}`);
  }
}
export function assertFunctionDeclarationType(declaration: unknown): asserts declaration is tsMorph.FunctionDeclaration {
  if (!(declaration instanceof tsMorph.FunctionDeclaration)) {
    throw new TypeError(`Declaration must be a FunctionDeclaration, received ${typeof declaration}`);
  }
}
export function assertModuleType(declaration: unknown): asserts declaration is tsMorph.ModuleDeclaration {
  if (!(declaration instanceof tsMorph.ModuleDeclaration)) {
    throw new TypeError(`Declaration must be a ModuleDeclaration, received ${typeof declaration}`);
  }
}
export function assertInterfaceDeclaration(declaration: unknown): asserts declaration is tsMorph.InterfaceDeclaration {
  if (!(declaration instanceof tsMorph.InterfaceDeclaration)) {
    throw new TypeError(`Declaration must be an InterfaceDeclaration, received ${typeof declaration}`);
  }
}

export function assertStringOrNull(value: unknown): asserts value is string | null {
  if (typeof value !== "string" && value !== null) {
    throw new TypeError(`Expected value to be a string or null, received ${typeof value}`);
  }
}
export function assertTypeNodeOrUndefined(typeNode: unknown): asserts typeNode is tsMorph.TypeNode | undefined {
  if (typeNode !== undefined && !(typeNode instanceof tsMorph.TypeNode)) {
    throw new TypeError(`Expected TypeNode or undefined, received ${typeof typeNode}`);
  }
}
export function assertConstructSignatures(constructSignatures: unknown): asserts constructSignatures is tsMorph.ConstructSignatureDeclaration[] {
  if (!Array.isArray(constructSignatures) || !constructSignatures.every((sig) => sig instanceof tsMorph.ConstructSignatureDeclaration)) {
    throw new TypeError(`Expected constructSignatures to be an array of ConstructSignatureDeclaration, received ${typeof constructSignatures}`);
  }
}
export function assertConstructSignatureDeclaration(constructSignature: unknown): asserts constructSignature is tsMorph.ConstructSignatureDeclaration {
  if (constructSignature instanceof tsMorph.ConstructSignatureDeclaration) {
    console.error("The following error was called with a value of:", constructSignature);
    throw new TypeError(`Expected constructSignature to be a ConstructSignatureDeclaration, received ${typeof constructSignature}`);
  }
}
export function assertCallSignatures(callSignatures: unknown): asserts callSignatures is tsMorph.CallSignatureDeclaration[] {
  if (!Array.isArray(callSignatures) || !callSignatures.every((sig) => sig instanceof tsMorph.CallSignatureDeclaration)) {
    throw new TypeError(`Expected callSignatures to be an array of CallSignatureDeclaration, received ${typeof callSignatures}`);
  }
}
export function assertConstructorDeclaration(declaration: unknown): asserts declaration is tsMorph.ConstructorDeclaration {
  if (!(declaration instanceof tsMorph.ConstructorDeclaration)) {
    throw new TypeError(`Declaration must be a ConstructorDeclaration, received ${typeof declaration}`);
  }
}
export function assertProperty(property: unknown): asserts property is tsMorph.PropertyDeclaration | tsMorph.PropertySignature {
  if (!(property instanceof tsMorph.PropertyDeclaration || property instanceof tsMorph.PropertySignature)) {
    console.error("The following error was called with a value of:", property);
    throw new TypeError(`Declaration must be a PropertyDeclaration or PropertySignature, received ${typeof property}`);
  }
}
export function assertProperties(variables: unknown): asserts variables is (tsMorph.PropertySignature | tsMorph.PropertyDeclaration)[] {
  if (
    !Array.isArray(variables) ||
    !variables.every((variable) => variable instanceof tsMorph.PropertySignature || variable instanceof tsMorph.PropertyDeclaration)
  ) {
    throw new TypeError(`Expected variables to be an array of PropertySignature, received ${typeof variables}`);
  }
}

export function assertInterfaceOrClassType(declaration: unknown): asserts declaration is tsMorph.InterfaceDeclaration | tsMorph.ClassDeclaration {
  if (!(declaration instanceof tsMorph.InterfaceDeclaration || declaration instanceof tsMorph.ClassDeclaration)) {
    throw new TypeError(`Declaration must be an InterfaceDeclaration or ClassDeclaration, received ${typeof declaration}`);
  }
}
export function assertFunctionType(declaration: unknown): asserts declaration is types.FunctionTypes {
  if (
    !(declaration instanceof tsMorph.FunctionDeclaration || declaration instanceof tsMorph.MethodDeclaration || declaration instanceof tsMorph.MethodSignature)
  ) {
    throw new TypeError(`Declaration must be one of FunctionDeclaration, MethodDeclaration, or MethodSignature, received ${typeof declaration}`);
  }
}
export function assertParameter(declaration: unknown): asserts declaration is tsMorph.ParameterDeclaration {
  if (!(declaration instanceof tsMorph.ParameterDeclaration)) {
    console.log("The following error was called with a value of:", declaration);
    throw new TypeError(`alsdlfkjParameter must be a ParameterDeclaration, received ${typeof declaration}`);
  }
}
export function assertParameters(parameters: unknown): asserts parameters is tsMorph.ParameterDeclaration[] {
  if (!Array.isArray(parameters) || !parameters.every((parameter) => parameter instanceof tsMorph.ParameterDeclaration)) {
    throw new TypeError(`Parameters must be of type ParameterDeclaration, received ${typeof parameters}`);
  }
}
export function assertMemberType(member: unknown): asserts member is types.MemberTypes {
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
export function assertAncestry(ancestry: unknown): asserts ancestry is Set<string> {
  if (!(ancestry instanceof Set)) {
    throw new TypeError(`Ancestry must be a Set, received ${typeof ancestry} with value of ${String(ancestry)}`);
  }
}

export function assertName(name: unknown): asserts name is string {
  if (typeof name !== "string") {
    throw new TypeError(`Expected name to be a string, received ${typeof name} with value of ${String(name)}`);
  }
}
// TODO: Validate against the Ast class once it is implemented.
export function assertAst(ast: unknown): asserts ast is types.Ast {
  if (typeof ast !== "object" || ast === null) {
    throw new TypeError(`Expected ast to be an object, received ${typeof ast}`);
  }
}
export function assertNode(node: unknown): asserts node is tsMorph.Node {
  if (!(node instanceof tsMorph.Node)) {
    throw new TypeError(`Expected node to be an instance of Node, received ${typeof node}`);
  }
}

export function assertKind(kind: unknown): asserts kind is tsMorph.SyntaxKind {
  if (typeof kind !== "number") {
    throw new TypeError(`Expected kind to be a SyntaxKind, received ${typeof kind}`);
  }
}

export function assertHandler(handler: unknown): asserts handler is (node: tsMorph.Node) => types.Ast {
  if (typeof handler !== "function") {
    throw new TypeError(`Expected handler to be a function, received ${typeof handler}`);
  }
}
export function assertUnionTypeNode(node: unknown): asserts node is tsMorph.UnionTypeNode {
  if (!(node instanceof tsMorph.UnionTypeNode)) {
    throw new TypeError(`Expected node to be a UnionTypeNode, received ${typeof node}`);
  }
}
export function assertTypeReferenceNode(node: unknown): asserts node is tsMorph.TypeReferenceNode {
  if (!(node instanceof tsMorph.TypeReferenceNode)) {
    throw new TypeError(`Expected node to be a TypeReferenceNode, received ${typeof node}`);
  }
}
export function assertLiteralTypeNode(node: unknown): asserts node is tsMorph.LiteralTypeNode {
  if (!(node instanceof tsMorph.LiteralTypeNode)) {
    throw new TypeError(`Expected node to be a LiteralTypeNode, received ${typeof node}`);
  }
}
export function assertFunctionTypeNode(node: unknown): asserts node is tsMorph.FunctionTypeNode {
  if (!(node instanceof tsMorph.FunctionTypeNode)) {
    throw new TypeError(`Expected node to be a FunctionTypeNode, received ${typeof node}`);
  }
}
export function assertTypeLiteralNode(node: unknown): asserts node is tsMorph.TypeLiteralNode {
  if (!(node instanceof tsMorph.TypeLiteralNode)) {
    throw new TypeError(`Expected node to be a TypeLiteralNode, received ${typeof node}`);
  }
}
export function assertTypeElementTypes(node: unknown): asserts node is tsMorph.TypeElementTypes {
  if (
    !(node instanceof tsMorph.CallSignatureDeclaration || node instanceof tsMorph.ConstructSignatureDeclaration || node instanceof tsMorph.MethodSignature ||
      node instanceof tsMorph.PropertySignature || node instanceof tsMorph.IndexSignatureDeclaration || node instanceof tsMorph.GetAccessorDeclaration ||
      node instanceof tsMorph.SetAccessorDeclaration)
  ) {
    throw new TypeError(`Expected node to be of type TypeElementTypes, received ${typeof node}`);
  }
}
export function assertTypeParameter(node: unknown): asserts node is tsMorph.TypeParameterDeclaration {
  if (!(node instanceof tsMorph.TypeParameterDeclaration)) {
    throw new TypeError(`Expected node to be a TypeParameterDeclaration, received ${typeof node}`);
  }
}
export function assertIntersectionTypeNode(node: unknown): asserts node is tsMorph.IntersectionTypeNode {
  if (!(node instanceof tsMorph.IntersectionTypeNode)) {
    throw new TypeError(`Expected node to be an IntersectionTypeNode, received ${typeof node}`);
  }
}
export function assertTypeOperatorTypeNode(node: unknown): asserts node is tsMorph.TypeOperatorTypeNode {
  if (!(node instanceof tsMorph.TypeOperatorTypeNode)) {
    throw new TypeError(`Expected node to be a TypeOperatorTypeNode, received ${typeof node}`);
  }
}
export function assertClassType(declaration: unknown): asserts declaration is tsMorph.ClassDeclaration {
  if (!(declaration instanceof tsMorph.ClassDeclaration)) {
    throw new TypeError(`Declaration must be a ClassDeclaration, received ${typeof declaration}`);
  }
}
export function assertTupleTypeNode(node: unknown): asserts node is tsMorph.TupleTypeNode {
  if (!(node instanceof tsMorph.TupleTypeNode)) {
    throw new TypeError(`Expected node to be a TupleTypeNode, received ${typeof node}`);
  }
}
export function assertRestTypeNode(node: unknown): asserts node is tsMorph.RestTypeNode {
  if (!(node instanceof tsMorph.RestTypeNode)) {
    throw new TypeError(`Expected node to be a RestTypeNode, received ${typeof node}`);
  }
}
export function assertParenthesizedTypeNode(node: unknown): asserts node is tsMorph.ParenthesizedTypeNode {
  if (!(node instanceof tsMorph.ParenthesizedTypeNode)) {
    throw new TypeError(`Expected node to be a ParenthesizedTypeNode, received ${typeof node}`);
  }
}
export function assertIndexSignatureNode(node: unknown): asserts node is tsMorph.IndexSignatureDeclaration {
  if (!(node instanceof tsMorph.IndexSignatureDeclaration)) {
    throw new TypeError(`Expected node to be an IndexSignatureDeclaration, received ${typeof node}`);
  }
}
export function assertPropertySignatureNode(node: unknown): asserts node is tsMorph.PropertySignature {
  if (!(node instanceof tsMorph.PropertySignature)) {
    throw new TypeError(`Expected node to be a PropertySignature, received ${typeof node}`);
  }
}
export function assertMappedTypeNode(node: unknown): asserts node is tsMorph.MappedTypeNode {
  if (!(node instanceof tsMorph.MappedTypeNode)) {
    throw new TypeError(`Expected node to be a MappedTypeNode, received ${typeof node}`);
  }
}
export function assertIndexedAccessTypeNode(node: unknown): asserts node is tsMorph.IndexedAccessTypeNode {
  if (!(node instanceof tsMorph.IndexedAccessTypeNode)) {
    throw new TypeError(`Expected node to be an IndexedAccessTypeNode, received ${typeof node}`);
  }
}
export function assertMethodSignatureNode(node: unknown): asserts node is tsMorph.MethodSignature {
  if (!(node instanceof tsMorph.MethodSignature)) {
    throw new TypeError(`Expected node to be a MethodSignature, received ${typeof node}`);
  }
}
export function assertExpressionWithTypeArguments(node: unknown): asserts node is tsMorph.ExpressionWithTypeArguments {
  if (!(node instanceof tsMorph.ExpressionWithTypeArguments)) {
    throw new TypeError(`Expected node to be an ExpressionWithTypeArguments, received ${typeof node}`);
  }
}
export function assertLeftHandSideExpression(node: unknown): asserts node is tsMorph.LeftHandSideExpression {
  if (!(node instanceof tsMorph.LeftHandSideExpression)) {
    throw new TypeError(`Expected node to be a LeftHandSideExpression, received ${typeof node}`);
  }
}
export function assertThisTypeNode(node: unknown): asserts node is tsMorph.ThisTypeNode {
  if (!(node instanceof tsMorph.ThisTypeNode)) {
    throw new TypeError(`Expected node to be a ThisTypeNode, received ${typeof node}`);
  }
}
export function assertConstructorTypeNode(node: unknown): asserts node is tsMorph.ConstructorTypeNode {
  if (!(node instanceof tsMorph.ConstructorTypeNode)) {
    throw new TypeError(`Expected node to be a ConstructorTypeNode, received ${typeof node}`);
  }
}
export function assertTypePredicateNode(node: unknown): asserts node is tsMorph.TypePredicateNode {
  if (!(node instanceof tsMorph.TypePredicateNode)) {
    throw new TypeError(`Expected node to be a TypePredicateNode, received ${typeof node}`);
  }
}
export function assertTypeQueryNode(node: unknown): asserts node is tsMorph.TypeQueryNode {
  if (!(node instanceof tsMorph.TypeQueryNode)) {
    throw new TypeError(`Expected node to be a TypeQueryNode, received ${typeof node}`);
  }
}
export function assertTemplateLiteralTypeNode(node: unknown): asserts node is tsMorph.TemplateLiteralTypeNode {
  if (!(node instanceof tsMorph.TemplateLiteralTypeNode)) {
    throw new TypeError(`Expected node to be a TemplateLiteralTypeNode, received ${typeof node}`);
  }
}
export function assertConditionalTypeNode(node: unknown): asserts node is tsMorph.ConditionalTypeNode {
  if (!(node instanceof tsMorph.ConditionalTypeNode)) {
    throw new TypeError(`Expected node to be a ConditionalTypeNode, received ${typeof node}`);
  }
}
export function assertArrayTypeNode(node: tsMorph.ArrayTypeNode): asserts node is tsMorph.ArrayTypeNode {
  if (!(node instanceof tsMorph.ArrayTypeNode)) {
    throw new TypeError(`Expected ArrayTypeNode, received ${typeof node}`);
  }
}
export function assertIdentifierNode(node: tsMorph.Node): asserts node is tsMorph.Identifier {
  if (!(node instanceof tsMorph.Identifier)) {
    throw new Error(`Expected Identifier node, but received ${node.getKindName()}`);
  }
}
export function assertResolvableType(node: unknown): asserts node is types.ResolvableTypes {
  if (!(node instanceof tsMorph.TypeNode || node instanceof tsMorph.Expression)) {
    throw new TypeError(`Expected node to be a TypeNode or Expression, received ${typeof node}`);
  }
}
export function assertToken(node: tsMorph.ts.Node): asserts node is tsMorph.ts.Token<tsMorph.ts.TokenSyntaxKind> {
  if (!tsMorph.ts.isToken(node)) {
    throw new TypeError(`Expected a token, received ${typeof node}`);
  }
}
export function assertPropertySignatures(properties: tsMorph.PropertySignature[]): asserts properties is tsMorph.PropertySignature[] {
  if (!Array.isArray(properties) || !properties.every((property) => tsMorph.ts.isPropertySignature(property.compilerNode))) {
    throw new TypeError(`Expected properties to be an array of PropertySignature, received ${typeof properties}`);
  }
}
export function assertMethods(methods: unknown): asserts methods is (tsMorph.MethodSignature | tsMorph.MethodDeclaration)[] {
  if (!Array.isArray(methods) || !methods.every((method) => method instanceof tsMorph.MethodSignature || method instanceof tsMorph.MethodDeclaration)) {
    console.error("The following error was called with a value of:", methods);
    throw new Error(`Expected methods to be an array of MethodSignature or MethodDeclaration, received ${typeof methods}`);
  }
}

export function assertMetaType(metaNode: unknown): asserts metaNode is types.MetaTypes {
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
export function assertProject(project: unknown): asserts project is tsMorph.Project {
  if (!(project instanceof tsMorph.Project)) {
    throw new TypeError(`Expected project to be an instance of Project, received ${typeof project}`);
  }
}

export function assertPaths(paths: unknown): asserts paths is string[] {
  if (!Array.isArray(paths) || !paths.every((path) => typeof path === "string")) {
    throw new TypeError(`Expected paths to be an array of strings, received ${typeof paths}`);
  }
}
