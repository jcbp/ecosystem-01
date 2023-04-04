import { useEffect, useState } from "react";
import { Compound } from './types/compound';
import { generateWorldCompounds } from "./models/compound";
import { createWorld } from "./models/world";

import "./App.css";

function App() {
  const [world, setWorld] = useState<Compound[][]>([]);

  useEffect(() => {
    generateWorldCompounds(20);
    setWorld(createWorld(20, 20));
  }, []);

  return (
    <div className="world">
      {world.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((substance, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="compound"
              style={{ backgroundColor: substance.color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;

// import { useEffect, useState } from "react";
// import { Compound } from "./types/compound";
// import { LivingBeing } from "./types/living-being";
// import { generateWorldCompounds } from "./models/compound";
// import { createWorld } from "./models/world";

// import "./App.css";

// function World() {
//   const [world, setWorld] = useState<{
//     compounds: Compound[][];
//     livingBeings: LivingBeing[][];
//   }>({
//     compounds: [],
//     livingBeings: [],
//   });

//   useEffect(() => {
//     const compounds = generateWorldCompounds(20);
//     // const livingBeings: LivingBeing[][] = Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => []));
//     const livingBeings = [] as LivingBeing[][];
//     setWorld({ compounds, livingBeings });
//   }, []);

//   return (
//     <div className="world">
//       {world.compounds.map((row, rowIndex) => (
//         <div key={rowIndex} className="row">
//           {row.map((compound, colIndex) => (
//             <div
//               key={`${rowIndex}-${colIndex}`}
//               className="compound"
//               style={{ backgroundColor: compound.color }}
//             >
//               {world.livingBeings[rowIndex][colIndex].map((livingBeing) => (
//                 <div
//                   key={livingBeing.id}
//                   className="livingBeing"
//                   style={{ backgroundColor: livingBeing.color }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default function App() {
//   return <World />;
// }
