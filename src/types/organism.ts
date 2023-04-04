import { Compound } from './compound'
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
