let sudoku = [
  [3, 0, 6, 5, 0, 8, 4, 0, 0],
  [5, 2, 0, 0, 0, 0, 0, 0, 0],
  [0, 8, 7, 0, 0, 0, 0, 3, 1],
  [0, 0, 3, 0, 1, 0, 0, 8, 0],
  [9, 0, 0, 8, 6, 3, 0, 0, 5],
  [0, 5, 0, 0, 9, 0, 6, 0, 0],
  [1, 3, 0, 0, 0, 0, 2, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 7, 4],
  [0, 0, 5, 2, 0, 6, 3, 0, 0],
];

let sudoku2 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

function findEmpty(sudoku: number[][]) {
  let pos = null;
  sudoku.forEach((row, x) => {
    row.forEach((_, y) => {
      if (sudoku[x][y] === 0) {
        pos = [x, y];
      }
    });
  });
  return pos;
}

function valid(sudoku: number[][], num: number, pos: [number, number]) {
  if (sudoku[pos[0]].includes(num)) {
    return false;
  }
  if (sudoku.map((row) => row[pos[1]]).includes(num)) {
    return false;
  }

  const box_x = Math.floor(pos[1] / 3);
  const box_y = Math.floor(pos[0] / 3);

  for (let row = box_y * 3; row < box_y * 3 + 2; row++) {
    for (let column = box_x * 3; column < box_x * 3 + 2; column++) {
      if (sudoku[row][column] === num) {
        return false;
      }
    }
  }
  return true;
}

function solve(sudoku: number[][]) {
  const pos = findEmpty(sudoku);
  if (!pos) return true;

  for (let i = 1; i < 10; i++) {
    if (valid(sudoku, i, pos)) {
      sudoku[pos[0]][pos[1]] = i;
      if (solve(sudoku)) {
        return true;
      }
      sudoku[pos[0]][pos[1]] = 0;
    }
  }
  return false;
}

console.table(sudoku);
solve(sudoku);
console.table(sudoku);

console.table(sudoku2);
solve(sudoku2);
console.table(sudoku2);
