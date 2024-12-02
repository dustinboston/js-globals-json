import * as tsMorph from "ts-morph";
import ts from "typescript";

export type DeclarationTypes =
  | tsMorph.ClassDeclaration
  | tsMorph.FunctionDeclaration
  | tsMorph.InterfaceDeclaration
  | tsMorph.ModuleDeclaration
  | tsMorph.VariableDeclaration;

export type MemberTypes =
  | tsMorph.CallSignatureDeclaration
  | tsMorph.ConstructSignatureDeclaration
  | tsMorph.ConstructorDeclaration
  | tsMorph.FunctionDeclaration
  | tsMorph.MethodDeclaration
  | tsMorph.MethodSignature;

export type MetaTypes =
  | tsMorph.MethodDeclaration
  | tsMorph.MethodSignature
  | tsMorph.ParameterDeclaration
  | tsMorph.PropertyDeclaration
  | tsMorph.PropertySignature;

export type PropertyOrMethod =
  | tsMorph.PropertySignature
  | tsMorph.PropertyDeclaration
  | tsMorph.MethodSignature
  | tsMorph.MethodDeclaration;

export type FunctionTypes =
  | tsMorph.FunctionDeclaration
  | tsMorph.MethodDeclaration
  | tsMorph.MethodSignature;

export type ResolvableTypes =
  | tsMorph.TypeNode
  | tsMorph.Expression;

export type ValidSyntaxKind =
  | ts.SyntaxKind.CallSignature
  | ts.SyntaxKind.ConstructSignature
  | ts.SyntaxKind.Constructor
  | ts.SyntaxKind.GetAccessor
  | ts.SyntaxKind.SetAccessor
  | ts.SyntaxKind.PropertySignature
  | ts.SyntaxKind.PropertyDeclaration
  | ts.SyntaxKind.MethodSignature
  | ts.SyntaxKind.MethodDeclaration
  | ts.SyntaxKind.FunctionDeclaration
  | ts.SyntaxKind.VariableDeclaration;

export type ParamName = string;
export type ParamType = string;
export type ParamsRecord = Record<ParamName, ParamType>;

// Ast
export type SerializedAst = Partial<{
  /** Whether the param is optional */
  isOptionalParam: boolean;

  /** Whether the param is a rest param */
  isRestParam: boolean;

  /** Whether the method or property is static */
  isStatic: boolean;

  /** Whether the method is asynchronus */
  isAsync: boolean;

  /** The kind of this Ast */
  kind: string;

  /** A literal value */
  literal: string | null;

  /** Children of a global object */
  members: SerializedAst[];

  /** Name of this Ast */
  name: string | null;

  /** The module that this Ast belongs to. */
  namespace: string | null;

  /** The parameters of a method or function */
  params: string; // WAS: ParamsRecord;

  /** Names of objects that this Ast inherits from */
  inheritanceSources: string[];

  /** The return type of methods, properties, global function, or global variables */
  returnType: string | null;
}>;

// Globals
export type VariableName = string;
export type VariableType = string;
export type MemberName = string;

/** Global interfaces such as Array, Map, etc. */
export type GlobalInterfaceName = string;

/** Methods, Properties, and Constructors of Global interfaces, e.g. Array::slice, Number.Infinity */
export type GlobalMembers = Record<MemberName, SerializedAst[]>;

/** Globals grouped by interface name and then by member name */
export type Globals = Record<GlobalInterfaceName, GlobalMembers | SerializedAst[]>;

// Misc
export type PreviouslyParsed = Set<DeclarationTypes>;
export type Ancestry = Set<string>;
