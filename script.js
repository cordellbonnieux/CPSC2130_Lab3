const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const TILE_SIZE = 32;

/*
*   CLASSES
*/
class Unit {
    constructor(name, hp, speed, x, y, sprite) {
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.size = TILE_SIZE;
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.width = TILE_SIZE;
        this.sprite.height = TILE_SIZE;
    }
    render() {
        ctx.drawImage(this.sprite, this.x, this.y);
    }
    moveTo (x, y) {
        this.x = x;
        this.y = y;
    }
}

class Enemy extends Unit {
    constructor(name, hp, speed, x, y, sprite) {
        super(name, hp, speed, x, y, sprite);
    }
}

class Player extends Unit {
    constructor(name, hp, speed, x, y) {
        super(name, hp, speed, x, y, './sprites/player.png');
    }
    addControls() {
        window.addEventListener('keydown', (e) => {
            if (e.key == 'a' || e.key == 'ArrowLeft') {
                this.x -= 1 * this.speed;
            } else if (e.key == 'd' || e.key == 'ArrowRight') {
                this.x += 1 * this.speed;
            } else if (e.key == 'w' || e.key == 'ArrowUp') {
                this.y -= 1 * this.speed;
            } else if (e.key == 's' || e.key == 'ArrowDown') {
                this.y += 1 * this.speed;
            }
        })
    }
}

class Crosshair {
    constructor() {
        this.img = new Image();
        this.img.src = './sprites/crosshairs.png';
        this.img.width = TILE_SIZE;
        this.img.height = TILE_SIZE;
        this.x;
        this.y;
    }
    addToContext() {
        canvas.addEventListener('mousemove', (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
        })
    }
    render() {
        ctx.drawImage(this.img, this.x, this.y);
    }
}
/*
*   INSTANTIATE UNITS
*/

const player = new Player('player', 100, 25, 100, 150);
const crosshairs = new Crosshair();


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
    // preload assets
    crosshairs.addToContext();
    player.addControls();

    // start
    updateGame();
    window.requestAnimationFrame(drawGame);

}

// Called Every
function updateGame() {
    setCanvasDimensions(canvas); // ensures canvas dimensions == viewport

    // GAME AND ANIMATION LOGIC GOES HERE


    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    window.setTimeout(updateGame, 20);
}

function drawGame() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // RENDERING HAPPENS HERE
    player.render();
    crosshairs.render();
    

    window.requestAnimationFrame(drawGame);
}


/* 
* Helper Functions
*/

function setCanvasDimensions(c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    // for now
    canvas.style.backgroundColor = '#000';
}
