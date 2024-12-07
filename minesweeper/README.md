# Minesweeper

This is a web-based implementation of the classic Minesweeper game, built using HTML, CSS, and JavaScript.

## How to Play

1. Open the `index.html` file in your web browser.
2. The game will start automatically with a 9x9 grid and 10 mines (beginner difficulty).
3. **Left-click** on a square to reveal it.
    *   If you reveal a mine, the game is over.
    *   If you reveal a number, it indicates the number of mines adjacent to that square.
    *   If you reveal an empty square, it will automatically reveal all adjacent empty squares recursively.
4. **Right-click** on a square to flag it as a potential mine. Right-click again to remove the flag.
5. The **timer** at the top of the screen shows how long you've been playing.
6. The **mine counter** shows the number of mines remaining (total mines - flagged squares).
7. The goal is to reveal all the safe squares without clicking on any mines.
8. Click the **Reset** button to start a new game with the same settings.

## Game Controls

*   **Left-click:** Reveal a square.
*   **Right-click:** Flag/unflag a square.

## Difficulty

The default difficulty is set to beginner (9x9 grid, 10 mines).

## Notes

*   This game does not currently support custom difficulty settings or a "New Game" button to change the difficulty. These features may be added in the future.
*   There is no leaderboard or high score tracking in this version.

Enjoy playing Minesweeper!
