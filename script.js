document.addEventListener('DOMContentLoaded', function () {

  const dimensionButton = document.getElementById('dimension-button');//hay đổi kích thước của bàn cờ.
  const dimensionElement = document.getElementById('dimension');//hiển thị kích thước hiện tại của bàn cờ.
  const statusElement = document.getElementById('status');//hiển thị trạng thái hiện tại của trò chơi (ví dụ: người chiến thắng, lượt đi tiếp theo).
  const restartButton = document.getElementById('restart-btn');//khởi động lại trò chơi.
  const singlePlayerToggle = document.getElementById('single-player-toggle');// Đây là nút để chuyển đổi chế độ chơi đơn người.
  const boardElement = document.getElementById('board');// phần tử chứa bàn cờ.

  let dimension = 50; // Giá trị mặc định

  dimensionButton.textContent = `${dimension}x${dimension}`;

  let singlePlayerMode = false;
  let squares = Array(dimension).fill(Array(dimension).fill(null));

  let xIsNext = Math.random() < 0.5; // Chọn ngẫu nhiên người chơi đi trước , nhỏ hơn 0.5, xIsNext sẽ được gán giá trị true (người chơi X đi trước)
  let theWinner = null;
  let winningLine = [];//khởi tạo với một mảng rỗng để lưu trữ các ô thắng nếu có.

  const dimensions = [10, 12, 16, 20];
  let dimensionIndex = 0; //để lưu trữ chỉ số của kích thước hiện tại trong mảng dimensions.
  //  xử lý sự kiện khi người dùng click vào nút thay đổi kích thước bàn cờ.
  dimensionButton.addEventListener('click', function () {
    dimensionIndex = (dimensionIndex + 1) % dimensions.length;
    dimension = dimensions[dimensionIndex];
    dimensionButton.textContent = `${dimension}x${dimension}`;
    restartGame();
  });
  restartButton.addEventListener('click', restartGame);

  singlePlayerToggle.addEventListener('click', function () {
    toggleSinglePlayerMode();
    restartGame();
    if (singlePlayerMode && !xIsNext) {
      makeComputerMove();
    }
  });

  function handleClick(row, col) {
    if (theWinner || squares[row][col]) {
      return;
    }

    const newSquares = squares.map((row) => [...row]);
    newSquares[row][col] = xIsNext ? 'X' : 'O';// Sử dụng 'X' hoặc 'O' tùy thuộc vào người chơi hiện tại
    squares = newSquares;
    squares = newSquares;
    xIsNext = !xIsNext;// Chuyển lượt đi cho người chơi tiếp theo

    const winner = calculateWinner(newSquares, row, col);
    if (winner) {
      theWinner = winner;
      winningLine = findWinningLine(newSquares, row, col, winner);
    }

    renderBoard();
    updateStatus();

    if (singlePlayerMode && !theWinner && !xIsNext) {
      makeComputerMove();
    }
  }

  function checkBlockEnd(cellStart, cellEnd, currentPlayer) {
    if (cellStart === null || cellEnd === null) return true
    return !(cellStart !== currentPlayer || cellEnd !== currentPlayer)
  }

  function calculateWinner(currentSquares, row, col) {
    const currentPlayer = currentSquares[row][col];

    // Check horizontally
    let count = 1;
    let leftCol = col - 1;
    while (leftCol >= 0 && currentSquares[row][leftCol] === currentPlayer) {
      count++;
      leftCol--;
    }
    let rightCol = col + 1;
    while (rightCol < dimension && currentSquares[row][rightCol] === currentPlayer) {
      count++;
      rightCol++;
    }
    if (count >= 5 && checkBlockEnd(currentSquares?.[row]?.[leftCol], currentSquares?.[row]?.[rightCol], currentPlayer)) {
      return currentPlayer;
    }

    // Check vertically
    count = 1;
    let topRow = row - 1;
    while (topRow >= 0 && currentSquares[topRow][col] === currentPlayer) {
      count++;
      topRow--;
    }
    let bottomRow = row + 1;
    while (bottomRow < dimension && currentSquares[bottomRow][col] === currentPlayer) {
      count++;
      bottomRow++;
    }
    if (count >= 5 && checkBlockEnd(currentSquares?.[topRow]?.[col], currentSquares?.[bottomRow]?.[col], currentPlayer)) {
      return currentPlayer;
    }

    // Check diagonally (top-left to bottom-right)
    count = 1;
    let topLeftRow = row - 1;
    let topLeftCol = col - 1;
    while (topLeftRow >= 0 && topLeftCol >= 0 && currentSquares[topLeftRow][topLeftCol] === currentPlayer) {
      count++;
      topLeftRow--;
      topLeftCol--;
    }
    let bottomRightRow = row + 1;
    let bottomRightCol = col + 1;
    while (bottomRightRow < dimension && bottomRightCol < dimension && currentSquares[bottomRightRow][bottomRightCol] === currentPlayer) {
      count++;
      bottomRightRow++;
      bottomRightCol++;
    }
    if (count >= 5 && checkBlockEnd(currentSquares?.[topLeftRow]?.[topLeftCol], currentSquares?.[bottomRightRow]?.[bottomRightCol], currentPlayer)) {
      return currentPlayer;
    }

    // Check diagonally (top-right to bottom-left)
    count = 1;
    let topRightRow = row - 1;
    let topRightCol = col + 1;
    while (topRightRow >= 0 && topRightCol < dimension && currentSquares[topRightRow][topRightCol] === currentPlayer) {
      count++;
      topRightRow--;
      topRightCol++;
    }
    let bottomLeftRow = row + 1;
    let bottomLeftCol = col - 1;
    while (bottomLeftRow < dimension && bottomLeftCol >= 0 && currentSquares[bottomLeftRow][bottomLeftCol] === currentPlayer) {
      count++;
      bottomLeftRow++;
      bottomLeftCol--;
    }
    if (count >= 5 && checkBlockEnd(currentSquares?.[topRightRow]?.[topRightCol], currentSquares?.[bottomLeftRow]?.[bottomLeftCol], currentPlayer)) {
      return currentPlayer;
    }

    return null;
  }

  function findWinningLine(currentSquares, row, col, winner) {
    const currentPlayer = currentSquares[row][col];
    const lines = [];

    // Check horizontally
    let leftCol = col - 1;
    while (leftCol >= 0 && currentSquares[row][leftCol] === currentPlayer) {
      lines.push([row, leftCol]);
      leftCol--;
    }
    lines.push([row, col]);
    let rightCol = col + 1;
    while (rightCol < dimension && currentSquares[row][rightCol] === currentPlayer) {
      lines.push([row, rightCol]);
      rightCol++;
    }
    if (lines.length >= 5) {
      return lines;
    }

    // Check vertically
    let topRow = row - 1;
    while (topRow >= 0 && currentSquares[topRow][col] === currentPlayer) {
      lines.push([topRow, col]);
      topRow--;
    }
    lines.push([row, col]);
    let bottomRow = row + 1;
    while (bottomRow < dimension && currentSquares[bottomRow][col] === currentPlayer) {
      lines.push([bottomRow, col]);
      bottomRow++;
    }
    if (lines.length >= 5) {
      return lines;
    }

    // Check diagonally (top-left to bottom-right)
    let topLeftRow = row - 1;
    let topLeftCol = col - 1;
    while (topLeftRow >= 0 && topLeftCol >= 0 && currentSquares[topLeftRow][topLeftCol] === currentPlayer) {
      lines.push([topLeftRow, topLeftCol]);
      topLeftRow--;
      topLeftCol--;
    }
    lines.push([row, col]);
    let bottomRightRow = row + 1;
    let bottomRightCol = col + 1;
    while (bottomRightRow < dimension && bottomRightCol < dimension && currentSquares[bottomRightRow][bottomRightCol] === currentPlayer) {
      lines.push([bottomRightRow, bottomRightCol]);
      bottomRightRow++;
      bottomRightCol++;
    }
    if (lines.length >= 5) {
      return lines;
    }

    // Check diagonally (top-right to bottom-left)
    let topRightRow = row - 1;
    let topRightCol = col + 1;
    while (topRightRow >= 0 && topRightCol < dimension && currentSquares[topRightRow][topRightCol] === currentPlayer) {
      lines.push([topRightRow, topRightCol]);
      topRightRow--;
      topRightCol++;
    }
    lines.push([row, col]);
    let bottomLeftRow = row + 1;
    let bottomLeftCol = col - 1;
    while (bottomLeftRow < dimension && bottomLeftCol >= 0 && currentSquares[bottomLeftRow][bottomLeftCol] === currentPlayer) {
      lines.push([bottomLeftRow, bottomLeftCol]);
      bottomLeftRow++;
      bottomLeftCol--;
    }
    if (lines.length >= 5) {
      return lines;
    }

    return [];
  }

  function renderBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < dimension; row++) {
      const rowElement = document.createElement('div');
      rowElement.className = 'board-row';

      for (let col = 0; col < dimension; col++) {
        const value = squares[row][col];
        const isWinningSquare = winningLine.some(([winRow, winCol]) => winRow === row && winCol === col);

        const squareButton = document.createElement('button');
        squareButton.className = 'square';
        squareButton.style.backgroundColor = isWinningSquare ? 'yellow' : 'white';
        squareButton.style.color = value === 'X' ? 'blue' : 'red';
        squareButton.style.fontWeight = isWinningSquare ? 'bold' : 'normal';
        squareButton.textContent = value;
        squareButton.addEventListener('click', () => {
          if (!singlePlayerMode || (singlePlayerMode && xIsNext)) {
            handleClick(row, col);
          }
        });

        rowElement.appendChild(squareButton);
      }

      boardElement.appendChild(rowElement);
    }
  }

  function updateStatus() {
    if (theWinner) {
      statusElement.textContent = `Chiến thắng: ${theWinner}`;
    } else {
      statusElement.textContent = `Người chơi: ${xIsNext ? 'X' : 'O'}`;
    }
  }

  function restartGame() {
    squares = Array(dimension).fill(Array(dimension).fill(null));
    xIsNext = true; 
    theWinner = null;
    winningLine = [];
    renderBoard();
    updateStatus();
  }

  function makeComputerMove() {
    if (!singlePlayerMode || theWinner) {
      return;
    }

    const availableMoves = [];
    const humanPlayer = xIsNext ? 'X' : 'O';
    const computerPlayer = xIsNext ? 'O' : 'X';

    squares.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (!squares[rowIndex][colIndex]) {
          availableMoves.push([rowIndex, colIndex]);
        }
      });
    });

    if (availableMoves.length > 0) {
      // Check if the computer can win in the next move
      for (let i = 0; i < availableMoves.length; i++) {
        const [row, col] = availableMoves[i];
        const newSquares = squares.map((row) => [...row]);
        newSquares[row][col] = computerPlayer;

        if (calculateWinner(newSquares, row, col) === computerPlayer) {
          handleClick(row, col);
          return;
        }
      }

      // Check if the human player can win in the next move
      for (let i = 0; i < availableMoves.length; i++) {
        const [row, col] = availableMoves[i];
        const newSquares = squares.map((row) => [...row]);
        newSquares[row][col] = humanPlayer;

        if (calculateWinner(newSquares, row, col) === humanPlayer) {
          handleClick(row, col);
          return;
        }
      }

      // Random move for normal difficulty
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const [row, col] = availableMoves[randomIndex];

      // Choose a winning move for hard difficulty
      if (availableMoves.length >= 3) {
        for (let i = 0; i < availableMoves.length; i++) {
          const [row, col] = availableMoves[i];
          const newSquares = squares.map((row) => [...row]);
          newSquares[row][col] = computerPlayer;

          if (isWinningMove(newSquares, computerPlayer)) {
            handleClick(row, col);
            return;
          }
        }
      }

      handleClick(row, col);
    }
  }



  function isWinningMove(currentSquares, player) {
    for (let row = 0; row < dimension; row++) {
      for (let col = 0; col < dimension; col++) {
        if (!currentSquares[row][col]) {
          const newSquares = currentSquares.map((row) => [...row]);
          newSquares[row][col] = player;
          if (calculateWinner(newSquares, row, col) === player) {
            return true;
          }
        }
      }
    }
    return false;
  }



  function toggleSinglePlayerMode() {
    singlePlayerMode = !singlePlayerMode;
    if (singlePlayerMode) {
      singlePlayerToggle.innerHTML = '&#x1F4BB;';
    } else {
      singlePlayerToggle.innerHTML = '&#x1F477; ';
    }
  }
  renderBoard();
  updateStatus();
});

