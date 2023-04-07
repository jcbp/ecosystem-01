import { Compound } from "../types/compound";
import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { calculateAverageColor } from "../utils/colors";
import { EcosystemBlueprint } from "./ecosystem-blueprint";
import { Ecosystem } from "./ecosystem";
import { OrganismTraits } from "../types/organism";
import { randomChoice } from "../utils/random";

const mutateNumber = (
  value: number,
  mutationRate: number,
  mutationMagnitude: number
): number => {
  if (Math.random() > mutationRate) {
    return value;
  }
  const mutationAmount = Math.round(
    Math.random() * mutationMagnitude * 2 - mutationMagnitude
  );
  const result = value + mutationAmount;
  return Math.max(0, result);
};

const mutateString = (value: string, mutationRate: number): string => {
  if (Math.random() > mutationRate) {
    return value;
  }
  const charIndex = Math.floor(Math.random() * value.length);
  const mutatedChar = String.fromCharCode(Math.floor(Math.random() * 26 + 97));
  return value.substr(0, charIndex) + mutatedChar + value.substr(charIndex + 1);
};

const mutateMovementPattern = (
  value: string,
  mutationRate: number,
  mutationMagnitude: number
): string => {
  const chars = ["U", "R", "D", "L"];
  const mutationCount = Math.floor(mutationMagnitude * value.length);
  let mutated = value.split("");
  for (let i = 0; i < mutationCount; i++) {
    if (Math.random() < mutationRate) {
      const index = Math.floor(Math.random() * value.length);
      mutated[index] = chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return mutated.join("");
};

const mutatePeriod = (
  value: [number, number],
  mutationRate: number,
  mutationMagnitude: number
): [number, number] => {
  if (Math.random() > mutationRate) {
    return value;
  }
  const mutationAmount = Math.round(
    Math.random() * mutationMagnitude * 2 - mutationMagnitude
  );
  const newStart = Math.max(value[0] + mutationAmount, 0);
  const newEnd = Math.max(value[1] + mutationAmount, 0);
  return [newStart, newEnd];
};

export const applyMutations = (
  organismTraits: OrganismTraits
): OrganismTraits => {
  const traits = { ...organismTraits };

  // Mutar el número de compuestos constituyentes
  // traits.constituentCompounds = mutateNumber(
  //   traits.constituentCompounds,
  //   traits.mutation.rate,
  //   traits.mutation.magnitude
  // );

  // Mutar el número de compuestos metabolizables
  // traits.metabolizableCompounds = mutateNumber(
  //   traits.metabolizableCompounds,
  //   traits.mutation.rate,
  //   traits.mutation.magnitude
  // );

  // Mutar el número de compuestos tóxicos
  // traits.toxicCompounds = mutateNumber(
  //   traits.toxicCompounds,
  //   traits.mutation.rate,
  //   traits.mutation.magnitude
  // );

  // Mutar la tasa metabólica
  traits.metabolicRate = mutateNumber(
    traits.metabolicRate,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  // Mutar la sensibilidad al contexto
  traits.contextSensitivity = mutateNumber(
    traits.contextSensitivity,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  // Mutar el patrón de movimiento
  traits.movementPattern = mutateMovementPattern(
    traits.movementPattern,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  // Mutar el umbral de necesidad de nutrientes
  traits.nutrientUrgeThreshold = mutateNumber(
    traits.nutrientUrgeThreshold,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  // Mutar el umbral de necesidad reproductiva
  traits.reproductiveUrgeThreshold = mutateNumber(
    traits.reproductiveUrgeThreshold,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  // Mutar el periodo reproductivo
  traits.reproductivePeriod = mutatePeriod(
    traits.reproductivePeriod,
    traits.mutation.rate,
    traits.mutation.magnitude
  );

  return traits;
};

export const crossTraits = (
  organism1: OrganismTraits,
  organism2: OrganismTraits
): OrganismTraits => {
  const traits: OrganismTraits = {
    constituentCompounds: [],
    metabolizableCompounds: [],
    toxicCompounds: [],
    reproduction: { ...organism1.reproduction },
    mutation: { ...organism1.mutation },
    metabolicRate: 0,
    contextSensitivity: 0,
    movementPattern: "",
    nutrientUrgeThreshold: 0,
    reproductiveUrgeThreshold: 0,
    reproductivePeriod: [0, 0],
  };

  // Cruce aleatorio de las características

  // metabolicRate
  traits.metabolicRate = randomChoice([
    organism1.metabolicRate,
    organism2.metabolicRate,
  ]);

  // contextSensitivity
  traits.contextSensitivity = randomChoice([
    organism1.contextSensitivity,
    organism2.contextSensitivity,
  ]);

  // movementPattern
  traits.movementPattern = randomChoice([
    organism1.movementPattern,
    organism2.movementPattern,
  ]);

  // nutrientUrgeThreshold
  traits.nutrientUrgeThreshold = randomChoice([
    organism1.nutrientUrgeThreshold,
    organism2.nutrientUrgeThreshold,
  ]);

  // reproductiveUrgeThreshold
  traits.reproductiveUrgeThreshold = randomChoice([
    organism1.reproductiveUrgeThreshold,
    organism2.reproductiveUrgeThreshold,
  ]);

  // reproductivePeriod
  const rPeriod1 = organism1.reproductivePeriod;
  const rPeriod2 = organism2.reproductivePeriod;
  traits.reproductivePeriod = [
    randomChoice([rPeriod1[0], rPeriod2[0]]),
    randomChoice([rPeriod1[1], rPeriod2[1]]),
  ];

  // reproduction.offspring
  traits.reproduction.offspring = randomChoice([
    organism1.reproduction.offspring,
    organism2.reproduction.offspring,
  ]);

  // reproduction.probability
  traits.reproduction.probability = randomChoice([
    organism1.reproduction.probability,
    organism2.reproduction.probability,
  ]);

  // mutation.rate
  traits.mutation.rate = randomChoice([
    organism1.mutation.rate,
    organism2.mutation.rate,
  ]);

  // mutation.magnitude
  traits.mutation.magnitude = randomChoice([
    organism1.mutation.magnitude,
    organism2.mutation.magnitude,
  ]);

  // constituentCompounds
  traits.constituentCompounds = [...organism1.constituentCompounds];

  // metabolizableCompounds
  traits.metabolizableCompounds = [...organism1.metabolizableCompounds];

  // toxicCompounds
  traits.toxicCompounds = [...organism1.toxicCompounds];

  return traits;
};

export const sexualReproduce = (
  organism1: Organism,
  organism2: Organism
): void => {
  const position = organism1.ecosystem?.findOrganismLocation(organism1);
  if (!position) {
    return;
  }

  const crossedTraits = crossTraits(organism1.traits, organism2.traits);
  const offspringCount = crossedTraits.reproduction.offspring;

  // Crear los hijos
  for (let i = 0; i < offspringCount; i++) {
    if (crossedTraits.reproduction.probability > Math.random()) {
      // Crear el hijo
      const mutatedTraits = applyMutations(crossedTraits);
      const offspring = new Organism(
        organism1.species,
        organism1.color,
        mutatedTraits,
        organism1.ecosystem
      );
      organism1.ecosystem!.addOrganism(offspring, position[0], position[1]);
      organism1.loseEnergy(organism1.traits.metabolicRate * 20);
      organism2.loseEnergy(organism2.traits.metabolicRate * 20);
    }
  }
};

export const asexualReproduce = (organism: Organism): void => {
  const position = organism.ecosystem?.findOrganismLocation(organism);
  if (position) {
    for (let i = 0; i < organism.traits.reproduction.offspring; i++) {
      if (organism.traits.reproduction.probability > Math.random()) {
        const newOrganism = new Organism(
          organism.species,
          organism.color,
          organism.traits,
          organism.ecosystem
        );
        organism.ecosystem!.addOrganism(newOrganism, position[0], position[1]);
        organism.loseEnergy(organism.traits.metabolicRate * 20);
      }
    }
  }
};
