// INIT STUFF
import { Knight } from './Knights/rules.js';
import { depthFirst } from './Knights/algorithm.js';
import { Node } from './Puzzle/rules.js';
import { MazeNode } from './Maze/rules.js';
import { bestFirst } from './Puzzle/algorithm.js';
import { bestFirstMaze } from './Maze/algorithm.js';
import { MinHeap } from './heap.js';

let solutionPath = [];
let currentStep = 0;
let boardSize = 8;
let currentProblem = 'knight';

const knightTourSection = document.getElementById('knight-tour-section');
const puzzleSection = document.getElementById('puzzle-section');
const mazeSection = document.getElementById('maze-section');
const knightTourBtn = document.getElementById('knight-tour-btn');
const puzzleBtn = document.getElementById('puzzle-btn');
const mazeBtn = document.getElementById('maze-btn');

const boardContainer = document.getElementById('chessboard');
const solveButton = document.getElementById('solveButton');
const nextButton = document.getElementById('nextButton');
const stepInfo = document.getElementById('stepInfo');
const statusMessage = document.getElementById('statusMessage');
const stepControls = document.getElementById('stepControls');
const controlsContainer = document.getElementById('controls-container'); 

const solvePuzzle = document.getElementById('solve-puzzle');
const statusPuzzle = document.getElementById('status-puzzle');
// --- PUZZLE UI references ---
const puzzleInput = document.getElementById('puzzle-input');
const puzzleMoves = document.getElementById('puzzle-moves');
const puzzleRoute = document.getElementById('puzzle-route');
const puzzleGridCurrent = document.getElementById('puzzle-current');
const puzzleGridGoal = document.getElementById('puzzle-goal');
const puzzleControls = document.getElementById('puzzleControls');
const puzzlePrev = document.getElementById('puzzlePrev');
const puzzleNextBtn = document.getElementById('puzzleNext');

// Corrige el id (tu código tenía 'puzzlInfo' con typo)
const puzzleInfo = document.getElementById('puzzleInfo');

// Estado del puzzle
let puzzlePath = [];
let puzzleStep = 0;
let puzzleGoalKey = '';
let puzzleMovesList = [];

const mazeInput = document.getElementById('maze-input');
const solveMaze = document.getElementById('solve-maze');
const statusMaze = document.getElementById('status-maze');
//const mazeMap = document.getElementById('maze-map');
const mazeResults = document.getElementById('maze-results');


function showSection(section) {
    knightTourSection.classList.add('hidden');
    puzzleSection.classList.add('hidden');
    mazeSection.classList.add('hidden');

    knightTourBtn.classList.replace('bg-blue-600', 'bg-gray-200');
    knightTourBtn.classList.replace('text-white', 'text-gray-700');
    puzzleBtn.classList.replace('bg-blue-600', 'bg-gray-200');
    puzzleBtn.classList.replace('text-white', 'text-gray-700');
    mazeBtn.classList.replace('bg-blue-600', 'bg-gray-200');
    mazeBtn.classList.replace('text-white', 'text-gray-700');

    section.classList.remove('hidden');
    if (section === knightTourSection) {
        currentProblem = 'knight';
        knightTourBtn.classList.replace('bg-gray-200', 'bg-blue-600');
        knightTourBtn.classList.replace('text-gray-700', 'text-white');
    } else if (section === puzzleSection) {
        currentProblem = 'puzzle';
        puzzleBtn.classList.replace('bg-gray-200', 'bg-blue-600');
        puzzleBtn.classList.replace('text-gray-700', 'text-white');
    } else if (section === mazeSection) {
        currentProblem = 'maze';
        mazeBtn.classList.replace('bg-gray-200', 'bg-blue-600');
        mazeBtn.classList.replace('text-gray-700', 'text-white');
    }
}

knightTourBtn.addEventListener('click', () => showSection(knightTourSection));
puzzleBtn.addEventListener('click', () => showSection(puzzleSection));
mazeBtn.addEventListener('click', () => showSection(mazeSection));

// KNIGHT STUFF
function displayMessage(text, isError = false) {
    statusMessage.textContent = text;
    statusMessage.className = `mt-4 p-3 rounded-lg text-sm font-medium text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`;
    statusMessage.style.display = 'block';
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

function getKnightTourInputs() {
    return {
        N: parseInt(document.getElementById('boardSize').value),
        startX: parseInt(document.getElementById('startX').value),
        startY: parseInt(document.getElementById('startY').value)
    };
}

function validateKnightTourInputs(N, startX, startY) {
    if (N < 5 || N > 8) {
        return "Please use a board size N between 5 and 8. (menos de 4 pueden no tener solucion y mas de 8 tardan demasiado).";
    }
    if (startX < 0 || startX >= N || startY < 0 || startY >= N) {
        return `Start coordinates must be between 0 and ${N - 1}.`;
    }
    return null;
}

function solveKnightTour() {
    const { N, startX, startY } = getKnightTourInputs();
    const validationError = validateKnightTourInputs(N, startX, startY);

    if (validationError) {
        return displayMessage(validationError, true);
    }

    solutionPath = [];
    currentStep = 0;
    boardSize = N;
    
    const sqVisited = new Set(); 
    const knightInstance = new Knight(startX, startY, N, sqVisited);
    
    const startKey = `${startX},${startY}`;
    sqVisited.add(startKey);
    solutionPath.push([startX, startY]);
    
    renderBoard(solutionPath, 0, boardSize);

    setTimeout(() => {
        const tourFound = depthFirst(knightInstance, sqVisited, solutionPath);
        solveButton.disabled = false;
        solveButton.textContent = 'Find Tour';

        if (tourFound) {
            stepControls.classList.remove('hidden');
            nextButton.disabled = false;
            renderBoard(solutionPath, 0, N);
            updateStepControls();
            displayMessage(`Solution found in ${solutionPath.length} steps. Start stepping through.`, false);
        } else {
            displayMessage(`No solution found from (${startX}, ${startY}) on a ${N}x${N} board. Try a different starting position.`, true);
            boardContainer.innerHTML = `<p class="text-red-500 text-center p-8">Search failed (no se encontro solucion). </p>`;
        }
    }, 50); 
}

solveButton.addEventListener('click', () => {
    statusMessage.style.display = 'none';
    stepControls.classList.add('hidden');
    solveButton.disabled = true;
    solveButton.textContent = 'Searching...';

    if (currentProblem === 'knight') {
        solveKnightTour();
    }
});

function keyToMatrix(key) {
  return [
    key.slice(0,3).split(''),
    key.slice(3,6).split(''),
    key.slice(6,9).split('')
  ];
}

function renderPuzzleBoard(key, container, highlightGoal = false) {
  container.innerHTML = '';
  const mat = keyToMatrix(key);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const v = mat[r][c];
      const tile = document.createElement('div');
      tile.className = 'tile' + (v === '0' ? ' zero' : '');
      tile.textContent = v === '0' ? '0' : v;
      if (highlightGoal && puzzleGoalKey && puzzleGoalKey[r*3 + c] === v && v !== '0') {
        tile.classList.add('goal');
      }
      container.appendChild(tile);
    }
  }
}

function parsePuzzleTextarea(txt) {
  // lee 18 números (6 líneas de 3) separados por espacios/saltos
  const tokens = txt.trim().split(/\s+/);
  if (tokens.length < 18) return null;
  const startKey = tokens.slice(0, 9).join('');
  const goalKey  = tokens.slice(9, 18).join('');
  return { startKey, goalKey };
}

function movesFromPath(path) {
  const moves = [];
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1].blankCoords;
    const b = path[i].blankCoords;
    if (b.y === a.y - 1 && b.x === a.x) moves.push('Up');
    else if (b.y === a.y + 1 && b.x === a.x) moves.push('Down');
    else if (b.x === a.x + 1 && b.y === a.y) moves.push('Right');
    else if (b.x === a.x - 1 && b.y === a.y) moves.push('Left');
    else moves.push('(?)');
  }
  return moves;
}

function showPuzzleStatus(text, isError=false) {
  statusPuzzle.textContent = text;
  statusPuzzle.className = `mt-4 p-3 rounded-lg text-sm font-medium text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`;
  statusPuzzle.style.display = 'block';
}

function updatePuzzleControls() {
  puzzleInfo.textContent = `Step: ${puzzleStep + 1} / ${puzzlePath.length}`;
  puzzlePrev.disabled = puzzleStep <= 0;
  puzzleNextBtn.disabled = puzzleStep >= puzzlePath.length - 1;
}

function renderPuzzleStep() {
  const node = puzzlePath[puzzleStep];
  renderPuzzleBoard(node.key, puzzleGridCurrent, true);
}


// PUZZLE STUFF
function solvePuzzleProblem() {
  const parsed = parsePuzzleTextarea(puzzleInput.value || '');
  if (!parsed) {
    showPuzzleStatus('Entrada inválida. Debe contener 6 renglones de 3 números (total 18).', true);
    solvePuzzle.disabled = false;
    solvePuzzle.textContent = 'Solve Puzzle';
    return;
  }

  const { startKey, goalKey } = parsed;
  puzzleGoalKey = goalKey;

  // Render objetivo a la derecha desde el inicio
  renderPuzzleBoard(goalKey, puzzleGridGoal);

  // Preparar nodo inicial y cola
  const visited = new Set([startKey]);
  const bi = startKey.indexOf('0');
  const startNode = new Node(startKey, bi % 3, Math.floor(bi / 3), visited, null);
  startNode.getValue(goalKey);

  const pq = new MinHeap();
  pq.insert(startNode);

  // Ejecutar búsqueda (Greedy Best-First)
  const path = bestFirst(goalKey, pq);

  // Restaurar botón
  solvePuzzle.disabled = false;
  solvePuzzle.textContent = 'Solve Puzzle';

  if (!path || path.length === 0) {
    showPuzzleStatus('No se encontró solución con Greedy Best-First.', true);
    puzzleControls.classList.add('hidden');
    puzzleGridCurrent.innerHTML = '';
    puzzleMoves.textContent = '';
    puzzleRoute.textContent = '';
    return;
  }

  // Guardar estado y dibujar
  puzzlePath = path;
  puzzleStep = 0;
  renderPuzzleStep();
  renderPuzzleBoard(goalKey, puzzleGridGoal);

  // Jugadas y ruta textual
  puzzleMovesList = movesFromPath(path);
  puzzleMoves.textContent = puzzleMovesList.length
    ? puzzleMovesList.join(' -> ')
    : '(Sin movimientos; ya estás en el objetivo)';

  puzzleRoute.innerHTML = path
    .map((n, i) => `Paso ${i}: ${n.key}`)
    .join('<br>');

  // Mostrar controles
  puzzleControls.classList.remove('hidden');
  updatePuzzleControls();

  // Mensaje de éxito
  showPuzzleStatus(`Solución encontrada. ${puzzleMovesList.length} jugadas.`, false);
}

puzzlePrev.addEventListener('click', () => {
  if (puzzleStep > 0) {
    puzzleStep--;
    renderPuzzleStep();
    updatePuzzleControls();
  }
});

puzzleNextBtn.addEventListener('click', () => {
  if (puzzleStep < puzzlePath.length - 1) {
    puzzleStep++;
    renderPuzzleStep();
    updatePuzzleControls();
  }
});


solvePuzzle.addEventListener('click', () => {
    statusPuzzle.style.display = 'none';
    solvePuzzle.disabled = true;
    solvePuzzle.textContent = 'Searching...';

    if (currentProblem === 'puzzle') {
        solvePuzzleProblem();
    }
});


// MAZE STUFF
function drawMaze(mapData, paths = [], bestPathIndex = -1) {
    const gridContainer = document.getElementById('maze-map');
    gridContainer.innerHTML = ''; 

    const [rows, cols] = mapData.dimensions;
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    const [startX, startY, endX, endY] = mapData.coords; 

    const isCellOnPath = (r, c) => {
        let pathType = null;

        if (paths.length > 0) {
            paths.forEach((path, index) => {
                const found = path.find(node => node.coords.x === r && node.coords.y === c);
                if (found) {
                    if (index === bestPathIndex) {
                        pathType = 'best';
                    } else if (pathType !== 'best') { 
                        pathType = 'other';
                    }
                }
            });
        }
        return pathType;
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('maze-cell'); 
            const pathType = isCellOnPath(r, c);
            
            if (pathType === 'best') {
                cell.style.backgroundColor = 'rgb(144, 238, 144)'; // Light Green
                cell.classList.add('best-path');
            } else if (pathType === 'other') {
                cell.style.backgroundColor = 'rgb(173, 216, 230)'; // Light Blue
                cell.classList.add('other-path');
            } else {
                if (mapData.transit[r][c] === 1) {
                    cell.style.backgroundColor = 'rgba(145, 148, 144, 0.8)'; 
                } else {
                    cell.style.backgroundColor = '#f3f4f6'; 
                }
            }

            const seguridadValue = mapData.security[r][c];
            const traficoValue = mapData.traffic[r][c];

            cell.style.borderStyle = 'none'; 
            
            const content = document.createElement('div');
            content.classList.add('cell-content');
            
            const traficoSpan = document.createElement('span');
            traficoSpan.classList.add('trafico-text');
            traficoSpan.textContent = `T: ${traficoValue}`;
            
            const seguridadSpan = document.createElement('span');
            seguridadSpan.classList.add('seguridad-text');
            seguridadSpan.textContent = `S: ${seguridadValue}`;

            content.appendChild(traficoSpan);
            content.appendChild(seguridadSpan);
            cell.appendChild(content);
            
            if (c === startY && r === startX) { // OJO AQUI INVERTIDOS PQ SON ARREGLOS
                cell.classList.add('origin-cell');
                cell.innerHTML += 'O'; 
            } else if (c === endY && r === endX) {
                cell.classList.add('destination-cell');
                cell.innerHTML += 'D'; 
            }
            
            gridContainer.appendChild(cell);
        }
    }
}

function getMazeInput(textMaze){
    try{
        const MAP_INFO = 2; 
        const DIMENSIONS = textMaze[0].split(' ').map(Number);
        const M = DIMENSIONS[0];
        const COORDS = textMaze[1].split(' ').map(Number);
        const maze = textMaze.slice(MAP_INFO + (M * 0), MAP_INFO + (M * 1)).map(rowString => rowString.split(' ').map(Number));
        const security = textMaze.slice(MAP_INFO + (M * 1), MAP_INFO + (M * 2)).map(rowString => rowString.split(' ').map(Number));
        const traffic = textMaze.slice(MAP_INFO + (M * 2), MAP_INFO + (M * 3)).map(rowString => rowString.split(' ').map(Number));

        if(!( DIMENSIONS.length == 2 && COORDS.length == 4 && maze.length == M && security.length == M && traffic.length == M )){
            throw new Error();
        }

        return {
            dimensions: DIMENSIONS,
            coords: COORDS,
            transit: maze,
            security: security,
            traffic: traffic
        };
    } catch {
        return false;
    }
}

function solveMazeProblem(){
    const textMaze = mazeInput.value.split('\n');
    const mapData = getMazeInput(textMaze);
    if(!mapData){
        //PON UNA ALERTA AQUI ULISES
        solveMaze.disabled = false;
        solveMaze.textContent = 'Solve';
        return;
    }

    drawMaze(mapData);

    // Preparar nodo inicial y cola
    const visited = new Set();
    visited.add(`${mapData.coords[0]},${mapData.coords[1]}`);
    const startNode = new MazeNode(mapData.coords[0], mapData.coords[1], visited, mapData, null);

    const pq = new MinHeap();
    pq.insert(startNode);

    // Ejecutar búsqueda (Greedy Best-First)
    const {bestPathIndex, paths} = bestFirstMaze(pq);
    if(bestPathIndex === -1){
        // Indicar aqui que no s eenceontro solucionnnn PON AQUI LA LAERTA TMB ULISES
        solveMaze.disabled = false;
        solveMaze.textContent = 'Solve Maze';
        return;
    }
    //HAZ QUE EN EL RECUERDRO ABAJO DEL MAPA SE VEA EN COORDENADAS LOS DOS CAMINOS E INDICA CUALE S EL MEJOR ULISES
    //ULISES CHECA SI LO PEUES HACER RESPONSIVO
    console.log(bestPathIndex);
    console.log(paths);
    drawMaze(mapData, paths, bestPathIndex);

    // Restaurar botón
    solveMaze.disabled = false;
    solveMaze.textContent = 'Solve Maze';
}

solveMaze.addEventListener('click', () => {
    statusMaze.style.display = 'none';
    solveMaze.disabled = true;
    solveMaze.textContent = 'Searching...';

    if (currentProblem === 'maze') {
        solveMazeProblem();
    }
});


// GENERAL STUFF
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startX').max = document.getElementById('startY').max = 7;
    nextButton.addEventListener('click', handleNextStep);
    puzzleSection.classList.add('hidden');
    mazeSection.classList.add('hidden');
    showSection(knightTourSection);
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

