import { Compound } from "../types/compound";

const calculateColorValue = (component: number): string => {
  const range = 255 / 10; // 10 is the max component value
  const value = Math.floor(component * range);
  const hex = value.toString(16).padStart(2, "0");
  return hex;
};

export class CompoundClass implements Compound {
  public color: string;
  public name: string;
  public components: {
    a: number;
    b: number;
    c: number;
  };
  public organic: boolean;

  constructor(a: number, b: number, c: number, organic: boolean) {
    this.components = { a, b, c };
    this.color = `#${calculateColorValue(a)}${calculateColorValue(
      b
    )}${calculateColorValue(c)}`;
    this.name = `${a.toString().padStart(2, "0")}_${b
      .toString()
      .padStart(2, "0")}_${c.toString().padStart(2, "0")}`;
    this.organic = organic;
  }

  static copy(compound: CompoundClass): CompoundClass {
    return new CompoundClass(
      compound.components.a,
      compound.components.b,
      compound.components.c,
      compound.organic
    );
  }
}
