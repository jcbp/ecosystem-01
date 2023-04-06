import { Compound } from "../types/compound";
import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { calculateAverageColor } from "../utils/colors";
import { EcosystemBlueprint } from "./ecosystem-blueprint";
import { Ecosystem } from "./ecosystem";

export const sexualReproduce = (
  organism1: Organism,
  organism2: Organism
): void => {};

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
      }
    }
  }
};

export const reproduceOrganism = (
  organism: Organism,
  partner: Organism | null,
  ecosystem: Ecosystem
): Organism[] => {
  const ecosystemBlueprint = EcosystemBlueprint.getInstance();
  const offspring: Organism[] = [];

  for (let i = 0; i < organism.traits.reproduction.offspring; i++) {
    // Asexual reproduction
    if (organism.traits.reproduction.mode === "asexual") {
      const newOrganism = new Organism(
        organism.species,
        organism.color,
        organism.traits,
        organism.ecosystem
      );
      offspring.push(newOrganism);
    }
    // Sexual reproduction
    else if (partner) {
      const newCompounds: Compound[] = [];

      for (let i = 0; i < organism.traits.constituentCompounds.length; i++) {
        const compoundA = organism.traits.constituentCompounds[i];
        const compoundB = partner.traits.constituentCompounds[i];
        const compoundC =
          ecosystemBlueprint.organicCompoundTypes[
            Math.floor(
              Math.random() * ecosystemBlueprint.organicCompoundTypes.length
            )
          ];
        const newCompound = new CompoundClass(
          compoundA.components.a,
          compoundB.components.b,
          compoundC.components.c,
          true
        );
        newCompounds.push(newCompound);
      }

      const newOrganism = new Organism(
        `${organism.species} x ${partner.species}`,
        calculateAverageColor([organism.color, partner.color]),
        organism.traits,
        organism.ecosystem
      );

      offspring.push(newOrganism);
    }
  }

  return offspring;
};
