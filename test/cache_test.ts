import ts from 'npm:typescript@5.5.3';
import { assert } from '@std/assert';
import { createMockCache } from './test_helpers.ts';

const _ = undefined;

Deno.test('[cache.visitModuleDeclaration] caches a variable declaration and a statement', () => {
    const cache = createMockCache(`declare module MyModule { interface MyInterface {} }`);
    const sourceFile = cache.program.getSourceFile('test.ts')!;
    const node = sourceFile.statements[0] as ts.ModuleDeclaration;

    // cache.visitModuleDeclaration(node, sourceFile, '');
    cache.visitDeclarations(node, sourceFile, '');

    assert(cache.variableNameToTypeMap.size === 1, 'There should be one item in the variable declarations cache.');
    assert(cache.variableNameToTypeMap.get('MyModule') === 'MyModule', '"MyModule" should be defined in the variable declarations cache.');
    assert(cache.statementsCache.size === 2, 'There should be two items in the statements cache.');

    const myModule = cache.statementsCache.get('MyModule');
    assert(myModule && ts.isModuleDeclaration(myModule[0][1]), 'The first item in the statements cache should be a module declaration');

    const myInterface = cache.statementsCache.get('MyModule.MyInterface');
    assert(myInterface && ts.isInterfaceDeclaration(myInterface[0][1]), 'The second item in the statements cache should be an interface declaration');
});

Deno.test('[cache.visitFunctionDeclaration] caches a statement', () => {
    const sourceCode = `declare interface MyInterface { myProp: any; }`;
    const cache = createMockCache(sourceCode);
    const sourceFile = cache.program.getSourceFile('test.ts')!;
    const node = sourceFile.statements[0] as ts.InterfaceDeclaration;

    cache.visitDeclarations(node, sourceFile, '');

    assert(cache.statementsCache.size === 1, 'There should be one item in the statements cache.');

    const myModule = cache.statementsCache.get('MyInterface');
    assert(myModule && ts.isInterfaceDeclaration(myModule[0][1]), 'The first item in the statements cache should be an interface declaration');
});

Deno.test('[cache.visitInterfaceDeclaration] caches a statement', () => {
    const sourceCode = `declare interface MyInterface { myProp: any; }`;
    const cache = createMockCache(sourceCode);
    const sourceFile = cache.program.getSourceFile('test.ts')!;
    const node = sourceFile.statements[0] as ts.InterfaceDeclaration;

    cache.visitDeclarations(node, sourceFile, '');

    assert(cache.statementsCache.size === 1, 'There should be one item in the statements cache.');

    const myModule = cache.statementsCache.get('MyInterface');
    assert(myModule && ts.isInterfaceDeclaration(myModule[0][1]), 'The first item in the statements cache should be an interface declaration');
});

Deno.test('[cache.visitInterfaceDeclaration] caches a statement and a constructor if present', () => {
    const sourceCode = `declare interface MyInterface { new(): Object }`;
    const cache = createMockCache(sourceCode);
    const sourceFile = cache.program.getSourceFile('test.ts')!;
    const node = sourceFile.statements[0] as ts.InterfaceDeclaration;

    cache.visitDeclarations(node, sourceFile, '');

    assert(cache.constructors.size === 1, 'There should be one item in the constructor cache.');
    assert(cache.constructors.has('MyInterface'), 'There should be one item in the constructor cache.');
});

Deno.test('[cache.visitVariableDeclaration] caches a variable declaration', () => {
    const sourceCode = `var myVariable: number`;
    const cache = createMockCache(sourceCode);
    const sourceFile = cache.program.getSourceFile('test.ts')!;
    const node = sourceFile.statements[0] as ts.VariableStatement;

    cache.visitDeclarations(node.declarationList.declarations[0], sourceFile, '');

    assert(cache.variableNameToTypeMap.size === 1, 'There should be one item in the variable declarations cache.');
    assert(cache.variableNameToTypeMap.get('myVariable') === 'number', '"myVariable" should be defined in the variable declarations cache.');
});

Deno.test('Caches should collect data from the program', () => {
    const sourceCode = `
        interface Frobnicator {
            frobnicate(a: number, b: number): number;
        }
        interface FrobnicatorConstructor {
            new(x: number): Frobnicator;
        }

        declare var Frobnicator: FrobnicatorConstructor;
    `;
    const cache = createMockCache(sourceCode);

    cache.initialize();

    assert(cache.variableNameToTypeMap.size === 1);
    assert(cache.variableNameToTypeMap.get('Frobnicator') === 'FrobnicatorConstructor');

    assert(cache.variableTypeToNameMap.size === 1);
    assert(cache.variableTypeToNameMap.get('FrobnicatorConstructor') === 'Frobnicator');

    assert(cache.constructors.size === 1);
    assert(cache.constructors.has('FrobnicatorConstructor'));

    assert(cache.statementsCache.size === 2);
    assert(cache.statementsCache.has('FrobnicatorConstructor'));
    assert(cache.statementsCache.has('Frobnicator'));
});
