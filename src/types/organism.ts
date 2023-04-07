import { Compound } from './compound'
import { Ecosystem } from "../models/ecosystem";

export interface NutrientRequirement {
  compound: Compound;
  quantity: number;
}

export interface Reproduction {
  mode: "sexual" | "asexual"; // Sexual or asexual reproduction
  offspring: number; // Number of offspring per reproduction
  probability: number; // Probability of reproducing
}

export interface Mutation {
  rate: number; // Mutation rate
  magnitude: number; // Magnitude of mutations
}

export interface OrganismTraits {
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

interface IOrganism {
  species: string;
  color: string;
  energy: number;
  age: number;
  isAlive: boolean;
  ecosystem: Ecosystem | undefined;
  traits: OrganismTraits;
}