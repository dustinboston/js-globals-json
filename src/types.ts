import ts from 'npm:typescript@5.5.3';

/**
 * Represents a serialized ast, which can include information about the property's kind, metadata, name, parameters, type, and type parameters.
 */
export type SerializedAst = Partial<{
    /**
     * The id of the object. This is used to uniquely identify the object.
     */
    id: string;

    /**
     * The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`
     */
    kind: string;

    /**
     * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
     * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
     */
    meta: string[];

    /**
     * The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.
     */
    name: string;

    /**
     * An array of `Ast` objects that represent function/method parameters.
     */
    parameters: SerializedAst[];

    /**
     * Actual text of a language-defined keyword or token value, such as `string`, `await`.
     */
    text: string;

    /**
     * An array of `Ast` objects that represent the type(s) of an object, property, function return, etc.
     */
    type: (string | SerializedAst)[];

    /**
     * An array of `Ast` objects that represent the type parameters of a generic type like `T`, `U`, etc.
     */
    typeParameters: SerializedAst[];
}>;

export type Meta =
    | ts.SyntaxKind.AbstractKeyword
    | ts.SyntaxKind.AccessorKeyword
    | ts.SyntaxKind.AssertsKeyword
    | ts.SyntaxKind.AsyncKeyword
    | ts.SyntaxKind.ConstKeyword
    | ts.SyntaxKind.DeclareKeyword
    | ts.SyntaxKind.DefaultKeyword
    | ts.SyntaxKind.ExportKeyword
    | ts.SyntaxKind.InKeyword
    | ts.SyntaxKind.PrivateKeyword
    | ts.SyntaxKind.ProtectedKeyword
    | ts.SyntaxKind.PublicKeyword
    | ts.SyntaxKind.OutKeyword
    | ts.SyntaxKind.OverrideKeyword
    | ts.SyntaxKind.ReadonlyKeyword
    | ts.SyntaxKind.StaticKeyword
    | ts.SyntaxKind.QuestionToken
    | ts.SyntaxKind.DotDotDotToken
    | ts.SyntaxKind.ExtendsKeyword;

export const validMetaValues = new Set([
    ts.SyntaxKind.AbstractKeyword,
    ts.SyntaxKind.AccessorKeyword,
    ts.SyntaxKind.AsyncKeyword,
    ts.SyntaxKind.ConstKeyword,
    ts.SyntaxKind.DeclareKeyword,
    ts.SyntaxKind.DefaultKeyword,
    ts.SyntaxKind.ExportKeyword,
    ts.SyntaxKind.InKeyword,
    ts.SyntaxKind.PrivateKeyword,
    ts.SyntaxKind.ProtectedKeyword,
    ts.SyntaxKind.PublicKeyword,
    ts.SyntaxKind.OutKeyword,
    ts.SyntaxKind.OverrideKeyword,
    ts.SyntaxKind.ReadonlyKeyword,
    ts.SyntaxKind.StaticKeyword,
    ts.SyntaxKind.QuestionToken,
    ts.SyntaxKind.DotDotDotToken,
    ts.SyntaxKind.ExtendsKeyword,
]);

export function isValidMeta(kind: ts.SyntaxKind): kind is Meta {
    return validMetaValues.has(kind);
}

/**
 * Formats a unique identifier for a global object or property.
 *
 * If the `id` is enclosed in square brackets (`[` and `]`), it is treated as a symbol and the `globalPrefix` is prepended to it.
 * Otherwise, if `globalPrefix` is provided, it is prepended to the `id` with a dot (`.`) separator.
 * If `globalPrefix` is not provided, the `id` is returned as-is.
 *
 * @param id The unique identifier to format.
 * @param globalPrefix An optional prefix to prepend to the `id`.
 * @returns The formatted identifier.
 */
export function formatId(id: string, globalPrefix = '') {
    if (id.startsWith('[') && id.endsWith(']')) { // This is a symbol
        return `${globalPrefix}${id}`;
    } else if (globalPrefix) {
        return `${globalPrefix}.${id}`;
    } else {
        return id;
    }
}

/**
 * Formats an AST name
 *
 * If the `name` is enclosed in square brackets (`[` and `]`), it is treated as a symbol and the `globalPrefix` is prepended to it.
 * Otherwise, if `globalPrefix` is provided, it is prepended to the `name` with a dot (`.`) separator.
 * If `globalPrefix` is not provided, the `name` is returned as-is.
 *
 * @param name The unique identifier to format.
 * @param globalPrefix An optional prefix to prepend to the `name`.
 * @returns The formatted identifier.
 */
export function formatName(name: string, globalPrefix = '') {
    let prefix = globalPrefix;
    if (name === 'prototype' && globalPrefix.endsWith('.prototype')) {
        prefix = globalPrefix.replace(/\.prototype/g, '');
    }

    if (name.startsWith('[') && name.endsWith(']')) { // This is a symbol
        return `${prefix}${name}`;
    } else if (prefix) {
        return `${prefix}.${name}`;
    } else {
        return name;
    }
}
