// deno-lint-ignore-file no-explicit-any
import ts from "typescript";
import { assertEquals } from "@std/assert";
import { TsLibParser } from "../src/tslib_parser.ts";
import { TypeResolver } from "../src/type_resolver.ts";

import _varEmptyJson from "./fixtures/var_empty.json" with { type: "json" };
import _varMissingJson from "./fixtures/var_missing.json" with { type: "json" };
import _varNewJson from "./fixtures/var_new.json" with { type: "json" };

const varEmptyJson = _varEmptyJson as any;
const varMissingJson = _varMissingJson as any;
const varNewJson = _varNewJson as any;

Deno.test("Variable declaration with missing interfaces is an empty object", () => {
  const program = ts.createProgram(["./test/fixtures/var_missing.d.ts"], { noLib: true });
  const result = new TsLibParser(program, new TypeResolver(program)).parse();
  assertEquals(result, varMissingJson);
});

Deno.test("Variable declaration with empty interfaces is an empty object", () => {
  const program = ts.createProgram(["./test/fixtures/var_empty.d.ts"], { noLib: true });
  const result = new TsLibParser(program, new TypeResolver(program)).parse();
  assertEquals(result, varEmptyJson);
});

Deno.test("Variable declaration with a constructor has a 'new' method", () => {
  const program = ts.createProgram(["./test/fixtures/var_new.d.ts"], { noLib: true });
  const result = new TsLibParser(program, new TypeResolver(program)).parse();
  assertEquals(result, varNewJson);
});
