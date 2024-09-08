import ts from 'typescript';
import { assert } from '@std/assert';
import { assertSpyCall, spy } from '@std/testing/mock';

import { Generator } from '../src/generator.ts';
import { createMockGenerator } from './test_helpers.ts';

const _ = undefined;

function createMock<T extends ts.Node>(sourceCode: string, spyOnFunction: keyof Generator, node?: T) {
    const generator = createMockGenerator(sourceCode);
    const sourceFile = generator.program.getSourceFile('test.ts')!;
    const cache = generator.cache;
    if (!node) node = sourceFile.statements[0] as unknown as T;

    const testSpy = spy(generator, spyOnFunction);
    generator.visitStatements(node, sourceFile);

    return { generator, sourceFile, cache, node, testSpy };
}

Deno.test('Generator.visitStatements', async (t) => {
    await t.step('handles function declaration', () => {
        const { testSpy, node, sourceFile } = createMock(`function myFunction(): string;`, 'readFunctionDeclaration');
        assertSpyCall(testSpy, 0, { args: [node as ts.FunctionDeclaration, sourceFile, ''] });
    });

    await t.step('handles type alias declaration', () => {
        const { testSpy, node, sourceFile } = createMock(`type MyTypeAlias = string;`, 'readTypeAliasDeclaration');
        assertSpyCall(testSpy, 0, { args: [node as ts.TypeAliasDeclaration, sourceFile, ''] });
    });

    await t.step('handles variable declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.VariableStatement>(`var myVariable: string;`, 'readVariableDeclaration');
        assertSpyCall(testSpy, 0, { args: [node.declarationList.declarations[0], sourceFile, ''] });
    });

    await t.step('handles module declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.ModuleDeclaration>(`module MyModule {};`, 'readModuleDeclaration');
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles interface declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.InterfaceDeclaration>(`interface MyInterface {};`, 'readInterfaceDeclaration');
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles call signature declaration', () => {
        const code = 'interface MyInterface { myCall(): any };';
        const node = ts.factory.createCallSignature(_, [], _);
        const { testSpy, sourceFile } = createMock<ts.CallSignatureDeclaration>(code, 'readCallSignatureDeclaration', node);
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles construct signature declaration with global prefix', () => {
        const generator = createMockGenerator();
        const mockNode = ts.factory.createConstructSignature(_, [], _);
        const mockSourceFile = {} as ts.SourceFile;
        const readConstructSignatureDeclarationSpy = spy(generator, 'readConstructSignatureDeclaration');

        generator.visitStatements(mockNode as ts.Node, mockSourceFile, 'global');

        assertSpyCall(readConstructSignatureDeclarationSpy, 0, {
            args: [mockNode, mockSourceFile, 'global'],
        });
    });

    await t.step('skips construct signature declaration without global prefix', () => {
        const generator = createMockGenerator();
        const mockNode = { kind: ts.SyntaxKind.ConstructSignature };
        const mockSourceFile = {} as ts.SourceFile;
        const readConstructSignatureDeclarationSpy = spy(generator, 'readConstructSignatureDeclaration');

        const result = generator.visitStatements(mockNode as ts.Node, mockSourceFile);

        assert(result === undefined);
        assert(readConstructSignatureDeclarationSpy.calls.length === 0);
    });

    // await t.step('handles heritage clause', () => {
    //     const generator = createMockGenerator('interface MyInterface extends Array {}');
    //     const mockNode = ts.factory.createHeritageClause(
    //         ts.SyntaxKind.ExtendsKeyword,
    //         [ts.factory.createExpressionWithTypeArguments(
    //             ts.factory.createIdentifier('Array'),
    //             undefined,
    //         )],
    //     );
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const readHeritageSpy = spy(generator, 'readHeritage');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(readHeritageSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles index signature declaration', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.IndexSignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const readIndexSignatureDeclarationSpy = spy(generator, 'readIndexSignatureDeclaration');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(readIndexSignatureDeclarationSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles method signature', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.MethodSignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const readMethodSignatureSpy = spy(generator, 'readMethodSignature');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(readMethodSignatureSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles property signature', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.PropertySignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const readPropertySignatureSpy = spy(generator, 'readPropertySignature');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(readPropertySignatureSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles variable statement', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.VariableStatement };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const readVariableStatementSpy = spy(generator, 'readVariableStatement');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(readVariableStatementSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('returns undefined for end of file token', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.EndOfFileToken };
    //     const mockSourceFile = {} as ts.SourceFile;

    //     const result = generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assert(result === undefined);
    // });

    // await t.step('logs warning for unhandled node type', () => {
    //     const generator = createMockGenerator();
    //     const mockNode = { kind: ts.SyntaxKind.Unknown };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const consoleWarnSpy = spy(console, 'warn');

    //     generator.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(consoleWarnSpy, 0, {
    //         args: ['Unhandled node type:', 'Unknown'],
    //     });
    // });
});
