import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { CompoundClass } from "./compound";
import { Ecosystem } from "./ecosystem";
import { sexualReproduce, asexualReproduce } from "./organism-reproduction";

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
  nutrientUrgeThreshold: number;
  reproductiveUrgeThreshold: number;
  reproductivePeriod: [number, number];
}

export class Organism {
  public species: string;
  public color: string;
  public energy: number = 100;
  public age: number = 0;
  public isAlive: boolean = true;
  public ecosystem: Ecosystem | undefined;
  public traits: OrganismTraits;

  private movementPatternIndex: number = 0;
  private reproductiveUrge: number = 0;
  private status: string = "initial";

  constructor(
    species: string,
    color: string,
    traits: OrganismTraits,
    ecosystem?: Ecosystem
  ) {
    this.species = species;
    this.color = color;
    this.traits = traits;
    this.ecosystem = ecosystem;
  }

  private moveTo(x: number, y: number) {
    this.ecosystem!.moveOrganism(this, x, y);
    this.energy -= this.traits.metabolicRate * 4;
  }

  private findNutrientsAround(): [number, number] | null {
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

  public findNutrientsAtCurrentPosition(): Organism | Compound | null {
    const currentCompound = this.ecosystem!.getCompoundAtSamePosition(this);
    if (
      currentCompound &&
      this.traits.metabolizableCompounds.some(
        (r) =>
          r.compound.name === currentCompound.name &&
          !currentCompound.isExhausted()
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

  private moveByPattern() {
    // Follow movement pattern if no nutrients are found
    if (this.movementPatternIndex >= this.traits.movementPattern.length) {
      this.movementPatternIndex = 0;
    }
    const nextMove = this.traits.movementPattern[this.movementPatternIndex];
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
    this.moveTo(newX, newY);
    this.movementPatternIndex++;
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
          this.status = "energy incresed";
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
          this.status = "energy incresed";
        }
        nutrientSource.remaining -= 10;
      }
    }
  }

  public findPartner(): Organism | null {
    const context = this.getContext();
    const potentialPartners = context.nearbyOrganisms.filter((organism) =>
      this.canReproduce(organism)
    );
    if (potentialPartners.length > 0) {
      const partnerIndex = Math.floor(Math.random() * potentialPartners.length);
      return potentialPartners[partnerIndex];
    } else {
      return null;
    }
  }

  public canReproduce(organism: Organism): boolean {
    return organism !== this && organism.species === this.species;
  }

  public update(): void {
    if (this.energy <= 0) {
      this.isAlive = false;
      return;
    }

    this.energy -= this.traits.metabolicRate;
    this.age += 0.1;

    const nutrientUrge = Math.min(100 - this.energy, 100);
    const nutrientUrgency = nutrientUrge / this.traits.nutrientUrgeThreshold;

    // Verificar si está dentro del periodo reproductivo
    let reproductiveUrgency = 0;
    if (
      this.age >= this.traits.reproductivePeriod[0] &&
      this.age <= this.traits.reproductivePeriod[1]
    ) {
      this.reproductiveUrge += 0.2;
      reproductiveUrgency =
        this.reproductiveUrge / this.traits.reproductiveUrgeThreshold;
    }

    if (nutrientUrgency > reproductiveUrgency) {
      this.status = "nutrient interest";
      // Priorizar búsqueda de nutrientes
      if (this.energy < this.traits.nutrientUrgeThreshold) {
        this.status = "nutrient needed";
        const nutrients = this.findNutrientsAtCurrentPosition();
        if (nutrients) {
          this.status = "nutrient needed. found in current position";
          this.consumeNutrient(nutrients);
        } else {
          this.status = "nutrient needed. not found in current position";
          const nutrientsCoords = this.findNutrientsAround();
          if (nutrientsCoords) {
            this.status = "moving to near nutrients";
            this.moveTo(nutrientsCoords[0], nutrientsCoords[1]);
          } else {
            this.status = "moving to find nutrients";
            this.moveByPattern();
          }
        }
      }
      // Priorizar reproducción
    } else if (this.reproductiveUrge >= this.traits.reproductiveUrgeThreshold) {
      this.status = "reproduction needed";
      if (this.traits.reproduction.mode === "asexual") {
        asexualReproduce(this);
        this.reproductiveUrge = 0;
        this.energy -= 10;
      } else {
        const partner = this.findPartner();
        if (partner) {
          this.status = "found partner for reproduction";
          sexualReproduce(this, partner);
        } else {
          this.status = "moving to find a partner";
          this.moveByPattern();
        }
      }
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
      organism.species,
      organism.color,
      organism.traits,
      ecosystem
    );
  }
}
