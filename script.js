// Variabili globali
var canvas;
var context;
var snake;
var food;
var gridSize = 20;
var direction;
var update;
var isPaused = false;
var score = 0;

// Inizializzazione del gioco
function init() {
    canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");

    snake = new Snake();
    food = new Food();
    direction = "right";

    update = setInterval(updateGame, 100); // Aggiorna il gioco ogni 100 millisecondi
    document.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keydown", function(e) {
        if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    });
}

// Funzione di aggiornamento del gioco
function updateGame() {
    if (!isPaused) {
        context.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il canvas

        snake.update(direction);
        snake.draw();

        food.draw();

        // Controllo collisione tra il serpente e il cibo
        if (snake.eat(food)) {
            food.move();
            snake.grow();
            score++; // Incrementa il punteggio
        }

        // Controllo collisione con il corpo del serpente
        if (snake.checkCollision()) {
            gameOver();
        }

        // Aggiorna il conteggio dei punti
        updateScore();
    }
}

// Funzione per aggiornare il conteggio dei punti
function updateScore() {
    var scoreElement = document.getElementById("score");
    scoreElement.innerHTML = "Punteggio: " + score;
}

// Funzione di gestione del cambio direzione
function handleKeyPress(event) {
    var key = event.keyCode;
    if (key === 37 && direction !== "right") { // Freccia sinistra
        direction = "left";
    } else if (key === 38 && direction !== "down") { // Freccia su
        direction = "up";
    } else if (key === 39 && direction !== "left") { // Freccia destra
        direction = "right";
    } else if (key === 40 && direction !== "up") { // Freccia giù
        direction = "down";
    } else if (key === 80) { // Tasto "P"
        togglePause();
    }
}

// Funzione per mettere in pausa il gioco
function togglePause() {
    isPaused = !isPaused;
}

// Funzione di game over
function gameOver() {
    clearInterval(update);
    var playAgain = confirm("Game Over! Punteggio: " + score + "\nVuoi giocare ancora?");
    if (playAgain) {
        restartGame();
    }
    score = 0; // Resetta il punteggio
    updateScore(); // Aggiorna il conteggio dei punti
}

// Funzione di riavvio del gioco
function restartGame() {
    snake = new Snake();
    food = new Food();
    direction = "right";
    update = setInterval(updateGame, 100); // Aggiorna il gioco ogni 100 millisecondi
    isPaused = false; // Ripristina lo stato di pausa
}

// Classe Snake
function Snake() {
    this.length = 1;
    this.body = [{x: 0, y: 0}];

    this.draw = function() {
        context.fillStyle = "green";
        for (var i = 0; i < this.body.length; i++) {
            var cell = this.body[i];
            context.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
        }
    };

    this.update = function(direction) {
        var head = {x: this.body[0].x, y: this.body[0].y};

        if (direction === "right") {
            head.x = (head.x + 1) % (canvas.width / gridSize);
        } else if (direction === "left") {
            head.x = (head.x - 1 + canvas.width / gridSize) % (canvas.width / gridSize);
        } else if (direction === "up") {
            head.y = (head.y - 1 + canvas.height / gridSize) % (canvas.height / gridSize);
        } else if (direction === "down") {
            head.y = (head.y + 1) % (canvas.height / gridSize);
        }

        this.body.unshift(head); // Aggiunge la nuova testa all'inizio dell'array

        if (this.length < this.body.length) {
            this.body.pop(); // Rimuove la coda se il serpente non è cresciuto
        }
    };

    this.checkCollision = function() {
        var head = this.body[0];

        // Controllo collisione con il corpo del serpente
        for (var i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }

        return false;
    };

    this.eat = function(food) {
        var head = this.body[0];
        return head.x === food.x && head.y === food.y;
    };

    this.grow = function() {
        this.length++;
    };
}

// Classe Food
function Food() {
    this.x = 0;
    this.y = 0;
    this.color = getRandomColor();

    this.draw = function() {
        context.fillStyle = this.color;
        context.fillRect(this.x * gridSize, this.y * gridSize, gridSize, gridSize);
    };

    this.move = function() {
        this.x = Math.floor(Math.random() * (canvas.width / gridSize));
        this.y = Math.floor(Math.random() * (canvas.height / gridSize));
        this.color = getRandomColor();
    };

    // Genera un colore casuale
    function getRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Inizializza il gioco
init();
