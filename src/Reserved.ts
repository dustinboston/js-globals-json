/**
 * A utility class that provides sets of reserved words for JavaScript and TypeScript.
 * It also includes a method to check if a given word is a reserved word in either language.
 */
export class Reserved {
  /**
   * JavaScript reserved words.
   *
   * @example
   * ```typescript
   * import { Reserved } from './src/Reserved.ts';
   *
   * if (Reserved.javascriptReservedWords.has('function')) {
   *   console.log('function is a reserved word in JavaScript.');
   * }
   * ```
   */
  public static javascriptReservedWords = new Set([
    "function",
    "class",
    "let",
    "const",
    "var",
    "new",
    "return",
    "throw",
    "try",
    "catch",
    "finally",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "yield",
    "await",
    "async",
    "import",
    "from",
    "export",
    "default",
    "as",
    "let",
    "const",
    "var",
    "null",
    "undefined",
    "true",
    "false",
    "typeof",
    "instanceof",
    "in",
    "delete",
    "void",
    "with",
    "debugger",
    "this",
    "self",
    "arguments",
    "super",
    "extends",
    "implements",
    "interface",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "abstract",
    "final",
    "native",
    "synchronized",
    "transient",
    "volatile",
    "strictfp",
    "goto",
    "enum",
    "assert",
    "byte",
    "char",
    "double",
    "float",
    "int",
    "long",
    "short",
    "boolean",
    "void",
    "class",
    "interface",
    "extends",
    "implements",
    "package",
    "import",
    "public",
    "protected",
    "private",
    "static",
    "final",
    "abstract",
    "synchronized",
    "native",
    "strictfp",
    "transient",
    "volatile",
    "throws",
    "throw",
    "try",
    "catch",
    "finally",
    "if",
    "else",
    "for",
    "while",
    "do",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "return",
    "yield",
    "await",
    "async",
    "function",
    "let",
    "const",
    "var",
    "delete",
    "typeof",
    "instanceof",
    "in",
    "null",
    "undefined",
    "true",
    "false",
    "with",
    "debugger",
    "this",
    "arguments",
    "super",
    "extends",
    "implements",
    "interface",
    "package",
    "private",
    "protected",
    "public",
    "static",
    "abstract",
    "final",
    "native",
  ]);

  /**
   * Typescript reserved words.
   *
   * @example
   * ```typescript
   * import { Reserved } from './src/Reserved.ts';
   *
   * if (Reserved.typescriptReservedWords.has('abstract')) {
   *   console.log('abstract is a reserved word in Typescript.');
   * }
   * ```
   */
  public static typeScriptReservedWords = new Set([
    "abstract",
    "any",
    "as",
    "asserts",
    "bigint",
    "boolean",
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "declare",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "implements",
    "import",
    "in",
    "infer",
    "instanceof",
    "interface",
    "is",
    "keyof",
    "let",
    "module",
    "namespace",
    "never",
    "new",
    "null",
    "number",
    "object",
    "package",
    "private",
    "protected",
    "public",
    "readonly",
    "require",
    "global",
    "return",
    "set",
    "static",
    "string",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "unique",
    "unknown",
    "var",
    "void",
    "while",
    "with",
    "yield",
  ]);

  /**
   * Checks if a given word is a reserved word in JavaScript or TypeScript.
   *
   * @example
   * ```typescript
   * import { Reserved } from './src/Reserved.ts';
   *
   * if (Reserved.isReservedWord('abstract')) {
   *   console.log('abstract is a reserved word.');
   * }
   * ```
   *
   * @param word - The word to check.
   * @returns `true` if the word is a reserved word, otherwise `false`.
   */
  public static isReservedWord(word: string): boolean {
    return Reserved.javascriptReservedWords.has(word) || Reserved.typeScriptReservedWords.has(word);
  }
}
