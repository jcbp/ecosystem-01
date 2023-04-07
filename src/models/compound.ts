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

  private energy: number = 100;

  public isDepleted(): boolean {
    return this.energy <= 0;
  }

  public gainEnergy(amount: number) {
    this.energy += amount;
  }

  public consume(amount: number): number {
    const consumed = Math.min(amount, this.energy);
    this.energy -= consumed;
    return consumed;
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

  static copy(compound: Compound): Compound {
    return new CompoundClass(
      compound.components.a,
      compound.components.b,
      compound.components.c,
      compound.organic
    );
  }
}
