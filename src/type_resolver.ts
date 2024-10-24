import ts from "typescript";

import { Ast } from "./ast.ts";
import { formatId, formatName } from "./utils.ts";

export class TypeResolver {
  private idCounter = 4999;
  private typeChecker: ts.TypeChecker;

  constructor(private program: ts.Program) {
    this.typeChecker = this.program.getTypeChecker();
  }
  public resolveType(node: ts.Node, file: ts.SourceFile): Ast {
    if (node.kind === ts.SyntaxKind.UnionType) {
      return this.handleUnionType(node, file);
    }
    if (node.kind === ts.SyntaxKind.ArrayType) {
      return this.handleArrayType(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypeReference) {
      return this.handleTypeReference(node, file);
    }
    if (node.kind === ts.SyntaxKind.Identifier) {
      return this.handleIdentifier(node, file);
    }
    if (node.kind === ts.SyntaxKind.LiteralType) {
      return this.handleLiteralType(node, file);
    }
    if (node.kind === ts.SyntaxKind.StringLiteral) {
      return this.handleStringLiteral(node, file);
    }
    if (node.kind === ts.SyntaxKind.FunctionType) {
      return this.handleFunctionType(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypeLiteral) {
      return this.handleTypeLiteral(node, file);
    }
    if (node.kind === ts.SyntaxKind.IntersectionType) {
      return this.handleIntersectionType(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypeOperator) {
      return this.handleTypeOperator(node, file);
    }
    if (node.kind === ts.SyntaxKind.TupleType) {
      return this.handleTupleType(node, file);
    }
    if (node.kind === ts.SyntaxKind.RestType) {
      return this.handleRestType(node, file);
    }
    if (node.kind === ts.SyntaxKind.ParenthesizedType) {
      return this.handleParenthesizedType(node, file);
    }
    if (node.kind === ts.SyntaxKind.IndexSignature) {
      return this.handleIndexSignature(node, file);
    }
    if (node.kind === ts.SyntaxKind.PropertySignature) {
      return this.handlePropertySignature(node, file);
    }
    if (node.kind === ts.SyntaxKind.MappedType) {
      return this.handleMappedType(node, file);
    }
    if (node.kind === ts.SyntaxKind.IndexedAccessType) {
      return this.handleIndexedAccessType(node, file);
    }
    if (node.kind === ts.SyntaxKind.MethodSignature) {
      return this.handleMethodSignature(node, file);
    }
    if (node.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
      return this.handleExpressionWithTypeArguments(node, file);
    }
    if (node.kind === ts.SyntaxKind.Parameter) {
      return this.getParameter(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypeParameter) {
      return this.getTypeParameter(node, file);
    }
    if (node.kind === ts.SyntaxKind.ThisType) {
      return this.handleThisType(node, file);
    }
    if (node.kind === ts.SyntaxKind.ConstructorType) {
      return this.handleConstructorType(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypePredicate) {
      return this.handleTypePredicate(node, file);
    }
    if (node.kind === ts.SyntaxKind.TypeQuery) {
      return this.handleTypeQuery(node, file);
    }
    if (node.kind === ts.SyntaxKind.TemplateLiteralType) {
      return this.handleTemplateLiteralType(node, file);
    }
    if (node.kind === ts.SyntaxKind.ConditionalType) {
      return this.handleConditionalType(node, file);
    }
    return this.handleDefault(node);
  }

  private handleUnionType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isUnionTypeNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    for (const childType of node.types) {
      const childParam = this.resolveType(childType, file);
      param.addType(childParam);
    }
    return param;
  }

  private handleArrayType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isArrayTypeNode(node)) return this.handleDefault(node);
    const childParameter = this.resolveType(node.elementType, file);
    return this.createAst(node).addType(childParameter);
  }

  private handleTypeReference(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTypeReferenceNode(node)) return this.handleDefault(node);

    let symbol = this.typeChecker.getSymbolAtLocation(node.typeName);

    if (!symbol) {
      const type = this.typeChecker.getTypeAtLocation(node.typeName);
      symbol = type.getSymbol();
    }

    if (symbol && (symbol.flags & ts.SymbolFlags.Alias)) {
      symbol = this.typeChecker.getAliasedSymbol(symbol);
    }

    const referenceName = symbol?.getName();
    console.log("referenceName", referenceName);
    const param = this.createAst(node);
    param.setName(referenceName);

    if (node.typeArguments) {
      for (const childType of node.typeArguments) {
        const childParameter = this.resolveType(childType, file);
        param.addType(childParameter);
      }
    }

    return param;
  }

  private handleIdentifier(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isIdentifier(node)) return this.handleDefault(node);
    return this.createAst(node).setText(node.getText(file));
  }

  private handleLiteralType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isLiteralTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node).addType(this.resolveType(node.literal, file));
  }

  private handleStringLiteral(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isStringLiteral(node)) return this.handleDefault(node);
    return this.createAst(node).setText(node.getText(file));
  }

  private handleFunctionType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isFunctionTypeNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    if (node.parameters) {
      for (const childType of node.parameters) {
        const childParameter = this.getParameter(childType, file);
        param.addParameter(childParameter);
      }
    }
    if (node.type) {
      const childParameter = this.resolveType(node.type, file);
      param.addType(childParameter);
    }
    return param;
  }

  private handleTypeLiteral(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTypeLiteralNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    if (node.members) {
      for (const childType of node.members) {
        const childParameter = this.resolveType(childType, file);
        param.addType(childParameter);
      }
    }
    return param;
  }

  private handleIntersectionType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isIntersectionTypeNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    for (const childType of node.types) {
      const childParameter = this.resolveType(childType, file);
      param.addType(childParameter);
    }
    return param;
  }

  private handleTypeOperator(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTypeOperatorNode(node)) return this.handleDefault(node);
    const type = this.resolveType(node.type, file);
    const param = this.createAst(node).addMeta(node.operator);

    if (param.hasMeta(ts.SyntaxKind.KeyOfKeyword)) {
      // TODO: get keys from type
    } else {
      param.addType(type);
    }
    return param;
  }

  private handleTupleType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTupleTypeNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    for (const childType of node.elements) {
      param.addType(this.resolveType(childType, file));
    }
    return param;
  }

  private handleRestType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isRestTypeNode(node)) return this.handleDefault(node);
    const restType = this.resolveType(node.type, file);
    restType.addMeta(ts.SyntaxKind.DotDotDotToken);
    return restType;
  }

  private handleParenthesizedType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isParenthesizedTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node).addType(this.resolveType(node.type, file));
  }

  private handleIndexSignature(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isIndexSignatureDeclaration(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    for (const childType of node.parameters) {
      param.addParameter(this.resolveType(childType, file));
    }
    param.addType(this.resolveType(node.type, file));
    return param;
  }

  private handlePropertySignature(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isPropertySignature(node)) return this.handleDefault(node);
    const param = this.createAst(node).setName(node.name.getText(file));

    if (node.questionToken !== undefined) {
      param.addMeta(ts.SyntaxKind.QuestionToken);
    }

    if (node.type) {
      param.addType(this.resolveType(node.type, file));
    }
    return param;
  }

  private handleMappedType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isMappedTypeNode(node)) return this.handleDefault(node);
    const param = this.createAst(node).addParameter(
      this.resolveType(node.typeParameter, file),
    );
    if (node.questionToken !== undefined) {
      param.addMeta(ts.SyntaxKind.QuestionToken);
    }
    if (node.readonlyToken !== undefined) {
      param.addMeta(ts.SyntaxKind.ReadonlyKeyword);
    }
    if (node.type) param.addType(this.resolveType(node.type, file));
    return param;
  }

  private handleIndexedAccessType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isIndexedAccessTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node).addType(this.resolveType(node.objectType, file))
      .addParameter(
        this.resolveType(node.indexType, file),
      );
  }

  private handleMethodSignature(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isMethodSignature(node)) return this.handleDefault(node);
    const param = this.createAst(node).setName(node.name.getText(file));
    if (node.questionToken !== undefined) {
      param.addMeta(ts.SyntaxKind.QuestionToken);
    }
    if (node.type) param.addType(this.resolveType(node.type, file));
    if (node.parameters) {
      for (const childType of node.parameters) {
        const childParameter = this.getParameter(childType, file);
        param.addParameter(childParameter);
      }
    }

    if (node.typeParameters) {
      for (const childType of node.typeParameters) {
        const childParameter = this.resolveType(childType, file);
        param.addTypeParameter(childParameter);
      }
    }
    return param;
  }

  private handleExpressionWithTypeArguments(
    node: ts.Node,
    file: ts.SourceFile,
  ) {
    if (!ts.isExpressionWithTypeArguments(node)) {
      return this.handleDefault(node);
    }
    return this.createAst(node).addType(
      this.resolveType(node.expression, file),
    );
  }

  private handleThisType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isThisTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node).setText(node.getText(file));
  }

  private handleConstructorType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isConstructorTypeNode(node)) return this.handleDefault(node);
    const meta = (node.modifiers ?? []).map((n) => n.kind);
    const parameters = this.getParameters(node.parameters, file);
    const typeParameters = this.getTypeParameters(
      node.typeParameters ??
        ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
      file,
    );

    const param = this.createAst(node);
    param.setMeta(meta).setTypeParameters(typeParameters).setParameters(
      parameters,
    ).addType(
      this.getType(node.type, file),
    );
    if (node.name) param.setName(node.name.getText(file));
    return param;
  }

  private handleTypePredicate(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTypePredicateNode(node)) return this.handleDefault(node);
    const param = this.createAst(node);
    param.setName(node.parameterName.getText(file));
    if (node.type) param.addType(this.getType(node.type, file));
    if (node.assertsModifier !== undefined) {
      param.addMeta(ts.SyntaxKind.AssertsKeyword);
    }
    return param;
  }

  private handleTypeQuery(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTypeQueryNode(node)) return this.handleDefault(node);
    return this.createAst(node).setName(node.exprName.getText(file));
  }

  private handleTemplateLiteralType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isTemplateLiteralTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node).setText(node.getText(file));
  }

  private handleConditionalType(node: ts.Node, file: ts.SourceFile) {
    if (!ts.isConditionalTypeNode(node)) return this.handleDefault(node);
    return this.createAst(node)
      .setText(node.getText(file))
      .addType(this.resolveType(node.checkType, file))
      .addType(this.resolveType(node.extendsType, file))
      .addType(this.resolveType(node.trueType, file))
      .addType(this.resolveType(node.falseType, file));
  }

  private handleDefault(node: ts.Node) {
    const param = this.createAst(node);
    if (ts.isToken(node)) {
      const token = ts.tokenToString(node.kind);
      param.setText(token);
    }
    return param;
  }

  //private getMetaFromModifiers(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): string[] {
  //  if (!modifiers) return [];
  //  const meta = new Set<string>();
  //  for (const modifier of modifiers) {
  //    if (isBooleanMetaValue(modifier.kind)) {
  //      const value = getBooleanMetaValue(modifier.kind)!;
  //      if (value !== undefined) meta.add(value);
  //    }
  //  }
  //  return [...meta];
  //}

  /** Resolves the type parameters of a TypeScript type parameter declaration. */
  public getTypeParameters(
    params: ts.NodeArray<ts.TypeParameterDeclaration>,
    sourceFile: ts.SourceFile,
  ): Ast[] {
    const parameters: Ast[] = [];
    if (!params) return parameters;

    for (const typeParameter of params) {
      const parameter = this.getTypeParameter(typeParameter, sourceFile);
      parameters.push(parameter);
    }
    return parameters;
  }

  /** Resolves a single TypeScript type parameter declaration. */
  private getTypeParameter(
    node: ts.Node,
    sourceFile: ts.SourceFile,
    globalPrefix = "",
  ): Ast {
    if (!ts.isTypeParameterDeclaration(node)) return this.handleDefault(node);
    const name = node.name.getText(sourceFile);
    const ast = new Ast(
      formatId(name, globalPrefix),
      formatName(name, globalPrefix),
      node.kind,
    );

    if (node.constraint) {
      ast.addMeta(ts.SyntaxKind.ExtendsKeyword);
      const type = this.resolveType(node.constraint, sourceFile);
      ast.addType(type);
    }

    return ast;
  }

  private getParameters(
    params: ts.NodeArray<ts.ParameterDeclaration>,
    sourceFile: ts.SourceFile,
  ): Ast[] {
    if (!params) return [];

    const parameters: Ast[] = [];
    for (const nodeParameter of params) {
      const parameter = this.getParameter(nodeParameter, sourceFile);
      parameters.push(parameter);
    }
    return parameters;
  }

  private getType(
    typeNode: ts.TypeNode,
    sourceFile: ts.SourceFile,
  ): Ast | undefined {
    return this.resolveType(typeNode, sourceFile);
  }

  private getParameter(node: ts.Node, sourceFile: ts.SourceFile) {
    if (!ts.isParameter(node)) return this.handleDefault(node);
    const name = node.name.getText(sourceFile);
    const parameter = new Ast(name, name, node.kind);

    if (node.questionToken !== undefined) {
      parameter.addMeta(ts.SyntaxKind.QuestionToken);
    }

    if (node.dotDotDotToken !== undefined) {
      parameter.addMeta(ts.SyntaxKind.DotDotDotToken);
    }

    // TODO: Set initializer

    if (node.type) {
      const childParameter = this.resolveType(node.type, sourceFile);
      parameter.addType(childParameter);
    }

    return parameter;
  }

  private createAst(node: ts.Node): Ast {
    // const id = `~${crypto.randomUUID()}`;
    //
    const id = `_${++this.idCounter}`;
    return new Ast(id, id, node.kind);
  }
}
