import { useState, useEffect } from "react";
import { Compound } from "./types/compound";
import { Ecosystem } from "./models/ecosystem";
import { Organism } from "./models/organism";
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
    if (organisms[0]) {
      console.log(organisms[0].getContext());
    }
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

const ecosystem = new Ecosystem(
  config.ecosystemRows,
  config.ecosystemCols,
  config.numInitialOrganisms
);

function App() {
  const [compounds, setCompounds] = useState<Compound[][]>([]);
  const [organisms, setOrganisms] = useState<Organism[][][]>([]);

  useEffect(() => {
    setInterval(() => {
      ecosystem.update();
      setCompounds([...ecosystem.getCompounds()]);
      setOrganisms([...ecosystem.getOrganisms()]);
    }, 200);
  }, []);

  return (
    <div className="ecosystem">
      {compounds.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((substance, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              substance={substance}
              organisms={organisms[rowIndex][colIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
