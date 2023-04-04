import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { calculateAverageColor } from "../utils/colors";
import { Organism } from "./organism";

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
  ecosystemCompounds: Compound[],
  numMetabolizableCompounds: number
): NutrientRequirement[] => {
  const metabolizableCompounds: NutrientRequirement[] = [];

  while (metabolizableCompounds.length < numMetabolizableCompounds) {
    const compound =
      ecosystemCompounds[Math.floor(Math.random() * ecosystemCompounds.length)];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const nutrientRequirement: NutrientRequirement = { compound, quantity };
    metabolizableCompounds.push(nutrientRequirement);
  }

  return metabolizableCompounds;
};

export const createOrganismType = (
  compoundTypes: Compound[],
  organicCompoundTypes: Compound[]
): Organism => {
  const numConstituentCompounds =
    Math.floor(Math.random() * organicCompoundTypes.length) + 1;
  const constituentCompounds: Compound[] = [];

  while (constituentCompounds.length < numConstituentCompounds) {
    const compound =
      organicCompoundTypes[
        Math.floor(Math.random() * organicCompoundTypes.length)
      ];
    if (!constituentCompounds.includes(compound)) {
      constituentCompounds.push(compound);
    }
  }

  const numMetabolizableCompounds = Math.floor(Math.random() * 4) + 1;
  const metabolizableCompounds = randomMetabolizableCompounds(
    compoundTypes,
    numMetabolizableCompounds
  );
  const reproduction = randomReproduction();
  const mutation = randomMutation();
  const metabolicRate = Math.random() * 10;
  const name = constituentCompounds.map((c) => c.name).join("#");
  const constituentColors = constituentCompounds.map((c) => c.color);
  const color = calculateAverageColor(constituentColors);

  return new Organism(
    constituentCompounds,
    metabolizableCompounds,
    reproduction,
    mutation,
    metabolicRate,
    name,
    color
  );
};
