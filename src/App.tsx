import { useState, useEffect, useRef } from "react";
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
      style={{
        backgroundColor: substance.isDepleted() ? "#c0c0c0" : substance.color,
      }}
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

// setInterval(() => {
//   const matrix = ecosystem.getOrganisms();
//   const organisms: Organism[] = [];
//   matrix.forEach((row) => {
//     row.forEach((cell) => {
//       cell.forEach((organism) => {
//         organisms.push(organism);
//       });
//     });
//   });
//   console.log(organisms);
// }, 5000);

function App() {
  const [compounds, setCompounds] = useState<Compound[][]>([]);
  const [organisms, setOrganisms] = useState<Organism[][][]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        ecosystem.update();
        setCompounds([...ecosystem.getCompounds()]);
        setOrganisms([...ecosystem.getOrganisms()]);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePauseButtonClick = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="ecosystem">
      <button onClick={handlePauseButtonClick}>
        {isPaused ? "Play" : "Pause"}
      </button>
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
