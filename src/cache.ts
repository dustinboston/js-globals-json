import ts from 'npm:typescript@5.5.3';
import { formatName, getDeclarationName, hasConstructSignature, isContainerDeclaration, isDeclarationWithName } from './utils.ts';

/**
 * Find and store declarations, constructors, and heritage to make parsing more efficient
 *
 * The `AppCache` class is responsible for caching various types of declarations, such as interfaces, variables, functions, and modules, to make parsing more efficient.
 * It provides methods to retrieve information about variables, constructors, and container declarations (e.g., interfaces, classes, modules) from the cache.
 * The class is associated with a TypeScript program and is initialized by collecting all the declarations in the program.
 */
export class AppCache {
    /**
     * Map of variable declaration names to their types.
     * @example Array => ArrayConstructor
     */
    public variableNameToTypeMap = new Map<string, string>();

    /**
     * Map of types to their variable declaration names.
     * @example ArrayConstructor => Array
     */
    public variableTypeToNameMap = new Map<string, string>();

    /**
     * Names of interfaces that are constructors
     */
    public constructors = new Set<string>();

    /**
     * All Nodes by name with source file
     * named statementsCache in generator
     * @todo rename "containers"
     */
    public statementsCache = new Map<string, [ts.SourceFile['fileName'], ts.Node][]>();

    /**
     * The TypeScript program that this cache is associated with.
     */
    public program: ts.Program;

    /**
     * Constructs a new instance of the `AppCache` class, which is associated with the provided TypeScript program.
     * @param program - The TypeScript program that this cache is associated with.
     * @throws {TypeError} If the `program` parameter is not provided.
     */
    constructor(program: ts.Program) {
        if (!program) {
            throw new TypeError('A program is required');
        }

        this.program = program;
    }

    /**
     * Given a variable name (typically from node.name.getText()) return its type
     * @example `var Name: Type`
     * ```typescript
     * cache.getVariableTypeFromName('Name'); // => 'Type'
     * ```
     * @example `var Array: ArrayConstructor`
     * ```typescript
     * cache.getVariableTypeFromName('Array'); // => 'ArrayConstructor'
     * ```
     * @param variableName The name of a variable whose type we want to get.
     * @returns The variable type associated with the given name, or `undefined` if no such variable type exists.
     */
    public getVariableTypeFromName(variableName: string): string | undefined {
        return this.variableNameToTypeMap.get(variableName);
    }

    /**
     * Given a type name, returns the corresponding variable name.
     * @example `var Name: Type`
     * ```typescript
     * cache.getVariableNameFromType('Type'); // => 'Name'
     * ```
     * @example `var Array: ArrayConstructor`
     * ```typescript
     * cache.getVariableNameFromType('ArrayConstructor'); // => 'Array'
     * ```
     * @param typeName - The type of a variable whose _name_ we want get.
     * @returns The variable name associated with the given type, or `undefined` if no such variable name exists.
     */
    public getVariableNameFromType(typeName: string): string | undefined {
        return this.variableTypeToNameMap.get(typeName);
    }

    /**
     * Checks if the cache contains a variable with the given name.
     * @param nodeName - The name of the variable to check for.
     * @returns `true` if the cache contains a variable with the given name, `false` otherwise.
     */
    public hasVariableName(nodeName: string) {
        return this.variableNameToTypeMap.has(nodeName);
    }

    /**
     * Checks if the cache contains a constructor with the given name.
     * @param constructorName - The name of the constructor to check for.
     * @returns `true` if the cache contains a constructor with the given name, `false` otherwise.
     */
    public hasConstructor(constructorName: string): boolean {
        return this.constructors.has(constructorName);
    }

    /**
     * Retrieves the container declarations (e.g. interfaces, classes, modules) that have the given name.
     * @param containerName - The name of the container to retrieve.
     * @returns An array of tuples, where the first element is the file path and the second element is the container declaration node.
     */
    public getContainer(containerName: string): [string, ts.Node][] {
        return this.statementsCache.get(containerName) ?? [];
    }

    /**
     * Collects all the declarations (variables, functions, type aliases, and modules) in the program and stores them in a map.
     * This method is called before parsing the source files to gather all the declarations that will be used later.
     */
    public initialize(): void {
        this.program.getSourceFiles().forEach((sourceFile) => this.visitChildren(sourceFile, sourceFile, ''));
    }

    /**
     * Recursively visits the children of the given node, calling `visitDeclarations` on each child.
     * @param node - The node whose children should be visited.
     * @param sourceFile - The source file containing the node.
     * @param globalPrefix - An optional prefix to apply to the names of the declarations.
     */
    public visitChildren(node: ts.Node, sourceFile: ts.SourceFile, globalPrefix = ''): void {
        ts.forEachChild(node, (child) => this.visitDeclarations(child, sourceFile, globalPrefix));
    }

    /**
     * Recursively visits the children of the given node, calling `visitDeclarations` on each child.
     * This method is responsible for caching various types of declarations, such as interfaces, variables, functions, and modules.
     * It checks the type of the node and calls the appropriate caching methods based on the node type.
     *
     * @param node - The node whose children should be visited.
     * @param sourceFile - The source file containing the node.
     * @param globalPrefix - An optional prefix to apply to the names of the declarations.
     */
    public visitDeclarations(node: ts.Node, sourceFile: ts.SourceFile, globalPrefix = ''): void {
        if (!isDeclarationWithName(node)) {
            return this.visitChildren(node, sourceFile, globalPrefix);
        }

        const name = getDeclarationName(node, sourceFile, globalPrefix);

        if (ts.isInterfaceDeclaration(node)) {
            this.cacheContainer(node, sourceFile, globalPrefix);
            this.cacheConstructor(node, sourceFile, globalPrefix);
            this.visitChildren(node, sourceFile, globalPrefix);
        } else if (ts.isVariableDeclaration(node)) { // } && hasDeclarationWithType(node)) {
            this.cacheType(node, sourceFile, globalPrefix);
        } else if (ts.isFunctionDeclaration(node)) { // && hasDeclarationWithType(node)) {
            this.cacheType(node, sourceFile, globalPrefix);
        } else if (ts.isModuleDeclaration(node) && node.body) {
            this.variableNameToTypeMap.set(name, name);
            this.cacheContainer(node, sourceFile, globalPrefix);
            if (ts.isModuleBlock(node.body)) this.visitChildren(node, sourceFile, name);
        }
    }

    /**
     * Caches a container declaration, such as an interface or module, in the statements cache.
     * The cache maps the formatted name of the container to an array of [sourceFile, node] tuples,
     * where the node represents the container declaration.
     *
     * @param node - The container declaration node to cache.
     * @param sourceFile - The source file containing the container declaration.
     * @param globalPrefix - An optional prefix to apply to the name of the container.
     */
    public cacheContainer<T extends ts.Node>(node: T, sourceFile: ts.SourceFile, globalPrefix = ''): void {
        if (!isDeclarationWithName(node) || !isContainerDeclaration(node)) return;
        const name = formatName(node.name.getText(sourceFile), globalPrefix);
        const declarations = this.statementsCache.get(name) ?? [];
        declarations.push([sourceFile.fileName, node]);
        this.statementsCache.set(name, declarations);
    }

    /**
     * Caches the type information for a variable or function declaration.
     * This method is responsible for extracting the type information from the declaration node
     * and storing it in the `variableNameToTypeMap` and `variableTypeToNameMap` caches.
     *
     * @param node - The variable or function declaration node to cache.
     * @param sourceFile - The source file containing the declaration.
     * @param globalPrefix - An optional prefix to apply to the name of the declaration.
     */
    public cacheType(node: ts.VariableDeclaration | ts.FunctionDeclaration | undefined, sourceFile: ts.SourceFile, globalPrefix = ''): void { // DeclarationWithType
        if (!node || !isDeclarationWithName(node)) return; // || !hasDeclarationWithType(node)) return;
        const name = getDeclarationName(node, sourceFile, globalPrefix);

        let type = `Uhandled<unknown>`;
        if (node.type && ts.isTypeReferenceNode(node.type) && ts.isVariableDeclaration(node)) {
            type = formatName(node.type.typeName.getText(sourceFile), globalPrefix);
            this.variableTypeToNameMap.set(type, name); // Reverse lookup for constructors
        } else if (node.type && ts.isToken(node.type)) {
            type = formatName(node.type.getText(sourceFile), globalPrefix);
        } else if (node.type) {
            type = `Uhandled<${ts.SyntaxKind[node.type.kind]}>`;
        }

        this.variableNameToTypeMap.set(name, type);
    }

    /**
     * Caches a constructor declaration in the `constructors` set.
     *
     * @param node - The constructor declaration node to cache.
     * @param sourceFile - The source file containing the constructor declaration.
     * @param globalPrefix - An optional prefix to apply to the name of the constructor.
     */
    public cacheConstructor<T extends ts.Node>(node: T, sourceFile: ts.SourceFile, globalPrefix = ''): void {
        if (!isDeclarationWithName(node) || !hasConstructSignature(node)) return;
        const name = getDeclarationName(node, sourceFile, globalPrefix);
        this.constructors.add(name);
    }
}
