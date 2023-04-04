import { Compound } from "../types/compound";
import { LivingBeing, Mutation, NutrientRequirement, Reproduction } from "../types/living-being";
import { worldOrganicCompounds } from "./compound";

class LivingBeingClass implements LivingBeing {
  public name: string;
  public energy: number = 100;
  public senescence: number = 0;
  public metabolicRate: number;
  public reproduction: Reproduction;
  public constituentCompounds: Compound[];
  public needs: NutrientRequirement[];
  public mutation: Mutation;
  public traits: { [key: string]: any } = {};

  constructor(
    constituentCompounds: Compound[],
    needs: NutrientRequirement[],
    reproduction: Reproduction,
    mutation: Mutation,
    metabolicRate: number,
    name: string
  ) {
    this.constituentCompounds = constituentCompounds;
    this.needs = needs;
    this.reproduction = reproduction;
    this.mutation = mutation;
    this.metabolicRate = metabolicRate;
    this.name = name;
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

const randomNeeds = (numNeeds: number): NutrientRequirement[] => {
  const needs: NutrientRequirement[] = [];

  while (needs.length < numNeeds) {
    const compound = worldOrganicCompounds[Math.floor(Math.random() * worldOrganicCompounds.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const nutrientRequirement: NutrientRequirement = { compound, quantity };
    needs.push(nutrientRequirement);
  }

  return needs;
};

export const generateLivingBeing = (): LivingBeingClass => {
  const numConstituentCompounds = Math.floor(Math.random() * worldOrganicCompounds.length) + 1;
  const constituentCompounds: Compound[] = [];

  while (constituentCompounds.length < numConstituentCompounds) {
    const compound = worldOrganicCompounds[Math.floor(Math.random() * worldOrganicCompounds.length)];
    if (!constituentCompounds.includes(compound)) {
      constituentCompounds.push(compound);
    }
  }

  const numNeeds = Math.floor(Math.random() * 4) + 1;
  const needs = randomNeeds(numNeeds);
  const reproduction = randomReproduction();
  const mutation = randomMutation();
  const metabolicRate = Math.random() * 10;
  const name = constituentCompounds.map((c) => c.name).join("#");

  return new LivingBeingClass(constituentCompounds, needs, reproduction, mutation, metabolicRate, name);
};
