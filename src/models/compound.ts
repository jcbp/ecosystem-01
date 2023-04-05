import { Compound } from "../types/compound";
import { calculateColorValue } from "../utils/colors";

export class CompoundClass implements Compound {
  public color: string;
  public name: string;
  public components: {
    a: number;
    b: number;
    c: number;
  };
  public organic: boolean;
  public remaining: number = 100;

  public isExhausted(): boolean {
    return this.remaining <= 0;
  }

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
