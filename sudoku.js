var sudoku = [
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
var sudoku2 = [
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
function findEmpty(sudoku) {
    var pos = null;
    sudoku.forEach(function (row, x) {
        row.forEach(function (_, y) {
            if (sudoku[x][y] === 0) {
                pos = [x, y];
            }
        });
    });
    return pos;
}
function valid(sudoku, num, pos) {
    if (sudoku[pos[0]].includes(num)) {
        return false;
    }
    if (sudoku.map(function (row) { return row[pos[1]]; }).includes(num)) {
        return false;
    }
    var box_x = Math.floor(pos[1] / 3);
    var box_y = Math.floor(pos[0] / 3);
    for (var row = box_y * 3; row < box_y * 3 + 2; row++) {
        for (var column = box_x * 3; column < box_x * 3 + 2; column++) {
            if (sudoku[row][column] === num) {
                return false;
            }
        }
    }
    return true;
}
function solve(sudoku) {
    var pos = findEmpty(sudoku);
    if (!pos)
        return true;
    for (var i = 1; i < 10; i++) {
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
