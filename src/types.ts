import ts from "typescript";

export type BooleanMetaValues = ts.ModifierSyntaxKind | ts.SyntaxKind.DotDotDotToken | ts.SyntaxKind.QuestionToken;

export type DeclarationWithName =
  | ts.InterfaceDeclaration
  | ts.VariableDeclaration
  | (ts.FunctionDeclaration & { name: ts.Identifier })
  | ts.ModuleDeclaration;

export type DeclarationWithConstructor = ts.InterfaceDeclaration & {
  members: ts.NodeArray<ts.ConstructSignatureDeclaration>;
};

export type ContainerDeclaration =
  | ts.InterfaceDeclaration
  | ts.ModuleDeclaration;
