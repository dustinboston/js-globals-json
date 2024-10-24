import { assert } from "@std/assert";
import globalsJson from "../globals.json" with { type: "json" };

Deno.test('AggregateError inherits "cause" from Error', () => {
  assert(Object.hasOwn(globalsJson, "AggregateError.prototype.toString"));
});

Deno.test('AggregateError inherits "toString" from Error', () => {
  assert(Object.hasOwn(globalsJson, "AggregateError.prototype.cause"));
});

Deno.test('AggregateError inherits "message" from Error', () => {
  assert(Object.hasOwn(globalsJson, "AggregateError.prototype.message"));
});

Deno.test('AggregateError inherits "name" from Error', () => {
  assert(Object.hasOwn(globalsJson, "AggregateError.prototype.name"));
});
