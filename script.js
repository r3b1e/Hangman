const words = ['REACT', 'JAVASCRIPT', 'TYPESCRIPT', 'NEXTJS', 'TAILWIND'];
const maxGuesses = 6;
const timeLimit = 60;

let word = '';
let guessedLetters = [];
let remainingGuesses = maxGuesses;
let gameStatus = 'playing';
let timeLeft = timeLimit;
let score = 0;
let highScore = 0;
let backgroundColor = '#4a9af5';

const wordElement = document.getElementById('word');
const lettersElement = document.getElementById('letters');
const hangmanElement = document.getElementById('hangman');
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const resultElement = document.getElementById('result');
const playAgainButton = document.getElementById('play-again');
const remainingGuessesElement = document.getElementById('remaining-guesses');

function initGame() {
    word = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remainingGuesses = maxGuesses;
    gameStatus = 'playing';
    timeLeft = timeLimit;
    backgroundColor = '#4a9af5';
    updateDisplay();
    generateLetterButtons();
    updateHangman();
    updateRemainingGuesses();
    updateHangmanImage();
}

function updateDisplay() {
    wordElement.innerHTML = word
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
    timeElement.textContent = `Time: ${formatTime(timeLeft)}`;
    scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
    document.body.style.backgroundColor = backgroundColor;
    resultElement.textContent = '';
    playAgainButton.classList.add('hidden');
}

function generateLetterButtons() {
    lettersElement.innerHTML = '';
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.classList.add('letter-button');
        button.disabled = guessedLetters.includes(letter) || gameStatus !== 'playing';
        button.addEventListener('click', () => guessLetter(letter));
        lettersElement.appendChild(button);
    });
}

function guessLetter(letter) {
    if (gameStatus !== 'playing') return;
    
    guessedLetters.push(letter);
    
    if (!word.includes(letter)) {
        remainingGuesses--;
        updateRemainingGuesses();
        updateHangmanImage();
        backgroundColor = `hsl(${Math.random() * 360}, 70%, 80%)`;
        playSound(330); // Incorrect guess
    } else {
        playSound(523.25); // Correct guess
    }
    
    updateDisplay();
    updateHangman();
    checkGameStatus();
}

function updateRemainingGuesses() {
    remainingGuessesElement.textContent = `Turns left: ${remainingGuesses}`;
}

function updateHangmanImage() {
    const imageNumber = maxGuesses - remainingGuesses;
    hangmanElement.innerHTML = `<img src="hangman${imageNumber}.png" alt="Hangman ${imageNumber}" />`;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateHangman() {
    const parts = [
        `<circle cx="50" cy="25" r="10" />`,
        `<line x1="50" y1="35" x2="50" y2="70" />`,
        `<line x1="50" y1="45" x2="30" y2="55" />`,
        `<line x1="50" y1="45" x2="70" y2="55" />`,
        `<line x1="50" y1="70" x2="30" y2="90" />`,
        `<line x1="50" y1="70" x2="70" y2="90" />`
    ];
    hangmanElement.innerHTML = `
        <svg viewBox="0 0 100 100" class="stroke-current text-gray-800 stroke-2 fill-none">
            <line x1="10" y1="95" x2="90" y2="95" />
            <line x1="30" y1="95" x2="30" y2="5" />
            <line x1="30" y1="5" x2="50" y2="5" />
            <line x1="50" y1="5" x2="50" y2="15" />
            ${parts.slice(0, maxGuesses - remainingGuesses).join('')}
        </svg>
    `;
}

function checkGameStatus() {
    const allLettersGuessed = word.split('').every(letter => guessedLetters.includes(letter));
    if (allLettersGuessed) {
        gameStatus = 'won';
        score++;
        if (score > highScore) {
            highScore = score;
        }
        playSound(440);
        resultElement.textContent = 'Congratulations! You won!';
        playAgainButton.classList.remove('hidden');
    } else if (remainingGuesses === 0) {
        gameStatus = 'lost';
        score = 0;
        playSound(220);
        resultElement.textContent = `Game Over! The word was ${word}`;
        playAgainButton.classList.remove('hidden');
    }
}

function playSound(frequency) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
}

function startTimer() {
    const timer = setInterval(() => {
        if (gameStatus !== 'playing') {
            clearInterval(timer);
        } else if (timeLeft > 0) {
            timeLeft--;
            timeElement.textContent = `Time left: ${timeLeft}s`;
        } else {
            gameStatus = 'lost';
            checkGameStatus();
            clearInterval(timer);
        }
    }, 1000);
}

playAgainButton.addEventListener('click', initGame);

initGame();
startTimer();
