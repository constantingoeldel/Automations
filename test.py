sudoku = [ [3, 0, 6, 5, 0, 8, 4, 0, 0], 
         [5, 2, 0, 0, 0, 0, 0, 0, 0], 
         [0, 8, 7, 0, 0, 0, 0, 3, 1], 
         [0, 0, 3, 0, 1, 0, 0, 8, 0], 
         [9, 0, 0, 8, 6, 3, 0, 0, 5], 
         [0, 5, 0, 0, 9, 0, 6, 0, 0], 
         [1, 3, 0, 0, 0, 0, 2, 5, 0], 
         [0, 0, 0, 0, 0, 0, 0, 7, 4], 
         [0, 0, 5, 2, 0, 6, 3, 0, 0] ]

sudoku2 = [ [2, 0, 4, 9, 0, 0, 0, 0, 0], 
         [0, 0, 0, 6, 0, 0, 0, 0, 0], 
         [0, 0, 0, 0, 0, 2, 9, 0, 7], 
         [0, 6, 0, 7, 0, 0, 0, 8, 0], 
         [0, 0, 0, 0, 0, 0, 0, 0, 5], 
         [5, 3, 9, 0, 0, 0, 0, 0, 0], 
         [0, 0, 7, 3, 0, 0, 2, 0, 0], 
         [0, 0, 5, 0, 0, 0, 8, 0, 0], 
         [9, 0, 0, 1, 0, 0, 3, 4, 0] ]

# create a function called solve_sudoku that takes a grid as an input and returns the solved sudoku
counter = 0
def solve_sudoku(grid):
    # check if the grid is valid
    if not is_valid(grid):
        return False
    
    # find the next empty cell
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == 0:
                for num in range(1, 10):
                    grid[i][j] = num
                    if is_valid(grid):
                        if solve_sudoku(grid):
                            return True
                    grid[i][j] = 0
                return False
    return True

# create a function called is_valid that takes a grid as an input and returns whether the grid is valid or not

def is_valid(grid):
    # check if each row is valid
    for row in grid:
        if not is_valid_row(row):
            return False
    
    # check if each column is valid
    for j in range(len(grid[0])):
        column = [grid[i][j] for i in range(len(grid))]
        if not is_valid_row(column):
            return False
    
    # check if each 3x3 sub-grid is valid
    for i in range(0, 9, 3):
        for j in range(0, 9, 3):
            sub_grid = [grid[i + row][j + col] for row in range(3) for col in range(3)]
            if not is_valid_row(sub_grid):
                return False
    return True


def is_valid_row(row):
    occ = []
    for i in row:
        if i != 0: 
            if i in occ:
             return False
            occ.append(i)
    return True
     
# solve the sudoku
solve_sudoku(sudoku2)

# print the solved sudoku
print(sudoku2, counter)