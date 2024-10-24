import { assert, assertEquals } from "@std/assert";
import globalsJson from "../globals.json" with { type: "json" };
import { SerializedAst } from "../src/types.ts";

Deno.test("new Array()", () => {
  const globalArray = globalsJson["Array.new"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "ConstructSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0]?.meta?.[0] === "QuestionToken"
    );
  });

  assertEquals(found.length, 1);
});

Deno.test("new Array(n)", () => {
  const globalArray = globalsJson["Array.new"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "ConstructSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0]?.meta === undefined
    );
  });

  assert(found.length === 1);
});

Deno.test("new Array(...rest)", () => {
  const globalArray = globalsJson["Array.new"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "ConstructSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0]?.meta?.[0] === "DotDotDotToken"
    );
  });

  assert(found.length === 1);
});

Deno.test("Array()", () => {
  const globalArray = globalsJson["Array"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "CallSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0].meta?.[0] === "QuestionToken"
    );
  });

  assert(found.length === 1);
});

Deno.test("Array(n)", () => {
  const globalArray = globalsJson["Array"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "CallSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0]?.meta === undefined
    );
  });

  assert(found.length === 1);
});

Deno.test("Array(...rest)", () => {
  const globalArray = globalsJson["Array"];
  const found: SerializedAst[] = globalArray.filter((a: SerializedAst) => {
    return (
      a.kind === "CallSignature" &&
      a.parameters?.length === 1 &&
      a.parameters[0]?.meta?.[0] === "DotDotDotToken"
    );
  });

  assert(found.length === 1);
});
