import { Compound } from "../types/compound";
import { CompoundClass } from "./compound";
import { Organism } from "./organism";
import { calculateAverageColor } from "../utils/colors";
import { EcosystemBlueprint } from "./ecosystem-blueprint";
import { Ecosystem } from "./ecosystem";

export const reproduceOrganism = (
  organism: Organism,
  partner: Organism | null,
  ecosystem: Ecosystem
): Organism[] => {
  const ecosystemBlueprint = EcosystemBlueprint.getInstance();
  const offspring: Organism[] = [];

  for (let i = 0; i < organism.reproduction.offspring; i++) {
    // Asexual reproduction
    if (organism.reproduction.mode === "asexual") {
      const newOrganism = new Organism(
        organism.constituentCompounds,
        organism.metabolizableCompounds,
        organism.toxicCompounds,
        organism.reproduction,
        organism.mutation,
        organism.metabolicRate,
        organism.name,
        organism.color,
        ecosystem
      );
      offspring.push(newOrganism);
    }
    // Sexual reproduction
    else if (partner) {
      const newCompounds: Compound[] = [];

      for (let i = 0; i < organism.constituentCompounds.length; i++) {
        const compoundA = organism.constituentCompounds[i];
        const compoundB = partner.constituentCompounds[i];
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
        newCompounds,
        organism.metabolizableCompounds,
        organism.toxicCompounds,
        organism.reproduction,
        organism.mutation,
        (organism.metabolicRate + partner.metabolicRate) / 2,
        `${organism.name} x ${partner.name}`,
        calculateAverageColor([organism.color, partner.color]),
        ecosystem
      );

      offspring.push(newOrganism);
    }
  }

  return offspring;
};
