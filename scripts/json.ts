/**
 * Generates a JSON object that represents the source file or libs.
 * @file
 */

import ts from "typescript";

import { Parser } from "../src/parser.ts";
import { TypeResolver } from "../src/type_resolver.ts";

function main(files: string[] = ["es5"], options: ts.CompilerOptions = {}) {
  const program = ts.createProgram(files, options);
  const typeResolver = new TypeResolver(program);
  const parser = new Parser(program, typeResolver);
  const globalDeclarations = parser.parse();

  try {
    const json = JSON.stringify(globalDeclarations, null, 2);
    console.log(json);
  } catch (e) {
    console.log(e);
  }
}

if (import.meta.main) {
  if (Deno.args.length) {
    main(Deno.args, { noLib: true });
  } else {
    main();
  }
}
