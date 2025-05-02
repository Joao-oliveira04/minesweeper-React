import "./Board.css";
import { useEffect, useRef } from "react";

function Board({ stats, mode, setStatus, setStart, reset, setReset }) {
  const { nColumns, nMines } = stats[mode];
  const boardRef = useRef(null);
  // Criar tabuleiro ao reiniciar
  useEffect(() => {
    const board = createBoard(stats[mode], mode);
    const boardElement = boardRef.current;

    boardElement.textContent = ""; // Limpar tabuleiro
    boardElement.style.setProperty("--gridSize", nColumns); // Dar o tamanho das colunas ao CSS
    // Associar celúlas e eventos ao tabuleiro
    board.forEach((row) => {
      row.forEach((cell) => {
        boardElement.append(cell.element);
        cell.element.addEventListener("click", () => {
          cellLeftClick(board, cell, setStatus, setStart);
        });
        cell.element.addEventListener("contextmenu", (e) => {
          e.preventDefault(); // Evitar abrir o menu de contexto
          cellRightClick(board, cell, nMines, setStatus, setStart);
        });
      });
    });

    setReset(false);

    // Limpar eventos
    return () => {
      board.forEach((row) => {
        row.forEach((cell) => {
          cell.element.removeEventListener("click", () => {
            cellLeftClick(board, cell, setStatus, setStart);
          });
          cell.element.removeEventListener("contextmenu", (e) => {
            e.preventDefault();
            cellRightClick(board, cell, nMines, setStatus, setStart);
          });
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, reset]);

  return <div id="Board" ref={boardRef}></div>;
}

function createBoard({ nRows, nColumns, nMines }, mode) {
  const mines = createMines(nRows, nColumns, nMines);

  const board = [];
  for (let i = 0; i < nRows; i++) {
    const row = [];
    for (let j = 0; j < nColumns; j++) {
      const element = document.createElement("div");
      element.id = "Cell";
      element.dataset.status = "closed";

      // Meter estilos dependendo do modo de jogo
      const elementStyle = {
        0: { fontSize: "1.5rem", borderWidth: "0.125rem" },
        1: { fontSize: "1rem", borderWidth: "0.0625rem" },
        2: { fontSize: "1rem", borderWidth: "0.0625rem" },
      };
      const { fontSize, borderWidth } = elementStyle[mode];
      element.style.fontSize = fontSize;
      element.style.borderWidth = borderWidth;

      // Criar celúla
      const cell = {
        element,
        i,
        j,
        mine: mines.some((m) => m.i === i && m.j === j), // Meter mina se estiver no array de minas
        // Getter Setter para obter e meter o estado da célula
        get status() {
          return this.element.dataset.status;
        },
        set status(status) {
          this.element.dataset.status = status;
        },
      };

      row.push(cell);
    }
    board.push(row);
  }

  return board;
}

function createMines(nRows, nColumns, nMines) {
  const mines = [];
  while (mines.length < nMines) {
    const mine = {
      // Meter localização aleatória da célula
      i: Math.floor(Math.random() * nRows),
      j: Math.floor(Math.random() * nColumns),
    };

    // Se a mina for diferente, adicionar no array de minas
    if (!mines.some((m) => m.i === mine.i && m.j === mine.j)) {
      mines.push(mine);
    }
  }

  return mines;
}

function cellLeftClick(board, cell, setStatus, setStart) {
  if (!checkLoss(board)) {
    setStart(true);
    openCell(board, cell);
    checkGameEnd(board, setStatus);
  }
}

function cellRightClick(board, cell, nMines, setStatus, setStart) {
  if (!checkWin(board)) {
    setStart(true);
    markCell(cell);
    countMinesLeft(board, nMines, setStatus);
    checkGameEnd(board, setStatus);
  }
}

function openCell(board, cell) {
  if (!(cell.status === "closed" || cell.status === "suspected")) {
    return;
  }

  if (cell.mine) {
    cell.status = "mined";
    cell.element.textContent = "💣";
    return;
  }

  cell.status = "opened";
  cell.element.textContent = "";

  const nearbyCells = adjacentCells(board, cell);
  const nearbyMines = nearbyCells.filter((c) => c.mine); // Filtrar número de minas adjacentes

  if (nearbyMines.length === 0) {
    nearbyCells.forEach(openCell.bind(null, board)); // Abrir células adjacentes recursivamente
  } else {
    cell.element.textContent = nearbyMines.length; // Meter número de minas adjacentes na célula
  }
}

function adjacentCells(board, { i, j }) {
  const cells = [];
  // Percorrer pelas céculas adjancentes
  for (let iOffset = -1; iOffset <= 1; iOffset++) {
    for (let jOffset = -1; jOffset <= 1; jOffset++) {
      // Se houver célula, adicionar ao array de células adjancentes
      const cell = board[i + iOffset]?.[j + jOffset];
      if (cell) cells.push(cell);
    }
  }

  return cells;
}

function markCell(cell) {
  if (cell.status === "opened" || cell.status === "mined") {
    return;
  }

  if (cell.status === "closed") {
    cell.status = "marked";
    cell.element.textContent = "🚩";
  } else if (cell.status === "marked") {
    cell.status = "suspected";
    cell.element.textContent = "?";
  } else {
    cell.status = "closed";
    cell.element.textContent = "";
  }
}

function countMinesLeft(board, nMines, setStatus) {
  // Contar número de minas restantes começando do 0
  const minesLeft = board.reduce((count, row) => {
    return count + row.filter((cell) => cell.status === "marked").length;
  }, 0);

  setStatus(nMines - minesLeft + " Mines Left");
}

function checkGameEnd(board, setStatus) {
  const win = checkWin(board);
  const loss = checkLoss(board);

  if (win) {
    setStatus("You Won");
  }

  if (loss) {
    setStatus("You Lost");

    // Mostrar minas no tabuleiro
    board.forEach((row) => {
      row.forEach((cell) => {
        // Desmarcar célula para ser aberta
        if (cell.status === "marked") markCell(cell);
        if (cell.status === "suspected") markCell(cell);

        if (cell.mine) openCell(board, cell);
      });
    });
  }
}

function checkWin(board) {
  // Se todas células são abertas ou minas marcadas, devolve verdadeiro
  return board.every((row) => {
    return row.every(
      (cell) =>
        cell.status === "opened" || (cell.mine && cell.status === "marked")
    );
  });
}

function checkLoss(board) {
  // Se houver uma mina aberta, devolve verdadeiro
  return board.some((row) => {
    return row.some((cell) => cell.status === "mined");
  });
}

export default Board;
