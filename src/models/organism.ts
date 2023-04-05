import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { CompoundClass } from "./compound";
import { Ecosystem } from "./ecosystem";

interface Context {
  nearbyCompounds: Compound[];
  nearbyOrganisms: Organism[];
}

interface OrganismTraits {
  constituentCompounds: Compound[];
  metabolizableCompounds: NutrientRequirement[];
  toxicCompounds: Compound[];
  reproduction: Reproduction;
  mutation: Mutation;
  metabolicRate: number;
  contextSensitivity: number;
  movementPattern: string;
}

export class Organism {
  public name: string;
  public color: string;
  public energy: number = 100;
  public senescence: number = 0;
  public isAlive: boolean = true;
  public ecosystem: Ecosystem | undefined;
  public traits: OrganismTraits;

  private movementPatternIndex: number = 0;

  constructor(
    name: string,
    color: string,
    traits: OrganismTraits,
    ecosystem?: Ecosystem
  ) {
    this.name = name;
    this.color = color;
    this.traits = traits;
    this.ecosystem = ecosystem;
  }

  private move(x: number, y: number) {
    this.ecosystem!.moveOrganism(this, x, y);
    this.energy -= this.traits.metabolicRate * 4;
  }

  private findNutrients(): [number, number] | null {
    const context = this.getContext();
    for (const nutrient of this.traits.metabolizableCompounds) {
      for (const compound of context.nearbyCompounds) {
        if (compound.name === nutrient.compound.name) {
          const [row, col] = this.ecosystem!.findCompoundLocation(compound);
          return [row, col];
        }
      }
      for (const organism of context.nearbyOrganisms) {
        if (
          organism !== this &&
          organism.traits.constituentCompounds.some(
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
      this.traits.metabolizableCompounds.some(
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
        this.traits.metabolizableCompounds.some((r) =>
          organism.traits.constituentCompounds.includes(r.compound)
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
      for (const requirement of this.traits.metabolizableCompounds) {
        const compound = requirement.compound;
        const quantity = requirement.quantity;
        if (
          nutrientSource.traits.constituentCompounds.find(
            (c) => c.name === compound.name
          )
        ) {
          this.energy += quantity;
        }
      }
      nutrientSource.energy -= 30;
    } else if (nutrientSource instanceof CompoundClass) {
      if (!nutrientSource.isExhausted()) {
        const requirement = this.traits.metabolizableCompounds.find(
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
    this.energy -= this.traits.metabolicRate;
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
          // Follow movement pattern if no nutrients are found
          if (this.movementPatternIndex >= this.traits.movementPattern.length) {
            this.movementPatternIndex = 0;
          }
          const nextMove =
            this.traits.movementPattern[this.movementPatternIndex];
          const [x, y] = this.ecosystem!.findOrganismLocation(this);
          let newX = x;
          let newY = y;
          switch (nextMove) {
            case "U":
              newY -= 1;
              break;
            case "R":
              newX += 1;
              break;
            case "D":
              newY += 1;
              break;
            case "L":
              newX -= 1;
              break;
          }
          const [ecosystemRows, ecosystemCols] = this.ecosystem!.getSize();
          newX = (newX + ecosystemCols) % ecosystemCols;
          newY = (newY + ecosystemRows) % ecosystemRows;
          this.move(newX, newY);
          this.movementPatternIndex++;
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
      this.traits.contextSensitivity || 1
    );
    const nearbyCompounds = this.ecosystem.getNearbyCompounds(
      this,
      this.traits.contextSensitivity || 1
    );
    return { nearbyCompounds, nearbyOrganisms };
  }

  static copy(organism: Organism, ecosystem: Ecosystem): Organism {
    return new Organism(
      organism.name,
      organism.color,
      organism.traits,
      ecosystem
    );
  }
}
