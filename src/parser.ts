import ts from 'npm:typescript@5.5.3';

import { ObjectProperty } from './object.ts';
import { MetaEnum } from './meta.ts';
import { KindsEnum } from './kinds.ts';

export class Parser {
    /** Map of built-in objects to their types */
    private globalBindings = new Map<string, string>();

    /** List of interfaces to process. */
    private stagedInterfaces = new Map<string, ts.Node[]>();

    /** All interfaces stored for future retrieval. */
    private interfaceCache = new Map<string, ts.Node[]>();

    /** Map of declaration variable/types, e.g. declare var VaribleName: TypeName */
    private declarations = new Map<string, string>();

    /** Regular expression to filter out names with invalid characters */
    private badCharsRE = new RegExp(/[^a-zA-Z0-9"[\]]/g);

    /** Running log of activities for debugging */
    private trace: string[] = [];

    /** Actual result of parsing */
    private finalResults: string[] = [];

    /** A cache of all source files */
    private sourceFiles: ts.SourceFile[] = [];

    /** An intermediate representation of every interface */
    private builtIns: ObjectProperty[] = [];

    /**
     * This is the main entry point for the parser. It creates a file using the TypeScript compiler API and then
     * visits each node looking for interfaces to convert into interop functions.
     *
     * You can call convert multiple times. The data from previous runs will be preserved so that interfaces can build
     * upon previous results. This is how the TypeScript libs are structured.
     *
     * @param file The name of the file to convert
     * @param data The contents of the file to convert
     */
    public parse(file: string, data: string) {
        const sourceFile = ts.createSourceFile(file, data, ts.ScriptTarget.Latest, false);
        this.sourceFiles.push(sourceFile);

        sourceFile.forEachChild(this.visitDeclarationsAndSignatures.bind(this));
    }

    public getBuiltIns() {
        return this.builtIns.map((p) => p.serialize());
    }

    private getCurrentSourceFile() {
        return this.sourceFiles[this.sourceFiles.length - 1];
    }

    private saveBuiltIn(builtIn: ObjectProperty) {
        this.builtIns.push(builtIn);
    }

    /**
     * Save a built-in name into a map of variables to their types.
     * @param key The built-in name
     * @param value The built-in type
     */
    private addToGlobals(key: string, value: string) {
        if (!this.globalBindings.has(key)) {
            this.globalBindings.set(key, value);
        }
    }

    /**
     * Stage a node for processing and add it to the the global cache so that it can be retrieved later.
     * @param objectName The name to associate with the node to be cached
     * @param node The node to cache and process
     */
    private cacheInterface(objectName: string, node: ts.Node) {
        const unprocessedNodes = this.stagedInterfaces.get(objectName) ?? [];
        this.stagedInterfaces.set(objectName, [...unprocessedNodes, node]);

        const interfaceNodes = this.interfaceCache.get(objectName) ?? [];
        this.interfaceCache.set(objectName, [...interfaceNodes, node]);
    }

    /**
     * Process staged interfaces.
     * @param objectName Name of the staged interface to process
     */
    private parseCachedInterface(objectName: string) {
        const unprocessedNodes = this.stagedInterfaces.get(objectName) ?? [];
        for (const node of unprocessedNodes) {
            if (!ts.isInterfaceDeclaration(node)) continue;

            const prefix = this.getPrefix(node);
            if (prefix === undefined) continue;

            this.parseHeritage(node, objectName);
            node.forEachChild((child) => this.visitDeclarationsAndSignatures(child, prefix));
        }
        this.stagedInterfaces.delete(objectName); // Clear processed
    }

    /**
     * Extract a prefix from an interface
     * @param node Interface from which to extract a prefix
     * @returns A prefix
     */
    private getPrefix(node: ts.InterfaceDeclaration): string | undefined {
        const sourceFile = this.getCurrentSourceFile();
        const interfaceName = node.name.getText(sourceFile);
        if (!interfaceName) {
            return undefined;
        }

        if (this.badCharsRE.test(interfaceName)) {
            return undefined;
        }

        const declaredObject = this.declarations.get(interfaceName);
        const builtInName = this.globalBindings.get(interfaceName);

        let prefix = '';
        if (declaredObject && builtInName === interfaceName && interfaceName === declaredObject) {
            prefix = `${interfaceName}`;
        } else if (declaredObject && !builtInName && interfaceName !== declaredObject) {
            prefix = `${declaredObject}`;
        } else {
            prefix = `${interfaceName}.prototype`;
        }

        return prefix;
    }

    /**
     * Processes the heritage clauses of an interface declaration and generates the corresponding interop code.
     *
     * @param node - The interface declaration node.
     * @param objectName - The name of the staged interface to process.
     */
    private parseHeritage(node: ts.InterfaceDeclaration, objectName: string) {
        if (!node.heritageClauses) {
            return;
        }

        const sourceFile = this.getCurrentSourceFile();

        for (const heritageClause of node.heritageClauses) {
            if (heritageClause.token !== ts.SyntaxKind.ExtendsKeyword) {
                continue;
            }
            for (const expressionWithTypeArgs of heritageClause.types) {
                const expression = expressionWithTypeArgs.expression;
                const parentInterfaceName = expression.getText(sourceFile);
                const parentInterfaceType = this.globalBindings.get(parentInterfaceName);
                const declaredVariableType = this.declarations.get(parentInterfaceName);

                let builtInName = '';
                if (!parentInterfaceType && parentInterfaceName !== declaredVariableType && declaredVariableType) {
                    builtInName = declaredVariableType;
                } else if (parentInterfaceType === parentInterfaceName) {
                    builtInName = parentInterfaceType;
                } else {
                    continue;
                }

                const sourceInterfaces = this.interfaceCache.get(builtInName) ?? [];
                if (!sourceInterfaces) continue;

                for (const sourceInterface of sourceInterfaces) {
                    if (!ts.isInterfaceDeclaration(sourceInterface)) continue;

                    const sourceName = sourceInterface.name.getText(sourceFile);
                    const prefix = (sourceName !== parentInterfaceName) ? `${objectName}` : `${objectName}.prototype`;
                    for (const member of sourceInterface.members) {
                        this.visitDeclarationsAndSignatures(member, prefix);
                    }
                }
            }
        }
    }

    /**
     * Visits top-level declarations and signatures in the TypeScript AST and resolves them to their types.
     * @note A switch/case is not used because the is* type-guard functions would still need to be used.
     * @param node The TypeScript AST to parse.
     * @param prefix A value such as 'Object.prototype' or 'Object' to add to binding values.
     */
    private visitDeclarationsAndSignatures(node: ts.Node, prefix = ''): void {
        if (ts.isInterfaceDeclaration(node)) {
            this.parseInterfaceDeclaration(node);
        } else if (ts.isVariableStatement(node)) {
            this.parseVariableStatement(node);
        } else if (ts.isVariableDeclaration(node)) {
            this.parseVariableDeclaration(node);
        } else if (ts.isFunctionDeclaration(node)) {
            this.parseFunctionDeclaration(node);
        } else if (ts.isMethodSignature(node) && prefix && this.globalBindings.has(prefix)) {
            this.parseMethodSignature(node, prefix);
        } else if (ts.isPropertySignature(node) && prefix && this.globalBindings.has(prefix)) {
            this.parsePropertySignature(node, prefix);
        } else if (ts.isConstructSignatureDeclaration(node) && prefix) {
            this.parseConstructSignatureDeclaration(node, prefix);
        } else if (ts.isCallSignatureDeclaration(node) && prefix) {
            this.parseCallSignatureDeclaration(node, prefix);
        }
    }

    /**
     * Parses a call signature declaration from the TypeScript AST and generates interop metadata for it.
     * @param node The call signature declaration node to parse.
     * @param prefix The prefix to use for the generated binding name and value.
     */
    private parseCallSignatureDeclaration(node: ts.CallSignatureDeclaration, prefix: string): void {
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(prefix)
                .setName(prefix)
                .setKind(KindsEnum.Function)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .addType(this.getType(node.type)),
        );
        this.addToGlobals(prefix, prefix);
    }

    /**
     * Parses a constructor signature declaration from the TypeScript AST and generates interop metadata for it.
     * @param node The constructor signature declaration node to parse.
     * @param prefix The prefix to use for the generated binding name and value.
     */
    private parseConstructSignatureDeclaration(node: ts.ConstructSignatureDeclaration, prefix: string): void {
        const bindingName = `${prefix}.new`;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(bindingName)
                .setName(prefix)
                .setKind(KindsEnum.Constructor)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .addType(this.getType(node.type)),
        );
        this.addToGlobals(`"${bindingName}"`, bindingName);
    }

    /**
     * Parses a method signature declaration from the TypeScript AST and generates interop metadata for it.
     * @param node The method signature declaration node to parse.
     * @param prefix The prefix to use for the generated binding name and value.
     */
    private parseMethodSignature(node: ts.MethodSignature, prefix: string): void {
        const sourceFile = this.getCurrentSourceFile();
        const methodName = node.name.getText(sourceFile);
        if (!methodName) return;

        const delimiter = (ts.isComputedPropertyName(node.name)) ? '' : '.';
        const bindingName = `${prefix.split('.')[0]}${delimiter}${methodName}`;
        const fullMethodName = `${prefix}${delimiter}${methodName}`;
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(bindingName)
                .setName(fullMethodName)
                .setKind(KindsEnum.Function)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .addType(this.getType(node.type)),
        );
    }

    /**
     * Parses a function declaration from the TypeScript AST and generates interop metadata for it.
     * @param node The function declaration node to parse.
     */
    private parseFunctionDeclaration(node: ts.FunctionDeclaration): void {
        if (!node.name) return;

        const sourceFile = this.getCurrentSourceFile();
        const functionName = node.name.getText(sourceFile);
        const parameters = this.getParameters(node.parameters);
        const typeParameters = this.getTypeParameters(node.typeParameters);

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(functionName)
                .setName(functionName)
                .setKind(KindsEnum.Function)
                .setParameters(parameters)
                .setTypeParameters(typeParameters)
                .addType(this.getType(node.type))
                .setMeta(this.getModifiers(node.modifiers)),
        );

        this.addToGlobals(functionName, functionName);
    }

    /**
     * Parses a property signature from the TypeScript AST and generates interop metadata for it.
     * @param node The property signature node to parse.
     * @param prefix The prefix to use for the property name.
     */
    private parsePropertySignature(node: ts.PropertySignature, prefix: string): void {
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

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(bindingName)
                .setName(propertyValue)
                .setKind(KindsEnum.Property)
                .addType(this.getType(node.type))
                .setMeta(this.getModifiers(node.modifiers)),
        );
        this.addToGlobals(bindingName, propertyValue);
    }

    /**
     * Parses a variable declaration from the TypeScript AST and generates interop metadata for it.
     * @param node - The variable declaration node to parse.
     */
    private parseVariableDeclaration(node: ts.VariableDeclaration): void {
        const sourceFile = this.getCurrentSourceFile();
        const objectName = node.name.getText(sourceFile);

        // Don't process if the interface has already been declared.
        if (this.declarations.get(objectName)) {
            return;
        }

        this.saveBuiltIn(
            new ObjectProperty()
                .setId(objectName)
                .setName(objectName)
                .setKind(KindsEnum.Variable)
                .addType(this.getType(node.type)),
        );

        this.addToGlobals(objectName, objectName);
        this.declarations.set(objectName, objectName); // Initial value maps to self.

        if (!node.type) {
            return;
        }

        // Process constructor and static methods, overwrite initial value with constructor interface.
        const constructorInterfaceName = node.type.getText(sourceFile);
        this.declarations.set(objectName, constructorInterfaceName);
        this.declarations.set(constructorInterfaceName, objectName);

        this.parseCachedInterface(constructorInterfaceName);
        this.parseCachedInterface(objectName);
    }

    /**
     * Parses a variable statement from the TypeScript AST and processes the variable declarations within it.
     * @param node - The variable statement node to parse.
     */
    private parseVariableStatement(node: ts.VariableStatement): void {
        node.declarationList.forEachChild(this.visitDeclarationsAndSignatures.bind(this));
    }

    /**
     * Parses an interface declaration from the TypeScript AST and processes the interface.
     * @param node - The interface declaration node to parse.
     */
    private parseInterfaceDeclaration(node: ts.InterfaceDeclaration): void {
        const sourceFile = this.getCurrentSourceFile();
        const objectName = node.name.getText(sourceFile);
        this.cacheInterface(objectName, node);
        if (this.globalBindings.has(objectName)) {
            this.parseCachedInterface(objectName);
        }
    }

    private getModifiers(modifiers: ts.NodeArray<ts.ModifierLike> | undefined) {
        if (!modifiers) return [];
        const meta = new Set<MetaEnum>();
        for (const modifier of modifiers) {
            switch (modifier.kind) {
                case ts.SyntaxKind.AbstractKeyword: {
                    meta.add(MetaEnum.Abstract);
                    break;
                }

                case ts.SyntaxKind.AccessorKeyword: {
                    meta.add(MetaEnum.Accessor);
                    break;
                }

                case ts.SyntaxKind.AsyncKeyword: {
                    meta.add(MetaEnum.Async);
                    break;
                }

                case ts.SyntaxKind.ConstKeyword: {
                    meta.add(MetaEnum.Const);
                    break;
                }

                case ts.SyntaxKind.DeclareKeyword: {
                    meta.add(MetaEnum.Declare);
                    break;
                }

                case ts.SyntaxKind.DefaultKeyword: {
                    meta.add(MetaEnum.Default);
                    break;
                }

                case ts.SyntaxKind.ExportKeyword: {
                    meta.add(MetaEnum.Export);
                    break;
                }

                case ts.SyntaxKind.InKeyword: {
                    meta.add(MetaEnum.In);
                    break;
                }

                case ts.SyntaxKind.PrivateKeyword: {
                    meta.add(MetaEnum.Private);
                    break;
                }

                case ts.SyntaxKind.ProtectedKeyword: {
                    meta.add(MetaEnum.Protected);
                    break;
                }

                case ts.SyntaxKind.PublicKeyword: {
                    meta.add(MetaEnum.Public);
                    break;
                }

                case ts.SyntaxKind.OutKeyword: {
                    meta.add(MetaEnum.Out);
                    break;
                }

                case ts.SyntaxKind.OverrideKeyword: {
                    meta.add(MetaEnum.Override);
                    break;
                }

                case ts.SyntaxKind.ReadonlyKeyword: {
                    meta.add(MetaEnum.ReadOnly);
                    break;
                }

                case ts.SyntaxKind.StaticKeyword: {
                    meta.add(MetaEnum.Static);
                    break;
                }
            }
        }
        return [...meta];
    }

    /**
     * Resolves the type parameters of a TypeScript type parameter declaration.
     * @param typeParameters - The TypeScript type parameter declarations to resolve.
     * @param syntaxKind - The name of the calling function (if any).
     * @returns An array of `ParameterBuilder` objects representing the resolved type parameters.
     */
    private getTypeParameters(typeParameters?: ts.NodeArray<ts.TypeParameterDeclaration>): ObjectProperty[] {
        const parameters: ObjectProperty[] = [];
        if (!typeParameters) return parameters;

        for (const typeParameter of typeParameters) {
            const parameter = this.getTypeParameter(typeParameter);
            parameters.push(parameter);
        }
        return parameters;
    }

    /**
     * Resolves a single TypeScript type parameter declaration.
     * @param typeParameter - The TypeScript type parameter declaration to resolve.
     * @param sourceFile - The source file containing the type parameter declaration.
     * @returns A `ParameterBuilder` object representing the resolved type parameter.
     */
    private getTypeParameter(typeParameter: ts.TypeParameterDeclaration) {
        const sourceFile = this.getCurrentSourceFile();
        const parameter = new ObjectProperty()
            .setText(typeParameter.getText(sourceFile))
            .setName(typeParameter.name.getText(sourceFile))
            .setKind(KindsEnum.Function);

        if (typeParameter.constraint) {
            parameter.addMeta(MetaEnum.Extends);
            const type = this.visitType(typeParameter.constraint);
            parameter.addType(type);
        }
        return parameter;
    }

    /**
     * Resolves the type of a TypeScript type node, handling various cases such as tokens, union types, and qualified names.
     * @param nodeParameters - The TypeScript type node to resolve.
     * @param sourceFile - The source file containing the type node.
     * @returns An array of strings representing the resolved type names.
     */
    public getParameters(nodeParameters: ts.NodeArray<ts.ParameterDeclaration>): ObjectProperty[] {
        if (!nodeParameters) return [];

        const parameters: ObjectProperty[] = [];
        for (const nodeParameter of nodeParameters) {
            const parameter = this.getParameter(nodeParameter);
            parameters.push(parameter);
        }
        return parameters;
    }

    /**
     * Resolves the type of a TypeScript type node and returns a `ParameterBuilder` object representing the resolved type.
     * @param nodeType - The TypeScript type node to resolve.
     * @returns A `ParameterBuilder` object representing the resolved type, or `undefined` if `nodeType` is `undefined`.
     */
    public getType(nodeType?: ts.TypeNode): ObjectProperty | undefined {
        if (!nodeType) return undefined;
        const parameter = new ObjectProperty().setName(nodeType.getText(this.getCurrentSourceFile()));
        if (ts.isTypeParameterDeclaration(nodeType)) {
            const type = this.getTypeParameter(nodeType);
            parameter.addType(type);
        }
        this.visitType(nodeType);
    }

    /**
     * Resolves a single TypeScript parameter declaration
     * @param nodeParameter - The TypeScript parameter declaration to resolve.
     * @param callee - The name of the calling function (if any).
     * @returns A `ParameterBuilder` object representing the resolved parameter.
     */
    private getParameter(nodeParameter: ts.ParameterDeclaration) {
        const parameter = new ObjectProperty()
            .setName(nodeParameter.name.getText(this.getCurrentSourceFile()));

        if (nodeParameter.questionToken !== undefined) {
            parameter.addMeta(MetaEnum.Optional);
        }

        if (nodeParameter.dotDotDotToken !== undefined) {
            parameter.addMeta(MetaEnum.Rest);
        }

        if (nodeParameter.type) {
            const childParameter = this.visitType(nodeParameter.type);
            parameter.addType(childParameter);
        }
        return parameter;
    }

    /**
     * Resolves the type of a TypeScript type node.
     * @param typeNode - The TypeScript type node to resolve.
     * @param parameter - The `ParameterBuilder` object to update with the resolved type information.
     */
    public visitType(typeNode: ts.Node) { // WAS: ts.TypeNode to scope it to types only
        const sourceFile = this.getCurrentSourceFile();
        const parameter = new ObjectProperty();

        if (ts.isUnionTypeNode(typeNode)) {
            // UnionTypeNode: string | number | boolean
            parameter.setKind(KindsEnum.Union);
            for (const childType of typeNode.types) {
                const childParameter = this.visitType(childType);
                parameter.addType(childParameter);
            }
        } else if (ts.isArrayTypeNode(typeNode)) {
            // ArrayTypeNode: add a [] after the type, e.g. string[]
            parameter.setKind(KindsEnum.Array);
            const childParameter = this.visitType(typeNode.elementType);
            parameter.addType(childParameter);
        } else if (ts.isTypeReferenceNode(typeNode)) {
            // ReferenceNode: typeArguments, typeName, e.g. typeArguments<typeName>, or just a reference to another object
            parameter.setKind(KindsEnum.Reference);
            if (typeNode.typeArguments) {
                for (const childType of typeNode.typeArguments) {
                    const childParameter = this.visitType(childType);
                    parameter.addType(childParameter);
                }
            }

            // typeName can be either Identifier or QualifiedName. getText is correct for both. So skip the is* check.
            if (typeNode.typeName) {
                parameter.setName(typeNode.typeName.getText(sourceFile));
            }
        } else if (ts.isIdentifier(typeNode)) {
            parameter
                .setKind(KindsEnum.Identifier)
                .setText(typeNode.getText(sourceFile));
        } else if (ts.isLiteralTypeNode(typeNode)) {
            parameter
                .setKind(KindsEnum.Literal)
                .setText(typeNode.getText(sourceFile));
        } else if (ts.isFunctionTypeNode(typeNode)) {
            // FunctionTypeNode: Literally a function type, where (type.parameters) => type.type
            parameter.setKind(KindsEnum.Function);
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
        } else if (ts.isTypeLiteralNode(typeNode)) {
            // TypeLiteralNode: Result surrounded by braces, { type.members }
            parameter
                .setKind(KindsEnum.TypeLiteral)
                .setText(typeNode.getText(sourceFile));

            if (typeNode.members) {
                for (const childType of typeNode.members) {
                    const childParameter = this.visitType(childType);
                    parameter.addType(childParameter);
                }
            }
        } else if (ts.isIntersectionTypeNode(typeNode)) {
            // IntersectionTypeNode: types separated by an ampersand, e.g. A & B & C
            parameter.setKind(KindsEnum.Intersection);
            for (const childType of typeNode.types) {
                const childParameter = this.visitType(childType);
                parameter.addType(childParameter);
            }
        } else if (ts.isTypeOperatorNode(typeNode)) {
            // TypeOperatorNode: a type preceded by an operator (operator type), e.g. readonly A, keyof A, unique A
            parameter
                .setKind(KindsEnum.Operator)
                .setText(ts.SyntaxKind[typeNode.operator])
                .addType(this.visitType(typeNode.type));
        } else if (ts.isTupleTypeNode(typeNode)) {
            // TupleTypeNode: elements surrounded by brackets and separated by commas, e.g. [A, B, C]
            parameter.setKind(KindsEnum.Tuple);
            for (const childType of typeNode.elements) {
                parameter.addType(this.visitType(childType));
            }
        } else if (ts.isParenthesizedTypeNode(typeNode)) {
            // ParenthesizedTypeNode: a type surrounded by parentheses, e.g. (A)
            parameter
                .setKind(KindsEnum.Parenthesized)
                .addType(this.visitType(typeNode.type));
        } else if (ts.isIndexSignatureDeclaration(typeNode)) {
            // IndexSignatureDeclaration: parameters surrounded by brackets, followed by a type, e.g. `[A: B]: C`
            parameter.setKind(KindsEnum.IndexSignature);
            for (const childType of typeNode.parameters) {
                parameter.addParameter(this.visitType(childType));
            }
            parameter.addType(this.visitType(typeNode.type));
        } else if (ts.isPropertySignature(typeNode)) {
            // PropertySignature: a property with a type, e.g. `A: B`
            parameter
                .setKind(KindsEnum.Property)
                .setName(typeNode.name.getText(sourceFile));

            if (typeNode.questionToken !== undefined) {
                parameter.addMeta(MetaEnum.Optional);
            }

            if (typeNode.type) {
                parameter.addType(this.visitType(typeNode.type));
            }
        } else if (ts.isMappedTypeNode(typeNode)) {
            // MappedTypeNode: Within braces, a type surrounded by brackets, followed by a type, e.g. `{ [A]?: B }`
            parameter
                .setKind(KindsEnum.Mapped)
                .addParameter(this.visitType(typeNode.typeParameter));

            if (typeNode.questionToken !== undefined) {
                parameter.addMeta(MetaEnum.Optional);
            }

            if (typeNode.readonlyToken !== undefined) {
                parameter.addMeta(MetaEnum.ReadOnly);
            }

            if (typeNode.type) {
                parameter.addType(this.visitType(typeNode.type));
            }
        } else if (ts.isIndexedAccessTypeNode(typeNode)) {
            // IndexedAccessTypeNode: a type with a type surrounded by brackets, e.g. `A[B]`
            // We use type to represent the object type and parameter to represent the index type
            parameter
                .setKind(KindsEnum.IndexAccess)
                .addType(this.visitType(typeNode.objectType))
                .addParameter(this.visitType(typeNode.indexType));
        } else if (ts.isMethodSignature(typeNode)) {
            // MethodSignature: a method with a type, e.g. `A(B): C`
            // TODO: typeParameters and parameters
            parameter
                .setKind(KindsEnum.Method)
                .setName(typeNode.name.getText(sourceFile));

            if (typeNode.questionToken !== undefined) {
                parameter.addMeta(MetaEnum.Optional);
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
        } else if (ts.isParameter(typeNode)) {
            return this.getParameter(typeNode);
        } else if (ts.isTypeParameterDeclaration(typeNode)) {
            return this.getTypeParameter(typeNode);
        } else if (ts.isThisTypeNode(typeNode)) {
            parameter
                .setKind(KindsEnum.This)
                .setText(typeNode.getText(sourceFile));
        } else if (ts.isToken(typeNode)) {
            parameter
                .setKind(KindsEnum.Token)
                .setText(typeNode.getText(sourceFile));
        } else if (ts.isTypeNode(typeNode)) {
            parameter
                .setKind(KindsEnum.Type)
                .setText(typeNode.getText(sourceFile));
        }

        if (!parameter.getKind()) {
            console.error(`Unhandled kind '${ts.SyntaxKind[typeNode.kind]}', for type ${typeNode.getText(sourceFile)}`);
        }

        return parameter;
    }

    /**
     * Resolves the type of a TypeScript type node.
     * @param typeNode - The TypeScript type node to resolve.
     * @param parameter - The `ParameterBuilder` object to update with the resolved type information.
     */
    public visitType2(typeNode: ts.Node) { // WAS: ts.TypeNode to scope it to types only
        const sourceFile = this.getCurrentSourceFile();
        const parameter = new ObjectProperty();

        switch (typeNode.kind) {
            case ts.SyntaxKind.UnionType: {
                if (!ts.isUnionTypeNode(typeNode)) break;
                return this.parseUnionType(typeNode);
            }

            case ts.SyntaxKind.ArrayType: {
                if (!ts.isArrayTypeNode(typeNode)) break;

                parameter.setKind(KindsEnum.Array);
                const childParameter = this.visitType(typeNode.elementType);
                parameter.addType(childParameter);
                break;
            }

            case ts.SyntaxKind.TypeReference: {
                if (!ts.isTypeReferenceNode(typeNode)) break;

                parameter.setKind(KindsEnum.Reference);
                if (typeNode.typeArguments) {
                    for (const childType of typeNode.typeArguments) {
                        const childParameter = this.visitType(childType);
                        parameter.addType(childParameter);
                    }
                }

                // typeName can be either Identifier or QualifiedName. getText is correct for both. So skip the is* check.
                if (typeNode.typeName) {
                    parameter.setName(typeNode.typeName.getText(sourceFile));
                }
                break;
            }

            case ts.SyntaxKind.Identifier: {
                if (!ts.isIdentifier(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Identifier)
                    .setText(typeNode.getText(sourceFile));
                break;
            }

            case ts.SyntaxKind.LiteralType: {
                if (!ts.isLiteralTypeNode(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Literal)
                    .setText(typeNode.getText(sourceFile));
                break;
            }

            case ts.SyntaxKind.FunctionType: {
                if (!ts.isFunctionTypeNode(typeNode)) break;

                parameter.setKind(KindsEnum.Function);
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

                parameter
                    .setKind(KindsEnum.TypeLiteral)
                    .setText(typeNode.getText(sourceFile));

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

                parameter.setKind(KindsEnum.Intersection);
                for (const childType of typeNode.types) {
                    const childParameter = this.visitType(childType);
                    parameter.addType(childParameter);
                }
                break;
            }

            case ts.SyntaxKind.TypeOperator: {
                if (!ts.isTypeOperatorNode(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Operator)
                    .setText(ts.SyntaxKind[typeNode.operator])
                    .addType(this.visitType(typeNode.type));
                break;
            }

            case ts.SyntaxKind.TupleType: {
                if (!ts.isTupleTypeNode(typeNode)) break;

                parameter.setKind(KindsEnum.Tuple);
                for (const childType of typeNode.elements) {
                    parameter.addType(this.visitType(childType));
                }
                break;
            }

            case ts.SyntaxKind.ParenthesizedType: {
                if (!ts.isParenthesizedTypeNode(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Parenthesized)
                    .addType(this.visitType(typeNode.type));
                break;
            }

            case ts.SyntaxKind.IndexSignature: {
                if (!ts.isIndexSignatureDeclaration(typeNode)) break;

                parameter.setKind(KindsEnum.IndexSignature);
                for (const childType of typeNode.parameters) {
                    parameter.addParameter(this.visitType(childType));
                }
                parameter.addType(this.visitType(typeNode.type));
                break;
            }

            case ts.SyntaxKind.PropertySignature: {
                if (!ts.isPropertySignature(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Property)
                    .setName(typeNode.name.getText(sourceFile));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(MetaEnum.Optional);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type));
                }
                break;
            }

            case ts.SyntaxKind.MappedType: {
                if (!ts.isMappedTypeNode(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Mapped)
                    .addParameter(this.visitType(typeNode.typeParameter));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(MetaEnum.Optional);
                }

                if (typeNode.readonlyToken !== undefined) {
                    parameter.addMeta(MetaEnum.ReadOnly);
                }

                if (typeNode.type) {
                    parameter.addType(this.visitType(typeNode.type));
                }
                break;
            }

            case ts.SyntaxKind.IndexedAccessType: {
                if (!ts.isIndexedAccessTypeNode(typeNode)) break;

                parameter
                    .setKind(KindsEnum.IndexAccess)
                    .addType(this.visitType(typeNode.objectType))
                    .addParameter(this.visitType(typeNode.indexType));
                break;
            }

            case ts.SyntaxKind.MethodSignature: {
                if (!ts.isMethodSignature(typeNode)) break;

                parameter
                    .setKind(KindsEnum.Method)
                    .setName(typeNode.name.getText(sourceFile));

                if (typeNode.questionToken !== undefined) {
                    parameter.addMeta(MetaEnum.Optional);
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
                    .setKind(KindsEnum.This)
                    .setText(typeNode.getText(sourceFile));
                break;
            }
            default: {
                parameter
                    .setKind(KindsEnum.Token)
                    .setText(typeNode.getText(sourceFile));
                break;
            }
        }

        if (!parameter.getKind()) {
            console.error(`Unhandled kind '${ts.SyntaxKind[typeNode.kind]}', for type ${typeNode.getText(sourceFile)}`);
        }

        return parameter;
    }

    private parseUnionType(typeNode: ts.UnionTypeNode): ObjectProperty {
        if (!ts.isUnionTypeNode(typeNode));
        const parameter = new ObjectProperty();
        parameter.setKind(KindsEnum.Union);
        for (const childType of typeNode.types) {
            const childParameter = this.visitType(childType);
            parameter.addType(childParameter);
        }
        return parameter;
    }
}
