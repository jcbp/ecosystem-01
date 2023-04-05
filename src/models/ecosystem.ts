import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { Compound } from "../types/compound";
import { EcosystemBlueprint } from "./ecosystem-blueprint";

export class Ecosystem {
  private readonly rows: number;
  private readonly cols: number;
  private readonly compounds: Compound[][];
  private readonly organisms: Organism[][][];

  constructor(rows: number, cols: number, numInitialOrganisms: number) {
    this.rows = rows;
    this.cols = cols;
    this.compounds = this.generateCompounds(rows, cols);
    this.organisms = this.generateOrganisms(rows, cols, numInitialOrganisms);
  }

  private generateCompounds(rows: number, cols: number): Compound[][] {
    const ecosystemBlueprint = EcosystemBlueprint.getInstance();
    const compounds: Compound[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: Compound[] = [];
      for (let j = 0; j < cols; j++) {
        const randomIndex = Math.floor(
          Math.random() * ecosystemBlueprint.inorganicCompoundTypes.length
        );
        const compound = ecosystemBlueprint.inorganicCompoundTypes[randomIndex];
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
    const ecosystemBlueprint = EcosystemBlueprint.getInstance();
    const randomIndex = Math.floor(
      Math.random() * ecosystemBlueprint.organismTypes.length
    );
    const specimen = ecosystemBlueprint.organismTypes[randomIndex];
    return Organism.copy(specimen, this);
  }

  private isWithinBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  public getNearbyOrganisms(organism: Organism, radius: number): Organism[] {
    const nearbyOrganisms: Organism[] = [];

    const [organismX, organismY] = this.findOrganismLocation(organism);

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const x = organismX + i;
        const y = organismY + j;

        if (this.isWithinBounds(x, y)) {
          const organismsInCell = this.organisms[x][y];
          organismsInCell.forEach((o) => {
            if (o !== organism) {
              nearbyOrganisms.push(o);
            }
          });
        }
      }
    }

    return nearbyOrganisms;
  }

  public getNearbyCompounds(organism: Organism, radius: number): Compound[] {
    const nearbyCompounds: Compound[] = [];

    const [organismX, organismY] = this.findOrganismLocation(organism);

    for (let i = -radius; i <= radius; i++) {
      for (let j = -radius; j <= radius; j++) {
        const x = organismX + i;
        const y = organismY + j;

        if (this.isWithinBounds(x, y)) {
          const compound = this.compounds[x][y];
          nearbyCompounds.push(compound);
        }
      }
    }

    return nearbyCompounds;
  }

  public findOrganismLocation(organism: Organism): [number, number] {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const organisms = this.organisms[i][j];
        const index = organisms.findIndex((o) => o === organism);
        if (index !== -1) {
          return [i, j];
        }
      }
    }

    throw new Error("Organism not found in ecosystem");
  }

  public findCompoundLocation(compound: Compound): [number, number] {
    for (let x = 0; x < this.rows; x++) {
      const y = this.compounds[x].indexOf(compound);
      if (y !== -1) {
        return [x, y];
      }
    }
    throw new Error("Compound not found in ecosystem");
  }

  public getOrganismsAtSamePosition(organism: Organism): Organism[] {
    const [organismX, organismY] = this.findOrganismLocation(organism);
    return this.organisms[organismX][organismY].filter((o) => o !== organism);
  }

  public getCompoundAtSamePosition(organism: Organism): Compound {
    const [organismX, organismY] = this.findOrganismLocation(organism);
    return this.compounds[organismX][organismY];
  }

  public getCompounds(): Compound[][] {
    return this.compounds;
  }

  public getCompound(row: number, col: number): Compound {
    return this.compounds[row][col];
  }

  public getOrganisms(): Organism[][][] {
    return this.organisms;
  }

  public addOrganism(organism: Organism, row: number, col: number): void {
    this.organisms[row][col].push(organism);
  }

  public removeOrganism(organism: Organism, row: number, col: number): void {
    const organisms = this.organisms[row][col];
    const index = organisms.findIndex((o) => o === organism);
    if (index >= 0) {
      organisms.splice(index, 1);
    }
  }

  public moveOrganism(
    organism: Organism,
    destinationRow: number,
    destinationCol: number
  ): void {
    const [originRow, originCol] = this.findOrganismLocation(organism);

    if (!this.isWithinBounds(destinationRow, destinationCol)) {
      throw new Error("Destination out of bounds");
    }

    if (originRow === destinationRow && originCol === destinationCol) {
      return;
    }

    const organismsInOriginCell = this.organisms[originRow][originCol];
    const index = organismsInOriginCell.indexOf(organism);
    if (index === -1) {
      throw new Error("Organism not found in origin cell");
    }

    this.removeOrganism(organism, originRow, originCol);
    this.organisms[destinationRow][destinationCol].push(organism);
  }

  public update(): void {
    // Update compounds
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.updateCompounds(i, j);
      }
    }

    // Update organisms
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.updateOrganisms(i, j);
      }
    }
  }

  private updateCompounds(row: number, col: number): void {
    const compound = this.compounds[row][col];
    // compound.update();
    if (compound.isExhausted()) {
      // this.removeCompound(row, col);
    }
  }

  private updateOrganisms(row: number, col: number): void {
    const organismsInCell = this.organisms[row][col];
    organismsInCell.forEach((organism) => {
      organism.update();
      if (!organism.isAlive) {
        this.removeOrganism(organism, row, col);
      }
    });
  }
}
