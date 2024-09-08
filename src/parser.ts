import ts from 'typescript';

import { Ast } from './ast.ts';
import { Meta } from './types.ts';
import { formatId, formatName, isValidMeta } from './utils.ts';
import { AppCache } from './cache.ts';

/**
 * The `Parser` class is responsible for parsing TypeScript source files and generating an abstract syntax tree (AST) representation of the code.
 * It iterates over the statements in a source file, converts each of them into an `Ast` object, and stores the serialized AST objects in the `globals` array.
 * The class also maintains various caches and data structures to store information about the parsed code, such as declarations, built-in types, and interfaces.
 */
export class Parser {
    /**
     * An array to store the serialized AST objects for the parsed global declarations.
     */
    public globals: Record<string, Ast[]> = {};

    /**
     * The Program contains information about the program, including the source files, compiler options, and diagnostics.
     */
    public program: ts.Program;

    /**
     * The cache used by the parser to store and retrieve information about the parsed code.
     */
    public cache: AppCache;

    /**
     * Initializes the parser with the provided file paths. Only the entry point files are necessary as the Typescript
     * Program will automatically load the dependencies.
     *
     * @param filePaths - An array of file paths to be parsed.
     */
    constructor(program: ts.Program, cache: AppCache) {
        if (!program || !cache) {
            throw new TypeError('A program and cache are required');
        }
        this.program = program;
        this.cache = cache;
    }

    /**
     * This is the main entry point for the parser.
     * It iterates over the statements in a source file and converts each of them into an Ast object.
     * @returns An array of Ast objects representing the parsed source file.
     */
    public parse() {
        this.cache.initialize();

        // Then process the program, resolving declarations along the way.
        this.program.getSourceFiles().forEach((sourceFile) => {
            sourceFile.forEachChild((node) => {
                this.visitStatements(node, sourceFile, '');
            });
        });

        return this.globals;
    }

    /**
     * Saves a serialized AST object to the global scope, keyed by the provided ID.
     * If the ID does not already exist in the global scope, a new array is created for it.
     * The serialized AST object is then pushed to the array for the given ID.
     *
     * @param id - The unique identifier to use as the key in the global scope.
     * @param ast - The AST object to serialize and save to the global scope.
     */
    public saveGlobal(ast: Ast) {
        if (!ast) return;

        const id = ast.getId();

        // Ignore ast's whose id starts with ~ (see ast.ts id)
        if (id.startsWith('~')) {
            return;
        }

        if (!Object.hasOwn(this.globals, id)) {
            this.globals[id] = [ast];
            return;
        }

        // Check if this ast is already part of the global
        const newText = JSON.stringify(ast.serialize());
        let hasMatch = false;
        for (const obj of this.globals[id]) {
            const oldText = JSON.stringify(obj.serialize());
            if (newText === oldText) {
                hasMatch = true;
                break;
            }
        }
        if (!hasMatch) {
            this.globals[id].push(ast);
        }
    }

    /**
     * Visits top-level declarations and signatures in the TypeScript AST and resolves them to their types.
     *
     * @note A switch/case is not used because the is* type-guard functions would still need to be used.
     * @param node The TypeScript AST to parse.
     * @param globalPrefix A value such as 'Object.prototype' or 'Object' to add to binding values.
     */
    public visitStatements(node: ts.Node, sourceFile: ts.SourceFile, globalPrefix = ''): Ast | undefined {
        switch (node.kind) {
            case ts.SyntaxKind.FunctionDeclaration: {
                if (ts.isFunctionDeclaration(node)) {
                    return this.parseFunctionDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            // Can be ignored because type aliases will be omitted from final output
            case ts.SyntaxKind.TypeAliasDeclaration: {
                if (ts.isTypeAliasDeclaration(node)) {
                    return this.parseTypeAliasDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            // Variable declarations are only used for reference, handled in visitDeclarations
            case ts.SyntaxKind.VariableDeclaration: {
                if (ts.isVariableDeclaration(node)) {
                    return this.parseVariableDeclaration(node, sourceFile);
                }
                break;
            }

            // Collect namespace members
            case ts.SyntaxKind.ModuleDeclaration: {
                if (ts.isModuleDeclaration(node)) {
                    return this.parseModuleDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            // This is the primary means of collecting definitions
            case ts.SyntaxKind.InterfaceDeclaration: {
                if (ts.isInterfaceDeclaration(node)) {
                    return this.parseInterfaceDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.CallSignature: {
                if (ts.isCallSignatureDeclaration(node)) {
                    return this.parseCallSignatureDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.ConstructSignature: {
                // Filtering out items when there isn't a globalPrefix
                if (ts.isConstructSignatureDeclaration(node) && globalPrefix) {
                    return this.parseConstructSignatureDeclaration(node, sourceFile, globalPrefix);
                } else {
                    return;
                }
            }

            case ts.SyntaxKind.HeritageClause: {
                if (ts.isHeritageClause(node)) {
                    return this.parseHeritage(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.IndexSignature: {
                if (ts.isIndexSignatureDeclaration(node)) {
                    return this.parseIndexSignatureDeclaration(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.MethodSignature: {
                if (ts.isMethodSignature(node)) {
                    return this.parseMethodSignature(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.PropertySignature: {
                if (ts.isPropertySignature(node)) {
                    return this.parsePropertySignature(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.VariableStatement: {
                if (ts.isVariableStatement(node)) {
                    return this.parseVariableStatement(node, sourceFile, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.EndOfFileToken: {
                return;
            }
        }
        console.warn('Unhandled node type:', ts.SyntaxKind[node.kind]);
    }

    /**
     * Resolves the type of a TypeScript type node.
     *
     * @param typeNode - The TypeScript type node to resolve.
     * @param parameter - The `ParameterBuilder` object to update with the resolved type information.
     */
    public visitType(typeNode: ts.Node, sourceFile: ts.SourceFile): Ast {
        const parameter = new Ast();
        switch (typeNode.kind) {
            case ts.SyntaxKind.UnionType: {
                if (!ts.isUnionTypeNode(typeNode)) break;
                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.types) {
                    const childParameter = this.visitType(childType, sourceFile);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.ArrayType: {
                if (!ts.isArrayTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                const childParameter = this.visitType(typeNode.elementType, sourceFile);
                parameter.addType(childParameter);
                break;
            }

            case ts.SyntaxKind.TypeReference: {
                if (!ts.isTypeReferenceNode(typeNode)) break;

                // typeName can be either Identifier or QualifiedName. getText is correct for both. So skip the is* check.
                parameter
                    .setKind(typeNode.kind)
                    .setName(typeNode.typeName.getText(sourceFile));

                if (typeNode.typeArguments) {
                    for (const childType of typeNode.typeArguments) {
                        const childParameter = this.visitType(childType, sourceFile);
                        parameter.addType(childParameter);
                    }
                }

                break;
            }

            case ts.SyntaxKind.Identifier: {
                if (!ts.isIdentifier(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setText(typeNode.getText(sourceFile));
                break;
            }

            case ts.SyntaxKind.LiteralType: {
                if (!ts.isLiteralTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setText(typeNode.getText(sourceFile));
                break;
            }

            case ts.SyntaxKind.FunctionType: {
                if (!ts.isFunctionTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                if (typeNode.parameters) {
                    for (const childType of typeNode.parameters) {
                        const childParameter = this.getParameter(childType, sourceFile);
                        parameter.addParameter(childParameter);
                    }
                }
                if (typeNode.type) {
                    const childParameter = this.visitType(typeNode.type, sourceFile);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.TypeLiteral: {
                if (!ts.isTypeLiteralNode(typeNode)) break;

                parameter.setKind(typeNode.kind);

                if (typeNode.members) {
                    for (const childType of typeNode.members) {
                        const childParameter = this.visitType(childType, sourceFile);
                        parameter.addType(childParameter);
                    }
                }
                break;
            }

            case ts.SyntaxKind.IntersectionType: {
                if (!ts.isIntersectionTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.types) {
                    const childParameter = this.visitType(childType, sourceFile);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.TypeOperator: {
                if (!ts.isTypeOperatorNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setText(ts.SyntaxKind[typeNode.operator])
                    .addType(this.visitType(typeNode.type, sourceFile));
                break;
            }

            case ts.SyntaxKind.TupleType: {
                if (!ts.isTupleTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.elements) {
                    parameter.addType(this.visitType(childType, sourceFile));
                }
                break;
            }

            case ts.SyntaxKind.RestType: {
                if (!ts.isRestTypeNode(typeNode)) break;
                // Skip adding a RestType Ast and return the type directly
                const restType = this.visitType(typeNode.type, sourceFile);
                restType.addMeta(ts.SyntaxKind.DotDotDotToken);
                return restType;
            }

            case ts.SyntaxKind.ParenthesizedType: {
                if (!ts.isParenthesizedTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addType(this.visitType(typeNode.type, sourceFile));
                break;
            }

            case ts.SyntaxKind.IndexSignature: {
                if (!ts.isIndexSignatureDeclaration(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.parameters) {
                    parameter.addParameter(this.visitType(childType, sourceFile));
                }
                parameter.addType(this.visitType(typeNode.type, sourceFile));
                break;
            }

            case ts.SyntaxKind.PropertySignature: {
                if (!ts.isPropertySignature(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setName(typeNode.name.getText(sourceFile));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.QuestionToken);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type, sourceFile));
                }
                break;
            }

            case ts.SyntaxKind.MappedType: {
                if (!ts.isMappedTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addParameter(this.visitType(typeNode.typeParameter, sourceFile));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.QuestionToken);
                }

                if (typeNode.readonlyToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.ReadonlyKeyword);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type, sourceFile));
                }
                break;
            }

            case ts.SyntaxKind.IndexedAccessType: {
                if (!ts.isIndexedAccessTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addType(this.visitType(typeNode.objectType, sourceFile))
                    .addParameter(this.visitType(typeNode.indexType, sourceFile));
                break;
            }

            case ts.SyntaxKind.MethodSignature: {
                if (!ts.isMethodSignature(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setName(typeNode.name.getText(sourceFile));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.QuestionToken);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type, sourceFile));
                }

                if (typeNode.parameters) {
                    for (const childType of typeNode.parameters) {
                        const childParameter = this.getParameter(childType, sourceFile);
                        parameter.addParameter(childParameter);
                    }
                }

                if (typeNode.typeParameters) {
                    for (const childType of typeNode.typeParameters) {
                        const childParameter = this.visitType(childType, sourceFile);
                        parameter.addTypeParameter(childParameter);
                    }
                }
                break;
            }

            case ts.SyntaxKind.ExpressionWithTypeArguments: {
                if (!ts.isExpressionWithTypeArguments(typeNode)) {
                    break;
                }
                parameter.addType(this.visitType(typeNode.expression, sourceFile)).setKind(typeNode.kind);
                break;
            }

            case ts.SyntaxKind.Parameter: {
                if (!ts.isParameter(typeNode)) break;

                return this.getParameter(typeNode, sourceFile);
            }

            case ts.SyntaxKind.TypeParameter: {
                if (!ts.isTypeParameterDeclaration(typeNode)) break;

                return this.getTypeParameter(typeNode, sourceFile);
            }

            case ts.SyntaxKind.ThisType: {
                if (!ts.isThisTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setText(typeNode.getText(sourceFile));
                break;
            }
            case ts.SyntaxKind.ConstructorType: {
                // Example: new () => T
                if (!ts.isConstructorTypeNode(typeNode)) break;
                const meta = this.getMetaFromModifiers(typeNode.modifiers);
                const parameters = this.getParameters(typeNode.parameters, sourceFile);
                const typeParameters = this.getTypeParameters(
                    typeNode.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
                    sourceFile,
                );

                parameter.setKind(typeNode.kind)
                    .setMeta(meta)
                    .setTypeParameters(typeParameters)
                    .setParameters(parameters)
                    .addType(this.getType(typeNode.type, sourceFile));

                if (typeNode.name) {
                    parameter.setName(typeNode.name.getText(sourceFile));
                }

                break;
            }

            case ts.SyntaxKind.ConstructSignature: {
                // Example: `new (...args: string[]): Function;`
                parameter.setKind(typeNode.kind);
                break;
            }

            case ts.SyntaxKind.FirstTypeNode: // Same as TypePredicate
            case ts.SyntaxKind.TypePredicate: {
                if (!ts.isTypePredicateNode(typeNode)) break;
                // Example: `value is S`
                parameter.setKind(typeNode.kind)
                    .setName(typeNode.parameterName.getText(sourceFile));

                if (typeNode.type) {
                    parameter.addType(this.getType(typeNode.type, sourceFile));
                }

                if (typeNode.assertsModifier !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.AssertsKeyword);
                }

                break;
            }
            case ts.SyntaxKind.TypeQuery: {
                if (!ts.isTypeQueryNode(typeNode)) break;
                // Example: `typeof globalThis`
                parameter.setKind(typeNode.kind)
                    .setName(typeNode.exprName.getText(sourceFile));
                break;
            }

            case ts.SyntaxKind.TemplateLiteralType: {
                if (!ts.isTemplateLiteralTypeNode(typeNode)) break;
                // Example: `${number}`
                parameter.setKind(typeNode.kind)
                    .setText(typeNode.getText(sourceFile));

                break;
            }

            case ts.SyntaxKind.ConditionalType: {
                // Example: `T extends (this: infer U, ...args: never) => any ? U : unknown;`
                parameter.setKind(typeNode.kind)
                    .setText(typeNode.getText(sourceFile));

                break;
            }

            default: {
                // Keyword
                if (typeNode.kind >= 83 && typeNode.kind <= 165) {
                    parameter.setKind(typeNode.kind).setText(typeNode.getText(sourceFile));
                    break;
                }

                // Token
                if (typeNode.kind >= 18 && typeNode.kind <= 79) {
                    parameter.setKind(typeNode.kind).setText(typeNode.getText(sourceFile));
                    break;
                }

                break;
            }
        }

        if (parameter.getKind() === undefined) {
            console.error(`visitType: Unhandled kind '${ts.SyntaxKind[typeNode.kind]}'`);
        }

        return parameter;
    }

    /**
     * Parse a module declaration.
     *
     * @example
     * ```
     * declare namespace Intl {
     *     // ...
     * }
     * ```
     *
     * @todo Not handling the case where node.body is a NamespaceDeclaration
     * @param node The module declaration to parse.
     * @returns An array of parsed module declarations.
     */
    public parseModuleDeclaration(node: ts.ModuleDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const name = node.name.getText(sourceFile);
        const meta = this.getMetaFromModifiers(node.modifiers);
        const ast = new Ast().setId(formatId(name, globalPrefix)).setName(formatName(name, globalPrefix)).setKind(node.kind).setMeta(meta);

        if (node.body && ts.isModuleBlock(node.body)) {
            const statementAsts: Ast[] = [];

            node.body.forEachChild((statement: ts.Node) => {
                const statementAst = this.visitStatements(statement, sourceFile, name);
                if (statementAst) statementAsts.push(statementAst);
            });

            ast.setParameters(statementAsts);
        }

        return ast;
    }

    /**
     * Parses an index signature declaration in the TypeScript AST and returns an Ast object representing the index signature.
     * An IndexSignatureDeclaration is a set of parameters surrounded by brackets, followed by a type, e.g. `[A: B]: C`
     *
     * @example
     * ```
     * interface MyInterface {
     *   [key: string]: number;
     * }
     * ```
     *
     * @param node The IndexSignatureDeclaration node to parse.
     * @returns an Ast object representing the parsed IndexSignatureDeclaration.
     */
    public parseIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration, sourceFile: ts.SourceFile, _globalPrefix = ''): Ast {
        const ast = new Ast().setKind(node.kind).addType(this.visitType(node.type, sourceFile));
        for (const parameter of node.parameters) {
            ast.addParameter(this.visitType(parameter, sourceFile));
        }
        return ast;
    }

    /**
     * Parses an interface declaration in the TypeScript AST and returns an Ast object representing the interface.
     *
     * @example
     * ```
     * interface MyInterface {
     *   property1: string;
     *   property2: number;
     *   method1(): void;
     *   method2(param: string): void;
     * }
     * ```
     *
     * @param node - The TypeScript AST node representing the interface declaration.
     * @returns An Ast object representing the parsed interface.
     */
    public parseInterfaceDeclaration(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const interfaceName = node.name.getText(sourceFile);
        const meta = this.getMetaFromModifiers(node.modifiers);
        const ast = new Ast()
            .setId(formatId(interfaceName, ''))
            .setName(formatName(interfaceName, ''))
            .setKind(node.kind)
            .setMeta(meta);

        const memberPrefix = this.getPrefixForInterfaceMembers(node, sourceFile, '');

        for (const member of [...node.members]) {
            const memberAst = this.visitStatements(member, sourceFile, memberPrefix);

            if (memberAst && memberAst instanceof Ast) {
                const memberName = memberAst.getName();

                if (memberName) {
                    if (globalPrefix) {
                        memberAst.changePrefix(interfaceName, globalPrefix);
                    }
                    this.saveGlobal(memberAst);
                }
                ast.addParameter(memberAst);
            }
        }

        // Done parsing interface. Begin extending Object.
        let hasObjectHeritage = interfaceName === 'Object' || interfaceName === 'ObjectConstructor';

        if (node.heritageClauses) {
            for (const heritageClause of node.heritageClauses) {
                const heritageAst = this.visitStatements(heritageClause, sourceFile, ast.getName());
                const heritageName = heritageAst?.getName();
                if (heritageName === 'Object') hasObjectHeritage = true;
                if (heritageAst) ast.addType(heritageAst);
            }
        }

        if (hasObjectHeritage === false) {
            const cachedObject = this.cache.statementsCache.get('Object');
            if (cachedObject) {
                for (const [fileName, statementNode] of cachedObject) {
                    const statementSourceFile = this.program.getSourceFile(fileName);
                    if (statementSourceFile) {
                        const statement = this.visitStatements(statementNode, statementSourceFile, ast.getName());
                        if (statement) {
                            statement?.changePrefix('Object', globalPrefix);
                        }
                    }
                }
            }
        }

        return ast;
    }

    /**
     * Parses a heritage clause in a TypeScript interface or class declaration.
     * A heritage clause specifies the interfaces or classes that the current interface or class extends or implements.
     *
     * @example
     * ```
     * interface MyInterface extends MyBaseInterface, MyOtherInterface {
     *   // ...
     * }
     * ```
     *
     * @param node - The TypeScript AST node representing the heritage clause.
     * @param globalPrefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed heritage clause.
     */
    public parseHeritage(node: ts.HeritageClause, sourceFile: ts.SourceFile, globalPrefix: string): Ast {
        const ast = new Ast().setId(globalPrefix).setKind(node.kind).setName(globalPrefix);
        const nodeTypes = [...node.types];

        for (const extendsType of nodeTypes) {
            const extendsName = extendsType.expression.getText(sourceFile);
            const extendedNodes = this.cache.statementsCache.get(extendsName) ?? [];

            for (const [fileName, extendedNode] of extendedNodes) {
                const statementSourceFile = this.program.getSourceFile(fileName);
                if (statementSourceFile) {
                    const statement = this.visitStatements(extendedNode, statementSourceFile, globalPrefix);
                    if (statement?.getParameters()) {
                        for (const parameter of statement.getParameters()) {
                            parameter.changePrefix(extendsName, globalPrefix);
                            this.saveGlobal(parameter);
                        }
                    }
                }
            }
        }

        return ast;
    }

    /**
     * Parses a call signature declaration in the TypeScript AST and returns an Ast object representing the call signature.
     * A call signature declaration is a function signature that can be used as a type.
     *
     * @example
     * ```
     * interface MyInterface {
     *   method(param: string): void;
     * }
     * ```
     *
     * @param node - The TypeScript AST node representing the call signature declaration.
     * @param globalPrefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed call signature.
     */
    public parseCallSignatureDeclaration(node: ts.CallSignatureDeclaration, sourceFile: ts.SourceFile, globalPrefix: string): Ast {
        const parameters = this.getParameters(node.parameters, sourceFile);
        const typeParameters = this.getTypeParameters(node.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(), sourceFile);

        const ast = new Ast()
            .setId(globalPrefix)
            .setName(globalPrefix)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters);

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }

        return ast;
    }

    /**
     * Parses a construct signature declaration in the TypeScript AST and returns an Ast object representing the construct signature.
     * A construct signature declaration is a special type of function signature declaration that is used to define the constructor of a class.
     *
     * @example The `constructor` method is a construct signature declaration
     * ```
     * class Foo {
     *   constructor(a: string, b: number) {}
     * }
     * ```
     *
     * @example The `new Foo('a', 1)` is a call signature declaration.
     * ```
     * const foo = new Foo('a', 1);
     * ```
     *
     * @param node - The TypeScript AST node representing the construct signature declaration.
     * @param globalPrefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed construct signature.
     */
    public parseConstructSignatureDeclaration(node: ts.ConstructSignatureDeclaration, sourceFile: ts.SourceFile, globalPrefix: string): Ast {
        if (!globalPrefix) {
            throw new TypeError('parseConstructSignatureDeclaration requires a globalPrefix');
        }

        const bindingName = `${globalPrefix}.new`;
        const parameters = this.getParameters(node.parameters, sourceFile);
        const typeParameters = this.getTypeParameters(
            node.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
            sourceFile,
        );

        const ast = new Ast()
            .setId(bindingName)
            .setName(bindingName)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters);

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }
        return ast;
    }

    /**
     * Parses a method signature declaration in the TypeScript AST and returns an Ast object representing the method signature.
     * A method signature declaration is a function signature that is part of an object type.
     *
     * @example
     * ```
     * interface MyInterface {
     *   myMethod(param1: string, param2: number): void;
     * }
     * ```
     *
     * @param node - The TypeScript AST node representing the method signature declaration.
     * @param globalPrefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed method signature, or undefined if the method name is not valid.
     */
    public parseMethodSignature(node: ts.MethodSignature, sourceFile: ts.SourceFile, globalPrefix: string): Ast | undefined {
        const methodName = node.name.getText(sourceFile);
        if (!methodName) return;

        const id = methodName;
        const bindingName = methodName;
        const parameters = this.getParameters(node.parameters, sourceFile);
        const typeParameters = this.getTypeParameters(
            node.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
            sourceFile,
        );

        const ast = new Ast()
            .setId(formatId(id, globalPrefix))
            .setName(formatName(bindingName, globalPrefix))
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters);

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }
        return ast;
    }

    /**
     * Parses a function declaration in the TypeScript AST and returns an Ast object representing the function.
     * If the function is in the declarations or if it has a global prefix, it is a global and should be added to the global object.
     *
     * @example
     * ```
     * function foo(x: number, y: string): void {
     *   // ...
     * }
     * ```
     * @param node - The TypeScript AST node representing the function declaration.
     * @param globalPrefix - The name of a global object that this function belongs to (which makes this a global)
     * @returns An Ast object representing the parsed function, or undefined if the function name is not valid.
     */
    public parseFunctionDeclaration(node: ts.FunctionDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast | undefined {
        if (!node.name) return;

        const functionName = node.name.getText(sourceFile);
        const ast = new Ast()
            .setId(formatId(functionName, globalPrefix))
            .setName(formatName(functionName, globalPrefix));

        const name = ast.getName();
        const hasName = name && this.cache.variableNameToTypeMap.has(name);
        const hasPrefix = globalPrefix !== '';

        if (hasName || hasPrefix) {
            const parameters = this.getParameters(node.parameters, sourceFile);
            const typeParameters = this.getTypeParameters(
                node.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
                sourceFile,
            );

            ast.setKind(node.kind)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .setMeta(this.getMetaFromModifiers(node.modifiers));

            if (node.type) {
                ast.addType(this.getType(node.type, sourceFile));
            }

            this.saveGlobal(ast);
            return ast;
        }
    }

    /**
     * Parses a property signature from the TypeScript AST and returns an Ast object representing the property.
     * A property signature is a property declaration that is part of an object type.
     *
     * @example
     * ```
     * interface MyInterface {
     *   myProperty: string;
     * }
     * ```
     *
     * @todo Determine whether to filter invalid characters
     * Should allow:
     * - Brackets: [Symbol.species],
     * - Quoted strings: "'prototype'",
     * - Underscores: Math.SQRT_2
     *
     * @param node - The TypeScript AST node representing the property signature.
     * @param prefix - The prefix to use for the property name.
     * @returns An Ast object representing the parsed property, or undefined if the property name is not valid.
     */
    public parsePropertySignature(node: ts.PropertySignature, sourceFile: ts.SourceFile, globalPrefix: string): Ast | undefined {
        if ((node.getFullText(sourceFile)).includes('@deprecated')) return;

        const propertyName = node.name.getText(sourceFile);
        const ast = new Ast()
            .setId(formatId(propertyName, globalPrefix))
            .setName(formatName(propertyName, globalPrefix))
            .setKind(node.kind)
            .setMeta(this.getMetaFromModifiers(node.modifiers));

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }

        return ast;
    }

    /**
     * Parses a variable declaration from the TypeScript AST and returns an Ast object representing the variable.
     *
     * @example `NaN: number` is variable declaration
     * ```
     * declare var NaN: number;
     * ```
     *
     * @param node - The TypeScript AST node representing the variable declaration.
     * @returns An Ast object representing the parsed variable.
     */
    public parseVariableDeclaration(node: ts.VariableDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const variableName = node.name.getText(sourceFile);

        const ast = new Ast()
            .setId(formatId(variableName, globalPrefix))
            .setName(formatName(variableName, globalPrefix))
            .setKind(node.kind);

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }

        // Don't save variable declarations.
        this.saveGlobal(ast);
        return ast;
    }

    /**
     * Parses a variable statement from the TypeScript AST and processes the variable declarations within it.
     *
     * @example
     * ```
     * declare var NaN: number;
     * ```
     *
     * @param node - The variable statement node to parse.
     */
    public parseVariableStatement(node: ts.VariableStatement, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const parameters: Ast[] = [];
        const declarationIds: string[] = [];
        node.declarationList.declarations.forEach((declaration) => {
            const declarationAst = this.parseVariableDeclaration(declaration, sourceFile, globalPrefix);
            parameters.push(declarationAst);
            declarationIds.push(declarationAst.getId());
        });

        const meta = this.getMetaFromModifiers(node.modifiers);
        const ast = new Ast()
            .setId(formatId(declarationIds.join('_'), globalPrefix))
            .setKind(node.kind).setMeta(meta);

        return ast;
    }

    /**
     * Parses a TypeScript type alias declaration and returns an Ast object representing it.
     *
     * @example
     * ```typescript
     * declare type PropertyKey = string | number | symbol;
     * ```
     *
     * @param node - The TypeScript AST node representing the type alias declaration.
     * @returns An Ast object representing the parsed type alias.
     */
    public parseTypeAliasDeclaration(node: ts.TypeAliasDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const id = node.name.getText(sourceFile);

        const ast = new Ast()
            .setId(formatId(id, globalPrefix))
            .setKind(node.kind)
            .setMeta(this.getMetaFromModifiers(node.modifiers))
            .setTypeParameters(
                this.getTypeParameters(
                    node.typeParameters ?? ts.factory.createNodeArray<ts.TypeParameterDeclaration>(),
                    sourceFile,
                ),
            );

        if (node.type) {
            ast.addType(this.getType(node.type, sourceFile));
        }

        return ast;
    }

    /**
     * Extracts a set of modifiers from the provided TypeScript modifier array and converts them to an array of metadata values.
     *
     * @param modifiers - The array of TypeScript modifier nodes to extract metadata from.
     * @returns An array of metadata values extracted from the provided modifiers.
     */
    public getMetaFromModifiers(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): Meta[] {
        if (!modifiers) return [];
        const meta = new Set<Meta>();
        for (const modifier of modifiers) {
            if (isValidMeta(modifier.kind)) {
                meta.add(modifier.kind);
            }
        }
        return [...meta];
    }

    /**
     * Resolves the type parameters of a TypeScript type parameter declaration.
     *
     * @param typeParameters - The TypeScript type parameter declarations to resolve.
     * @param syntaxKind - The name of the calling function (if any).
     * @returns An array of `ParameterBuilder` objects representing the resolved type parameters.
     */
    public getTypeParameters(typeParameters: ts.NodeArray<ts.TypeParameterDeclaration>, sourceFile: ts.SourceFile): Ast[] {
        const parameters: Ast[] = [];
        if (!typeParameters) return parameters;

        for (const typeParameter of typeParameters) {
            const parameter = this.getTypeParameter(typeParameter, sourceFile);
            parameters.push(parameter);
        }
        return parameters;
    }

    /**
     * Resolves a single TypeScript type parameter declaration.
     *
     * @param typeParameter - The TypeScript type parameter declaration to resolve.
     * @param sourceFile - The source file containing the type parameter declaration.
     * @returns A `ParameterBuilder` object representing the resolved type parameter.
     */
    public getTypeParameter(typeParameter: ts.TypeParameterDeclaration, sourceFile: ts.SourceFile, globalPrefix = ''): Ast {
        const name = typeParameter.name.getText(sourceFile);

        const parameter = new Ast()
            .setId(formatId(name, globalPrefix))
            .setName(formatName(name, globalPrefix))
            .setKind(typeParameter.kind);

        if (typeParameter.constraint) {
            parameter.addMeta(ts.SyntaxKind.ExtendsKeyword);
            const type = this.visitType(typeParameter.constraint, sourceFile);
            parameter.addType(type);
        }
        return parameter;
    }

    /**
     * Resolves the type of a TypeScript type node, handling various cases such as tokens, union types, and qualified names.
     *
     * @param nodeParameters - The TypeScript type node to resolve.
     * @param sourceFile - The source file containing the type node.
     * @returns An array of strings representing the resolved type names.
     */
    public getParameters(nodeParameters: ts.NodeArray<ts.ParameterDeclaration>, sourceFile: ts.SourceFile): Ast[] {
        if (!nodeParameters) return [];

        const parameters: Ast[] = [];
        for (const nodeParameter of nodeParameters) {
            const parameter = this.getParameter(nodeParameter, sourceFile);
            parameters.push(parameter);
        }
        return parameters;
    }

    /**
     * Resolves the type of a TypeScript type node and returns an AST representing the resolved type.
     *
     * @param typeNode - The TypeScript type node to resolve.
     * @returns A `ParameterBuilder` object representing the resolved type, or `undefined` if `nodeType` is `undefined`.
     */
    public getType(typeNode: ts.TypeNode, sourceFile: ts.SourceFile): Ast | undefined {
        return this.visitType(typeNode, sourceFile);
    }

    /**
     * Resolves a single TypeScript parameter declaration
     *
     * @param nodeParameter - The TypeScript parameter declaration to resolve.
     * @param callee - The name of the calling function (if any).
     * @returns A `ParameterBuilder` object representing the resolved parameter.
     */
    public getParameter(nodeParameter: ts.ParameterDeclaration, sourceFile: ts.SourceFile) {
        const parameter = new Ast()
            .setName(nodeParameter.name.getText(sourceFile))
            .setKind(nodeParameter.kind);

        if (nodeParameter.questionToken !== undefined) {
            parameter.addMeta(ts.SyntaxKind.QuestionToken);
        }

        if (nodeParameter.dotDotDotToken !== undefined) {
            parameter.addMeta(ts.SyntaxKind.DotDotDotToken);
        }

        if (nodeParameter.type) {
            const childParameter = this.visitType(nodeParameter.type, sourceFile);
            parameter.addType(childParameter);
        }
        return parameter;
    }

    /**
     * Gets the prefix for the members of an interface.
     *
     * If the interface has a constructor signature declaration, the prefix is the interface name.
     * If the interface name is a declared variable and the variable type matches the interface name, the prefix is the interface name.
     * Otherwise, the prefix is `{interfaceName}.prototype`.
     *
     * @param node - The interface declaration to get the prefix for.
     * @param sourceFile - The source file containing the interface declaration.
     * @param _globalPrefix - An optional global prefix (not used in this implementation).
     * @returns The prefix for the members of the interface.
     */
    public getPrefixForInterfaceMembers(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile, _globalPrefix = ''): string {
        const interfaceName = node.name.getText(sourceFile);
        const hasConstructSignatureDeclaration = this.cache.constructors.has(interfaceName);
        const isInterfaceNameADeclaredVariable = this.cache.variableNameToTypeMap.has(interfaceName);
        const interfaceTypeForDeclaredVariable = this.cache.variableNameToTypeMap.get(interfaceName);

        // If this is a constructor interface, get the declared interface
        if (hasConstructSignatureDeclaration) {
            return this.cache.variableTypeToNameMap.get(interfaceName) ?? '';
        } else if (isInterfaceNameADeclaredVariable && interfaceTypeForDeclaredVariable === interfaceName) {
            return interfaceName;
        } else {
            return `${interfaceName}.prototype`;
        }
    }

    /**
     * Check if an interface has a ConstructSignatureDeclaration
     *
     * @param interfaceDeclaration - The interface declaration to check
     */
    public hasConstructSignatureDeclaration(interfaceDeclaration: ts.InterfaceDeclaration) {
        return interfaceDeclaration.members.some((member) => ts.isConstructSignatureDeclaration(member));
    }
}
