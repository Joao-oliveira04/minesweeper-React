import "./Time.css";
import { useEffect, useState } from "react";

function Time({ status, start, time, setTime, setVisibility }) {
  const [timer, setTimer] = useState(0);

  // Cronometar tempo ao começar o jogo
  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      setTimer(timer);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

  // Parar cronometro e mudar visibilidade do elemento ao acabar o jogo
  useEffect(() => {
    if (status === "You Won" || status === "You Lost") {
      clearInterval(timer);
      setVisibility("visible");
    } else {
      setVisibility("hidden");
    }
  }, [status, timer]);

  return <div id="Time">Time: {formatTime(time)}</div>;
}

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60 >= 10 ? time % 60 : "0" + (time % 60); // Adicionar "0" se houver um digito

  return min + ":" + sec;
}

export default Time;
