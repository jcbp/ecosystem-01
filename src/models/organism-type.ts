import { Compound } from "../types/compound";
import { NutrientRequirement, Mutation, Reproduction } from "../types/organism";
import { calculateAverageColor } from "../utils/colors";
import { Organism } from "./organism";
import { getRandomInt, generateRandomString } from "../utils/random";

const randomReproduction = (): Reproduction => ({
  mode: Math.random() < 0.5 ? "asexual" : "sexual",
  offspring: getRandomInt(1, 10),
  probability: Math.random(),
});

const randomMutation = (): Mutation => ({
  rate: Math.random(),
  magnitude: Math.random(),
});

const randomMetabolizableCompounds = (
  compoundTypes: Compound[],
  numMetabolizableCompounds: number
): NutrientRequirement[] => {
  const metabolizableCompounds: NutrientRequirement[] = [];

  while (metabolizableCompounds.length < numMetabolizableCompounds) {
    const compoundIndex = getRandomInt(0, compoundTypes.length - 1);
    const compound = compoundTypes[compoundIndex];
    const quantity = getRandomInt(1, 10);

    const nutrientRequirement: NutrientRequirement = { compound, quantity };
    metabolizableCompounds.push(nutrientRequirement);
  }

  return metabolizableCompounds;
};

const randomToxicCompounds = (
  compoundTypes: Compound[],
  numToxicCompounds: number
): Compound[] => {
  const toxicCompounds: Compound[] = [];

  while (toxicCompounds.length < numToxicCompounds) {
    const compound =
      compoundTypes[Math.floor(Math.random() * compoundTypes.length)];
    if (!toxicCompounds.includes(compound)) {
      toxicCompounds.push(compound);
    }
  }

  return toxicCompounds;
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

  const numMetabolizableCompounds = getRandomInt(0, 5);
  const metabolizableCompounds = randomMetabolizableCompounds(
    compoundTypes,
    numMetabolizableCompounds
  );
  const reproduction = randomReproduction();
  const mutation = randomMutation();
  const metabolicRate = Math.random() * 2;
  const contextSensitivity = getRandomInt(0, 4);
  const toxicCompounds = randomToxicCompounds(
    compoundTypes,
    getRandomInt(0, 2)
  );
  // up, right, down, left
  const movementPattern = generateRandomString(16, "URDL");
  const name = constituentCompounds.map((c) => c.name).join("#");
  const constituentColors = constituentCompounds.map((c) => c.color);
  const color = calculateAverageColor(constituentColors);

  return new Organism(name, color, {
    constituentCompounds,
    metabolizableCompounds,
    toxicCompounds,
    reproduction,
    mutation,
    metabolicRate,
    contextSensitivity,
    movementPattern,
  });
};
