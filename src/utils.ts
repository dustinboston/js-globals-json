import ts from 'npm:typescript@5.5.3';
import { Meta, metaValues } from './types.ts';
import type { ContainerDeclaration, DeclarationWithConstructor, DeclarationWithName, DeclarationWithType } from './types.ts';

/**
 * A set of valid meta values, which are members of the `metaValues` array.
 * These values represent boolean meta values and are stored in a set for O(1) lookup.
 */
export const validMetaValues = new Set(metaValues);

/**
 * Checks if the provided `kind` value is a valid meta value.
 *
 * @param kind - The value to check.
 * @returns `true` if the `kind` is a valid meta value, `false` otherwise.
 */
export function isValidMeta(kind: number): kind is Meta {
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

export function getDeclarationName(node: DeclarationWithName, sourceFile: ts.SourceFile, globalPrefix = ''): string {
    return formatName(node.name.getText(sourceFile), globalPrefix);
}

export function isDeclarationWithName(node: ts.Node): node is DeclarationWithName {
    return (
        (ts.isFunctionDeclaration(node) && node.name !== undefined) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isVariableDeclaration(node) ||
        ts.isModuleDeclaration(node)
    );
}

export function hasConstructSignature(node: ts.Node): node is DeclarationWithConstructor {
    return ts.isInterfaceDeclaration(node) && node.members.some(ts.isConstructSignatureDeclaration);
}

export function isContainerDeclaration(node: ts.Node): node is ContainerDeclaration {
    return (ts.isInterfaceDeclaration(node) || ts.isModuleDeclaration(node));
}

export function hasDeclarationWithType(node: ts.Node): node is DeclarationWithType {
    return (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) && node.type !== undefined &&
        (ts.isTypeReferenceNode(node.type) || ts.isToken(node.type)) && node.name !== undefined;
}
