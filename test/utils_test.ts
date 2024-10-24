import ts from "npm:typescript@5.5.3";
import { assert } from "@std/assert";
import { hasConstructSignature, isDeclarationWithName } from "../src/utils.ts";
import { isContainerDeclaration } from "../src/utils.ts";
import { hasDeclarationWithType } from "../src/utils.ts";

const _ = undefined;

Deno.test("[isDeclarationWithName] returns true for an interface declaration with an identifier name", () => {
  const node = ts.factory.createInterfaceDeclaration(
    _,
    ts.factory.createIdentifier("Name"),
    _,
    _,
    [],
  );
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a variable declaration with a string name", () => {
  const node = ts.factory.createVariableDeclaration("Name", _, _, _);
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a variable declaration with an identifier name", () => {
  const node = ts.factory.createVariableDeclaration(
    ts.factory.createIdentifier("Name"),
    _,
    _,
    _,
  );
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a variable declaration with a binding pattern", () => {
  const node = ts.factory.createVariableDeclaration(
    ts.factory.createArrayBindingPattern([
      ts.factory.createBindingElement(_, _, "Name", _),
    ]),
    _,
    _,
    _,
  );
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a function declaration with a string name", () => {
  const node = ts.factory.createFunctionDeclaration(_, _, "Name", _, [], _, _);
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a module declaration with an identifier name", () => {
  const node = ts.factory.createModuleDeclaration(
    _,
    ts.factory.createIdentifier("Name"),
    _,
    0,
  );
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns true for a module declaration with a string literal name", () => {
  const node = ts.factory.createModuleDeclaration(
    _,
    ts.factory.createStringLiteral("Name"),
    _,
    0,
  );
  assert(isDeclarationWithName(node));
});

Deno.test("[isDeclarationWithName] returns false for an invalid declaration type", () => {
  const node = ts.factory.createClassDeclaration(_, "Name", _, _, []);
  assert(!isDeclarationWithName(node));
});

Deno.test("[hasConstructSignature] return true if the interface has a construct signature", () => {
  const node = ts.factory.createInterfaceDeclaration(_, "Name", _, _, [
    ts.factory.createConstructSignature(_, [], _),
  ]);
  assert(hasConstructSignature(node));
});

Deno.test("[hasConstructSignature] returns false for an empty interface", () => {
  const node = ts.factory.createInterfaceDeclaration(_, "Name", _, _, []);
  assert(!hasConstructSignature(node));
});

Deno.test("[hasConstructSignature] returns false for an interface without a construct signature", () => {
  const node = ts.factory.createInterfaceDeclaration(_, "Name", _, _, [
    ts.factory.createCallSignature(_, [], _),
  ]);
  assert(!hasConstructSignature(node));
});

Deno.test("[isContainerDeclaration] returns true for an interface declaration", () => {
  const node = ts.factory.createInterfaceDeclaration(_, "Name", _, _, []);
  assert(isContainerDeclaration(node));
});

Deno.test("[isContainerDeclaration] returns true for a module declaration", () => {
  const node = ts.factory.createModuleDeclaration(
    _,
    ts.factory.createIdentifier("Name"),
    _,
    0,
  );
  assert(isContainerDeclaration(node));
});

Deno.test("[isContainerDeclaration] returns false for an invalid declaration", () => {
  const node = ts.factory.createClassDeclaration(_, "Name", _, _, []);
  assert(!isContainerDeclaration(node));
});

Deno.test("[hasDeclarationWithType] returns true for a function declaration with a token type", () => {
  const node = ts.factory.createFunctionDeclaration(
    _,
    _,
    "Name",
    _,
    [],
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
    _,
  );
  assert(hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns true for a function declaration with a type reference type", () => {
  const node = ts.factory.createFunctionDeclaration(
    _,
    _,
    "Name",
    _,
    [],
    ts.factory.createTypeReferenceNode("Type", []),
    _,
  );
  assert(hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns true for a variable declaration with a token type", () => {
  const node = ts.factory.createVariableDeclaration(
    "Name",
    _,
    ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
    _,
  );
  assert(hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns true for a variable declaration with a type reference type", () => {
  const node = ts.factory.createVariableDeclaration(
    "Name",
    _,
    ts.factory.createTypeReferenceNode("Type", []),
    _,
  );
  assert(hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns false for a variable declaration with an invalid type", () => {
  const node = ts.factory.createVariableDeclaration(
    "Name",
    _,
    ts.factory.createTypeLiteralNode([]),
    _,
  );
  assert(!hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns false for a variable declaration without a type", () => {
  const node = ts.factory.createVariableDeclaration("Name", _, _, _);
  assert(!hasDeclarationWithType(node));
});

Deno.test("[hasDeclarationWithType] returns false for a variable declaration without a name", () => {
  const node = ts.factory.createVariableDeclaration(
    _ as unknown as string,
    _,
    _,
    _,
  );
  assert(!hasDeclarationWithType(node));
});
