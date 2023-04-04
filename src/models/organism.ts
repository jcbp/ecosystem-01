import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { calculateAverageColor } from "../utils/colors";

export class Organism {
  public name: string;
  public color: string;
  public energy: number = 100;
  public senescence: number = 0;
  public metabolicRate: number;
  public reproduction: Reproduction;
  public constituentCompounds: Compound[];
  public metabolizableCompounds: NutrientRequirement[];
  public mutation: Mutation;
  public traits: { [key: string]: any } = {};

  constructor(
    constituentCompounds: Compound[],
    metabolizableCompounds: NutrientRequirement[],
    reproduction: Reproduction,
    mutation: Mutation,
    metabolicRate: number,
    name: string,
    color: string
  ) {
    this.constituentCompounds = constituentCompounds;
    this.metabolizableCompounds = metabolizableCompounds;
    this.reproduction = reproduction;
    this.mutation = mutation;
    this.metabolicRate = metabolicRate;
    this.name = name;
    this.color = color;
  }

  public update(): void {}

  static copy(organism: Organism): Organism {
    return new Organism(
      organism.constituentCompounds,
      organism.metabolizableCompounds,
      organism.reproduction,
      organism.mutation,
      organism.metabolicRate,
      organism.name,
      organism.color
    );
  }

  static reproduce(organism: Organism, partner: Organism): Organism[] {
    const offspring: Organism[] = [];

    for (let i = 0; i < organism.reproduction.offspring; i++) {
      // Asexual reproduction
      if (organism.reproduction.mode === "asexual") {
        const newOrganism = new Organism(
          organism.constituentCompounds,
          organism.metabolizableCompounds,
          organism.reproduction,
          organism.mutation,
          organism.metabolicRate,
          organism.name,
          organism.color
        );
        offspring.push(newOrganism);
      }
      // Sexual reproduction
      else {
        const newCompounds: Compound[] = [];

        for (let i = 0; i < organism.constituentCompounds.length; i++) {
          // const compoundA = organism.constituentCompounds[i];
          // const compoundB = partner.constituentCompounds[i];
          // const compoundC =
          //   ecosystemOrganicCompounds[
          //     Math.floor(Math.random() * ecosystemOrganicCompounds.length)
          //   ];
          // const newCompound = Compound.combine(compoundA, compoundB, compoundC);
          // newCompounds.push(newCompound);
        }

        const newOrganism = new Organism(
          newCompounds,
          organism.metabolizableCompounds,
          organism.reproduction,
          organism.mutation,
          (organism.metabolicRate + partner.metabolicRate) / 2,
          `${organism.name} x ${partner.name}`,
          calculateAverageColor([organism.color, partner.color])
        );

        offspring.push(newOrganism);
      }
    }

    return offspring;
  }
}