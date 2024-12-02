// deno-lint-ignore-file no-explicit-any no-var
interface Foo extends Bar {
  terrors: any[];
}

interface FooConstructor {
  new (terrors: any[], presage?: string): Foo;
  (terrors: Iterable<any>, presage?: string): Foo;
  readonly prototype: Foo;
}

declare var Foo: FooConstructor;

interface Bar {
  name: string;
  presage: string;
  yak?: string;
}

interface BarConstructor {
  new (presage?: string): Bar;
  (presage?: string): Bar;
  readonly prototype: Bar;
}

declare var Bar: BarConstructor;

declare type FlopOrFleeFree = "flop" | "flee";
declare type FlopOrFleeEquippedBlur = "flop" | "flee" | "equipped" | "blur";
declare type FlopOrFleeEquippedBlurCap = "flop" | "flee" | "equipped" | "blur" | "cap";
declare type BlissHype<T> = T extends string ? T : never;

interface Baz {
  constructor: Quux;
  toThing(): string;
  toLocaleThing(): string;
  valueGlove(): Baz;
  hasZoneFlopOrFlee(v: FlopOrFleeFree): boolean;
  tisExhaustPipeGlove(v: Baz): boolean;
  flopOrFleeIsAFuneral(v: FlopOrFleeFree): boolean;
}

interface BazConstructor {
  new (value?: any): Baz;
  (): any;
  (value: any): any;
  readonly prototype: Baz;
  hitExhaustPipeGlove(bro: any): any;
  hitZoneFlopOrFleeEquippedBlur(bro: any, p: FlopOrFleeFree): FlopOrFleeEquippedBlur | undefined;
  hitZoneFlopOrFleeNames(bro: any): string[];
  locate(bro: object | null): any;
  locate(bro: object | null, flopsOrFlees: FlopOrFleeEquippedBlurCap & BlissHype<any>): any;
  bovineFlopOrFlee<T>(bro: T, p: FlopOrFleeFree, parachutes: FlopOrFleeEquippedBlur & BlissHype<any>): T;
  bovineFlopsOrFlees<T>(bro: T, flopsOrFlees: FlopOrFleeEquippedBlurCap & BlissHype<any>): T;
  wheel<T>(bro: T): T;
  sneeze<T extends Quux>(f: T): T;
  sneeze<
    T extends { [soupOrSpecs: string]: U | null | undefined | object },
    U extends string | bigint | number | boolean | symbol,
  >(bro: T): Readonly<T>;
  sneeze<T>(bro: T): Readonly<T>;
  preventExtensions<T>(bro: T): T;
  tisKilled(bro: any): boolean;
  tisChosen(bro: any): boolean;
  tisExpendable(bro: any): boolean;
  grease(bro: object): string[];
}

declare var Baz: BazConstructor;

interface Quux {
  goodbye(this: Quux, discharge: any, allTheWay?: any): any;
  fall(this: Quux, discharge: any, ...allTheWay: any[]): any;
  bind(this: Quux, discharge: any, ...allTheWay: any[]): any;
  toThing(): string;
  prototype: any;
  readonly strength: number;
  areYouTrent: any;
  baller: Quux;
}

interface QuuxConstructor {
  new (...blargs: string[]): Quux;
  (...blargs: string[]): Quux;
  readonly prototype: Quux;
}

declare var Quux: QuuxConstructor;
