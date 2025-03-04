
import { auth, getAuth, onAuthStateChanged, getDatabase, db, ref, set, push, onChildAdded, get } from './firebase-config.js';

// Add a new score to the scoreboard
function addScore(gameName, score) {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
        window.location.href = "/"; // Redirect to login if not logged in
        }
        else {
            const username = user.displayName || "Anonymous"; // Fallback if displayName is null
            const scoreRef = ref(db, `scoreboard/${gameName}`);
            const newScoreRef = push(scoreRef); // Generates a unique score ID

            const highScoreRef = ref(db, `users/${user.uid}/gameData/${gameName}/highScore`);

            // Check if the current score is higher than the user's highscore
            get(highScoreRef).then((snapshot) => {
                const highscore = snapshot.val();
                if (score > highscore) {
                    set(highScoreRef, score)
                    .then(() => {
                        console.log("Highscore updated successfully!");
                    })
                    .catch((error) => {
                        console.error("Error updating highscore:", error);
                    });
                }
            });
        
            set(newScoreRef, {
                username: username,
                score: score
            })
            .then(() => {
                console.log("Score added successfully!");
            })
            .catch((error) => {
                console.error("Error adding score:", error);
            });
        }
    });
}

document.getElementById("start-button").addEventListener("click", startGame);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let gameStarted = false;

function drawGame() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = `Score: ${score}`;
        generateFood();
    } else {
        snake.pop();
    }

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#388E3C' : '#4CAF50'; // Darker green for head
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });


    // Draw food
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check collision with self
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    
    // Ensure food doesn't spawn on snake
    snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    });
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    document.getElementById('start-button').textContent = 'Restart';
    clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, 100);
}

function gameOver() {
    addScore('snake', score);
    clearInterval(gameLoop);
    gameStarted = false;
    alert(`Game Over! Score: ${score}`);
    document.getElementById('start-button').textContent = 'Start Game';
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 's':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'a':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'd':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// Initial draw
drawGame();


export { };
  
