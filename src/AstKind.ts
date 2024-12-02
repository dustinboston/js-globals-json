import { ValidSyntaxKind } from "./Types.ts";
import { SyntaxKind } from "typescript";

export enum AstKind {
  GlobalObject = 1,
  GlobalFunction,
  GlobalVariable,
  Constructor,
  Method,
  Property,
  Event,
  ReturnType,
  Generic,
  Parameter,
  Type,
}

export function fromSyntaxKind(syntaxKind: ValidSyntaxKind): AstKind {
  switch (syntaxKind) {
    case SyntaxKind.CallSignature:
    case SyntaxKind.ConstructSignature:
    case SyntaxKind.Constructor: {
      return AstKind.Constructor;
    }
    case SyntaxKind.GetAccessor:
    case SyntaxKind.SetAccessor:
    case SyntaxKind.PropertySignature:
    case SyntaxKind.PropertyDeclaration: {
      return AstKind.Property;
    }
    case SyntaxKind.MethodSignature:
    case SyntaxKind.MethodDeclaration:
    case SyntaxKind.FunctionDeclaration: {
      return AstKind.Method;
    }
    case SyntaxKind.VariableDeclaration: {
      return AstKind.Property;
    }
    default: {
      throw new TypeError(`Syntax Kind '${SyntaxKind[syntaxKind]}' cannot be converted to an AST kind.`);
    }
  }
}
