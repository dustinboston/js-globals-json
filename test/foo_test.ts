import ts from "typescript";
import { assertEquals } from "@std/assert";
import { Parser } from "../src/parser.ts";
import { TypeResolver } from "../src/type_resolver.ts";
import { SerializedAst } from "../src/ast.ts";
import foo from "./fixtures/foo.json" with { type: "json" };

enum Fixtures {
  SimpleStatic = "./test/fixtures/foo.d.ts",
}

function createParser(fixture: Fixtures) {
  const program = ts.createProgram([fixture], { noLib: true });
  return new Parser(program, new TypeResolver(program));
}

Deno.test("Parses variable statements correctly", () => {
  const result = createParser(Fixtures.SimpleStatic).parse();
  const expected: Record<string, SerializedAst[]> = foo;

  assertEquals(result, expected);
});
