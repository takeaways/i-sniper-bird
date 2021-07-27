const score = document.querySelector(".score");
const startBtn = document.querySelector(".startBtn");
const gameArea = document.querySelector(".gameArea");
const gameMessage = document.querySelector(".gameMessage");

startBtn.addEventListener("click", start);
gameMessage.addEventListener("click", () => {
  location.reload();
});
document.addEventListener("keydown", pressOn);
document.addEventListener("keyup", pressOff);

let keys = {};
let player = {
  x: 0,
  y: 0,
  speed: 2,
  score: 0,
  play: false,
};

const pipe = {
  startPos: 0,
  spaceBetweenRow: 0,
  spaceBetweenCol: 0,
  pipeCount: 0,
};

class Bird {
  constructor() {
    this.bird = document.createElement("div");
    this.wing = document.createElement("div");
    this.bird.setAttribute("class", "bird");
    this.wing.setAttribute("class", "wing");
    this.wing.pos = 15;
    this.wing.top = this.wing.pos + "px";
    this.bird.appendChild(this.wing);
  }
}
let { bird, wing } = new Bird();

function start() {
  let newBird = new Bird();
  bird = newBird.bird;
  wing = newBird.wing;

  player.play = true;
  player.score = 0;

  gameMessage.classList.add("hide");
  startBtn.classList.add("hide");

  gameArea.appendChild(bird);

  player.x = bird.offsetLeft;
  player.y = bird.offsetTop;

  pipe.startPos = 0;
  pipe.spaceBetweenRow = 400;
  pipe.pipeCount = Math.floor(gameArea.offsetWidth / pipe.spaceBetweenRow);

  for (let i = 0; i < pipe.pipeCount; i++) {
    makePipe(pipe.startPos * pipe.spaceBetweenRow);
    pipe.startPos++;
  }

  requestAnimationFrame(playGame);
}

function makePipe(pipePos) {
  let totalHeight = gameArea.offsetHeight;
  let totalWidth = gameArea.offsetWidth;
  let pipeUp = document.createElement("div");
  pipeUp.classList.add("pipe");
  pipeUp.height = Math.floor(Math.random() * 350);
  pipeUp.style.height = pipeUp.height + "px";
  pipeUp.style.left = totalWidth + pipePos + "px";
  pipeUp.x = totalWidth + pipePos;
  pipeUp.style.top = "0px";
  pipeUp.style.backgroundColor = "red";

  gameArea.appendChild(pipeUp);

  pipe.spaceBetweenCol = Math.floor(Math.random() * 250) + 150;

  let pipeDown = document.createElement("div");
  pipeDown.classList.add("pipe");
  pipeDown.style.height =
    totalHeight - (pipeUp.height + pipe.spaceBetweenCol) + "px";
  pipeDown.style.left = totalWidth + pipePos + "px";
  pipeDown.x = totalWidth + pipePos;
  pipeDown.style.bottom = "0px";
  pipeDown.style.backgroundColor = "black";

  gameArea.appendChild(pipeDown);
}

function playGame() {
  if (!player.play) {
    return;
  }
  let move = false;
  movePipe();

  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
    move = true;
  }
  if (keys.ArrowRight && player.x < gameArea.offsetWidth - bird.offsetWidth) {
    player.x += player.speed;
    move = true;
  }
  if ((keys.ArrowUp || keys.Space) && player.y > 0) {
    player.y -= player.speed * 5;
    move = true;
  }
  if (keys.ArrowDown && player.y < gameArea.offsetHeight - bird.offsetHeight) {
    player.y += player.speed;
    move = true;
  }

  if (move) {
    wing.pos = wing.pos === 15 ? 25 : 15;
    wing.style.top = wing.pos + "px";
  }

  player.y += player.speed * 2;
  if (player.y > gameArea.offsetHeight) {
    gameOver();
  }

  bird.style.left = player.x + "px";
  bird.style.top = player.y + "px";
  requestAnimationFrame(playGame);
  player.score++;
  score.innerText = "SCORE : " + player.score;
}

function movePipe() {
  let pipes = document.querySelectorAll(".pipe");
  let counter = 0;

  pipes.forEach(function (item) {
    item.x -= player.speed;
    item.style.left = item.x + "px";
    if (item.x < 0) {
      item.parentElement.removeChild(item);
      counter++;
    }

    if (isCollide(item, bird)) {
      gameOver();
    }
  });

  for (let i = 0; i < counter / 2; i++) {
    makePipe(0);
  }
}

function isCollide(pipe, bird) {
  let pipeRect = pipe.getBoundingClientRect();
  let birdRect = bird.getBoundingClientRect();

  return (
    pipeRect.bottom > birdRect.top &&
    pipeRect.top < birdRect.bottom &&
    pipeRect.left < birdRect.right &&
    pipeRect.right > birdRect.left
  );
}

function gameOver() {
  player.play = false;
  gameMessage.classList.remove("hide");
  gameMessage.innerHTML = `
    Game Over <br/> Score : ${player.score}<br/>
  `;
}

function pressOn(evt) {
  const { code } = evt;
  keys[code] = true;
}

function pressOff(evt) {
  const { code } = evt;
  keys[code] = false;
}
