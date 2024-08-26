export enum MetaEnum {
    /**
     * Indicates that a class is marked `abstract`
     */
    Abstract = 'Abstract',

    /**
     * Indicates that a property is an accessor, e.g. `A[B]`
     */
    Accessor = 'Accessor',

    /**
     * Indicates that a function is marked `async`
     */
    Async = 'Async',

    /**
     * Indicates that a value is a constant variabale, `const`
     */
    Const = 'Const',

    /**
     * Indicates a variable or function declaration, `declare`
     */
    Declare = 'Declare',

    /**
     * Indicates that a value is the default export `default`
     */
    Default = 'Default',

    /**
     * Indicates that a value is exported, `export`
     */
    Export = 'Export',

    /**
     * Indicates that an object extends another object, marked `extends`
     */
    Extends = 'Extends',

    /**
     * Indicates that a function is a generator function, marked with an `*`
     */
    Generator = 'Generator',

    /**
     * Indicates that a value is in a set, e.g. `a in b`
     */
    In = 'In',

    /**
     * Indicates that a value is optional, marked with a `?`
     */
    Optional = 'Optional',

    /**
     * Indicates that a value is out of a set, e.g. `a out of b`
     */
    Out = 'Out',

    /**
     * Indiciates that a method overrides a method in a parent class, marked `override`
     */
    Override = 'Override',

    /**
     * Indicates that a value is private, `private` (TODO: does this include `#`?)
     */
    Private = 'Private',

    /**
     * Indicates that a value is protected, `protected`
     */
    Protected = 'Protected',

    /**
     * Indicates that a value is public, `public`
     */
    Public = 'Public',

    /**
     * Indicates that a value is read-only, `readonly`
     */
    ReadOnly = 'ReadOnly',

    /**
     * Indicates that a value is a rest parameter, marked with `...`
     */
    Rest = 'Rest',

    /**
     * Indicates that a value is marked as static, `static`
     */
    Static = 'Static',
}
