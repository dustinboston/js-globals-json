import ts from 'npm:typescript@5.5.3';

export const ignoreProps = new Set([
    'contextualType',
    'emitNode',
    'end',
    'endFlowNode',
    'flags',
    'flowNode',
    'id',
    'jsDoc',
    'kind', // Handled manually
    'locals',
    'localSymbol',
    'modifierFlagsCache',
    'nextContainer',
    'original',
    'parent',
    'pos',
    'resolvedSignature',
    'returnFlowNode',
    'symbol',
    'transformFlags',
]);

export const ignoreKinds = new Set([
    ts.SyntaxKind.EndOfFileToken,
    ts.SyntaxKind.VariableDeclarationList,
]);

export const substitutePropWith = new Map<string, string>([
    ['dotDotDotToken', 'rest'],
    ['questionToken', 'optional'],
]);

export const pseudoModifier = new Set<string>([
    'rest',
    'optional',
]);
