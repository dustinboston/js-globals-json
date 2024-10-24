// deno-lint-ignore-file no-var no-empty-interface
interface QuantumPickle {}
interface MysticPlatypus {
  new (rhubarb: string): QuantumPickle;
  (rhubarb: string): QuantumPickle;
}
declare var QuantumPickle: MysticPlatypus;
