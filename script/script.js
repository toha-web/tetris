document.addEventListener("contextmenu", (e) => {e.preventDefault()});
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        e.preventDefault();
    }
});

const startAudio = new Audio("../sounds/startGame.mp3");
const gameOverAudio = new Audio("../sounds/gameOver.mp3");
const rotateAudio = new Audio("../sounds/rotate.mp3");
const moveAudio = new Audio("../sounds/move.mp3");
const putAudio = new Audio("../sounds/put.mp3");
const deleteAudio = new Audio("../sounds/delete.mp3");

const fieldWrapper = document.querySelector(".tetris-field");
const nextWrapper = document.querySelector(".next-field");
const highScoreField = document.querySelector(".high-score span");
const linesField = document.querySelector(".lines span");
const scoreField = document.querySelector(".score span");
const speedField = document.querySelector(".speed span");
const levelField = document.querySelector(".level span");
const pauseButton = document.querySelector(".pause button");
const startButton = document.querySelector(".start button");
const pauseImg = document.querySelector(".pause img");

startButton.innerText = "Start";
startButton.addEventListener("click", () => {
    startGame();
})

pauseButton.innerText = "Pause";
pauseButton.disabled = true;
pauseButton.addEventListener("click", () => {
    if(!pauseStatus){
        clearInterval(timerId);
        document.removeEventListener("keydown", keyHandler);
        pauseStatus = true;
        pauseButton.innerText = "Resume";
        pauseImg.style.display = "block";
    }
    else{
        document.addEventListener("keydown", keyHandler);
        timerId = setInterval(moveDown, timerSpeed);
        pauseStatus = false;
        pauseButton.innerText = "Pause";
        pauseImg.style.display = "none";
    }
    
});

const fieldRows = 20;
const fieldCols = 10;
const figureNames = ["o", "l", "j", "s", "z", "i", "t"];
const figures = {
    o: [
        [
            [1, 1],
            [1, 1],
        ],
    ],
    l: [
        [
            [0, 0, 1],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        [
            [1, 1, 1],
            [1, 0, 0],
        ],
        [
            [1, 1],
            [0, 1],
            [0, 1],
        ],
    ],
    j: [
        [
            [1, 0, 0],
            [1, 1, 1],
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 0, 1],
        ],
        [
            [0, 1],
            [0, 1],
            [1, 1],
        ],
    ],
    s: [
        [
            [0, 1, 1],
            [1, 1, 0],
        ],
        [
            [1, 0],
            [1, 1],
            [0, 1],
        ],
    ],
    z: [
        [
            [1, 1, 0],
            [0, 1, 1],
        ],
        [
            [0, 1],
            [1, 1],
            [1, 0],
        ],
    ],
    i: [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
    t: [
        [
            [0, 1, 0],
            [1, 1, 1],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 0],
        ],
        [
            [1, 1, 1],
            [0, 1, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [0, 1],
        ],
    ],
};

let lines, score, speed, level, highScore, timerId, gameField, prevGameField, nextField;
let timerSpeed = 700;// - speed * 50;
let pauseStatus = false;
let blockMove = false;

let currentFigure = createFigure();
let nextFigure = createFigure();

function randomColor(){return Math.floor(20 + Math.random() * 230)};
function randomFigure(){return figureNames[Math.floor(Math.random() * 7)]};

function startGame(){
    startAudio.play();
    gameField = [];
    nextField = [];
    prevGameField = [];
    if(localStorage.tetrisHighScore){
        highScore = JSON.parse(localStorage.getItem("tetrisHighScore"));
    }
    highScoreField.innerText = highScore.toString().padStart(9, "0")
    lines = 0;
    score = 0;
    speed = 0;
    level = 0;
    pauseButton.disabled = false;
    createField();
    createNextField();
    drawFigure(currentFigure);
    drawNextFigure(nextFigure);
    linesField.innerText = lines.toString().padStart(6, "0");
    scoreField.innerText = score.toString().padStart(9, "0");
    speedField.innerText = speed;
    levelField.innerText = level;
    document.addEventListener("keydown", keyHandler);
    timerId = setInterval(moveDown, timerSpeed);
    startButton.disabled = true;
}

function gameOver(){
    gameOverAudio.play();
    clearInterval(timerId);
    document.removeEventListener("keydown", keyHandler);
    pauseButton.disabled = true;
    startButton.disabled = false;
    console.log("GAME OVER");
    if(parseInt(score) > parseInt(highScore)){
        localStorage.setItem("tetrisHighScore", JSON.stringify(score));
    }
}

function createNextField(){
    nextWrapper.replaceChildren();
    for(let i = 0; i < 4; i++){
        nextField[i] = [];
        for(let j = 0; j < 4; j++){
            const cell = document.createElement("div");
            cell.className = "cell";
            nextField[i][j] = cell;
            nextWrapper.append(cell);
        }
    }
}

function drawNextFigure(nextFigure){
    for(let i = 0; i < nextFigure.type[0].length; i++){
        for(let j = 0; j < nextFigure.type[0][0].length; j++){
            if(nextFigure.type[0][i][j] === 1){
                nextField[i][j].style.backgroundColor = `rgb(${nextFigure.color})`;
                nextField[i][j].classList.add("figure");
            }
        }
    }
}

function createField() {
    fieldWrapper.replaceChildren();
    if(prevGameField.length === 0){
        for (let i = 0; i < fieldRows; i++) {
            gameField[i] = [];
            for (let j = 0; j < fieldCols; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.data = 0;
                // cell.innerText = cell.data; //--------
                gameField[i][j] = cell;
                fieldWrapper.append(cell);
            }
        }
    }
    else if (prevGameField.length > 0) {
        for (let i = 0; i < fieldRows; i++) {
            gameField[i] = [];
            for (let j = 0; j < fieldCols; j++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.data = 0;
                if(prevGameField[i][j].stop === true){
                    cell.data = 1;
                    cell.stop = true;
                    cell.style.backgroundColor = `${prevGameField[i][j].color}`;
                    cell.classList.add("figure");
                }
                // cell.innerText = cell.data; //--------
                gameField[i][j] = cell;
                fieldWrapper.append(cell);
            }
        }
    }
}

function createFigure(){
    const figure = {
        x: 4,
        y: 0,
        type: figures[randomFigure()],
        rotate: 0,
        color: [randomColor(), randomColor(), randomColor()],
    };
    return figure;
}

function drawFigure(currentFigure) {
console.log(`draw figure ${currentFigure.color}`);
    const figure = currentFigure.type[currentFigure.rotate];
    const height = figure.length;
    const width = figure[0].length;
    
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const currentCell = gameField[i + currentFigure.y][j + currentFigure.x];

            if(gameField[i + currentFigure.y] && gameField[j + currentFigure.x] && figure[i][j] === 1){
                if (currentCell.stop) {
                    gameOver();
                    return;
                }
                // console.log("i am draw");
                currentCell.data = figure[i][j];
                currentCell.style.backgroundColor = `rgb(${currentFigure.color})`;
                currentCell.classList.add("figure");
                // currentCell.innerText = currentCell.data; //----------
            }
        }
    }
}

function stepFieldUpdate(){
    if(blockMove) return;
    console.log("step update");
    createField();
    drawFigure(currentFigure);
}

function fullFieldUpdate(){
    if(blockMove) return;
    console.log("full update");
    prevGameField = Array.from(gameField);
    createField();

    currentFigure = nextFigure;
    drawFigure(currentFigure);

    nextFigure = createFigure();
    createNextField();
    drawNextFigure(nextFigure);
}

function keyHandler(e){
    console.log(e);
    switch (e.key) {
        case "ArrowLeft":
            moveAudio.play();
            moveLeft();
            break;
        case "ArrowRight":
            moveAudio.play();
            moveRight();
            break;
        case "ArrowDown":
            moveAudio.play();
            moveDown();
            break;
        case "ArrowUp":
            rotateAudio.play();
            rotate();
            break;
        case " ":
            fallDown();
            break;

        default:
            break;
    }
}

function moveLeft(){
    if(currentFigure.x !== 0 && checkNextStep("left")){
        currentFigure.x -= 1;
        stepFieldUpdate();
    }
}
function moveRight() {
    if (currentFigure.x < (fieldCols - currentFigure.type[currentFigure.rotate][0].length) && checkNextStep("right")) {
        currentFigure.x += 1;
        stepFieldUpdate();
    }
}
function moveDown() {
    if (currentFigure.y < fieldRows - currentFigure.type[currentFigure.rotate].length && checkNextStep("down")) {
        currentFigure.y += 1;
        stepFieldUpdate();
    }
    else{
        if(!blockMove){
            putAudio.play();
            stopPosition();
            checkFullRows();
        }
    }
}
function rotate(){
    const prevRotatePosition = currentFigure.rotate;

    currentFigure.type[currentFigure.rotate + 1] ? currentFigure.rotate += 1 : currentFigure.rotate = 0;
    
    if(currentFigure.x > (fieldCols - currentFigure.type[currentFigure.rotate][0].length)){
        do {
            currentFigure.x -= 1;
        } while (currentFigure.x > (fieldCols - currentFigure.type[currentFigure.rotate][0].length));
    }
    if(currentFigure.y > (fieldRows - currentFigure.type[currentFigure.rotate].length)){
        do {
            currentFigure.y -= 1;
        } while (currentFigure.y > (fieldRows - currentFigure.type[currentFigure.rotate].length));
    }
    if (!checkNextStep("rotate")) {
        currentFigure.rotate = prevRotatePosition;
        return;
    }
    stepFieldUpdate();
}
function fallDown() {
    console.log("fall down");
    while(currentFigure.y < fieldRows - currentFigure.type[currentFigure.rotate].length && checkNextStep("down")) {
        currentFigure.y += 1;
        console.log("---");
        stepFieldUpdate();
    }
    if(!blockMove){
        stopPosition();
        checkFullRows();
    }
}

function stopPosition(){
    console.log("stop position");
    for(let i = 0; i < fieldRows; i++){
        for(let j = 0; j < fieldCols; j++){
            if(gameField[i][j].data === 1){
                gameField[i][j].stop = true;
                const style = getComputedStyle(gameField[i][j]);
                gameField[i][j].color = style.backgroundColor;
            }
        }
    }
}

function checkNextStep(move = "down"){
    let count = [];
    switch (move) {
        case "down":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y + 1][j + currentFigure.x].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every(el => el === 1) ? true : false;

        case "right":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x + 1].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        case "left":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x - 1].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        case "rotate":
            for(let i = 0; i < currentFigure.type[currentFigure.rotate].length; i++){
                for(let j = 0; j < currentFigure.type[currentFigure.rotate][0].length; j++){
                    if(currentFigure.type[currentFigure.rotate][i][j] === 0) continue;
                    if(currentFigure.type[currentFigure.rotate][i][j] === 1 && gameField[i + currentFigure.y][j + currentFigure.x].stop !== true){
                        count.push(1);
                    }
                    else{
                        count.push(0);
                    }
                }
            }
            return count.every((el) => el === 1) ? true : false;

        default: return false;
    }
}

function checkFullRows(){
    console.log("check rows");
    let deletedRowsQty = 0;
    let deletedRows = [];
    for(let i = 0; i < fieldRows; i++){
        if(gameField[i].every(cell => cell.data === 1)){
            blockMove = true;
            deletedRowsQty += 1;
            deletedRows.push(i);
            deleteRow(gameField[i]);
        }
    }
    if(deletedRowsQty === 0){
        fullFieldUpdate();
    }
    else{
        scoreCount(deletedRowsQty);
        replaceRows(deletedRows);
    }
}

function scoreCount(count){
    switch (count) {
        case 1:
            lines += 1;
            score += 100;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 2:
            lines += 2;
            score += 300;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 3:
            lines += 3;
            score += 600;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        case 4:
            lines += 4;
            score += 1000;
            linesField.innerText = lines.toString().padStart(6, "0");
            scoreField.innerText = score.toString().padStart(9, "0");
            break;
        default: return;
    }
}

function deleteRow(row){
    console.log("delete row");
    deleteAudio.play();
    row.forEach((cell) => {
            cell.stop = false;
            cell.classList.add("deleted");
    });
}

function replaceRows(rows){
    setTimeout(() => {
        for(let i = 0; i < rows.length; i++){
            for(let j = 0; j < fieldRows; j++){
                if(j === rows[i]){
                    gameField.splice(j, 1);
                    gameField.unshift(createNewLine());
                    break;
                }
            }
        }
        console.log("replace rows");
        blockMove = false;
        fullFieldUpdate();
        
    }, 220);
}

function createNewLine(){
    let line = [];
    for(let i = 0; i < fieldCols; i++){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.data = 0;
        cell.innerText = cell.data; //------
        line.push(cell);
    }
    return line;
}