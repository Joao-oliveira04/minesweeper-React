import "./Info.css";
import Reset from "../Reset/Reset.jsx";
import Mode from "../Mode/Mode.jsx";
import Status from "../Status/Status.jsx";
import Time from "../Time/Time.jsx";
import { useState } from "react";

function Info({
  stats,
  mode,
  setMode,
  status,
  setStatus,
  setReset,
  start,
  setStart,
}) {
  const [time, setTime] = useState(0);
  const [visibility, setVisibility] = useState("hidden");

  return (
    <div id="Info">
      <h1 id="Title">Minesweeper</h1>
      <Reset
        stats={stats}
        mode={mode}
        setStatus={setStatus}
        setReset={setReset}
        setStart={setStart}
        setTime={setTime}
        visibility={visibility}
      />
      <div id="Options">
        <Mode
          stats={stats}
          setMode={setMode}
          setStatus={setStatus}
          setStart={setStart}
          setTime={setTime}
        />
        <Status status={status} />
        <Time
          status={status}
          start={start}
          time={time}
          setTime={setTime}
          setVisibility={setVisibility}
        />
      </div>
    </div>
  );
}

export default Info;
