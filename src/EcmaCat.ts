import * as tsMorph from "ts-morph";
import { Parser } from "./Parser.ts";
import Libraries from "./Libraries.ts";

const { exit } = Deno;

export class EcmaCat {
  public static main(...args: string[]): void {
    const project = new tsMorph.Project({ compilerOptions: { noLib: true } });
    const parser = new Parser(project, args.length ? args : Libraries.getTypescriptLibraryPaths());

    try {
      const ast = parser.parse();
      console.log(JSON.stringify(ast, null, 2));
    } catch (error) {
      console.error(error);
      exit(64);
    }
  }
}

if (import.meta.main) {
  EcmaCat.main(...Deno.args);
}
