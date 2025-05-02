import "./Mode.css";

function Mode({ stats, setMode, setStatus, setStart, setTime }) {
  function handleChange(event) {
    const mode = event.target.value;
    setMode(mode);

    setStatus(stats[mode].nMines + " Mines Left");
    setStart(false);
    setTime(0);
  }

  return (
    <select id="Mode" onChange={handleChange}>
      <option value="0">Basic</option>
      <option value="1">Intermediate</option>
      <option value="2">Advanced</option>
    </select>
  );
}

export default Mode;
