import ts from "typescript";
import type {
  BooleanMetaValues,
  ContainerDeclaration,
  DeclarationWithConstructor,
  DeclarationWithName,
} from "./types.ts";

export const metaModifierKinds = [
  ts.SyntaxKind.AbstractKeyword,
  ts.SyntaxKind.AccessorKeyword,
  ts.SyntaxKind.AsyncKeyword,
  ts.SyntaxKind.ConstKeyword,
  ts.SyntaxKind.DeclareKeyword,
  ts.SyntaxKind.DefaultKeyword,
  ts.SyntaxKind.ExportKeyword,
  ts.SyntaxKind.InKeyword,
  ts.SyntaxKind.PrivateKeyword,
  ts.SyntaxKind.ProtectedKeyword,
  ts.SyntaxKind.PublicKeyword,
  ts.SyntaxKind.ReadonlyKeyword,
  ts.SyntaxKind.OutKeyword,
  ts.SyntaxKind.OverrideKeyword,
  ts.SyntaxKind.StaticKeyword,
];

export const metaTokenKinds = [ts.SyntaxKind.DotDotDotToken, ts.SyntaxKind.QuestionToken];

/** Checks if the provided `kind` value is a boolean meta value. */
export function isBooleanMetaValue(kind: ts.SyntaxKind): kind is BooleanMetaValues {
  if (metaModifierKinds.includes(kind)) return true;
  if (metaTokenKinds.includes(kind)) return true;
  return false;
}

export function getBooleanMetaValue(kind: ts.SyntaxKind): string | undefined {
  return ts.tokenToString(kind);
}

export function formatId(id: string, globalPrefix = "") {
  if (id === "prototype" && globalPrefix.endsWith(".prototype")) {
    globalPrefix = globalPrefix.slice(0, -10);
  }
  // return isSymbol(id) ? `${globalPrefix}${id}` : globalPrefix ? `${globalPrefix}.${id}` : id;
  return isSymbol(id) ? `${globalPrefix}${id}` : globalPrefix ? `${globalPrefix}.${id}` : id;
}

export function formatName(name: string, globalPrefix = "") {
  if (name === "prototype" && globalPrefix.endsWith(".prototype")) {
    globalPrefix = globalPrefix.slice(0, -10);
  }
  return isSymbol(name) ? `${globalPrefix}${name}` : globalPrefix ? `${globalPrefix}.${name}` : name;
}

/** Checks if a method or property has symbol notation, e.g. Foo[Symbol.bar] */
export function isSymbol(id: string) {
  return id.startsWith("[") && id.endsWith("]");
}

export function getDeclarationName(
  node: DeclarationWithName,
  sourceFile: ts.SourceFile,
  globalPrefix = "",
): string {
  return formatName(node.name.getText(sourceFile), globalPrefix);
}

export function isDeclarationWithName(
  node: ts.Node,
): node is DeclarationWithName {
  return (
    (ts.isFunctionDeclaration(node) && node.name !== undefined) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isVariableDeclaration(node) ||
    ts.isModuleDeclaration(node) ||
    ts.isTypeAliasDeclaration(node)
  );
}

export function hasConstructSignature(
  node: ts.Node,
): node is DeclarationWithConstructor {
  return ts.isInterfaceDeclaration(node) &&
    node.members.some(ts.isConstructSignatureDeclaration);
}

export function isContainerDeclaration(
  node: ts.Node,
): node is ContainerDeclaration {
  return (ts.isInterfaceDeclaration(node) || ts.isModuleDeclaration(node));
}

export function getKindName(kind: number) {
  switch (ts.SyntaxKind[kind ?? 0]) {
    case "FirstAssignment":
      return "EqualsToken"; // 64
    case "LastPunctuation":
    case "LastAssignment":
    case "LastCompoundAssignment":
    case "LastBinaryOperator":
      return "CaretEqualsToken"; // 79
    case "LastToken":
    case "LastKeyword":
    case "FirstCompoundAssignment":
      return "PlusEqualsToken"; // 65
    case "FirstKeyword":
    case "FirstReservedWord":
      return "BreakKeyword"; // 83
    case "LastReservedWord":
    case "LastTemplateToken":
      return "TemplateTail"; // 18
    case "FirstPunctuation":
    case "FirstFutureReservedWord":
      return "OpenBraceToken"; // 19
    case "FirstJSDocTagNode":
    case "LastFutureReservedWord":
      return "SemicolonToken"; // 27
    case "FirstTypeNode":
      return "FirstTypeNode"; // 82
    case "LastTypeNode":
      return "WhitespaceTrivia"; // 05
    case "FirstToken":
      return "Unknown"; // 0
    case "FirstTriviaToken":
      return "SingleLineCommentTrivia"; // 2
    case "LastTriviaToken":
      return "ConflictMarkerTrivia"; // 7
    case "FirstJSDocNode":
    case "FirstLiteralToken":
      return "NumericLiteral"; // 9
    case "LastLiteralToken":
    case "FirstTemplateToken":
      return "NoSubstitutionTemplateLiteral"; // 15
    case "FirstBinaryOperator":
      return "LessThanToken"; // 30
    case "FirstStatement": // 243
      return "VariableStatement"; // 243
    case "LastStatement":
      return "ColonToken"; // 59
    case "FirstNode":
      return "MinusEqualsToken"; // 66
    case "LastJSDocNode":
    case "LastJSDocTagNode":
      return "AmpersandToken"; // 51
    default:
      return ts.SyntaxKind[kind ?? 0];
  }
}
