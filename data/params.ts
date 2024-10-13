import { htmlTags, mathMlTags, svgTags, type BaseObjects } from './types.ts';

/** A record of built-in definitions indexed by string keys. */
export type Builtins = Record<string, (BuiltinDefn | BuiltinDefn[])>;

/** Categorizes different types of definitions such as constructors, static methods, etc */
export type DefnType =
  | 'Constructor'
  | 'StaticMethod'
  | 'StaticProperty'
  | 'InstanceMethod'
  | 'InstanceProperty'
  | 'Event';

/** Represents a tuple of a param name and its type. */
export type NamedParam = [name: string, type: ParamType];

/** Describes the structure of a built-in definition, including its type, params, return value, and inheritance. */
export type BuiltinDefn = {
  type: DefnType;
  params: Array<NamedParam>;
  returns: ParamType;
  inherits: Array<BaseObjects>;
};

/**
 * Interface representing a visitor for different param types.
 * Each method in this interface corresponds to a specific param type
 * and returns a string representation of the param.
 */

export interface ParamVisitor {
  visitAnd(param: AndParam): string;
  visitAny(param: AnyParam): string;
  visitArr(param: ArrParam): string;
  visitArrBuff(param: ArrBuffParam): string;
  visitBigInt(param: BigIntParam): string;
  visitBool(param: BooleanParameter): string;
  visitCtor(param: CtorParam): string;
  visitErr(param: ErrParam): string;
  visitFn(param: FnParam): string;
  visitIter(param: IterParam): string;
  visitMap(param: MapParam): string;
  visitNull(param: NullParam): string;
  visitNum(param: Num): string;
  visitObj(param: ObjParam): string;
  visitPromise(param: PromiseParam): string;
  visitRegex(param: RegexParam): string;
  visitSet(param: SetParam): string;
  visitStr(param: StrParam): string;
  visitSym(param: SymParam): string;
  visitTuple(param: TupleParam): string;
  visitTypedArr(param: TypedArrParam): string;
  visitUndef(param: UndefParam): string;
  visitOr(param: OrParam): string;
}
/**
 * A visitor class that implements the `ParameterTypeVisitor` interface to convert various param types
 * into their corresponding TypeScript type representations as strings.
 *
 * @remarks
 * This class provides methods to visit different param types and return their TypeScript type
 * representation. It supports a wide range of param types including primitive types, complex types,
 * and custom types.
 *
 * @example
 * ```typescript
 * const visitor = new JavaScriptParameterTypeVisitor();
 * const typeString = someParameter.accept(visitor);
 * console.log(typeString); // Outputs the TypeScript type as a string
 * ```
 */

export class JsVisitor implements ParamVisitor {
  visitAnd(param: AndParam): string {
    return param.types.map((t) => t.accept(this)).join(' & ');
  }
  visitAny(_param: AnyParam): string {
    return 'any';
  }
  visitArr(param: ArrParam): string {
    return `Array<${param.type.accept(this)}>`;
  }
  visitArrBuff(_param: ArrBuffParam): string {
    return 'ArrayBuffer';
  }
  visitBigInt(_param: BigIntParam): string {
    return 'bigint';
  }
  visitBool(_param: BooleanParameter): string {
    return 'boolean';
  }
  visitCtor(param: CtorParam): string {
    return param.builtin ?? 'Function';
  }
  visitErr(_param: ErrParam): string {
    return 'Error';
  }
  visitFn(_param: FnParam): string {
    return 'Function';
  }
  visitIter(param: IterParam): string {
    return `Iterable<${param.type.accept(this)}>`;
  }
  visitMap(param: MapParam): string {
    return `Map<${param.key.accept(this)}, ${param.value.accept(this)}>`;
  }
  visitNull(_param: NullParam): string {
    return 'null';
  }
  visitNum(_param: Num): string {
    return 'number';
  }
  visitObj(param: ObjParam): string {
    return (param.key && param.value) ? `Record<${param.key.accept(this)}, ${param.value.accept(this)}>` : 'object';
  }
  visitPromise(param: PromiseParam): string {
    return `Promise<${param.type.accept(this)}>`;
  }
  visitRegex(param: RegexParam): string {
    return param.pattern ?? 'RegExp';
  }
  visitSet(param: SetParam): string {
    return `Set<${param.type.accept(this)}>`;
  }
  visitStr(param: StrParam): string {
    return (param.literal) ? `"${param.literal}"` : 'string';
  }
  visitSym(_Param: SymParam): string {
    return 'symbol';
  }
  visitTuple(param: TupleParam): string {
    return `[${param.types.map((t) => t.accept(this)).join(', ')}]`;
  }
  visitTypedArr(param: TypedArrParam): string {
    return param.type;
  }
  visitUndef(_param: UndefParam): string {
    return 'undefined';
  }
  visitOr(param: OrParam): string {
    return param.types.map((t) => t.accept(this)).join(' | ');
  }
}
/**
 * A visitor that converts ParamTypes into Ensemble types.
 */

export class EnsembleVisitor implements ParamVisitor {
  visitAnd(param: AndParam): string {
    return `types.JsNode<${param.types.map((t) => t.accept(this)).join(' & ')}>`;
  }
  visitAny(_param: AnyParam): string {
    return `types.AstNode`;
  }
  visitArr(param: ArrParam): string {
    return `types.VectorNode<${param.type.accept(this)}>`;
  }
  visitArrBuff(_param: ArrBuffParam): string {
    return 'types.JsNode<ArrayBuffer>'; // this.AtomNode(ArrayBuffer)
  }
  visitBigInt(_param: BigIntParam): string {
    return 'types.NumberNode';
  }
  visitBool(_param: BooleanParameter): string {
    return 'types.BooleanNode';
  }
  visitCtor(param: CtorParam): string {
    return param.builtin ? `types.JsNode<${param.builtin}>` : `types.FunctionNode`;
  }
  visitErr(_param: ErrParam): string {
    return 'types.ErrorNode';
  }
  visitFn(_param: FnParam): string {
    return `types.FunctionNode`;
  }
  visitIter(param: IterParam): string {
    return `types.VectorNode<${param.type.accept(this)}>`;
  }
  visitMap(param: MapParam): string {
    return `types.MapNode<${param.key.accept(this)}, ${param.value.accept(this)}>`;
  }
  visitNull(_param: NullParam): string {
    return 'types.NilNode';
  }
  visitNum(_param: Num): string {
    return 'types.NumberNode';
  }
  visitObj(param: ObjParam): string {
    return (param.key && param.value)
      ? `types.MapNode<${param.key.accept(this)}, ${param.value.accept(this)}>`
      : 'types.MapNode';
  }
  // TODO: Promise
  visitPromise(param: PromiseParam): string {
    return `types.JsNode<Promise<${param.type.accept(this)}>>`;
  }
  // TODO: RegExp
  visitRegex(param: RegexParam): string {
    return `types.JsNode<${param.pattern ? `"${param.pattern}"` : 'RegExp'}>`;
  }
  visitSet(param: SetParam): string {
    return `types.VectorNode<${param.type.accept(this)}>`;
  }
  visitStr(param: StrParam): string {
    return (param.literal) ? `types.StringNode<"${param.literal}">` : 'types.StringNode';
  }
  visitSym(_param: SymParam): string {
    return 'types.SymbolNode';
  }
  visitTuple(param: TupleParam): string {
    return `types.VectorNode<[${param.types.map((t) => t.accept(this)).join(', ')}]>`;
  }
  // TODO: TypedArray
  visitTypedArr(param: TypedArrParam): string {
    return `types.JsNode<${param.type}>`;
  }
  visitUndef(_param: UndefParam): string {
    return 'types.NilNode';
  }
  visitOr(param: OrParam): string {
    return param.types.map((t) => t.accept(this)).join(' | ');
  }
}

export abstract class ParamType {
  abstract accept(visitor: ParamVisitor): string;
}

export class AnyParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitAny(this);
  }
}

export class ArrParam extends ParamType {
  constructor(public type: ParamType = new AnyParam()) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitArr(this);
  }
}

export class ArrBuffParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitArrBuff(this);
  }
}

export class BigIntParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitBigInt(this);
  }
}

export class BooleanParameter extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitBool(this);
  }
}

export class CtorParam extends ParamType {
  constructor(public builtin: BaseObjects = 'Function') {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitCtor(this);
  }
}

export class ErrParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitErr(this);
  }
}

export class FnParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitFn(this);
  }
}

export class IterParam extends ParamType {
  constructor(public type: ParamType = new AnyParam()) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitIter(this);
  }
}

export class MapParam extends ParamType {
  constructor(public key: ParamType = new StrParam(), public value: ParamType = new AnyParam()) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitMap(this);
  }
}

export class NullParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitNull(this);
  }
}

export class Num extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitNum(this);
  }
}

export class ObjParam extends ParamType {
  constructor(public key?: ParamType, public value?: ParamType) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitObj(this);
  }
}

export class PromiseParam extends ParamType {
  constructor(public type: ParamType = new AnyParam()) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitPromise(this);
  }
}

export class RegexParam extends ParamType {
  constructor(public pattern?: string) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitRegex(this);
  }
}

export class SetParam extends ParamType {
  constructor(public type: ParamType = new AnyParam()) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitSet(this);
  }
}

export class StrParam extends ParamType {
  constructor(public literal?: string) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitStr(this);
  }
}

export class SymParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitSym(this);
  }
}

export class TupleParam extends ParamType {
  public types: ParamType[] = [];
  constructor(...types: ParamType[]) {
    super();
    this.types = types;
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitTuple(this);
  }
}
/**
 * Represents a param type that holds a typed numeric array.
 */

export class TypedArrParam extends ParamType {
  constructor(
    public type: 'BigInt64Array' |
      'BigUint64Array' |
      'Float32Array' |
      'Float64Array' |
      'Int16Array' |
      'Int32Array' |
      'Int8Array' |
      'Uint16Array' |
      'Uint32Array' |
      'Uint8Array' |
      'Uint8ClampedArray' |
      'number' = 'number'
  ) {
    super();
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitTypedArr(this);
  }
}

export class UndefParam extends ParamType {
  accept(visitor: ParamVisitor) {
    return visitor.visitUndef(this);
  }
}

export class OrParam extends ParamType {
  public types: ParamType[] = [];
  constructor(...types: ParamType[]) {
    super();
    this.types = types;
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitOr(this);
  }
}

export class AndParam extends ParamType {
  public types: ParamType[] = [];
  constructor(...types: ParamType[]) {
    super();
    this.types = types;
  }
  accept(visitor: ParamVisitor) {
    return visitor.visitAnd(this);
  }
}
// MARK: FACTORY FNS
/**
 * Factory function for creating an AnyParameter instance.
 *
 * @returns A new instance of AnyParameter.
 */

export function any(): AnyParam {
  return new AnyParam();
}
/**
 * Factory function for creating an ArrayParameter instance.
 *
 * @param type - The param type for the array elements.
 * @returns A new instance of ArrayParameter.
 */

export function arr(type: ParamType = new AnyParam()): ArrParam {
  return new ArrParam(type);
}
/**
 * Factory function for creating an ArrayBufferParameter instance.
 *
 * @returns A new instance of ArrayBufferParameter.
 */

export function arrBuff(): ArrBuffParam {
  return new ArrBuffParam();
}
/**
 * Factory function for creating a BigIntParameter instance.
 *
 * @returns A new instance of BigIntParameter.
 */

export function bigInt(): BigIntParam {
  return new BigIntParam();
}
/**
 * Factory function for creating a BooleanParameter instance.
 *
 * @returns A new instance of BooleanParameter.
 */

export function bool(): BooleanParameter {
  return new BooleanParameter();
}
/**
 * Factory function for creating a ConstructorFunctionParameter instance.
 *
 * @param builtin - The built-in object for the constructor function.
 * @returns A new instance of ConstructorFunctionParameter.
 */

export function ctor(builtin: BaseObjects = 'Function'): CtorParam {
  return new CtorParam(builtin);
}
/**
 * Factory function for creating an ErrorParameter instance.
 *
 * @returns A new instance of ErrorParameter.
 */

export function error(): ErrParam {
  return new ErrParam();
}
/**
 * Factory function for creating a FunctionParameter instance.
 *
 * @param functionTypeDefinition - The type definition of the function.
 * @returns A new instance of FunctionParameter.
 */

export function fn(): FnParam {
  return new FnParam();
}
/**
 * Factory function for creating an IterableParameter instance.
 *
 * @param type - The param type for the iterable elements.
 * @returns A new instance of IterableParameter.
 */

export function iter(type: ParamType = new AnyParam()): IterParam {
  return new IterParam(type);
}
/**
 * Factory function for creating a MapParameter instance.
 *
 * @param key - The param type for the map keys.
 * @param value - The param type for the map values.
 * @returns A new instance of MapParameter.
 */

export function map(key: ParamType = new StrParam(), value: ParamType = new AnyParam()): MapParam {
  return new MapParam(key, value);
}
/**
 * Factory function for creating a NullParameter instance.
 *
 * @returns A new instance of NullParameter.
 */

export function nil(): NullParam {
  return new NullParam();
}
/**
 * Factory function for creating a NumberParameter instance.
 *
 * @returns A new instance of NumberParameter.
 */

export function num(): Num {
  return new Num();
}
/**
 * Factory function for creating an ObjectParameter instance.
 *
 * @param key - The param type for the object keys.
 * @param value - The param type for the object values.
 * @returns A new instance of ObjectParameter.
 */

export function obj(key?: ParamType, value?: ParamType): ObjParam {
  return new ObjParam(key, value);
}
/**
 * Factory function for creating a PromiseParameter instance.
 *
 * @param type - The param type for the promise result.
 * @returns A new instance of PromiseParameter.
 */

export function promise(type: ParamType = new AnyParam()): PromiseParam {
  return new PromiseParam(type);
}
/**
 * Factory function for creating a RegExpParameter instance.
 *
 * @param pattern - The pattern for the regular expression.
 * @returns A new instance of RegExpParameter.
 */

export function regex(pattern?: string): RegexParam {
  return new RegexParam(pattern);
}
/**
 * Factory function for creating a SetParameter instance.
 *
 * @param type - The param type for the set elements.
 * @returns A new instance of SetParameter.
 */

export function set(type: ParamType = new AnyParam()): SetParam {
  return new SetParam(type);
}
/**
 * Factory function for creating a StringParameter instance.
 *
 * @param literal - The literal string value.
 * @returns A new instance of StringParameter.
 */

export function str(literal?: string): StrParam {
  return new StrParam(literal);
}
/**
 * Factory function for creating a SymbolParameter instance.
 *
 * @returns A new instance of SymbolParameter.
 */

export function sym(): SymParam {
  return new SymParam();
}
/**
 * Factory function for creating a TupleParameter instance.
 *
 * @param types - The param types for the tuple elements.
 * @returns A new instance of TupleParameter.
 */

export function tuple(...types: ParamType[]): TupleParam {
  return new TupleParam(...types);
}
/**
 * Factory function for creating a TypedArrayParameter instance.
 *
 * @param type - The type of the typed array.
 * @returns A new instance of TypedArrayParameter.
 */

export function typedArr(
  type: 'BigInt64Array' |
    'BigUint64Array' |
    'Float32Array' |
    'Float64Array' |
    'Int16Array' |
    'Int32Array' |
    'Int8Array' |
    'Uint16Array' |
    'Uint32Array' |
    'Uint8Array' |
    'Uint8ClampedArray' |
    'number' = 'number'
): TypedArrParam {
  return new TypedArrParam(type);
}
/**
 * Factory function for creating an UndefinedParameter instance.
 *
 * @returns A new instance of UndefinedParameter.
 */

export function undef(): UndefParam {
  return new UndefParam();
}
/**
 * Factory function for creating an OrParameter instance.
 *
 * @param types - The param types for the union.
 * @returns A new instance of OrParameter.
 */

export function or(...types: ParamType[]): OrParam {
  return new OrParam(...types);
}

export function and(...types: ParamType[]): AndParam {
  return new AndParam(...types);
}


// MARK: TYPE HELPERS
export const mathMlTagStrs = () => or(...Array.from(mathMlTags).map((t) => ctor(t as BaseObjects)));
export const svgEls = () =>
  or(...Array.from(svgInterfaces).filter((i) => i.endsWith('Element')).map((i) => ctor(i as BaseObjects)));
export const svgTagStrs = () => or(...Array.from(svgTags).map((tag) => str(tag)));
export const htmlCollection = arr;
export const elOrNil = () => or(ctor('Element'), nil());
export const htmlTagStrs = () => or(...Array.from(htmlTags).map((tag) => str(tag)));
export const htmlEls = () =>
  or(...Array.from(htmlDomInterfaces).filter((el) => el.startsWith('HTML')).map((el) => ctor(el as BaseObjects)));
