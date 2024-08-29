// deno-lint-ignore-file no-explicit-any
import ts from 'npm:typescript@5.5.3';
import { ignoreKinds, ignoreProps, pseudoModifier, substitutePropWith } from './constants.ts';

export class Parser {
    private program: ts.Program;
    private sourceFiles: ts.SourceFile[];

    constructor(files: string[]) {
        this.program = ts.createProgram(files, {});
        this.sourceFiles = [...this.program.getSourceFiles()];
    }

    public parse() {
        return this.sourceFiles.map((sourceFile) => {
            return sourceFile.statements.filter((s) => !this.shouldIgnoreKind(s.kind)).map((s) =>
                this.visitEverything(s)
            );
        });
    }

    private visitEverything(node: ts.Node): any {
        if (this.shouldIgnoreKind(node.kind)) return;

        const props: any = { kind: ts.SyntaxKind[node.kind] };

        if (ts.isHeritageClause(node) || ts.isImportAttributes(node)) {
            props.token = ts.SyntaxKind[node.token];
        }

        if (ts.isVariableStatement(node)) {
            props.declarations = node.declarationList.declarations.map((d) => this.visitEverything(d));
        }

        if (ts.isExpressionWithTypeArguments(node)) {
            props.typeArguments = node.typeArguments?.map((t) => this.visitEverything(t)) ?? [];
        }

        for (const prop in node) {
            if (this.shoudlIgnoreProp(prop)) continue;
            const subbedProp = this.getPropSubstitution(prop);
            const value = (node as any)[prop];

            if (this.isPseudoModifier(subbedProp) && value) {
                if (!props.modifiers) props.modifiers = [];
                props.modifiers.push(subbedProp);
                continue;
            }

            if (prop === 'modifiers' && Array.isArray(value)) {
                if (!props.modifiers) props.modifiers = [];
                value.map((m: any) => m.getText()).forEach((m) => props.modifiers.push(m));
                continue;
            }

            if (this.isNode(value)) {
                if (ts.isTypeReferenceNode(value)) {
                    props[subbedProp] = value.typeName.getText();
                } else if (ts.isLiteralTypeNode(value)) {
                    props[subbedProp] = value.literal.getText();
                } else if (ts.isToken(value)) {
                    props[subbedProp] = value.getText();
                } else if (ts.isIdentifier(value)) {
                    props[subbedProp] = value.getText();
                } else {
                    props[subbedProp] = this.visitEverything(value);
                }
            } else {
                props[prop] = this.parseNode(value);
            }
        }
        return props;
    }

    private parseNode(value: any): unknown {
        if (value === undefined) {
            return undefined;
        }

        if (this.isNode(value)) {
            return this.visitEverything(value);
        }

        if (Array.isArray(value)) {
            return value.map((p) => this.parseNode(p));
        }

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }

        if (value instanceof Map) {
            if (value.size === 0) return;
            const result: any = {};
            for (const [k, v] of value.entries()) {
                result[k] = this.parseNode(v);
            }
            return result;
        }
        console.log(`Unhandled object: ${ts.SyntaxKind[value.kind]}`);
    }

    private getModifiers(node: ts.Modifier | ts.ModifierLike): string[] {
        const modifiers: string[] = [];

        if (ts.isQuestionToken(node)) {
            modifiers.push('optional');
        }

        if (ts.isDotDotDotToken(node)) {
            modifiers.push('rest');
        }

        return modifiers;
    }

    private isNode(value: any): value is ts.Node {
        return value && typeof value.kind === 'number';
    }

    private shoudlIgnoreProp(prop: string): boolean {
        return ignoreProps.has(prop);
    }

    private shouldIgnoreKind(kind: ts.SyntaxKind): boolean {
        return ignoreKinds.has(kind);
    }

    private getPropSubstitution(prop: string): string {
        return substitutePropWith.get(prop) ?? prop;
    }

    private isPseudoModifier(prop: string): boolean {
        return pseudoModifier.has(prop);
    }
}
