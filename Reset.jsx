import "./Reset.css";

function Reset({
  stats,
  mode,
  setStatus,
  setReset,
  setStart,
  setTime,
  visibility,
}) {
  function handleClick() {
    setStatus(stats[mode].nMines + " Mines Left");
    setReset(true);
    setStart(false);
    setTime(0);
  }

  return (
    <div id="Reset" onClick={handleClick} style={{ visibility: visibility }}>
      Reset
    </div>
  );
}

export default Reset;
