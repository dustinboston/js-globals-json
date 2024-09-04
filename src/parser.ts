/**
 * @todo Wire up extends and fix inheritance_tests
 * @todo Find and remove the top-level `.new` method that is getting saved to the globals
 * @todo Find an remove the top-level `length` property that is getting saved to globals
 * @todo Find and remove the top-level property `RegExpMatchArrya.prorotype.0`, maybe the full interface
 */

import ts from 'npm:typescript@5.5.3';

import { Ast } from './ast.ts';
import { formatName, isValidMeta, Meta, SerializedAst } from './types.ts';
import { formatId } from './types.ts';

/**
 * The `Parser` class is responsible for parsing TypeScript source files and generating an abstract syntax tree (AST) representation of the code.
 * It iterates over the statements in a source file, converts each of them into an `Ast` object, and stores the serialized AST objects in the `globals` array.
 * The class also maintains various caches and data structures to store information about the parsed code, such as declarations, built-in types, and interfaces.
 */
export class Parser {
    /**
     * Map of declaration names to types
     */
    protected variableDeclarationsByName = new Map<string, string>();

    /**
     * Map of declaration types to their declaration names
     */
    protected variableDeclarationsByType = new Map<string, string>();

    /**
     * List of constructors for quick reference
     */
    protected constructorCache = new Set<string>();

    /**
     * Regular expression to filter out names with invalid characters
     */
    protected badCharsRE = new RegExp(/[^a-zA-Z0-9"\[\]]/g);

    /**
     * An array to store the serialized AST objects for the parsed global declarations.
     */
    protected globals: Record<string, SerializedAst[]> = {};

    /**
     * The Program contains information about the program, including the source files, compiler options, and diagnostics.
     */
    protected program: ts.Program;

    /**
     * The index of the current source file being processed.
     */
    protected currentSourceFile: ts.SourceFile;

    /**
     * Initializes the parser with the provided file paths. Only the entry point files are necessary as the Typescript
     * Program will automatically load the dependencies.
     *
     * @param filePaths - An array of file paths to be parsed.
     */
    constructor(filePaths: string[]) {
        if (filePaths.length === 0) {
            throw new Error('No files to parse');
        }

        this.program = ts.createProgram(filePaths, { noLib: true });
        this.currentSourceFile = this.program.getSourceFiles()[0];
    }

    /**
     * Saves a serialized AST object to the global scope, keyed by the provided ID.
     * If the ID does not already exist in the global scope, a new array is created for it.
     * The serialized AST object is then pushed to the array for the given ID.
     *
     * @param id - The unique identifier to use as the key in the global scope.
     * @param ast - The AST object to serialize and save to the global scope.
     */
    protected saveGlobal(ast: Ast) {
        if (!ast) return;

        const id = ast.getId();
        if (!Object.hasOwn(this.globals, id)) {
            this.globals[id] = [];
        }

        const serialized = ast.serialize();
        this.globals[id].push(serialized);
    }

    /**
     * This is the main entry point for the parser.
     * It iterates over the statements in a source file and converts each of them into an Ast object.
     * @returns An array of Ast objects representing the parsed source file.
     */
    public parse() {
        // Collect all the declarations in the program
        this.collectDeclarations();

        // Then process the program, resolving declarations along the way.
        this.program.getSourceFiles().forEach((sourceFile) => {
            this.currentSourceFile = sourceFile;
            sourceFile.forEachChild((node) => {
                this.visitStatements(node, '');
            });
        });

        return this.globals;
    }

    /**
     * Collects all the declarations (variables, functions, type aliases, and modules) in the program and stores them in a map.
     * This method is called before parsing the source files to gather all the declarations that will be used later.
     */
    protected collectDeclarations(): void {
        // console.log(`// Globals`);
        this.program.getSourceFiles().forEach((sourceFile) => {
            // console.log(`// File: ${sourceFile.fileName} */`);
            ts.forEachChild(sourceFile, (node) => this.visitDeclarations(node, sourceFile));
        });
    }

    /**
     * Visits the TypeScript AST and extracts declarations for variables, functions, and type aliases.
     *
     * - For each declaration, it logs the name and type to the console.
     * - For module declarations, it logs the name and the resolved type of the module body.
     * - The extracted declarations are also stored in a Map for later use.
     *
     * @todo Get parameters for function declarations
     * @todo For module declarations parse the body
     *
     * @param node - The current node being visited in the TypeScript AST.
     */
    protected visitDeclarations(node: ts.Node, sourceFile: ts.SourceFile, globalPrefix = ''): void {
        if (ts.isInterfaceDeclaration(node)) {
            this.visitInterfaceDeclaration(node, sourceFile, globalPrefix);
        }

        if (ts.isVariableDeclaration(node)) {
            return this.visitVariableDeclaration(node, sourceFile, globalPrefix);
        }

        if (ts.isFunctionDeclaration(node)) {
            return this.visitFunctionDeclaration(node, sourceFile, globalPrefix);
        }

        if (ts.isModuleDeclaration(node) && (node.name && node.body)) {
            return this.visitModuleDeclaration(node, sourceFile, globalPrefix);
        }

        node.forEachChild((child: ts.Node) => this.visitDeclarations(child, sourceFile, globalPrefix));
    }

    /**
     * Visits a TypeScript interface declaration node and processes its contents.
     *
     * This method is responsible for:
     * - Extracting the name of the interface declaration and storing it in the `constructorCache`.
     * - Determining if the interface has a constructor signature declaration and adding it to the `constructorCache` if so.
     *
     * @param node - The TypeScript interface declaration node to visit.
     * @param sourceFile - The source file containing the interface declaration.
     * @param globalPrefix - The global prefix to use when formatting the interface name.
     */
    private visitInterfaceDeclaration(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile, globalPrefix = '') {
        const name = formatName(node.name.getText(sourceFile), globalPrefix);

        if (this.hasConstructSignatureDeclaration(node)) {
            this.constructorCache.add(name);
        }
    }

    /**
     * Visits a TypeScript module declaration node and processes its contents.
     *
     * This method is responsible for:
     * - Extracting the name of the module declaration and storing it in the `variableDeclarationsByName` map.
     * - If the module declaration has a body, recursively visiting the child nodes of the body to process any nested declarations.
     *
     * @param node - The TypeScript module declaration node to visit.
     * @param sourceFile - The source file containing the module declaration.
     * @param globalPrefix - The global prefix to use when formatting the module name.
     */
    private visitModuleDeclaration(node: ts.ModuleDeclaration, sourceFile: ts.SourceFile, globalPrefix: string): void {
        if (!node.body) return;

        const name = formatName(node.name.getText(sourceFile), globalPrefix);
        this.variableDeclarationsByName.set(name, name);

        if (ts.isModuleBlock(node.body)) {
            node.forEachChild((child: ts.Node) => this.visitDeclarations(child, sourceFile, name));
        }

        return;
    }

    /**
     * Visits a TypeScript function declaration node and processes its contents.
     *
     * This method is responsible for:
     * - Extracting the name of the function declaration and storing it in the `variableDeclarationsByName` map.
     * - Determining the type of the function declaration, either from the `type` property or by using a fallback value.
     *
     * @param node - The TypeScript function declaration node to visit.
     * @param sourceFile - The source file containing the function declaration.
     * @param globalPrefix - The global prefix to use when formatting the function name.
     */
    private visitFunctionDeclaration(
        node: ts.FunctionDeclaration,
        sourceFile: ts.SourceFile,
        globalPrefix: string,
    ): void {
        if (!node.name) return;

        const name = formatName(node.name.getText(sourceFile), globalPrefix);

        let type = '';
        if (node.type && ts.isToken(node.type)) {
            type = formatName(node.type.getText(sourceFile), globalPrefix);
        } else if (node.type) {
            type = `Uhandled<${ts.SyntaxKind[node.type.kind]}>`;
        }

        this.variableDeclarationsByName.set(name, type);
    }

    /**
     * Visits a TypeScript variable declaration node and processes its contents.
     *
     * This method is responsible for:
     * - Extracting the name of the variable declaration and storing it in the `variableDeclarationsByName` map.
     * - Determining the type of the variable declaration, either from the `type` property or by using a fallback value.
     * - If the variable declaration has a type reference, storing the type name in the `variableDeclarationsByType` map for reverse lookup.
     *
     * @param node - The TypeScript variable declaration node to visit.
     * @param sourceFile - The source file containing the variable declaration.
     * @param globalPrefix - The global prefix to use when formatting the variable name.
     */
    private visitVariableDeclaration(
        node: ts.VariableDeclaration,
        sourceFile: ts.SourceFile,
        globalPrefix: string,
    ): void {
        if (!node.name || !node.type) return;

        const name = formatName(node.name.getText(sourceFile), globalPrefix);

        let type = `Uhandled<${ts.SyntaxKind[node.type.kind]}>`;
        if (ts.isTypeReferenceNode(node.type) && ts.isVariableDeclaration(node)) {
            type = formatName(node.type.typeName.getText(sourceFile), globalPrefix);
            this.variableDeclarationsByType.set(type, name); // Reverse lookup for constructors
        } else if (ts.isToken(node.type)) {
            type = formatName(node.type.getText(sourceFile), globalPrefix);
        }

        this.variableDeclarationsByName.set(name, type);
    }

    /**
     * Visits top-level declarations and signatures in the TypeScript AST and resolves them to their types.
     *
     * @note A switch/case is not used because the is* type-guard functions would still need to be used.
     * @param node The TypeScript AST to parse.
     * @param globalPrefix A value such as 'Object.prototype' or 'Object' to add to binding values.
     */
    protected visitStatements(node: ts.Node, globalPrefix = ''): Ast | undefined {
        switch (node.kind) {
            case ts.SyntaxKind.FunctionDeclaration: {
                if (ts.isFunctionDeclaration(node)) {
                    return this.parseFunctionDeclaration(node, globalPrefix);
                }
                break;
            }

            // Can be ignored because type aliases will be omitted from final output
            case ts.SyntaxKind.TypeAliasDeclaration: {
                if (ts.isTypeAliasDeclaration(node)) {
                    return this.parseTypeAliasDeclaration(node, globalPrefix);
                }
                break;
                // WAS: return; // Skip
            }

            // Variable declarations are only used for reference, handled in visitDeclarations
            case ts.SyntaxKind.VariableDeclaration: {
                // WAS: return; // Skip
                if (ts.isVariableDeclaration(node)) {
                    return this.parseVariableDeclaration(node);
                }
                break;
            }

            // Collect namespace members
            case ts.SyntaxKind.ModuleDeclaration: {
                if (ts.isModuleDeclaration(node)) {
                    return this.parseModuleDeclaration(node, globalPrefix);
                }
                break;
            }

            // This is the primary means of collecting definitions
            case ts.SyntaxKind.InterfaceDeclaration: {
                if (ts.isInterfaceDeclaration(node)) {
                    return this.parseInterfaceDeclaration(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.CallSignature: {
                if (ts.isCallSignatureDeclaration(node)) {
                    return this.parseCallSignatureDeclaration(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.ConstructSignature: {
                // Filtering out items when there isn't a globalPrefix
                if (ts.isConstructSignatureDeclaration(node) && globalPrefix) {
                    return this.parseConstructSignatureDeclaration(node, globalPrefix);
                } else {
                    return;
                }
            }

            case ts.SyntaxKind.HeritageClause: {
                if (ts.isHeritageClause(node)) {
                    return this.parseHeritage(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.IndexSignature: {
                if (ts.isIndexSignatureDeclaration(node)) {
                    return this.parseIndexSignatureDeclaration(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.MethodSignature: {
                if (ts.isMethodSignature(node)) {
                    return this.parseMethodSignature(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.PropertySignature: {
                if (ts.isPropertySignature(node)) {
                    return this.parsePropertySignature(node, globalPrefix);
                }
                break;
            }

            case ts.SyntaxKind.VariableStatement: {
                if (ts.isVariableStatement(node)) {
                    return this.parseVariableStatement(node, globalPrefix);
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
    public visitType(typeNode: ts.Node): Ast { // WAS: ts.TypeNode to scope it to types only
        const sourceFile = this.getCurrentSourceFile();
        // Ids for types aren't needed, so give them a guid
        const parameter = new Ast();
        switch (typeNode.kind) {
            case ts.SyntaxKind.UnionType: {
                if (!ts.isUnionTypeNode(typeNode)) break;
                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.types) {
                    const childParameter = this.visitType(childType);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.ArrayType: {
                if (!ts.isArrayTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                const childParameter = this.visitType(typeNode.elementType);
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
                        const childParameter = this.visitType(childType);
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
                        const childParameter = this.getParameter(childType);
                        parameter.addParameter(childParameter);
                    }
                }
                if (typeNode.type) {
                    const childParameter = this.visitType(typeNode.type);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.TypeLiteral: {
                if (!ts.isTypeLiteralNode(typeNode)) break;

                parameter.setKind(typeNode.kind);

                if (typeNode.members) {
                    for (const childType of typeNode.members) {
                        const childParameter = this.visitType(childType);
                        parameter.addType(childParameter);
                    }
                }
                break;
            }

            case ts.SyntaxKind.IntersectionType: {
                if (!ts.isIntersectionTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.types) {
                    const childParameter = this.visitType(childType);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.TypeOperator: {
                if (!ts.isTypeOperatorNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .setText(ts.SyntaxKind[typeNode.operator])
                    .addType(this.visitType(typeNode.type));
                break;
            }

            case ts.SyntaxKind.TupleType: {
                if (!ts.isTupleTypeNode(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.elements) {
                    parameter.addType(this.visitType(childType));
                }
                break;
            }

            case ts.SyntaxKind.RestType: {
                if (!ts.isRestTypeNode(typeNode)) break;
                // Skip adding a RestType Ast and return the type directly
                const restType = this.visitType(typeNode.type);
                restType.addMeta(ts.SyntaxKind.DotDotDotToken);
                return restType;
            }

            case ts.SyntaxKind.ParenthesizedType: {
                if (!ts.isParenthesizedTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addType(this.visitType(typeNode.type));
                break;
            }

            case ts.SyntaxKind.IndexSignature: {
                if (!ts.isIndexSignatureDeclaration(typeNode)) break;

                parameter.setKind(typeNode.kind);
                for (const childType of typeNode.parameters) {
                    parameter.addParameter(this.visitType(childType));
                }
                parameter.addType(this.visitType(typeNode.type));
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
                    parameter.addType(this.visitType(typeNode.type));
                }
                break;
            }

            case ts.SyntaxKind.MappedType: {
                if (!ts.isMappedTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addParameter(this.visitType(typeNode.typeParameter));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.QuestionToken);
                }

                if (typeNode.readonlyToken !== undefined) {
                    parameter.addMeta(ts.SyntaxKind.ReadonlyKeyword);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type));
                }
                break;
            }

            case ts.SyntaxKind.IndexedAccessType: {
                if (!ts.isIndexedAccessTypeNode(typeNode)) break;

                parameter
                    .setKind(typeNode.kind)
                    .addType(this.visitType(typeNode.objectType))
                    .addParameter(this.visitType(typeNode.indexType));
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
                    parameter.addType(this.visitType(typeNode.type));
                }

                if (typeNode.parameters) {
                    for (const childType of typeNode.parameters) {
                        const childParameter = this.getParameter(childType);
                        parameter.addParameter(childParameter);
                    }
                }

                if (typeNode.typeParameters) {
                    for (const childType of typeNode.typeParameters) {
                        const childParameter = this.visitType(childType);
                        parameter.addTypeParameter(childParameter);
                    }
                }
                break;
            }

            case ts.SyntaxKind.ExpressionWithTypeArguments: {
                if (!ts.isExpressionWithTypeArguments(typeNode)) {
                    break;
                }
                parameter.addType(this.visitType(typeNode.expression)).setKind(typeNode.kind);
                break;
            }

            case ts.SyntaxKind.Parameter: {
                if (!ts.isParameter(typeNode)) break;

                return this.getParameter(typeNode);
            }

            case ts.SyntaxKind.TypeParameter: {
                if (!ts.isTypeParameterDeclaration(typeNode)) break;

                return this.getTypeParameter(typeNode);
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
                const parameters = this.getParameters(typeNode.parameters);
                const typeParameters = this.getTypeParameters(typeNode.typeParameters);

                parameter.setKind(typeNode.kind)
                    .setMeta(meta)
                    .setTypeParameters(typeParameters)
                    .setParameters(parameters)
                    .addType(this.getType(typeNode.type));

                if (typeNode.name) {
                    parameter.setName(typeNode.name.getText(sourceFile));
                }

                break;
            }

            // TODO: Audit this - `parseConstructSignature` requires a globalPrefix. If there isn't one, just return an empty AST.
            case ts.SyntaxKind.ConstructSignature: {
                // Example: `new (...args: string[]): Function;`
                parameter.setKind(typeNode.kind);

                // if (!ts.isConstructSignatureDeclaration(typeNode)) break;
                // return this.parseConstructSignatureDeclaration(typeNode, '');
                break;
            }

            case ts.SyntaxKind.FirstTypeNode: // Same as TypePredicate
            case ts.SyntaxKind.TypePredicate: {
                if (!ts.isTypePredicateNode(typeNode)) break;
                // Example: `value is S`
                parameter.setKind(typeNode.kind)
                    .setName(typeNode.parameterName.getText(sourceFile))
                    .addType(this.getType(typeNode.type));

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
    protected parseModuleDeclaration(node: ts.ModuleDeclaration, globalPrefix = ''): Ast {
        const name = node.name.getText(this.getCurrentSourceFile());
        const meta = this.getMetaFromModifiers(node.modifiers);
        const ast = new Ast()
            .setId(formatId(name, globalPrefix))
            .setName(formatName(name, globalPrefix))
            .setKind(node.kind)
            .setMeta(meta);

        if (node.body && ts.isModuleBlock(node.body)) {
            const statementAsts: Ast[] = [];

            node.body.forEachChild((statement: ts.Node) => {
                const statementAst = this.visitStatements(statement, name);
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
    protected parseIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration, _globalPrefix = ''): Ast {
        const ast = new Ast().setKind(node.kind).addType(this.visitType(node.type));
        for (const parameter of node.parameters) {
            ast.addParameter(this.visitType(parameter));
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
    protected parseInterfaceDeclaration(node: ts.InterfaceDeclaration, globalPrefix = ''): Ast {
        const interfaceName = node.name.getText(this.getCurrentSourceFile());
        const meta = this.getMetaFromModifiers(node.modifiers);
        const ast = new Ast()
            .setId(formatId(interfaceName, globalPrefix))
            .setName(formatName(interfaceName, globalPrefix))
            .setKind(node.kind)
            .setMeta(meta);

        const memberPrefix = this.getPrefixForInterfaceMembers(node);

        for (const member of [...node.members]) {
            const memberAst = this.visitStatements(member, memberPrefix);

            if (memberAst && memberAst instanceof Ast) {
                const memberName = memberAst.getName();

                if (memberName) this.saveGlobal(memberAst);
                ast.addParameter(memberAst);
            }
        }

        // TODO: get properties from extended interface
        if (node.heritageClauses) {
            for (const heritageClause of node.heritageClauses) {
                const heritageAst = this.visitStatements(heritageClause, ast.getName());
                if (heritageAst) ast.addType(heritageAst);
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
    protected parseHeritage(node: ts.HeritageClause, globalPrefix: string): Ast {
        const ast = new Ast().setId(globalPrefix).setKind(node.kind).setName(globalPrefix);
        for (const type of node.types) {
            ast.addType(this.visitType(type));
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
    protected parseCallSignatureDeclaration(node: ts.CallSignatureDeclaration, globalPrefix: string): Ast {
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(globalPrefix)
            .setName(globalPrefix)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters)
            .addType(this.getType(node.type));
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
    protected parseConstructSignatureDeclaration(node: ts.ConstructSignatureDeclaration, globalPrefix: string): Ast {
        if (!globalPrefix) {
            throw new TypeError('parseConstructSignatureDeclaration requires a globalPrefix');
        }

        const bindingName = `${globalPrefix}.new`;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(bindingName)
            .setName(bindingName)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters)
            .addType(this.getType(node.type));
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
    protected parseMethodSignature(node: ts.MethodSignature, globalPrefix: string): Ast | undefined {
        const sourceFile = this.getCurrentSourceFile();
        const methodName = node.name.getText(sourceFile);
        if (!methodName) return;

        const id = methodName;
        const bindingName = methodName;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(formatId(id, globalPrefix))
            .setName(formatName(bindingName, globalPrefix)) // WAS: fullMethodName (which was right)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters)
            .addType(this.getType(node.type));
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
    protected parseFunctionDeclaration(node: ts.FunctionDeclaration, globalPrefix = ''): Ast | undefined {
        if (!node.name) return;

        const sourceFile = this.getCurrentSourceFile();
        const functionName = node.name.getText(sourceFile);
        const ast = new Ast()
            .setId(formatId(functionName, globalPrefix))
            .setName(formatName(functionName, globalPrefix));

        if (ast.getName() && this.variableDeclarationsByName.has(ast.getName()!) || globalPrefix !== '') {
            const parameters = this.getParameters(node.parameters);
            const typeParameters = this.getTypeParameters(node.typeParameters);

            ast.setKind(node.kind)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .addType(this.getType(node.type))
                .setMeta(this.getMetaFromModifiers(node.modifiers));

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
     * @param node - The TypeScript AST node representing the property signature.
     * @param prefix - The prefix to use for the property name.
     * @returns An Ast object representing the parsed property, or undefined if the property name is not valid.
     */
    protected parsePropertySignature(node: ts.PropertySignature, globalPrefix: string): Ast | undefined {
        const sourceFile = this.getCurrentSourceFile();
        if ((node.getFullText(sourceFile)).includes('@deprecated')) return;

        // Strip quotes and reject if there are characters other than alphanum and []
        // Some values are quotes, maybe for literals, e.g. "'prototype'"
        const propertyName = node.name.getText(sourceFile);

        // ============== TODO: Filter bad chars =============
        //
        // Should allow:
        // - Brackets: [Symbol.species],
        // - Quoted strings: "'prototype'",
        // - Underscores: Math.SQRT_2
        //
        // if (this.badCharsRE.test(propertyName)) {
        //     return;
        // }

        return new Ast()
            .setId(formatId(propertyName, globalPrefix))
            .setName(formatName(propertyName, globalPrefix)) // WAS propertyValue
            .setKind(node.kind)
            .addType(this.getType(node.type))
            .setMeta(this.getMetaFromModifiers(node.modifiers));
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
    protected parseVariableDeclaration(node: ts.VariableDeclaration, globalPrefix = ''): Ast {
        const sourceFile = this.getCurrentSourceFile();
        const variableName = node.name.getText(sourceFile);
        const variableType = this.getType(node.type);

        const ast = new Ast()
            .setId(formatId(variableName, globalPrefix))
            .setName(formatName(variableName, globalPrefix))
            .setKind(node.kind)
            .addType(variableType);

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
    protected parseVariableStatement(node: ts.VariableStatement, globalPrefix = ''): Ast {
        const parameters: Ast[] = [];
        const declarationIds: string[] = [];
        node.declarationList.declarations.forEach((declaration) => {
            const declarationAst = this.parseVariableDeclaration(declaration, globalPrefix);
            parameters.push(declarationAst);
            declarationIds.push(declarationAst.getId());
            // WAS: ast.addParameter(declarationAst);
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
    protected parseTypeAliasDeclaration(node: ts.TypeAliasDeclaration, globalPrefix = ''): Ast {
        const id = node.name.getText(this.getCurrentSourceFile());

        const ast = new Ast()
            .setId(formatId(id, globalPrefix))
            .setKind(node.kind)
            .setMeta(this.getMetaFromModifiers(node.modifiers))
            .addType(this.getType(node.type))
            .setTypeParameters(this.getTypeParameters(node.typeParameters));

        return ast;
    }

    /**
     * Extracts a set of modifiers from the provided TypeScript modifier array and converts them to an array of metadata values.
     *
     * @param modifiers - The array of TypeScript modifier nodes to extract metadata from.
     * @returns An array of metadata values extracted from the provided modifiers.
     */
    protected getMetaFromModifiers(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): Meta[] {
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
    protected getTypeParameters(typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>): Ast[] {
        const parameters: Ast[] = [];
        if (!typeParameters) return parameters;

        for (const typeParameter of typeParameters) {
            const parameter = this.getTypeParameter(typeParameter);
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
    protected getTypeParameter(typeParameter: ts.TypeParameterDeclaration, globalPrefix = ''): Ast {
        const sourceFile = this.getCurrentSourceFile();
        const name = typeParameter.name.getText(sourceFile);

        const parameter = new Ast()
            .setId(formatId(name, globalPrefix))
            .setName(formatName(name, globalPrefix))
            .setKind(typeParameter.kind);

        if (typeParameter.constraint) {
            parameter.addMeta(ts.SyntaxKind.ExtendsKeyword);
            const type = this.visitType(typeParameter.constraint);
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
    public getParameters(nodeParameters: ts.NodeArray<ts.ParameterDeclaration>): Ast[] {
        if (!nodeParameters) return [];

        const parameters: Ast[] = [];
        for (const nodeParameter of nodeParameters) {
            const parameter = this.getParameter(nodeParameter);
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
    public getType(typeNode?: ts.TypeNode): Ast | undefined {
        if (!typeNode) return;
        return this.visitType(typeNode);
    }

    /**
     * Resolves a single TypeScript parameter declaration
     *
     * @param nodeParameter - The TypeScript parameter declaration to resolve.
     * @param callee - The name of the calling function (if any).
     * @returns A `ParameterBuilder` object representing the resolved parameter.
     */
    protected getParameter(nodeParameter: ts.ParameterDeclaration) {
        const parameter = new Ast()
            .setName(nodeParameter.name.getText(this.getCurrentSourceFile()))
            .setKind(nodeParameter.kind);

        if (nodeParameter.questionToken !== undefined) {
            parameter.addMeta(ts.SyntaxKind.QuestionToken);
        }

        if (nodeParameter.dotDotDotToken !== undefined) {
            parameter.addMeta(ts.SyntaxKind.DotDotDotToken);
        }

        if (nodeParameter.type) {
            const childParameter = this.visitType(nodeParameter.type);
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
     * @returns The prefix for the members of the interface.
     */
    protected getPrefixForInterfaceMembers(node: ts.InterfaceDeclaration): string {
        const sourceFile = this.getCurrentSourceFile();
        const interfaceName = node.name.getText(sourceFile);
        const hasConstructSignatureDeclaration = this.constructorCache.has(interfaceName); // WAS: this.hasConstructSignatureDeclaration(node, sourceFile, globalPrefix);
        const isInterfaceNameADeclaredVariable = this.variableDeclarationsByName.has(interfaceName);
        const interfaceTypeForDeclaredVariable = this.variableDeclarationsByName.get(interfaceName);

        // If this is a constructor interface, get the declared interface
        if (hasConstructSignatureDeclaration) {
            return this.variableDeclarationsByType.get(interfaceName) ?? '';
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
    protected hasConstructSignatureDeclaration(interfaceDeclaration: ts.InterfaceDeclaration) {
        return interfaceDeclaration.members.some((member) => ts.isConstructSignatureDeclaration(member));
    }

    /**
     * Gets a reference to the source file that is currently being parsed
     * @returns The current source file
     */
    protected getCurrentSourceFile() {
        return this.currentSourceFile;
    }
}
