import { worldCompounds, CompoundClass } from "./compound";
import { Compound } from "../types/compound";

export function createWorld(rows: number, cols: number): Compound[][] {
  const world: Compound[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: Compound[] = [];
    for (let j = 0; j < cols; j++) {
      const randomIndex = Math.floor(Math.random() * worldCompounds.length);
      const compound = worldCompounds[randomIndex];
      row.push(
        new CompoundClass(
          compound.components.a,
          compound.components.b,
          compound.components.c,
          compound.organic
        )
      );
    }
    world.push(row);
  }
  return world;
}
