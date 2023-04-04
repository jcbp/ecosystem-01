import { Compound } from "./types/compound";
import { Ecosystem } from "./models/ecosystem";
import { Organism } from "./models/organism";
import { EcosystemBlueprint } from "./models/ecosystem-blueprint";
import { config } from "./config";

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
          key={index}
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
  const ecosystemBlueprint = new EcosystemBlueprint();
  const ecosystem = new Ecosystem(
    ecosystemBlueprint,
    config.ecosystemRows,
    config.ecosystemCols,
    config.numInitialOrganisms
  );

  return (
    <div className="ecosystem">
      {ecosystem.getCompounds().map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((substance, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              substance={substance}
              organisms={ecosystem.getOrganisms(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
