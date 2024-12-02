import ts from "typescript";
import { Ast } from "./Ast.ts";

type Foo = ts.Node;

export enum NodeProperties {
  Argument = "argument",
  ArgumentExpression = "argumentExpression",
  Arguments = "arguments",
  AssertsModifier = "assertsModifier",
  AsteriskToken = "asteriskToken",
  Attributes = "attributes",
  AwaitModifier = "awaitModifier",
  Block = "block",
  Body = "body",
  CaseBlock = "caseBlock",
  CatchClause = "catchClause",
  CheckType = "checkType",
  Children = "children",
  Class = "class",
  Clauses = "clauses",
  ClosingElement = "closingElement",
  ColonToken = "colonToken",
  Comment = "comment",
  Condition = "condition",
  Constraint = "constraint",
  ContainsOnlyTriviaWhiteSpaces = "containsOnlyTriviaWhiteSpaces",
  DeclarationList = "declarationList",
  Declarations = "declarations",
  Default = "default",
  DotDotDotToken = "dotDotDotToken",
  Elements = "elements",
  ElementType = "elementType",
  ElseStatement = "elseStatement",
  Enabled = "enabled",
  EndOfFileToken = "endOfFileToken",
  EqualsGreaterThanToken = "equalsGreaterThanToken",
  EqualsToken = "equalsToken",
  ExclamationToken = "exclamationToken",
  ExportClause = "exportClause",
  Expression = "expression",
  ExprName = "exprName",
  ExtendsType = "extendsType",
  FalseType = "falseType",
  FileName = "fileName",
  FinallyBlock = "finallyBlock",
  FullName = "fullName",
  HasExtendedUnicodeEscape = "hasExtendedUnicodeEscape",
  HasLeadingNewline = "hasLeadingNewline",
  HasNoDefaultLib = "hasNoDefaultLib",
  HasTrailingComma = "hasTrailingComma",
  HasTrailingNewLine = "hasTrailingNewLine",
  Head = "head",
  HeritageClauses = "heritageClauses",
  ImportClause = "importClause",
  Incrementor = "incrementor",
  IndexType = "indexType",
  Initializer = "initializer",
  IsArrayType = "isArrayType",
  IsBracketed = "isBracketed",
  IsDeclarationFile = "isDeclarationFile",
  IsExportEquals = "isExportEquals",
  IsNameFirst = "isNameFirst",
  IsSpread = "isSpread",
  IsTypeOf = "isTypeOf",
  IsTypeOnly = "isTypeOnly",
  IsUnterminated = "isUnterminated",
  JsDocPropertyTags = "jsDocPropertyTags",
  KeywordToken = "keywordToken",
  Kind = "kind",
  Label = "label",
  LanguageVariant = "languageVariant",
  Left = "left",
  LibReferenceDirectives = "libReferenceDirectives",
  Literal = "literal",
  Members = "members",
  Modifiers = "modifiers",
  ModuleName = "moduleName",
  ModuleReference = "moduleReference",
  ModuleSpecifier = "moduleSpecifier",
  MultiLine = "multiLine",
  Name = "name",
  NamedBindings = "namedBindings",
  Namespace = "namespace",
  NameType = "nameType",
  ObjectAssignmentInitializer = "objectAssignmentInitializer",
  ObjectType = "objectType",
  OpeningElement = "openingElement",
  OpeningFragment = "openingFragment",
  Operand = "operand",
  OperatorToken = "operatorToken",
  ParameterName = "parameterName",
  Parameters = "parameters",
  Path = "path",
  PossiblyExhaustive = "possiblyExhaustive",
  Postfix = "postfix",
  Preserve = "preserve",
  Properties = "properties",
  PropertyName = "propertyName",
  Qualifier = "qualifier",
  QuestionDotToken = "questionDotToken",
  QuestionToken = "questionToken",
  RawText = "rawText",
  ReadonlyToken = "readonlyToken",
  ReferencedFiles = "referencedFiles",
  ResolutionMode = "resolutionMode",
  ResolvedSymbol = "resolvedSymbol",
  Right = "right",
  Statement = "statement",
  Statements = "statements",
  Tag = "tag",
  TagName = "tagName",
  Tags = "tags",
  Template = "template",
  TemplateSpans = "templateSpans",
  Text = "text",
  ThenStatement = "thenStatement",
  Token = "token",
  TrueType = "trueType",
  TryBlock = "tryBlock",
  TupleNameSource = "tupleNameSource",
  Type = "type",
  TypeArguments = "typeArguments",
  TypeExpression = "typeExpression",
  TypeName = "typeName",
  TypeParameter = "typeParameter",
  TypeReferenceDirectives = "typeReferenceDirectives",
  Types = "types",
  Value = "value",
  VariableDeclaration = "variableDeclaration",
  WhenFalse = "whenFalse",
  WhenTrue = "whenTrue",
}

export type AstNodePropertyType = string | boolean | number | object | null | AstNode;

export type AstNode = Partial<{
  argument: AstNodePropertyType;
  argumentExpression: AstNodePropertyType;
  arguments: AstNodePropertyType;
  assertsModifier: AstNodePropertyType;
  asteriskToken: AstNodePropertyType;
  attributes: AstNodePropertyType;
  awaitModifier: AstNodePropertyType;
  block: AstNodePropertyType;
  body: AstNodePropertyType;
  caseBlock: AstNodePropertyType;
  catchClause: AstNodePropertyType;
  checkType: AstNodePropertyType;
  children: AstNodePropertyType;
  class: AstNodePropertyType;
  clauses: AstNodePropertyType;
  closingElement: AstNodePropertyType;
  colonToken: AstNodePropertyType;
  comment: AstNodePropertyType;
  condition: AstNodePropertyType;
  constraint: AstNodePropertyType;
  containsOnlyTriviaWhiteSpaces: AstNodePropertyType;
  declarationList: AstNodePropertyType;
  declarations: AstNodePropertyType;
  default: AstNodePropertyType;
  dotDotDotToken: AstNodePropertyType;
  elements: AstNodePropertyType;
  elementType: AstNodePropertyType;
  elseStatement: AstNodePropertyType;
  enabled: AstNodePropertyType;
  endOfFileToken: AstNodePropertyType;
  equalsGreaterThanToken: AstNodePropertyType;
  equalsToken: AstNodePropertyType;
  exclamationToken: AstNodePropertyType;
  exportClause: AstNodePropertyType;
  expression: AstNodePropertyType;
  exprName: AstNodePropertyType;
  extendsType: AstNodePropertyType;
  falseType: AstNodePropertyType;
  fileName: AstNodePropertyType;
  finallyBlock: AstNodePropertyType;
  fullName: AstNodePropertyType;
  hasExtendedUnicodeEscape: AstNodePropertyType;
  hasLeadingNewline: AstNodePropertyType;
  hasNoDefaultLib: AstNodePropertyType;
  hasTrailingComma: AstNodePropertyType;
  hasTrailingNewLine: AstNodePropertyType;
  head: AstNodePropertyType;
  heritageClauses: AstNodePropertyType;
  importClause: AstNodePropertyType;
  incrementor: AstNodePropertyType;
  indexType: AstNodePropertyType;
  initializer: AstNodePropertyType;
  isArrayType: AstNodePropertyType;
  isBracketed: AstNodePropertyType;
  isDeclarationFile: AstNodePropertyType;
  isExportEquals: AstNodePropertyType;
  isNameFirst: AstNodePropertyType;
  isSpread: AstNodePropertyType;
  isTypeOf: AstNodePropertyType;
  isTypeOnly: AstNodePropertyType;
  isUnterminated: AstNodePropertyType;
  jsDocPropertyTags: AstNodePropertyType;
  keywordToken: AstNodePropertyType;
  kind: AstNodePropertyType;
  label: AstNodePropertyType;
  languageVariant: AstNodePropertyType;
  left: AstNodePropertyType;
  libReferenceDirectives: AstNodePropertyType;
  literal: AstNodePropertyType;
  members: AstNodePropertyType;
  modifiers: AstNodePropertyType;
  moduleName: AstNodePropertyType;
  moduleReference: AstNodePropertyType;
  moduleSpecifier: AstNodePropertyType;
  multiLine: AstNodePropertyType;
  name: AstNodePropertyType;
  namedBindings: AstNodePropertyType;
  namespace: AstNodePropertyType;
  nameType: AstNodePropertyType;
  objectAssignmentInitializer: AstNodePropertyType;
  objectType: AstNodePropertyType;
  openingElement: AstNodePropertyType;
  openingFragment: AstNodePropertyType;
  operand: AstNodePropertyType;
  operatorToken: AstNodePropertyType;
  parameterName: AstNodePropertyType;
  parameters: AstNodePropertyType;
  path: AstNodePropertyType;
  possiblyExhaustive: AstNodePropertyType;
  postfix: AstNodePropertyType;
  preserve: AstNodePropertyType;
  properties: AstNodePropertyType;
  propertyName: AstNodePropertyType;
  qualifier: AstNodePropertyType;
  questionDotToken: AstNodePropertyType;
  questionToken: AstNodePropertyType;
  rawText: AstNodePropertyType;
  readonlyToken: AstNodePropertyType;
  referencedFiles: AstNodePropertyType;
  resolutionMode: AstNodePropertyType;
  resolvedSymbol: AstNodePropertyType;
  right: AstNodePropertyType;
  statement: AstNodePropertyType;
  statements: AstNodePropertyType;
  tag: AstNodePropertyType;
  tagName: AstNodePropertyType;
  tags: AstNodePropertyType;
  template: AstNodePropertyType;
  templateSpans: AstNodePropertyType;
  text: AstNodePropertyType;
  thenStatement: AstNodePropertyType;
  token: AstNodePropertyType;
  trueType: AstNodePropertyType;
  tryBlock: AstNodePropertyType;
  tupleNameSource: AstNodePropertyType;
  type: AstNodePropertyType;
  typeArguments: AstNodePropertyType;
  typeExpression: AstNodePropertyType;
  typeName: AstNodePropertyType;
  typeParameter: AstNodePropertyType;
  typeReferenceDirectives: AstNodePropertyType;
  types: AstNodePropertyType;
  value: AstNodePropertyType;
  variableDeclaration: AstNodePropertyType;
  whenFalse: AstNodePropertyType;
  whenTrue: AstNodePropertyType;
}>;

export default class Properties {
  /**
   * A list of all Typescript Node properties excluding the following:
   *
   * - emitNode
   * - end
   * - flags
   * - flowNode
   * - id
   * - isReferenced
   * - mergeId
   * - modifierFlagsCache
   * - parent
   * - pos
   * - symbol
   * - transformFlags
   */
  public static readonly typescriptNodeProperties = new Set<string>([
    "argument",
    "argumentExpression",
    "arguments",
    "assertsModifier",
    "asteriskToken",
    "attributes",
    "awaitModifier",
    "block",
    "body",
    "caseBlock",
    "catchClause",
    "checkType",
    "children",
    "class",
    "clauses",
    "closingElement",
    "colonToken",
    "comment",
    "condition",
    "constraint",
    "containsOnlyTriviaWhiteSpaces",
    "declarationList",
    "declarations",
    "default",
    "dotDotDotToken",
    "elements",
    "elementType",
    "elseStatement",
    "enabled",
    "endOfFileToken",
    "equalsGreaterThanToken",
    "equalsToken",
    "exclamationToken",
    "exportClause",
    "expression",
    "exprName",
    "extendsType",
    "falseType",
    "fileName",
    "finallyBlock",
    "fullName",
    "hasExtendedUnicodeEscape",
    "hasLeadingNewline",
    "hasNoDefaultLib",
    "hasTrailingComma",
    "hasTrailingNewLine",
    "head",
    "heritageClauses",
    "importClause",
    "incrementor",
    "indexType",
    "initializer",
    "isArrayType",
    "isBracketed",
    "isDeclarationFile",
    "isExportEquals",
    "isNameFirst",
    "isSpread",
    "isTypeOf",
    "isTypeOnly",
    "isUnterminated",
    "jsDocPropertyTags",
    "keywordToken",
    "kind",
    "label",
    "languageVariant",
    "left",
    "libReferenceDirectives",
    "literal",
    "members",
    "modifiers",
    "moduleName",
    "moduleReference",
    "moduleSpecifier",
    "multiLine",
    "name",
    "namedBindings",
    "namespace",
    "nameType",
    "objectAssignmentInitializer",
    "objectType",
    "openingElement",
    "openingFragment",
    "operand",
    "operatorToken",
    "parameterName",
    "parameters",
    "path",
    "possiblyExhaustive",
    "postfix",
    "preserve",
    "properties",
    "propertyName",
    "qualifier",
    "questionDotToken",
    "questionToken",
    "rawText",
    "readonlyToken",
    "referencedFiles",
    "resolutionMode",
    "resolvedSymbol",
    "right",
    "statement",
    "statements",
    "tag",
    "tagName",
    "tags",
    "template",
    "templateSpans",
    "text",
    "thenStatement",
    "token",
    "trueType",
    "tryBlock",
    "tupleNameSource",
    "type",
    "typeArguments",
    "typeExpression",
    "typeName",
    "typeParameter",
    "typeReferenceDirectives",
    "types",
    "value",
    "variableDeclaration",
    "whenFalse",
    "whenTrue",
  ]);

  public static getTypescriptNodeProperties(): Set<string> {
    return this.typescriptNodeProperties;
  }
}
