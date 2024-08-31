import ts from 'npm:typescript@5.5.3';

import { Ast } from './ast.ts';
import { isValidMeta, Meta, SerializedAst } from './types.ts';

/**
 * The `Parser` class is responsible for parsing TypeScript source files and generating an abstract syntax tree (AST) representation of the code.
 * It iterates over the statements in a source file, converts each of them into an `Ast` object, and stores the serialized AST objects in the `globals` array.
 * The class also maintains various caches and data structures to store information about the parsed code, such as declarations, built-in types, and interfaces.
 */
export class Parser {
    /**
     * Map of declaration variable/types
     */
    private declarations = new Map<string, string>();

    /**
     * Regular expression to filter out names with invalid characters
     */
    private badCharsRE = new RegExp(/[^a-zA-Z0-9"\[\]]/g);

    /**
     * A cache of all source files
     */
    private sourceFiles: ts.SourceFile[] = [];

    /**
     * An intermediate representation of every interface
     */
    private builtIns: Ast[] = [];

    /**
     * @todo replace interfaceCache with this
     * Cache of Ast objects for each interface
     */
    private interfaces: Record<string, Ast[]> = {};

    /**
     * An array to store the serialized AST objects for the parsed global declarations.
     */
    private globals: SerializedAst[] = [];

    /**
     * The Program contains information about the program, including the source files, compiler options, and diagnostics.
     */
    private program: ts.Program;

    /**
     * The index of the current source file being processed.
     */
    private currentSourceFileIndex = 0;

    /**
     * Initializes the parser with the provided file paths.
     *
     * @param filePaths - An array of file paths to be parsed.
     */
    constructor(filePaths: string[]) {
        this.program = ts.createProgram(filePaths, {});
        this.sourceFiles = [...this.program.getSourceFiles()];
    }

    /**
     * This is the main entry point for the parser.
     * It iterates over the statements in a source file and converts each of them into an Ast object.
     * @returns An array of Ast objects representing the parsed source file.
     */
    public parse(): SerializedAst[] {
        for (let i = 0; i < this.sourceFiles.length; i++) {
            this.currentSourceFileIndex = i;
            const sourceFile = this.sourceFiles[i];
            sourceFile.forEachChild((node) => {
                const objectProperty = this.visitDeclarationsAndSignatures(node);
                if (objectProperty) {
                    const interfaceName = objectProperty.getName();
                    if (interfaceName) {
                        if (!Object.hasOwn(this.interfaces, interfaceName)) {
                            this.interfaces[interfaceName] = [];
                        }
                        this.interfaces[interfaceName].push(objectProperty);
                        this.globals.push(objectProperty.serialize());
                    }
                }
            });
        }

        return this.globals;
    }

    /**
     * Gets a serialized list of all builtins that have been parsed
     * @returns The final results of parsing
     */
    public getBuiltIns() {
        return this.builtIns.map((p) => p.serialize());
    }

    /**
     * Gets a reference to the source file that is currently being parsed
     * @returns The current source file
     */
    private getCurrentSourceFile() {
        return this.sourceFiles[this.currentSourceFileIndex];
    }

    /**
     * Visits top-level declarations and signatures in the TypeScript AST and resolves them to their types.
     *
     * @note A switch/case is not used because the is* type-guard functions would still need to be used.
     * @param node The TypeScript AST to parse.
     * @param prefix A value such as 'Object.prototype' or 'Object' to add to binding values.
     */
    private visitDeclarationsAndSignatures(node: ts.Node, prefix = ''): Ast | undefined {
        if (ts.isInterfaceDeclaration(node)) {
            return this.parseInterfaceDeclaration(node);
        } else if (ts.isVariableStatement(node)) {
            return this.parseVariableStatement(node);
        } else if (ts.isVariableDeclaration(node)) {
            return this.parseVariableDeclaration(node);
        } else if (ts.isFunctionDeclaration(node)) {
            return this.parseFunctionDeclaration(node);
        } else if (ts.isMethodSignature(node) && prefix) {
            return this.parseMethodSignature(node, prefix);
        } else if (ts.isPropertySignature(node) && prefix) {
            return this.parsePropertySignature(node, prefix);
        } else if (ts.isConstructSignatureDeclaration(node) && prefix) {
            return this.parseConstructSignatureDeclaration(node, prefix);
        } else if (ts.isCallSignatureDeclaration(node) && prefix) {
            return this.parseCallSignatureDeclaration(node, prefix);
        } else if (ts.isIndexSignatureDeclaration(node)) {
            return this.parseIndexSignatureDeclaration(node);
        } else if (ts.isHeritageClause(node)) {
            return this.parseHeritage(node, prefix);
        }
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
    private parseIndexSignatureDeclaration(node: ts.IndexSignatureDeclaration): Ast {
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
    private parseInterfaceDeclaration(node: ts.InterfaceDeclaration): Ast {
        const name = node.name.getText(this.getCurrentSourceFile());
        const meta = this.getMetaFromModifiers(node.modifiers);
        const iface = new Ast().setKind(node.kind).setName(name).setMeta(meta);

        for (const member of [...node.members]) {
            const childProp = this.visitDeclarationsAndSignatures(member, name);
            if (childProp && childProp instanceof Ast) {
                iface.addParameter(childProp);
            }
        }
        if (node.heritageClauses) {
            for (const heritageClause of node.heritageClauses) {
                const heritage = this.visitDeclarationsAndSignatures(heritageClause, name);
                if (heritage) iface.addType(heritage);
            }
        }
        return iface;
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
     * @param prefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed heritage clause.
     */
    private parseHeritage(node: ts.HeritageClause, prefix: string): Ast {
        const ast = new Ast().setKind(node.kind).setName(prefix);
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
     * @param prefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed call signature.
     */
    private parseCallSignatureDeclaration(node: ts.CallSignatureDeclaration, prefix: string): Ast {
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(prefix)
            .setName(prefix)
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
     * @param prefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed construct signature.
     */
    private parseConstructSignatureDeclaration(node: ts.ConstructSignatureDeclaration, prefix: string): Ast {
        const bindingName = `${prefix}.new`;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(bindingName)
            .setName(prefix)
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
     * @param prefix - The prefix to use for the generated Ast object.
     * @returns An Ast object representing the parsed method signature, or undefined if the method name is not valid.
     */
    private parseMethodSignature(node: ts.MethodSignature, prefix: string): Ast | undefined {
        const sourceFile = this.getCurrentSourceFile();
        const methodName = node.name.getText(sourceFile);
        if (!methodName) return;

        const delimiter = (ts.isComputedPropertyName(node.name)) ? '' : '.';
        const bindingName = `${prefix.split('.')[0]}${delimiter}${methodName}`;
        const fullMethodName = `${prefix}${delimiter}${methodName}`;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(bindingName)
            .setName(fullMethodName)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters)
            .addType(this.getType(node.type));
    }

    /**
     * Parses a function declaration in the TypeScript AST and returns an Ast object representing the function.
     * A function declaration is a function signature that is part of an object type.
     *
     * @example
     * ```
     * function foo(x: number, y: string): void {
     *   // ...
     * }
     * ```
     * @param node - The TypeScript AST node representing the function declaration.
     * @returns An Ast object representing the parsed function, or undefined if the function name is not valid.
     */
    private parseFunctionDeclaration(node: ts.FunctionDeclaration): Ast | undefined {
        if (!node.name) return;

        const sourceFile = this.getCurrentSourceFile();
        const functionName = node.name.getText(sourceFile);
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        return new Ast()
            .setId(functionName)
            .setName(functionName)
            .setKind(node.kind)
            .setParameters(parameters)
            .setTypeParameters(typeParameters)
            .addType(this.getType(node.type))
            .setMeta(this.getMetaFromModifiers(node.modifiers));
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
    private parsePropertySignature(node: ts.PropertySignature, prefix: string): Ast | undefined {
        const sourceFile = this.getCurrentSourceFile();
        if ((node.getFullText(sourceFile)).includes('@deprecated')) return;

        const propertyName = node.name.getText(sourceFile).replace(/"/g, '');
        if (this.badCharsRE.test(propertyName)) {
            return;
        }

        const objectName = prefix.split('.')[0];
        const delimiter = (ts.isComputedPropertyName(node.name) || !propertyName) ? '' : '.';
        const bindingName = `${objectName}${delimiter}${propertyName}`;
        const propertyValue = `${prefix}${delimiter}${propertyName}`;
        const type = this.getType(node.type);

        return new Ast()
            .setId(bindingName)
            .setName(propertyValue)
            .setKind(node.kind)
            .addType(type)
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
    private parseVariableDeclaration(node: ts.VariableDeclaration): Ast {
        const sourceFile = this.getCurrentSourceFile();
        const variableName = node.name.getText(sourceFile);
        const variableType = this.getType(node.type);
        const op = new Ast()
            .setId(variableName)
            .setName(variableName)
            .setKind(node.kind)
            .addType(variableType);

        // Map the declaration to its interfaces
        this.declarations.set(variableName, variableName);
        const constructorName = variableType?.getName();
        if (constructorName) {
            this.declarations.set(constructorName, variableName);
        }

        return op;
    }

    /**
     * Parses a variable statement from the TypeScript AST and processes the variable declarations within it.
     *
     * @example
     * ```
     * const myVariable: string = "Hello, world!";
     * ```
     *
     * @param node - The variable statement node to parse.
     */
    private parseVariableStatement(node: ts.VariableStatement): Ast {
        const modifiers = this.getMetaFromModifiers(node.modifiers);
        const op = new Ast().setMeta(modifiers);
        node.declarationList.forEachChild((child) => {
            const childOp = this.visitDeclarationsAndSignatures(child);
            if (childOp instanceof Ast) op.addParameter(childOp);
        });
        return op;
    }

    /**
     * Extracts a set of modifiers from the provided TypeScript modifier array and converts them to an array of metadata values.
     *
     * @param modifiers - The array of TypeScript modifier nodes to extract metadata from.
     * @returns An array of metadata values extracted from the provided modifiers.
     */
    private getMetaFromModifiers(modifiers: ts.NodeArray<ts.ModifierLike> | undefined): Meta[] {
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
    private getTypeParameters(typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>): Ast[] {
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
    private getTypeParameter(typeParameter: ts.TypeParameterDeclaration) {
        const sourceFile = this.getCurrentSourceFile();
        const parameter = new Ast()
            // .setText(typeParameter.getText(sourceFile))
            .setName(typeParameter.name.getText(sourceFile))
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
     * Resolves the type of a TypeScript type node and returns a `ParameterBuilder` object representing the resolved type.
     *
     * @param nodeType - The TypeScript type node to resolve.
     * @returns A `ParameterBuilder` object representing the resolved type, or `undefined` if `nodeType` is `undefined`.
     */
    public getType(nodeType?: ts.TypeNode): Ast | undefined {
        if (!nodeType) return undefined;
        const parameter = new Ast().setName(nodeType.getText(this.getCurrentSourceFile()));
        if (ts.isTypeParameterDeclaration(nodeType)) {
            const type = this.getTypeParameter(nodeType);
            parameter.addType(type);
        }
        this.visitType(nodeType);
    }

    /**
     * Resolves a single TypeScript parameter declaration
     *
     * @param nodeParameter - The TypeScript parameter declaration to resolve.
     * @param callee - The name of the calling function (if any).
     * @returns A `ParameterBuilder` object representing the resolved parameter.
     */
    private getParameter(nodeParameter: ts.ParameterDeclaration) {
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
     * Resolves the type of a TypeScript type node.
     *
     * @param typeNode - The TypeScript type node to resolve.
     * @param parameter - The `ParameterBuilder` object to update with the resolved type information.
     */
    public visitType(typeNode: ts.Node): Ast { // WAS: ts.TypeNode to scope it to types only
        const sourceFile = this.getCurrentSourceFile();
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

                parameter
                    .setKind(typeNode.kind)
                    // typeName can be either Identifier or QualifiedName. getText is correct for both. So skip the is* check.
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
                    parameter.setName(typeNode.name.getText(this.getCurrentSourceFile()));
                }

                break;
            }
            case ts.SyntaxKind.ConstructSignature: {
                // Example: `new (...args: string[]): Function;`
                if (!ts.isConstructSignatureDeclaration(typeNode)) break;
                // TODO: get a prefix??
                return this.parseConstructSignatureDeclaration(typeNode, '');
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

                // No kind === TODO
                parameter.setText(typeNode.getText(sourceFile));
                break;
            }
        }

        if (parameter.getKind() === undefined) {
            console.error(`Unhandled kind '${ts.SyntaxKind[typeNode.kind]}', for type ${typeNode.getText(sourceFile)}`);
        }

        return parameter;
    }
}
