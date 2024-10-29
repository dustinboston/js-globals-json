import * as tsMorph from "ts-morph";

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

export type FunctionTypes = tsMorph.FunctionDeclaration | tsMorph.MethodDeclaration | tsMorph.MethodSignature;
export type ResolvableTypes = tsMorph.TypeNode | tsMorph.Expression;

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

//import ts from "typescript";
//
//export type BooleanMetaValues = ts.ModifierSyntaxKind | ts.SyntaxKind.DotDotDotToken | ts.SyntaxKind.QuestionToken;
//
//export type DeclarationWithName =
//  | ts.InterfaceDeclaration
//  | ts.VariableDeclaration
//  | (ts.FunctionDeclaration & { name: ts.Identifier })
//  | ts.ModuleDeclaration;
//
//export type DeclarationWithConstructor = ts.InterfaceDeclaration & {
//  members: ts.NodeArray<ts.ConstructSignatureDeclaration>;
//};
//
//export type ContainerDeclaration =
//  | ts.InterfaceDeclaration
//  | ts.ModuleDeclaration;
