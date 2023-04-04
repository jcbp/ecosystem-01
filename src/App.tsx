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
  organisms,
}: {
  substance: Compound;
  organisms: Organism[];
}) {
  const handleClick = () => {
    console.log("Compound", substance);
    console.log("Organism", organisms);
  };
  return (
    <div
      className="cell"
      style={{ backgroundColor: substance.color }}
      onClick={handleClick}
    >
      {organisms.map((organism, index) => (
        <div
          className="organism"
          style={{
            backgroundColor: organism.color,
            position: "absolute",
            top: `${Math.floor(index / 3) * 10}px`,
            left: `${(index % 3) * 10}px`,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  createInorganicCompounds(5);
  createOrganicCompounds(5);
  createWorldOrganisms(15);
  const world = new World(20, 20, 50);

  return (
    <div className="world">
      {world.getCompounds().map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((substance, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              substance={substance}
              organisms={world.getOrganisms(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
