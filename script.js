const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');

/*
*   CLASSES
*/
class Unit {
    constructor(name, hp, speed, size, x, y, sprite) {
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.size = size;
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.width = size;
        this.sprite.height = size;
    }
    render() {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
    moveTo (x, y) {
        this.x = x;
        this.y = y;
        // add animate logic
    }
    animate() {

    }
}

class Enemy extends Unit {
    constructor(name, hp, speed, size, x, y, sprite) {
        super(name, hp, speed, size, x, y, sprite);
    }
}

class Player extends Unit {
    constructor(name, hp, speed, size, x, y) {
        super(name, hp, speed, size, x, y, './sprites/test.png');
    }
}

/*
*   INSTANTIATE UNITS
*/

let test = new Player('player', 100, 5, 32, 100, 150);

/**
 *  ENGINE FUNCTIONS
 */
main();

// Called first
function main() {
    startGame();
}

// Called on start
function startGame() {
    updateGame();
    window.requestAnimationFrame(drawGame);
    crosshairs();
}

// Called Every
function updateGame() {
    setCanvasDimensions(canvas); // ensures canvas dimensions == viewport

    // GAME AND ANIMATION LOGIC GOES HERE
    test.moveTo(300, 400);

    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    window.setTimeout(updateGame, 20);
}

function drawGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // RENDERING HAPPENS HERE
    test.render();
    

    window.requestAnimationFrame(drawGame);
}


/* 
* Helper Functions
*/

function setCanvasDimensions(c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    // for now
    canvas.style.backgroundColor = 'blue';
}

function crosshairs() {
    canvas.addEventListener('mousemove', (e) => {
        console.log(e.clientX)
        console.log("hey")
        // replace with image!
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 30, 0, 2 * Math.PI, false);
        ctx.stroke();
    })
}