import "./App.css";
import Info from "./components/Info/Info";
import Board from "./components/Board/Board";
import { useState } from "react";

// Dados dos modos de jogo
const stats = {
  0: { nRows: 9, nColumns: 9, nMines: 10 },
  1: { nRows: 16, nColumns: 16, nMines: 40 },
  2: { nRows: 16, nColumns: 30, nMines: 99 },
};

function App() {
  const [mode, setMode] = useState(0);
  const [status, setStatus] = useState(stats[0].nMines + " Mines Left");
  const [reset, setReset] = useState(false);
  const [start, setStart] = useState(false);

  return (
    <div id="App">
      <Info
        stats={stats}
        mode={mode}
        setMode={setMode}
        status={status}
        setStatus={setStatus}
        setReset={setReset}
        start={start}
        setStart={setStart}
      />
      <Board
        stats={stats}
        mode={mode}
        setStatus={setStatus}
        reset={reset}
        setReset={setReset}
        setStart={setStart}
      />
    </div>
  );
}

export default App;
