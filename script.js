let currentLevel = 0;
let score = 0;
let playerName = '';
let avatar = '';
let timerInterval;
let timeLeft = 300; // 5 minutes

const questions = [
  // Easy
  { code: 'print("Hello World"', answer: 'print("Hello World")', output: 'Hello World' },
  { code: 'x = 10\nprint(x', answer: 'x = 10\nprint(x)', output: '10' },
  { code: 'if True\n  print("Yes")', answer: 'if True:\n  print("Yes")', output: 'Yes' },
  { code: 'a = [1, 2, 3\nprint(len(a))', answer: 'a = [1, 2, 3]\nprint(len(a))', output: '3' },
  { code: 'def hi()\n  print("Hi")\nhi()', answer: 'def hi():\n  print("Hi")\nhi()', output: 'Hi' },

  // Medium
  { code: 'for i in range(3)\nprint(i)', answer: 'for i in range(3):\n  print(i)', output: '0\n1\n2' },
  { code: 'x = 5\nif x == 5\nprint("Equal")', answer: 'x = 5\nif x == 5:\n  print("Equal")', output: 'Equal' },
  { code: 'name = "Sam"\nprint "Hi", name', answer: 'name = "Sam"\nprint("Hi", name)', output: 'Hi Sam' },
  { code: 'x = [1,2,3\nprint(x[1])', answer: 'x = [1,2,3]\nprint(x[1])', output: '2' },
  { code: 'def add(a, b)\nreturn a + b\nprint(add(2,3))', answer: 'def add(a, b):\n  return a + b\nprint(add(2,3))', output: '5' },

  // Hard
  { code: 'try\n  print(1/0)\nexcept ZeroDivisionError\nprint("Error")', answer: 'try:\n  print(1/0)\nexcept ZeroDivisionError:\n  print("Error")', output: 'Error' },
  { code: 'd = {"a": 1, "b": 2\nprint(d["b"])', answer: 'd = {"a": 1, "b": 2}\nprint(d["b"])', output: '2' },
  { code: 'class Cat\n  def __init__(self):\n    self.name = "Kitty"\nc = Cat()\nprint(c.name)', answer: 'class Cat:\n  def __init__(self):\n    self.name = "Kitty"\nc = Cat()\nprint(c.name)', output: 'Kitty' },
  { code: 'import math\nprint math.sqrt(25)', answer: 'import math\nprint(math.sqrt(25))', output: '5.0' },
  { code: 'with open("file.txt", "w"\nfile.write("Done")', answer: 'with open("file.txt", "w") as file:\n  file.write("Done")', output: '' },
];

function startGame() {
  playerName = document.getElementById("username").value.trim();
  avatar = document.getElementById("avatar").value;

  if (playerName === "") {
    alert("Please enter your name!");
    return;
  }

  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  document.getElementById("player-info").textContent = `${avatar} ${playerName}`;
  startTimer();
  monitorTabSwitch();
  loadLevel();
}

function loadLevel() {
  if (currentLevel >= questions.length) {
    endGame();
    return;
  }

  document.getElementById("level").textContent = currentLevel + 1;
  document.getElementById("code-snippet").textContent = questions[currentLevel].code;
  document.getElementById("user-input").value = "";
  document.getElementById("message").textContent = "";
  document.getElementById("output-box").textContent = "";
}

function submitAnswer() {
  const userAns = document.getElementById("user-input").value.trim();
  const correctAns = questions[currentLevel].answer.trim();
  const output = questions[currentLevel].output || '[Output]';

  if (userAns === correctAns) {
    let gain = currentLevel < 5 ? 10 : currentLevel < 10 ? 20 : 30;
    score += gain;
    document.getElementById("score").textContent = score;
    document.getElementById("message").textContent = "✅ Correct!";
    document.getElementById("output-box").textContent = output;
    currentLevel++;
    setTimeout(loadLevel, 2500);
  } else {
    document.getElementById("message").textContent = "❌ Incorrect! Here's the correct answer:";
    document.getElementById("output-box").textContent = `${correctAns}\n\nOutput:\n${output}`;
    currentLevel++;
    setTimeout(loadLevel, 5000);
  }
}

function skipQuestion() {
  currentLevel++;
  document.getElementById("message").textContent = "⏭️ Skipped!";
  setTimeout(loadLevel, 1500);
}

function endGame(tabSwitch = false) {
  clearInterval(timerInterval);
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");

  if (tabSwitch) {
    document.getElementById("final-message").innerHTML = `⚠️ ${avatar} <strong>${playerName}</strong>, you switched tabs!<br>You completed the game with a score of <strong>${score}</strong>.`;
  } else {
    document.getElementById("final-message").innerHTML = `${avatar} <strong>${playerName}</strong>, you got <strong>${score}</strong> points!`;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function monitorTabSwitch() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      endGame(true);
    }
  });

  window.addEventListener("blur", () => {
    endGame(true);
  });
}
