// ===== SELECT ELEMENTS =====
const boxes = document.querySelectorAll(".box");
const resetBtn = document.getElementById("reset-btn");
const newBtn = document.getElementById("new-btn");
const msgContainer = document.querySelector(".msg-container");
const msg = document.getElementById("msg");
const winningLine = document.getElementById("winning-line");

const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");

let scoreX = 0;
let scoreO = 0;

let gameOver = false;

// ===== WIN PATTERNS =====
const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

// ===== PLAYER CLICK (X) =====
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "" || gameOver) return;

    box.innerText = "X";
    animatePop(box);

    checkWinner();

    if (!gameOver) {
      setTimeout(aiMove, 500);
    }
  });
});

// ===== POP ANIMATION =====
function animatePop(box) {
  box.classList.remove("pop");
  void box.offsetWidth;
  box.classList.add("pop");
}

// ===== AI MOVE (Random) =====
function aiMove() {
  let emptyBoxes = [];

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      emptyBoxes.push(index);
    }
  });

  if (emptyBoxes.length === 0) return;

  let randomIndex =
    emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];

  boxes[randomIndex].innerText = "O";
  animatePop(boxes[randomIndex]);

  checkWinner();
}

// ===== CHECK WINNER =====
function checkWinner() {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[a].innerText === boxes[c].innerText
    ) {
      highlightWinner(a, b, c);
      showWinningLine(pattern);
      showWinner(boxes[a].innerText);
      gameOver = true;
      return;
    }
  }

  // Check Draw
  let filled = true;
  boxes.forEach(box => {
    if (box.innerText === "") filled = false;
  });

  if (filled && !gameOver) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    gameOver = true;
  }
}

// ===== HIGHLIGHT WINNING BOXES =====
function highlightWinner(a, b, c) {
  boxes[a].classList.add("win");
  boxes[b].classList.add("win");
  boxes[c].classList.add("win");
}

// ===== SHOW WINNER =====
function showWinner(winner) {
  if (winner === "X") {
    scoreX++;
    scoreXEl.innerText = scoreX;
  } else {
    scoreO++;
    scoreOEl.innerText = scoreO;
  }

  msg.innerText = `Congratulations! ${winner} Wins 🎉`;
  msgContainer.classList.remove("hide");

  launchConfetti();
}

// ===== RESET GAME =====
function resetGame() {
  gameOver = false;

  boxes.forEach(box => {
    box.innerText = "";
    box.classList.remove("win");
  });

  msgContainer.classList.add("hide");

  winningLine.style.width = "0";
}

// ===== BUTTON EVENTS =====
resetBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);

// ===== WINNING LINE ANIMATION =====
function showWinningLine(pattern) {
  const positions = {
    "0,1,2": { top: "16%", left: "0%", width: "100%", rotate: "0deg" },
    "3,4,5": { top: "50%", left: "0%", width: "100%", rotate: "0deg" },
    "6,7,8": { top: "84%", left: "0%", width: "100%", rotate: "0deg" },

    "0,3,6": { top: "0%", left: "16%", width: "100%", rotate: "90deg" },
    "1,4,7": { top: "0%", left: "50%", width: "100%", rotate: "90deg" },
    "2,5,8": { top: "0%", left: "84%", width: "100%", rotate: "90deg" },

    "0,4,8": { top: "0%", left: "0%", width: "140%", rotate: "45deg" },
    "2,4,6": { top: "0%", left: "100%", width: "140%", rotate: "-45deg" }
  };

  const key = pattern.toString();
  const pos = positions[key];

  winningLine.style.top = pos.top;
  winningLine.style.left = pos.left;
  winningLine.style.transform = `rotate(${pos.rotate})`;

  setTimeout(() => {
    winningLine.style.width = pos.width;
  }, 50);
}

// ===== CONFETTI EFFECT =====
function launchConfetti() {
  const container = document.getElementById("confetti-container");

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration =
      Math.random() * 2 + 2 + "s";

    container.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}