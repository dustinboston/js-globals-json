import { MetaEnum } from './meta.ts';

/**
 * Represents a serialized object property, which can include information about the property's kind, metadata, name, parameters, type, and type parameters.
 */

export type SerializedObjectProperty = {
    /**
     * The id of the object. This is used to uniquely identify the object.
     */
    id?: string;

    /**
     * The kind of the object. This is used to determine the type of the object. This is a simplied version of the TypeScript API's `SyntaxKinds`
     */
    kind?: string;

    /**
     * Meta information about the object, as boolean flags (if present it's true, absent is false) This includes
     * metadata about the object such as whether it is a declaration, extends another object, or is read-only. This is a list of the available types:
     */
    meta: MetaEnum[];

    /**
     * The name of the objects and properties such as `String`, `ArrayConstructor`, and `encodeURI`.
     */
    name?: string;

    /**
     * An array of `ObjectProperty` objects that represent function/method parameters.
     */
    parameters: SerializedObjectProperty[];

    /**
     * Actual text of a language-defined keyword or token value, such as `string`, `await`.
     */
    text?: string;

    /**
     * An array of `ObjectProperty` objects that represent the type(s) of an object, property, function return, etc.
     */
    type: SerializedObjectProperty[];

    /**
     * An array of `ObjectProperty` objects that represent the type parameters of a generic type like `T`, `U`, etc.
     */
    typeParameters: SerializedObjectProperty[];
};
