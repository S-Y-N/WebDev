/*const game elements*/
const canvas = document.getElementById('game-canvas');
const gameContainer = document.getElementById('game-container');

//buttons
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');



let reqID;
let time = null;
let stoppedAt = 0;
/*getContext - повертає 2д контекст графіки */
const context = canvas.getContext("2d");
const flappyImg = new Image();
flappyImg.src = 'assets/img/player.png';

//score vars
let curr_score = document.getElementById('current-score');
let score = 0;
let bestScore = 0;

//Змінна для перевірки, коли плеєр проходить через труби і додавати +1 до рахунку
let scored = false;
let isPaused = false;

//Game consts
const FLAPPY_SPEED = -3;
const FLAPPY_WIDTH = 40;
const FLAPPY_HEIGHT = 30;
const PIPE_WIDTH = 70;
const PIPE_GAP = 140;

//Flappy vars
let flappyX = 50;
let flappyY = 50;
let flappyVelocity = 0;
let flappyAccelaration = 0.1;

//Pipe vars
let pipeX = 400;
let pipeY = canvas.hight - 200;

//управління плеєром при натискані на пробіл
document.body.onkeyup = function (e) {
    if (e.code == 'Space') {
        flappyVelocity = FLAPPY_SPEED;
    }
}
document.getElementById('restart-btn').addEventListener('click', function () {
    hideMenu();
    reset();
    loop();
})


playButton.addEventListener('click', () => {
    reqID = requestAnimationFrame(loop);
})


pauseButton.addEventListener('click', () => {
    stopAnimation();
})


function stopAnimation() {
    window.cancelAnimationFrame(reqID);
    stoppedAt = window.performance.now();
}
//функція колізій гравця і труб
function collisionCheck() {
    //стартові координати та розміри плеєра
    const flappyBox = {
        x: flappyX,
        y: flappyY,
        width: FLAPPY_WIDTH,
        height: FLAPPY_HEIGHT
    }

    //стартові координати труб
    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + FLAPPY_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + FLAPPY_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Чек колізії для верхньої труби
    if (flappyBox.x + flappyBox.width > topPipeBox.x &&
        flappyBox.x < topPipeBox.x + topPipeBox.width &&
        flappyBox.y < topPipeBox.y) {
        return true;
    }

    // чек колізії для нижньої труби
    if (flappyBox.x + flappyBox.width > bottomPipeBox.x &&
        flappyBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        flappyBox.y + flappyBox.height > bottomPipeBox.y) {
        return true;
    }

    // перевірка чи плеєр торкається меж рамки, ниже 0 чи вище рамки,
    //то змінити флаг ->true і закінчити гру
    if (flappyY < 0 || flappyY + FLAPPY_HEIGHT > canvas.height) {
        return true;
    }
    //якщо все ОК - продовжуємо
    return false;
}

//збільшення рахунку
function increaseScore() {
    //логіка така: якщо координати плеєра по осі Х більші за координати труби (pipiX-=2кожну 1мс)
    //і плеєр знаходиться вище чи координат труби(2 труби) по осі У
    //+1 до лічильника
    if (flappyX > pipeX + PIPE_WIDTH &&
        (flappyY < pipeY + PIPE_GAP ||
            flappyY + FLAPPY_HEIGHT > pipeY + PIPE_GAP) && !scored) {
        score++;
        curr_score.innerHTML = score;
        scored = true;
    }
    //коли пройшли трубу - координати її знову дефолт (400) - скинути флаг
    if (flappyX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}
//приховати меню
function hideMenu() {
    document.getElementById('menu').style.display = 'none';
    gameContainer.classList.remove('blur');
}

//показати меню
function showMenu() {
    document.getElementById('menu').style.display = 'block';
    gameContainer.classList.add('blur');
    document.getElementById('score').innerHTML = score;

    if (bestScore < score) {
        bestScore = score;
    }
    document.getElementById('best-score').innerHTML = bestScore;
}

//скидання до дефолтних налаштувань
//!не ставити значення 0 - так не зможе відбувати розрахунок проходження через труби і не буде працювать лічильник
function reset() {
    flappyX = 50;
    flappyY = 50;

    flappyVelocity = 0;
    flappyAccelaration = 0.1;
    pipeX = 400;
    pipeY = canvas.height - 200;
    document.getElementById('current-score').innerHTML = 0;
    score = 0;
}

//Кінець гри
function gameOver() {
    showMenu();
}

//Основна функція механіки гри
function loop(timestamp) {
    /*clearRect() - задає чорний прозорий колір для всього контекста в заданому прямокутнику*/
    //обнулити контекст після кожної ітерації
    if (time === null) {
        time = timestamp;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    //малюємо плеєра і розміщуємо його на стартовий координатах
    context.drawImage(flappyImg, flappyX, flappyY);

    //колір заливки прямокутників(труб)
    context.fillStyle = '#2B2B2B';
    //малюємо 2 прямокутника по заданим координатам і певних розмірів
    context.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    context.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    //додавання колізій (умовні рамки плеєра та труб, якщо їх координати стикаються = scored = true-> кінець гри)
    if (collisionCheck()) {
        gameOver();
        return;
    }

    //рух труб задається їхнім зміщенням по осі Х
    pipeX -= 2;

    //якщо труба виходить за рамку - скинуть трубу ( розмір труби 70px)
    //поставить її в дефолтне положення по осі Х та дати рандомну довжину
    if (pipeX <= -70) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    flappyVelocity += flappyAccelaration;
    flappyY += flappyVelocity;
    increaseScore();
    //функція просить браузер перемелювати картинку(анімацію кожні 1мс), тобто ми зациклюємов виклик ф-ції loop

    reqID = requestAnimationFrame(loop);
}
loop();