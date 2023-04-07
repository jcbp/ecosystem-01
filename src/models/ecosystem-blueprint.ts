import { Compound } from "../types/compound";
import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { createOrganismType } from "./organism-type";
import { config } from "../config";

export class EcosystemBlueprint {
  public compoundTypes: Compound[] = [];
  public organicCompoundTypes: Compound[] = [];
  public inorganicCompoundTypes: Compound[] = [];
  public organismTypes: Organism[] = [];

  constructor() {
    this.createInorganicCompoundTypes(config.inorganicCompounds);
    this.createOrganicCompoundTypes(config.organicCompounds);
    this.createOrganismTypes(config.numEcosystemSpecies);
  }

  public createCompoundType = (organic: boolean): Compound => {
    return new CompoundClass(
      Math.floor(Math.random() * 11),
      Math.floor(Math.random() * 11),
      Math.floor(Math.random() * 11),
      organic
    );
  };

  public createOrganicCompoundTypes(numCompounds: number) {
    const existingCompounds: string[] = [];

    while (this.organicCompoundTypes.length < numCompounds) {
      const newCompound = this.createCompoundType(true);
      if (!existingCompounds.includes(newCompound.name)) {
        existingCompounds.push(newCompound.name);
        this.compoundTypes.push(newCompound);
        this.organicCompoundTypes.push(newCompound);
      }
    }
  }

  public createInorganicCompoundTypes(numCompounds: number) {
    const existingCompounds: string[] = [];

    while (this.inorganicCompoundTypes.length < numCompounds) {
      const newCompound = this.createCompoundType(false);
      if (!existingCompounds.includes(newCompound.name)) {
        existingCompounds.push(newCompound.name);
        this.compoundTypes.push(newCompound);
        this.inorganicCompoundTypes.push(newCompound);
      }
    }
  }

  public createOrganismTypes(numOrganisms: number) {
    const existingOrganisms: string[] = [];

    while (this.organismTypes.length < numOrganisms) {
      const newOrganism = createOrganismType(
        this.compoundTypes,
        this.organicCompoundTypes
      );
      if (!existingOrganisms.includes(newOrganism.species)) {
        existingOrganisms.push(newOrganism.species);
        this.organismTypes.push(newOrganism);
      }
    }
  }

  private static instance: EcosystemBlueprint;

  public static getInstance(): EcosystemBlueprint {
    if (!EcosystemBlueprint.instance) {
      EcosystemBlueprint.instance = new EcosystemBlueprint();
    }
    return EcosystemBlueprint.instance;
  }
}
