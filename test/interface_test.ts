import { assert } from "@std/assert";
import { Project, TsLibParser } from "../src/tslib_parser.ts";

Deno.test("Interface is read correctly", () => {
  const project = new Project({ compilerOptions: { noLib: true } });
  const col = new TsLibParser(project, ["./fixtures/interface.d.ts"]);
  const globals = col.transpileToGlobalsJson();
  console.log(globals);
});
