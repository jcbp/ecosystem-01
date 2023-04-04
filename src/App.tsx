import { Compound } from "./types/compound";
import { Organism } from "./types/organism";
import {
  createInorganicCompounds,
  createOrganicCompounds,
} from "./models/compound";
import { World } from "./models/world";
import { createWorldOrganisms } from "./models/organism";

import "./App.css";

function Cell({
  substance,
  organism,
}: {
  substance: Compound;
  organism?: Organism | null;
}) {
  const handleClick = () => {
    console.log("Compound", substance);
    console.log("Organism", organism);
  };
  return (
    <div
      className="cell"
      style={{ backgroundColor: substance.color }}
      onClick={handleClick}
    >
      {organism && (
        <div
          className="organism"
          style={{
            backgroundColor: organism.color,
            position: "absolute",
            top: '2px',
            left: '2px',
          }}
        />
      )}
    </div>
  );
}

function App() {
  createInorganicCompounds(5);
  createOrganicCompounds(5);
  createWorldOrganisms(5);
  const world = new World(20, 20, 15);

  return (
    <div className="world">
      {world.getCompounds().map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((substance, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              substance={substance}
              organism={world.getOrganism(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
