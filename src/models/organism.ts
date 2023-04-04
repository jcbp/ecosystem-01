import { Compound } from "../types/compound";
import {
  Organism,
  Mutation,
  NutrientRequirement,
  Reproduction,
} from "../types/organism";
import { worldOrganicCompounds, worldCompounds } from "./compound";
import { calculateAverageColor } from "../utils/colors";

export class OrganismClass implements Organism {
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

  static copy(organism: OrganismClass): OrganismClass {
    return new OrganismClass(
      organism.constituentCompounds,
      organism.metabolizableCompounds,
      organism.reproduction,
      organism.mutation,
      organism.metabolicRate,
      organism.name,
      organism.color
    );
  }

  static reproduce(
    organism: OrganismClass,
    partner: OrganismClass
  ): OrganismClass[] {
    const offspring: OrganismClass[] = [];

    for (let i = 0; i < organism.reproduction.offspring; i++) {
      // Asexual reproduction
      if (organism.reproduction.mode === "asexual") {
        const newOrganism = new OrganismClass(
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
          //   worldOrganicCompounds[
          //     Math.floor(Math.random() * worldOrganicCompounds.length)
          //   ];
          // const newCompound = Compound.combine(compoundA, compoundB, compoundC);
          // newCompounds.push(newCompound);
        }

        const newOrganism = new OrganismClass(
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

const randomReproduction = (): Reproduction => ({
  mode: Math.random() < 0.5 ? "asexual" : "sexual",
  offspring: Math.floor(Math.random() * 10) + 1,
  probability: Math.random(),
});

const randomMutation = (): Mutation => ({
  rate: Math.random(),
  magnitude: Math.random(),
});

const randomMetabolizableCompounds = (
  numMetabolizableCompounds: number
): NutrientRequirement[] => {
  const metabolizableCompounds: NutrientRequirement[] = [];

  while (metabolizableCompounds.length < numMetabolizableCompounds) {
    const compound =
      worldCompounds[Math.floor(Math.random() * worldCompounds.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const nutrientRequirement: NutrientRequirement = { compound, quantity };
    metabolizableCompounds.push(nutrientRequirement);
  }

  return metabolizableCompounds;
};

export const createOrganism = (): OrganismClass => {
  const numConstituentCompounds =
    Math.floor(Math.random() * worldOrganicCompounds.length) + 1;
  const constituentCompounds: Compound[] = [];

  while (constituentCompounds.length < numConstituentCompounds) {
    const compound =
      worldOrganicCompounds[
        Math.floor(Math.random() * worldOrganicCompounds.length)
      ];
    if (!constituentCompounds.includes(compound)) {
      constituentCompounds.push(compound);
    }
  }

  const numMetabolizableCompounds = Math.floor(Math.random() * 4) + 1;
  const metabolizableCompounds = randomMetabolizableCompounds(
    numMetabolizableCompounds
  );
  const reproduction = randomReproduction();
  const mutation = randomMutation();
  const metabolicRate = Math.random() * 10;
  const name = constituentCompounds.map((c) => c.name).join("#");
  const constituentColors = constituentCompounds.map((c) => c.color);
  const color = calculateAverageColor(constituentColors);

  return new OrganismClass(
    constituentCompounds,
    metabolizableCompounds,
    reproduction,
    mutation,
    metabolicRate,
    name,
    color
  );
};

export const worldOrganisms: Organism[] = [];

export function createWorldOrganisms(numOrganisms: number) {
  const existingOrganisms: string[] = [];

  while (worldOrganisms.length < numOrganisms) {
    const newOrganism = createOrganism();
    if (!existingOrganisms.includes(newOrganism.name)) {
      existingOrganisms.push(newOrganism.name);
      worldOrganisms.push(newOrganism);
    }
  }
}
