const words = [
    'REACT',
    'JAVASCRIPT',
    'TYPESCRIPT',
    'NEXTJS',
    'TAILWIND',
    'NODEJS',
    'EXPRESS',
    'VUE',
    'ANGULAR',
    'WEBPACK',
    'BABEL',
    'JEST',
    'REDUX',
    'MONGODB',
    'POSTGRES',
    'GRAPHQL',
    'SASS',
    'WEBPACK',
    'ELECTRON',
    'JQUERY'
];

        const maxGuesses = 6;
        const timeLimit = 60;

        let word = '';
        let guessedLetters = [];
        let remainingGuesses = maxGuesses;
        let gameStatus = 'playing';
        let timeLeft = timeLimit;
        let score = parseInt(localStorage.getItem('hangmanScore')) || 0;
        let highScore = parseInt(localStorage.getItem('hangmanHighScore')) || 0;
        let backgroundColor = '#4a9af5';
        let timer = null;

        const wordElement = document.getElementById('word');
        const lettersElement = document.getElementById('letters');
        const hangmanElement = document.getElementById('hangman');
        const timeElement = document.getElementById('time');
        const scoreElement = document.getElementById('score');
        const resultElement = document.getElementById('result');
        const playAgainButton = document.getElementById('play-again');
        const remainingGuessesElement = document.getElementById('remaining-guesses');
        const tipButton = document.getElementById('tip-button');
        const tipContent = document.getElementById('tip')


        tipButton.addEventListener('click', ()=>{
            tipContent.classList.remove('hidden');
            tipButton.classList.add('hidden')
        })




        function initGame() {
            word = words[Math.floor(Math.random() * words.length)];
            guessedLetters = [];
            remainingGuesses = maxGuesses;
            gameStatus = 'playing';
            timeLeft = timeLimit;
            backgroundColor = '#4a9af5';
            
            
            if (timer) {
                clearInterval(timer);
            }
            
            updateDisplay();
            generateLetterButtons();
            updateHangman();
            updateRemainingGuesses();
            startTimer();
        }

        function updateDisplay() {
            wordElement.innerHTML = word
                .split('')
                .map(letter => guessedLetters.includes(letter) ? letter : '_')
                .join(' ');
            timeElement.textContent = `Time: ${formatTime(timeLeft)}`;
            scoreElement.textContent = `Score: ${score} | High Score: ${highScore}`;
            document.body.style.backgroundColor = backgroundColor;
            // resultElement.textContent = '';
            // playAgainButton.classList.add('hidden');
        }

        document.addEventListener('keydown', (event) => {
    const letter = event.key.toUpperCase();

    if (letter >= 'A' && letter <= 'Z' &&
        gameStatus === 'playing' &&
        !guessedLetters.includes(letter)) { 
        guessLetter(letter);
    }
});


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
            if (gameStatus !== 'playing' || guessedLetters.includes(letter)) return;
            
            guessedLetters.push(letter);
            
            if (!word.includes(letter)) {
                remainingGuesses--;
                updateRemainingGuesses();
                backgroundColor = `hsl(${Math.random() * 60 + 300}, 70%, 60%)`;
                playSound(330); // Incorrect guess
            } else {
                backgroundColor = `hsl(${Math.random() * 60 + 90}, 70%, 60%)`;
                playSound(523.25); // Correct guess
            }
            
            updateDisplay();
            updateHangman();
            generateLetterButtons();
            checkGameStatus();
        }

        function updateRemainingGuesses() {
            remainingGuessesElement.textContent = `Turns left: ${remainingGuesses}`;
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        function updateHangman() {
            const wrongGuesses = maxGuesses - remainingGuesses;
            const parts = [];
            
            if (wrongGuesses >= 1) parts.push(`<circle cx="50" cy="25" r="8" fill="none" stroke="#333" stroke-width="2"/>`); // Head
            if (wrongGuesses >= 2) parts.push(`<line x1="50" y1="33" x2="50" y2="70" stroke="#333" stroke-width="2"/>`); // Body
            if (wrongGuesses >= 3) parts.push(`<line x1="50" y1="45" x2="35" y2="55" stroke="#333" stroke-width="2"/>`); // Left arm
            if (wrongGuesses >= 4) parts.push(`<line x1="50" y1="45" x2="65" y2="55" stroke="#333" stroke-width="2"/>`); // Right arm
            if (wrongGuesses >= 5) parts.push(`<line x1="50" y1="70" x2="35" y2="85" stroke="#333" stroke-width="2"/>`); // Left leg
            if (wrongGuesses >= 6) parts.push(`<line x1="50" y1="70" x2="65" y2="85" stroke="#333" stroke-width="2"/>`); // Right leg
            
            hangmanElement.innerHTML = `
                <svg viewBox="0 0 100 100">
                    <!-- Gallows -->
                    <line x1="10" y1="90" x2="70" y2="90" stroke="#8B4513" stroke-width="4"/>
                    <line x1="20" y1="90" x2="20" y2="10" stroke="#8B4513" stroke-width="4"/>
                    <line x1="20" y1="10" x2="50" y2="10" stroke="#8B4513" stroke-width="4"/>
                    <line x1="50" y1="10" x2="50" y2="17" stroke="#8B4513" stroke-width="4"/>
                    
                    <!-- Person parts -->
                    ${parts.join('')}
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
                    localStorage.setItem('hangmanHighScore', highScore);
                }
                localStorage.setItem('hangmanScore', score);
                playSound([523.25, 659.25, 783.99]); // Victory chord
                resultElement.textContent = '🎉 Congratulations! You won! 🎉';
                console.log("completed");
                playAgainButton.classList.remove('hidden');
                backgroundColor = '#28a745'; // Green for victory
                document.body.style.backgroundColor = backgroundColor;
                if (timer) clearInterval(timer);
            } else if (remainingGuesses === 0 || timeLeft <= 0) {
                gameStatus = 'lost';
                score = 0;
                localStorage.setItem('hangmanScore', score);
                playSound([220, 196, 174]); // Defeat chord
                resultElement.textContent = `💀 Game Over! The word was "${word}" 💀`;
                playAgainButton.classList.remove('hidden');
                backgroundColor = '#dc3545'; // Red for defeat
                document.body.style.backgroundColor = backgroundColor;
                if (timer) clearInterval(timer);
            }
            
            updateDisplay();
        }

        function playSound(frequencies) {
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                
                if (Array.isArray(frequencies)) {
                    // Play chord
                    frequencies.forEach((freq, index) => {
                        const oscillator = context.createOscillator();
                        const gainNode = context.createGain();
                        
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(freq, context.currentTime);
                        oscillator.connect(gainNode);
                        gainNode.connect(context.destination);
                        gainNode.gain.setValueAtTime(0.1, context.currentTime);
                        
                        oscillator.start(context.currentTime + index * 0.1);
                        oscillator.stop(context.currentTime + 0.3 + index * 0.1);
                    });
                } else {
                    // Play single note
                    const oscillator = context.createOscillator();
                    const gainNode = context.createGain();
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(frequencies, context.currentTime);
                    oscillator.connect(gainNode);
                    gainNode.connect(context.destination);
                    gainNode.gain.setValueAtTime(0.1, context.currentTime);
                    
                    oscillator.start();
                    oscillator.stop(context.currentTime + 0.2);
                }
            } catch (error) {
                console.log('Audio not supported');
            }
        }

        function startTimer() {
            timer = setInterval(() => {
                if (gameStatus !== 'playing') {
                    clearInterval(timer);
                } else if (timeLeft > 0) {
                    timeLeft--;
                    timeElement.textContent = `Time: ${formatTime(timeLeft)}`;
                } else {
                    timeLeft = 0;
                    checkGameStatus();
                }
            }, 1000);
        }

        // Event listeners
        playAgainButton.addEventListener('click', initGame);

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            const letter = event.key.toUpperCase();
            if (letter >= 'A' && letter <= 'Z' && gameStatus === 'playing') {
                guessLetter(letter);
            }
        });

        playAgainButton.addEventListener('click',()=> {initGame()});

        // Initialize game
        
        initGame();