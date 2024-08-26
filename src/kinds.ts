/**
 * Represents the different kinds of TypeScript syntax elements that can be serialized as part of an object property.
 */

export enum KindsEnum {
    /**
     * A value followed by brackets, e.g. `string[]`
     */
    Array = 'Array',
    /**
     * A constructor interface, e.g. `new (...args: any[]) => any`
     */
    Constructor = 'Constructor',

    /**
     * A function with parameters and a return type, e.g. `(a: string, b: string) => number`
     */
    Function = 'Function',

    /**
     * The name of an object or property. This is always represented by a string value, not an object.
     */
    Identifier = 'Identifier',

    /**
     * A type with a type surrounded by brackets, e.g. `A[B]`
     */
    IndexAccess = 'IndexAccess',

    /**
     * Parameters surrounded by brackets, followed by a type, e.g. `[key: string]: number`
     */
    IndexSignature = 'IndexSignature',

    /**
     * A list of types separated by `&`, e.g. `{ foo: true } & { bar: false }`
     */
    Intersection = 'Intersection',

    /**
     * A literal value, e.g. `"default"`
     */
    Literal = 'Literal',

    /**
     * A map of parameters, each surrounded by brackets, followed by a type, e.g. `{ [A]?: B }`
     */
    Mapped = 'Mapped',

    /**
     * A method with parameters and a return type, e.g. `A(B): C`
     */
    Method = 'Method',

    /**
     * A type preceded by an operator, e.g. `readonly A`, `keyof A`, `unique A`
     */
    Operator = 'Operator',

    /**
     * A type surrounded by parentheses, e.g. `(A)`
     */
    Parenthesized = 'Parenthesized',

    /**
     * A property with a type, e.g. `A: B`
     */
    Property = 'Property',

    /**
     * A reference to another interface, e.g. `Array<T>` or `ArrayConstructor`
     */
    Reference = 'Reference',

    /**
     * The literal `this` which will probably be removed in favor of Token for simplicity.
     */
    This = 'This',

    /**
     * Language-defined words such as `number`, `void`, `any`, etc.
     */
    Token = 'Token',

    /**
     * Elements surrounded by brackets and separated by commas, e.g. `[string, number, boolean]`
     */
    Tuple = 'Tuple',

    /**
     * Currently a catch-all for any unhandled values. This should be better specified as the type of an object or property.
     */
    Type = 'Type',

    /**
     * Object-literal notation (members surrounded by braces), e.g. `{ a: string, b: number }`
     */
    TypeLiteral = 'TypeLiteral',

    /**
     * `string | number | boolean`
     */
    Union = 'Union',

    /**
     * A variable declaration, usually preceded by the `declare` modifier, e.g. `declare var a: string`
     */
    Variable = 'Variable',
}
