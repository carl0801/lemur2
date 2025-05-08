
import { auth, getAuth, onAuthStateChanged, getDatabase, db, ref, set, push, onChildAdded, get, onValue} from './firebase-config.js';

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

let bonusFood = null;
let bonusFoodTimer = null;
let bonusFoodOpacity = 0;
let bonusFoodFadeDirection = 1;


// Define high-score-based color schemes
const colorSchemes = [
    { min: 0, max: 200, head: "#4CAF50", body: "#1B5E20", level: 1 },  // Green
    { min: 201, max: 400, head: "#FFEB3B", body: "#111", level: 2 }, // Yellow-Gold
    { min: 401, max: 600, head: "#2196F3", body: "#0D47A1", level: 3 }, // Blue
    { min: 601, max: 800, head: "#FF5722", body: "#BF360C", level: 4 }, // Orange-Red
    { min: 801, max: 1000, head: "#9C27B0", body: "#4A148C", level: 5 }, // Purple
    { min: 1001, max: 1200, head: "#E91E63", body: "#880E4F", level: 6 }, // Pink
    { min: 1201, max: 1400, head: "#00BCD4", body: "#006064", level: 7 }, // Cyan
    { min: 1401, max: 1600, head: "#8BC34A", body: "#33691E", level: 8 }, // Lime Green
    { min: 1601, max: 1800, head: "#F44336", body: "#B71C1C", level: 9 }, // Red
    { min: 1801, max: Infinity, head: "#795548", body: "#3E2723", level: 10 }  // Brown
];

// Function to get the appropriate color scheme based on high score
function getColorScheme(highScore) {
    return colorSchemes.find(scheme => highScore >= scheme.min && highScore <= scheme.max) || colorSchemes[0];
}

// Store selected colors (default to the first scheme)
let selectedColors = colorSchemes[0];
let colorsUpdated = false;

// Listen for auth state changes (user logged in or out)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Get the user's high score from Firebase
        const highScoreRef = ref(db, `users/${user.uid}/gameData/snake/highScore`);

        // Listen for high score updates in real-time
        onValue(highScoreRef, (snapshot) => {
            const highscore = snapshot.val() || 0;
            selectedColors = getColorScheme(highscore);
            console.log("Updated selectedColors based on high score:", selectedColors);
            
            colorsUpdated = true;

        });

    } else {
        console.log("User is not logged in");
    }
});

function spawnBonusFood() {
    bonusFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    bonusFoodOpacity = 0;
    bonusFoodFadeDirection = 1;

    // Avoid spawning on top of regular food or snake
    if ((bonusFood.x === food.x && bonusFood.y === food.y) ||
        snake.some(seg => seg.x === bonusFood.x && seg.y === bonusFood.y)) {
        spawnBonusFood();
        return;
    }

    // Remove after 3 seconds
    bonusFoodTimer = setTimeout(() => {
        bonusFood = null;
    }, 3000);
}


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

    // Check if snake ate bonus food
    if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
        score += 30;
        document.getElementById('score').textContent = `Score: ${score}`;
        clearTimeout(bonusFoodTimer);
        bonusFood = null;
    }
    

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? selectedColors.head : selectedColors.body;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    

    // Draw food
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw bonus (blue) food if it exists
    if (bonusFood) {
        bonusFoodOpacity += 0.1 * bonusFoodFadeDirection;
        if (bonusFoodOpacity >= 1) {
            bonusFoodOpacity = 1;
            bonusFoodFadeDirection = -1;
        } else if (bonusFoodOpacity <= 0.2) {
            bonusFoodOpacity = 0.2;
            bonusFoodFadeDirection = 1;
        }
        ctx.fillStyle = `rgba(0, 153, 255, ${bonusFoodOpacity.toFixed(2)})`;
        ctx.fillRect(bonusFood.x * gridSize, bonusFood.y * gridSize, gridSize - 2, gridSize - 2);
    }
    

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

    // 20% chance to spawn bonus food
    if (Math.random() < 0.2) {
        spawnBonusFood();
    }
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
    clearInterval(gameLoop);
    gameStarted = false;
    alert(`Game Over! Score: ${score}`);
    addScore('snake', score);
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

// If the colors are updated, call drawGame
if (colorsUpdated) {
    drawGame();
}


export { };
  
