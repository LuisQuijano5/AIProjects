import { Knight } from './rules.js';
//const knight = new Knight(0, 0, 8);
//const sqVisited = new Set();
//sqVisited.add(`${knight.coords.x},${knight.coords.y}`);
let solutionPath = [];
let currentStep = 0;
let boardSize = 8;

function depthFirst(knight, sqVisited, path) {
    const TOTAL_SQUARES = knight.size * knight.size;

    if (sqVisited.size === TOTAL_SQUARES) {
        return true;
    }

    const possibleMoves = [
        knight.ruleRtUp, knight.ruleUpRt, knight.ruleUpLe, knight.ruleLeUp,
        knight.ruleLeLo, knight.ruleLoLe, knight.ruleLoRt, knight.ruleRtLo,
    ];

    for (const move of possibleMoves) {
        const originalX = knight.coords.x;
        const originalY = knight.coords.y;
        
        if (move.call(knight, sqVisited)) { 
            const newKey = `${knight.coords.x},${knight.coords.y}`;
            
            sqVisited.add(newKey);
            path.push([knight.coords.x, knight.coords.y]);
            
            if (depthFirst(knight, sqVisited, path)) {
                return true;
            }

            path.pop();
            sqVisited.delete(newKey);
            knight.coords.x = originalX; 
            knight.coords.y = originalY;
        }
    }

    return false; 
}


// UI
const boardContainer = document.getElementById('chessboard');
const solveButton = document.getElementById('solveButton');
const nextButton = document.getElementById('nextButton');
const stepInfo = document.getElementById('stepInfo');
const statusMessage = document.getElementById('statusMessage');
const stepControls = document.getElementById('stepControls');

nextButton.addEventListener('click', handleNextStep);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && !nextButton.disabled) {
        handleNextStep();
    }
});


function renderBoard(pathData, step, N) {
    boardContainer.innerHTML = '';
    boardContainer.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    boardContainer.style.gridTemplateRows = `repeat(${N}, 1fr)`;
    const cellSize = `calc(600px / ${N})`; 

    const currentX = pathData[step][0];
    const currentY = pathData[step][1];
    
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            const isDark = (x + y) % 2 === 0;
            const square = document.createElement('div');
            square.className = `square ${isDark ? 'dark' : 'light'}`;
            square.style.width = square.style.height = cellSize;

            let stepNumber = -1;
            for (let i = 0; i < pathData.length; i++) {
                if (pathData[i][0] === x && pathData[i][1] === y) {
                    stepNumber = i;
                    break;
                }
            }

            if (stepNumber !== -1) {
                square.textContent = stepNumber;
                if (stepNumber <= step) {
                        square.classList.add('visited-step');
                        square.style.color = isDark ? '#d1d5db' : '#374151'; 
                }
            }
            
            if (x === currentX && y === currentY) {
                square.innerHTML = `<div class="knight">${step}</div>`;
            } else if (stepNumber === pathData.length - 1 && step === pathData.length - 1) {
                square.classList.add('bg-green-100');
            }

            boardContainer.appendChild(square);
        }
    }
}

function updateStepControls() {
    stepInfo.textContent = `Step: ${currentStep + 1} / ${boardSize * boardSize}`;
    
    nextButton.disabled = currentStep >= solutionPath.length - 1;

    if (currentStep === solutionPath.length - 1 && solutionPath.length > 0) {
            statusMessage.textContent = `Tour Complete! ${boardSize * boardSize} moves found.`;
            statusMessage.className = 'mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium text-center';
            statusMessage.style.display = 'block';
            nextButton.textContent = 'Tour Complete!';
    } else {
            nextButton.textContent = 'Next Step (→)';
    }
}

function handleNextStep() {
    if (currentStep < solutionPath.length - 1) {
        currentStep++;
        renderBoard(solutionPath, currentStep, boardSize);
        updateStepControls();
    }
}

function displayMessage(text, isError = false) {
    statusMessage.textContent = text;
    statusMessage.className = `mt-4 p-3 rounded-lg text-sm font-medium text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`;
    statusMessage.style.display = 'block';
}


solveButton.addEventListener('click', () => {
    const N = parseInt(document.getElementById('boardSize').value);
    const startX = parseInt(document.getElementById('startX').value);
    const startY = parseInt(document.getElementById('startY').value);

    if (N < 5 || N > 8) {
        return displayMessage("Please use a board size N between 5 and 8. (menos de 4 puede no tener solucion, mas de 8 tardaria mucho).", true);
    }
    if (startX < 0 || startX >= N || startY < 0 || startY >= N) {
        return displayMessage(`Start coordinates must be between 0 and ${N - 1}. (coordenadas fuera del tablero)`, true);
    }

    solutionPath = [];
    currentStep = 0;
    boardSize = N;
    statusMessage.style.display = 'none';
    stepControls.classList.add('hidden');
    solveButton.disabled = true;
    solveButton.textContent = 'Searching...';

    const TOTAL_SQUARES = N * N;
    
    const knightInstance = new Knight(startX, startY, N);
    const sqVisited = new Set();
    
    const startKey = `${startX},${startY}`;
    sqVisited.add(startKey);
    solutionPath.push([startX, startY]);
    
    renderBoard(solutionPath, 0, boardSize);

    setTimeout(() => {
        const tourFound = depthFirst(knightInstance, sqVisited, solutionPath);
        solveButton.disabled = false;
        solveButton.textContent = 'Solve';

        if (tourFound) {
            stepControls.classList.remove('hidden');
            nextButton.disabled = false;
            renderBoard(solutionPath, 0, N);
            updateStepControls();
            displayMessage(`Solution found in ${solutionPath.length} steps. Start stepping through.`, false);
        } else {
            displayMessage(`No solution found from (${startX}, ${startY}) on a ${N}x${N} board. Try a different starting position.`, true);
            boardContainer.innerHTML = `<p class="text-red-500 text-center p-8">Search failed (no se encoentro solucion). </p>`;
        }
    }, 50); 
});

document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('startX').max = document.getElementById('startY').max = 7;
});

document.getElementById('boardSize').addEventListener('input', (e) => {
    const N = parseInt(e.target.value);
    const maxCoord = N - 1;
    document.getElementById('startX').max = maxCoord;
    document.getElementById('startY').max = maxCoord;
    
    if (parseInt(document.getElementById('startX').value) >= N) {
        document.getElementById('startX').value = 0;
    }
        if (parseInt(document.getElementById('startY').value) >= N) {
        document.getElementById('startY').value = 0;
    }
});



// console.log(depthFirst(knight));
// console.log(sqVisited);