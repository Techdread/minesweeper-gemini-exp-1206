document.addEventListener('DOMContentLoaded', () => {
    const grid = [];
    let isGameOver = false;
    let currentDifficulty = 'beginner'; // Default difficulty
    let timerInterval;
    let flagsPlaced = 0;

    // Difficulty settings
    const difficulty = {
        beginner: { rows: 10, cols: 10, mines: 10 },
        normal: { rows: 15, cols: 15, mines: 40 },
        expert: { rows: 20, cols: 20, mines: 99 }
    };

    const gridElement = document.getElementById('game-grid');
    const resetButton = document.getElementById('reset-button');
    const timerDisplay = document.getElementById('timer');
    const mineCounterDisplay = document.getElementById('mine-counter');
    const gameOverMessage = document.getElementById('game-over-message');
    const gameWinMessage = document.getElementById('game-win-message');
    const difficultySelect = document.getElementById('difficulty');

    resetButton.addEventListener('click', initGame);
    difficultySelect.addEventListener('change', () => {
        currentDifficulty = difficultySelect.value;
        initGame();
    });

    // Function to initialize the game
    function initGame() {
        isGameOver = false;
        clearInterval(timerInterval);
        timerDisplay.textContent = 'Time: 0';
        const { rows, cols, mines } = difficulty[currentDifficulty];
        flagsPlaced = 0;
        mineCounterDisplay.textContent = `Mines: ${mines}`;
        gameOverMessage.style.display = 'none';
        gameWinMessage.style.display = 'none';

        gridElement.innerHTML = ''; // Clear the grid
        grid.length = 0; // Reset the grid array

        createGrid(rows, cols);
        plantMines(mines);
        calculateAdjacentMines();
        startTimer();
    }

    // Function to create the grid
    function createGrid(rows, cols) {
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                const square = document.createElement('div');
                square.dataset.row = i;
                square.dataset.col = j;
                square.addEventListener('click', () => handleSquareClick(square));
                square.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    handleFlagPlacement(square);
                });
                gridElement.appendChild(square);
                row.push({
                    element: square,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    adjacentMines: 0
                });
            }
            grid.push(row);
        }
        gridElement.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
    }

    // Function to plant mines randomly
    function plantMines(mines) {
        let minesPlanted = 0;
        while (minesPlanted < mines) {
            const row = Math.floor(Math.random() * grid.length);
            const col = Math.floor(Math.random() * grid[0].length);
            if (!grid[row][col].isMine) {
                grid[row][col].isMine = true;
                minesPlanted++;
            }
        }
    }

    // Function to calculate the number of adjacent mines for each square
    function calculateAdjacentMines() {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (!grid[i][j].isMine) {
                    grid[i][j].adjacentMines = countAdjacentMines(i, j);
                }
            }
        }
    }

    // Function to count the number of adjacent mines for a given square
    function countAdjacentMines(row, col) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && grid[i][j].isMine) {
                    count++;
                }
            }
        }
        return count;
    }

    // Function to start the timer
    function startTimer() {
        let seconds = 0;
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.textContent = `Time: ${seconds}`;
        }, 1000);
    }

    // Function to handle square click
    function handleSquareClick(squareElement) {
        if (isGameOver) return;
        const row = parseInt(squareElement.dataset.row);
        const col = parseInt(squareElement.dataset.col);
        const square = grid[row][col];

        if (square.isRevealed || square.isFlagged) return;

        if (square.isMine) {
            gameOver();
        } else {
            revealSquare(square);
            checkForWin();
        }
    }

    // Function to handle flag placement
    function handleFlagPlacement(squareElement) {
        if (isGameOver) return;
        const row = parseInt(squareElement.dataset.row);
        const col = parseInt(squareElement.dataset.col);
        const square = grid[row][col];

        if (square.isRevealed) return;

        const { mines } = difficulty[currentDifficulty];

        if (square.isFlagged) {
            square.isFlagged = false;
            square.element.classList.remove('flagged');
            flagsPlaced--;
        } else {
            if (flagsPlaced < mines) {
                square.isFlagged = true;
                square.element.classList.add('flagged');
                flagsPlaced++;
            }
        }
        mineCounterDisplay.textContent = `Mines: ${mines - flagsPlaced}`;
    }

    // Function to reveal a square
    function revealSquare(square) {
        if (square.isRevealed) return;
        square.isRevealed = true;
        square.element.classList.add('revealed');

        if (square.adjacentMines > 0) {
            square.element.textContent = square.adjacentMines;
            return;
        }

        // Recursively reveal empty neighbors
        const row = parseInt(square.element.dataset.row);
        const col = parseInt(square.element.dataset.col);
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
                    revealSquare(grid[i][j]);
                }
            }
        }
    }

    // Function to check for win condition
    function checkForWin() {
        let nonMineSquaresRevealed = 0;
        const { rows, cols, mines } = difficulty[currentDifficulty];

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (!grid[i][j].isMine && grid[i][j].isRevealed) {
                    nonMineSquaresRevealed++;
                }
            }
        }

        if (nonMineSquaresRevealed === rows * cols - mines) {
            gameWon();
        }
    }

    // Function to handle game won
    function gameWon() {
        isGameOver = true;
        clearInterval(timerInterval);
        gameWinMessage.style.display = 'block';
    }

    // Function to handle game over
    function gameOver() {
        isGameOver = true;
        clearInterval(timerInterval);
        gameOverMessage.style.display = 'block';

        // Reveal all mines
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                if (grid[i][j].isMine) {
                    grid[i][j].element.classList.add('mine');
                }
            }
        }
    }

    // Call initGame to start the game
    initGame();
});
