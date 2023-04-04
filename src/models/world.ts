import { worldInorganicCompounds, CompoundClass } from "./compound";
import { worldOrganisms, OrganismClass } from "./organism";
import { Compound } from "../types/compound";
import { Organism } from "../types/organism";

export class World {
  private readonly rows: number;
  private readonly cols: number;
  private readonly compounds: Compound[][];
  private readonly organisms: (Organism | null)[][];

  constructor(rows: number, cols: number, numInitialOrganisms: number) {
    this.rows = rows;
    this.cols = cols;
    this.compounds = this.generateCompounds(rows, cols);
    this.organisms = this.generateOrganisms(rows, cols, numInitialOrganisms);
  }

  private generateCompounds(rows: number, cols: number): Compound[][] {
    const compounds: Compound[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Compound[] = [];
      for (let j = 0; j < cols; j++) {
        const randomIndex = Math.floor(
          Math.random() * worldInorganicCompounds.length
        );
        const compound = worldInorganicCompounds[randomIndex];
        row.push(CompoundClass.copy(compound));
      }
      compounds.push(row);
    }
    return compounds;
  }

  private generateOrganisms(
    rows: number,
    cols: number,
    numOrganisms: number
  ): (Organism | null)[][] {
    const organisms: (Organism | null)[][] = [];

    // initialize empty grid
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push(null);
      }
      organisms.push(row);
    }

    // place organisms randomly
    for (let i = 0; i < numOrganisms; i++) {
      const organism = this.generateRandomOrganism();
      let x, y;
      do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
      } while (organisms[x][y] !== null);
      organisms[x][y] = organism;
    }

    return organisms;
  }

  private generateRandomOrganism(): Organism {
    const randomIndex = Math.floor(Math.random() * worldOrganisms.length);
    const specimen = worldOrganisms[randomIndex];
    return OrganismClass.copy(specimen);
  }

  public getCompounds(): Compound[][] {
    return this.compounds;
  }

  public getCompound(row: number, col: number): Compound {
    return this.compounds[row][col];
  }

  public getOrganism(row: number, col: number): Organism | null {
    return this.organisms[row][col];
  }

  public addOrganism(organism: Organism, row: number, col: number): void {
    this.organisms[row][col] = organism;
  }

  public removeOrganism(row: number, col: number): void {
    this.organisms[row][col] = null;
  }

  public moveOrganism(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ): void {
    const organism = this.organisms[fromRow][fromCol];
    this.organisms[fromRow][fromCol] = null;
    this.organisms[toRow][toCol] = organism;
  }

  public update(): void {
    // update the state of the world after each turn
  }
}
