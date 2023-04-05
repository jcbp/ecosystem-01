import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { CompoundClass } from "./compound";
import { Ecosystem } from "./ecosystem";

interface Context {
  nearbyCompounds: Compound[];
  nearbyOrganisms: Organism[];
}

export class Organism {
  public name: string;
  public color: string;
  public energy: number = 100;
  public senescence: number = 0;
  public isAlive: boolean = true;
  public contextSensitivity: number = 2;
  public metabolicRate: number;
  public reproduction: Reproduction;
  public constituentCompounds: Compound[];
  public metabolizableCompounds: NutrientRequirement[];
  public toxicCompounds: Compound[];
  public mutation: Mutation;
  public ecosystem: Ecosystem | undefined;

  constructor(
    constituentCompounds: Compound[],
    metabolizableCompounds: NutrientRequirement[],
    toxicCompounds: Compound[],
    reproduction: Reproduction,
    mutation: Mutation,
    metabolicRate: number,
    name: string,
    color: string,
    ecosystem?: Ecosystem
  ) {
    this.constituentCompounds = constituentCompounds;
    this.metabolizableCompounds = metabolizableCompounds;
    this.toxicCompounds = toxicCompounds;
    this.reproduction = reproduction;
    this.mutation = mutation;
    this.metabolicRate = metabolicRate;
    this.name = name;
    this.color = color;
    this.ecosystem = ecosystem;
  }

  private move(x: number, y: number) {
    this.ecosystem!.moveOrganism(this, x, y);
    this.energy -= this.metabolicRate * 2;
  }

  private findNutrients(): [number, number] | null {
    const context = this.getContext();
    for (const nutrient of this.metabolizableCompounds) {
      for (const compound of context.nearbyCompounds) {
        if (compound.name === nutrient.compound.name) {
          const [row, col] = this.ecosystem!.findCompoundLocation(compound);
          return [row, col];
        }
      }
      for (const organism of context.nearbyOrganisms) {
        if (
          organism !== this &&
          organism.constituentCompounds.some(
            (compound) => compound.name === nutrient.compound.name
          )
        ) {
          const [row, col] = this.ecosystem!.findOrganismLocation(organism);
          return [row, col];
        }
      }
    }
    return null;
  }

  public searchNutrientsAtCurrentPosition(): Organism | Compound | null {
    const currentCompound = this.ecosystem!.getCompoundAtSamePosition(this);
    if (
      currentCompound &&
      this.metabolizableCompounds.some(
        (r) => r.compound.name === currentCompound.name
      )
    ) {
      return currentCompound;
    }

    // Search for metabolizable compounds in other organisms in the current position
    const organismsAtSamePosition =
      this.ecosystem!.getOrganismsAtSamePosition(this);
    for (const organism of organismsAtSamePosition) {
      if (
        this.metabolizableCompounds.some((r) =>
          organism.constituentCompounds.includes(r.compound)
        )
      ) {
        return organism;
      }
    }

    // No metabolizable compounds found
    return null;
  }

  private consumeNutrient(nutrientSource: Organism | CompoundClass) {
    if (nutrientSource instanceof Organism) {
      for (const requirement of this.metabolizableCompounds) {
        const compound = requirement.compound;
        const quantity = requirement.quantity;
        if (
          nutrientSource.constituentCompounds.find(
            (c) => c.name === compound.name
          )
        ) {
          this.energy += quantity;
        }
      }
      nutrientSource.energy -= 30;
    } else if (nutrientSource instanceof CompoundClass) {
      if (!nutrientSource.isExhausted()) {
        const requirement = this.metabolizableCompounds.find(
          (r) => r.compound.name === nutrientSource.name
        );
        if (requirement) {
          this.energy += requirement.quantity;
        }
        nutrientSource.remaining -= 30;
      }
    }
  }

  public update(): void {
    this.energy -= this.metabolicRate / 2;
    this.senescence++;

    if (this.energy < 80) {
      const nutrients = this.searchNutrientsAtCurrentPosition();
      if (nutrients) {
        this.consumeNutrient(nutrients);
      }
      // If energy is less than 50, search for nutrients
      else if (this.energy < 50) {
        const nutrientsCoords = this.findNutrients();
        if (nutrientsCoords) {
          this.move(nutrientsCoords[0], nutrientsCoords[1]);
        } else {
          // Move to a random location
          const ecosystemCompounds = this.ecosystem!.getCompounds();
          const rows = ecosystemCompounds.length;
          const cols = ecosystemCompounds[0].length;
          const randomRow = Math.floor(Math.random() * rows);
          const randomCol = Math.floor(Math.random() * cols);
          this.move(randomRow, randomCol);
        }
      }
    }

    if (this.energy <= 0) {
      this.isAlive = false;
    }
  }

  public getContext(): Context {
    if (!this.ecosystem) {
      throw new Error("Cannot determine context without ecosystem");
    }
    const nearbyOrganisms = this.ecosystem.getNearbyOrganisms(
      this,
      this.contextSensitivity
    );
    const nearbyCompounds = this.ecosystem.getNearbyCompounds(
      this,
      this.contextSensitivity
    );
    return { nearbyCompounds, nearbyOrganisms };
  }

  static copy(organism: Organism, ecosystem: Ecosystem): Organism {
    return new Organism(
      organism.constituentCompounds,
      organism.metabolizableCompounds,
      organism.toxicCompounds,
      organism.reproduction,
      organism.mutation,
      organism.metabolicRate,
      organism.name,
      organism.color,
      ecosystem
    );
  }
}
