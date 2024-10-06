document.getElementById('generateButton').addEventListener('click', generateAndDisplayMatrix);
document.getElementById('submitButton').addEventListener('click', checkUserPath);

let matrix = [];
let minShortestPath = 0;
let userPath = [];
let hasReachedEnd = false;

function generateAndDisplayMatrix() {
    const rows = 5;
    const cols = 5;
    matrix = generateRandomMatrix(rows, cols);
    displayMatrix(matrix);
    minShortestPath = findMinShortestPath(matrix);

    document.getElementById('matrixContainer').style.display = 'inline-block'; // Show matrix container
    document.getElementById('submitButton').style.display = 'block';
    document.getElementById('result').textContent = '';
    userPath = [];
}

function generateRandomMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            row.push(Math.floor(Math.random() * 10) + 1);
        }
        matrix.push(row);
    }
    return matrix;
}

function displayMatrix(matrix) {
    const container = document.getElementById('matrixContainer');
    container.innerHTML = '';
    matrix.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.textContent = cell;
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            cellDiv.addEventListener('click', () => cellClick(rowIndex, colIndex, cellDiv));
            rowDiv.appendChild(cellDiv);
        });
        container.appendChild(rowDiv);
    });
}

function cellClick(row, col, cellDiv) {
    if (hasReachedEnd) {
        document.getElementById('result').textContent = 'You have reached the end. No more changes allowed!';
        hasReachedEnd = false;
        return;
    }
    // If user has not started from (0, 0), do nothing
    if (userPath.length === 0 && (row !== 0 || col !== 0)) {
        document.getElementById('result').textContent = 'You must start from the top-left corner!';
        return;
    }

    // Prevent diagonal movement by checking if the move is either horizontal or vertical
    if (userPath.length > 0) {
        const lastCell = userPath[userPath.length - 1];
        if (!(lastCell.row === row || lastCell.col === col)) {
            document.getElementById('result').textContent = 'You can only move horizontally or vertically!';
            return;
        }
    }

    const index = userPath.findIndex(p => p.row === row && p.col === col);

    if (index === -1) {
        // Add to path
        userPath.push({ row, col });
        cellDiv.classList.add('highlight');
        // Check if the user has reached the end
        if (row === matrix.length - 1 && col === matrix[0].length - 1) {
            hasReachedEnd = true;
            document.getElementById('result').textContent = 'You have reached the end! Click submit to finish.';
        }
    } else {
        // Remove from path
        userPath.splice(index, 1);
        cellDiv.classList.remove('highlight');
        // Reset the end reached flag if user removes the end cell from the path
        if (row === matrix.length - 1 && col === matrix[0].length - 1) {
            hasReachedEnd = false;
        }
    }
}

function checkUserPath() {
    if (userPath.length === 0) {
        document.getElementById('result').textContent = 'No path selected. Please select a path and try again.';
        return;
    }

    const userPathSum = calculatePathSum(userPath);

    if (userPathSum === minShortestPath) {
        document.getElementById('result').textContent = `You win! Your path sum is ${userPathSum}. Minimum path sum is ${minShortestPath}.`;
    } else {
        document.getElementById('result').textContent = `You lose. Your path sum is ${userPathSum}. Minimum path sum is ${minShortestPath}.`;
    }
}

function calculatePathSum(path) {
    let sum = 0;
    for (const { row, col } of path) {
        if (row >= 0 && row < matrix.length && col >= 0 && col < matrix[0].length) {
            sum += matrix[row][col];
        } else {
            return Infinity; // Invalid path
        }
    }
    return sum;
}

function findMinShortestPath(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

    dp[0][0] = matrix[0][0];

    for (let j = 1; j < cols; j++) {
        dp[0][j] = dp[0][j - 1] + matrix[0][j];
    }

    for (let i = 1; i < rows; i++) {
        dp[i][0] = dp[i - 1][0] + matrix[i][0];
    }

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + matrix[i][j];
        }
    }

    return dp[rows - 1][cols - 1];
}
