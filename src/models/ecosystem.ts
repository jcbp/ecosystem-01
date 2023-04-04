import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { Compound } from "../types/compound";
import { EcosystemBlueprint } from "./ecosystem-blueprint";

export class Ecosystem {
  private readonly rows: number;
  private readonly cols: number;
  private readonly compounds: Compound[][];
  private readonly organisms: Organism[][][];
  private readonly ecosystemBlueprint: EcosystemBlueprint;

  constructor(
    ecosystemBlueprint: EcosystemBlueprint,
    rows: number,
    cols: number,
    numInitialOrganisms: number
  ) {
    this.rows = rows;
    this.cols = cols;
    this.ecosystemBlueprint = ecosystemBlueprint;
    this.compounds = this.generateCompounds(rows, cols);
    this.organisms = this.generateOrganisms(rows, cols, numInitialOrganisms);
  }

  private generateCompounds(rows: number, cols: number): Compound[][] {
    const compounds: Compound[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Compound[] = [];
      for (let j = 0; j < cols; j++) {
        const randomIndex = Math.floor(
          Math.random() *
            this.ecosystemBlueprint.inorganicCompoundTypes.length
        );
        const compound =
          this.ecosystemBlueprint.inorganicCompoundTypes[randomIndex];
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
  ): Organism[][][] {
    const organisms: Organism[][][] = [];

    // initialize empty grid
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        row.push([]);
      }
      organisms.push(row);
    }

    // place organisms randomly
    for (let i = 0; i < numOrganisms; i++) {
      const x = Math.floor(Math.random() * rows);
      const y = Math.floor(Math.random() * cols);
      const organism = this.generateRandomOrganism();
      organisms[x][y].push(organism);
    }

    return organisms;
  }

  private generateRandomOrganism(): Organism {
    const randomIndex = Math.floor(
      Math.random() * this.ecosystemBlueprint.organismTypes.length
    );
    const specimen = this.ecosystemBlueprint.organismTypes[randomIndex];
    return Organism.copy(specimen);
  }

  public getCompounds(): Compound[][] {
    return this.compounds;
  }

  public getCompound(row: number, col: number): Compound {
    return this.compounds[row][col];
  }

  public getOrganisms(row: number, col: number): Organism[] {
    return this.organisms[row][col];
  }

  public addOrganism(organism: Organism, row: number, col: number): void {
    this.organisms[row][col].push(organism);
  }

  public removeOrganism(row: number, col: number, organism: Organism): void {
    const organisms = this.organisms[row][col];
    const index = organisms.findIndex((o) => o === organism);
    if (index >= 0) {
      organisms.splice(index, 1);
    }
  }

  public moveOrganism(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    organism: Organism
  ): void {
    this.removeOrganism(fromRow, fromCol, organism);
    this.organisms[toRow][toCol].push(organism);
  }

  public update(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.organisms[i][j];

        // call update for each organism in the cell
        cell.forEach((organism) => {
          if (organism) {
            organism.update();
          }
        });
      }
    }
  }
}
