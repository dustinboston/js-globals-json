import { assert, assertEquals } from "@std/assert";
import { Parser } from "../src/Parser.ts";
import * as tsMorph from "ts-morph";

const project = new tsMorph.Project({ compilerOptions: { noLib: true } });
const tsParser = new Parser(project, ["./test/fixtures/particles.d.txt"]);
const json = tsParser.parse();
const photon = json["Photon"];
const charm = json["charm"];

Deno.test("Photon has Photon::wavelength", () => {
  assert("Photon::wavelength" in photon);
});

Deno.test("Photon has Photon::getFrequency", () => {
  assert("Photon::getFrequency" in photon);
});

Deno.test("Photon has Photon::getEnergy", () => {
  assert("Photon::getEnergy" in photon);
});

Deno.test("Photon::getEnergy length", () => {
  assertEquals(photon["Photon::getEnergy"].length, 5);
});

Deno.test("Photon has Photon::getMomentum", () => {
  assert("Photon::getMomentum" in photon);
});

Deno.test("Photon has Photon::getColor", () => {
  assert("Photon::getColor" in photon);
});

Deno.test("Photon has Photon::isVisible", () => {
  assert("Photon::isVisible" in photon);
});

Deno.test("Photon has Photon::convertWavelength", () => {
  assert("Photon::convertWavelength" in photon);
});

Deno.test("Photon::convertWavelength length", () => {
  assertEquals(photon["Photon::convertWavelength"].length, 2);
});

Deno.test("Photon has Photon", () => {
  assert("Photon" in photon);
});

Deno.test("Photon length", () => {
  assertEquals(photon["Photon"].length, 2);
});

Deno.test("Photon has Photon::", () => {
  assert("Photon::" in photon);
});

Deno.test("Photon has Photon.speedOfLight", () => {
  assert("Photon.speedOfLight" in photon);
});

Deno.test("Photon.speedOfLight length", () => {
  assertEquals(photon["Photon.speedOfLight"].length, 2);
});

Deno.test("Photon has Photon.plancksConstant", () => {
  assert("Photon.plancksConstant" in photon);
});

Deno.test("Photon.plancksConstant length", () => {
  assertEquals(photon["Photon.plancksConstant"].length, 2);
});

Deno.test("Photon has Photon.electronVolt", () => {
  assert("Photon.electronVolt" in photon);
});

Deno.test("Photon.electronVolt length", () => {
  assertEquals(photon["Photon.electronVolt"].length, 2);
});

Deno.test("Photon has Photon.convertEnergyToElectronVolts", () => {
  assert("Photon.convertEnergyToElectronVolts" in photon);
});

Deno.test("Photon.convertEnergyToElectronVolts length", () => {
  assertEquals(photon["Photon.convertEnergyToElectronVolts"].length, 2);
});

Deno.test("Photon has Photon.calculateMomentum", () => {
  assert("Photon.calculateMomentum" in photon);
});

Deno.test("Photon.calculateMomentum length", () => {
  assertEquals(photon["Photon.calculateMomentum"].length, 2);
});

Deno.test("Photon has Photon.fromWavelength", () => {
  assert("Photon.fromWavelength" in photon);
});

Deno.test("Photon.fromWavelength length", () => {
  assertEquals(photon["Photon.fromWavelength"].length, 4);
});

Deno.test("Photon has Photon.create", () => {
  assert("Photon.create" in photon);
});

Deno.test("Photon.create length", () => {
  assertEquals(photon["Photon.create"].length, 2);
});

// Tests to assert that Antiparticle keys do not exist
Deno.test("Antiparticle does not exist", () => {
  assert(!("Antiparticle" in photon));
});

// Tests for charm static interface
Deno.test("charm has charm.mass", () => {
  assert("charm.mass" in charm);
});

Deno.test("charm.mass length", () => {
  assertEquals(charm["charm.mass"].length, 1);
});

Deno.test("charm has charm.charge", () => {
  assert("charm.charge" in charm);
});

Deno.test("charm.charge length", () => {
  assertEquals(charm["charm.charge"].length, 1);
});

Deno.test("charm has charm.spin", () => {
  assert("charm.spin" in charm);
});

Deno.test("charm.spin length", () => {
  assertEquals(charm["charm.spin"].length, 1);
});

Deno.test("charm has charm.symbol", () => {
  assert("charm.symbol" in charm);
});

Deno.test("charm.symbol length", () => {
  assertEquals(charm["charm.symbol"].length, 1);
});

Deno.test("charm has charm.colorCharge", () => {
  assert("charm.colorCharge" in charm);
});

Deno.test("charm.colorCharge length", () => {
  assertEquals(charm["charm.colorCharge"].length, 1);
});

Deno.test("charm has charm.calculateInteractionEnergy", () => {
  assert("charm.calculateInteractionEnergy" in charm);
});

Deno.test("charm.calculateInteractionEnergy length", () => {
  assertEquals(charm["charm.calculateInteractionEnergy"].length, 1);
});

Deno.test("charm has charm.toString", () => {
  assert("charm.toString" in charm);
});

Deno.test("charm.toString length", () => {
  assertEquals(charm["charm.toString"].length, 1);
});

Deno.test("charm has charm.decay", () => {
  assert("charm.decay" in charm);
});

Deno.test("charm.decay length", () => {
  assertEquals(charm["charm.decay"].length, 1);
});
