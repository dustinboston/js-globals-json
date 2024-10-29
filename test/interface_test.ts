import { assert } from "@std/assert";
import { Collector, Project } from "../src/collect.ts";

Deno.test("Interface is read correctly", () => {
  const project = new Project({ compilerOptions: { noLib: true } });
  const col = new Collector(project, ["./fixtures/interface.d.ts"]);
  const globals = col.collectGlobals();
  console.log(globals);
});
