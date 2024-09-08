import ts from 'typescript';

import { Parser } from '../src/parser.ts';
import { AppCache } from '../src/cache.ts';

export function createMockCache(sourceCode = ''): AppCache {
    const compilerHost = createCompilerHost(createMockSourceFile(sourceCode));
    const program = ts.createProgram(['test.ts'], { noLib: true }, compilerHost);
    return new AppCache(program);
}

export function createMockParser(sourceCode = ''): Parser {
    const compilerHost = createCompilerHost(createMockSourceFile(sourceCode));
    const program = ts.createProgram(['test.ts'], { noLib: true }, compilerHost);
    return new Parser(program, new AppCache(program));
}

export function createMockSourceFile(content = ''): ts.SourceFile {
    return ts.createSourceFile('test.ts', content, ts.ScriptTarget.Latest, true);
}

export function createCompilerHost(sourceFile: ts.SourceFile): ts.CompilerHost {
    const host = ts.createCompilerHost({});
    host.getCanonicalFileName = (f) => f;
    host.getCurrentDirectory = () => '';
    host.getDirectories = () => [];
    host.getNewLine = () => '\n';
    host.getSourceFile = () => sourceFile;
    host.useCaseSensitiveFileNames = () => true;
    host.writeFile = () => {};
    return host;
}
