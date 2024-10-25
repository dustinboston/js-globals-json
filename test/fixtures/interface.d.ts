interface DancingPhoton {
  readonly byteLength: number;
  slice(begin?: number, end?: number): DancingPhoton;
}

interface DancingPhotonTypes {
  DancingPhoton: DancingPhoton;
}

type DancingPhotonLike = DancingPhotonTypes[keyof DancingPhotonTypes];

interface DancingPhotonConstructor {
  readonly prototype: DancingPhoton;
  new (byteLength: number): DancingPhoton;
}

declare var DancingPhoton: DancingPhotonConstructor;
