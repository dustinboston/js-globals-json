import ts from 'typescript';
import { assert } from '@std/assert';
import { assertSpyCall, spy } from '@std/testing/mock';

import { Parser } from '../src/parser.ts';
import { AppCache } from '../src/cache.ts';
import { createMockParser } from './test_helpers.ts';

const _ = undefined;

function createMock<T extends ts.Node>(sourceCode: string, spyOnFunction: keyof Parser, node?: T) {
    const parser = createMockParser(sourceCode);
    const sourceFile = parser.program.getSourceFile('test.ts')!;
    const cache = parser.cache;
    if (!node) node = sourceFile.statements[0] as unknown as T;

    const testSpy = spy(parser, spyOnFunction);
    parser.visitStatements(node, sourceFile);

    return { parser, sourceFile, cache, node, testSpy };
}

Deno.test('Parser.visitStatements', async (t) => {
    await t.step('handles function declaration', () => {
        const { testSpy, node, sourceFile } = createMock(`function myFunction(): string;`, 'parseFunctionDeclaration');
        assertSpyCall(testSpy, 0, { args: [node as ts.FunctionDeclaration, sourceFile, ''] });
    });

    await t.step('handles type alias declaration', () => {
        const { testSpy, node, sourceFile } = createMock(`type MyTypeAlias = string;`, 'parseTypeAliasDeclaration');
        assertSpyCall(testSpy, 0, { args: [node as ts.TypeAliasDeclaration, sourceFile, ''] });
    });

    await t.step('handles variable declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.VariableStatement>(`var myVariable: string;`, 'parseVariableDeclaration');
        assertSpyCall(testSpy, 0, { args: [node.declarationList.declarations[0], sourceFile, ''] });
    });

    await t.step('handles module declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.ModuleDeclaration>(`module MyModule {};`, 'parseModuleDeclaration');
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles interface declaration', () => {
        const { testSpy, node, sourceFile } = createMock<ts.InterfaceDeclaration>(`interface MyInterface {};`, 'parseInterfaceDeclaration');
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles call signature declaration', () => {
        const code = 'interface MyInterface { myCall(): any };';
        const node = ts.factory.createCallSignature(_, [], _);
        const { testSpy, sourceFile } = createMock<ts.CallSignatureDeclaration>(code, 'parseCallSignatureDeclaration', node);
        assertSpyCall(testSpy, 0, { args: [node, sourceFile, ''] });
    });

    await t.step('handles construct signature declaration with global prefix', () => {
        const parser = createMockParser();
        const mockNode = ts.factory.createConstructSignature(_, [], _);
        const mockSourceFile = {} as ts.SourceFile;
        const parseConstructSignatureDeclarationSpy = spy(parser, 'parseConstructSignatureDeclaration');

        parser.visitStatements(mockNode as ts.Node, mockSourceFile, 'global');

        assertSpyCall(parseConstructSignatureDeclarationSpy, 0, {
            args: [mockNode, mockSourceFile, 'global'],
        });
    });

    await t.step('skips construct signature declaration without global prefix', () => {
        const parser = createMockParser();
        const mockNode = { kind: ts.SyntaxKind.ConstructSignature };
        const mockSourceFile = {} as ts.SourceFile;
        const parseConstructSignatureDeclarationSpy = spy(parser, 'parseConstructSignatureDeclaration');

        const result = parser.visitStatements(mockNode as ts.Node, mockSourceFile);

        assert(result === undefined);
        assert(parseConstructSignatureDeclarationSpy.calls.length === 0);
    });

    // await t.step('handles heritage clause', () => {
    //     const parser = createMockParser('interface MyInterface extends Array {}');
    //     const mockNode = ts.factory.createHeritageClause(
    //         ts.SyntaxKind.ExtendsKeyword,
    //         [ts.factory.createExpressionWithTypeArguments(
    //             ts.factory.createIdentifier('Array'),
    //             undefined,
    //         )],
    //     );
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const parseHeritageSpy = spy(parser, 'parseHeritage');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(parseHeritageSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles index signature declaration', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.IndexSignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const parseIndexSignatureDeclarationSpy = spy(parser, 'parseIndexSignatureDeclaration');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(parseIndexSignatureDeclarationSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles method signature', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.MethodSignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const parseMethodSignatureSpy = spy(parser, 'parseMethodSignature');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(parseMethodSignatureSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles property signature', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.PropertySignature };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const parsePropertySignatureSpy = spy(parser, 'parsePropertySignature');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(parsePropertySignatureSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('handles variable statement', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.VariableStatement };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const parseVariableStatementSpy = spy(parser, 'parseVariableStatement');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(parseVariableStatementSpy, 0, {
    //         args: [mockNode, mockSourceFile, ''],
    //     });
    // });

    // await t.step('returns undefined for end of file token', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.EndOfFileToken };
    //     const mockSourceFile = {} as ts.SourceFile;

    //     const result = parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assert(result === undefined);
    // });

    // await t.step('logs warning for unhandled node type', () => {
    //     const parser = createMockParser();
    //     const mockNode = { kind: ts.SyntaxKind.Unknown };
    //     const mockSourceFile = {} as ts.SourceFile;
    //     const consoleWarnSpy = spy(console, 'warn');

    //     parser.visitStatements(mockNode as ts.Node, mockSourceFile);

    //     assertSpyCall(consoleWarnSpy, 0, {
    //         args: ['Unhandled node type:', 'Unknown'],
    //     });
    // });
});
