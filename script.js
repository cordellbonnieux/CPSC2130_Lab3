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
    constructor(name, x, y) {
        super(name, 1, 2, x, y, './sprites/test.png');
    }
}

class Player extends Unit {
    constructor(name, crosshair) {
        super(name, 3, 30, (canvas.width / 2), (canvas.height / 2), './sprites/player.png');
        this.rotation = this.getRotationAngle(crosshair);
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
    getRotationAngle(target) {
        return Math.atan2(
            target.x - (this.x + 16),
            -(target.y - (this.y+ 16)) ,
          );
    }
    render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(player.getRotationAngle(crosshairs));
        ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
        ctx.strokeStyle = "red"
        ctx.stroke();
        ctx.restore();
    }
}

class Crosshair {
    constructor() {
        this.img = new Image();
        this.img.src = './sprites/crosshairs.png';
        this.img.width = TILE_SIZE;
        this.img.height = TILE_SIZE;
        this.x = 0;
        this.y = 0;
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
*   SET UP GLOBALS
*/
let crosshairs;
let player;
let lastRender = 0;


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
    crosshairs = new Crosshair();
    player = new Player('player', crosshairs);
    crosshairs.addToContext();
    player.addControls();
    

    // start
    updateGame();
    window.requestAnimationFrame(drawGame);

}

// Called Every
function updateGame(delta) {
    const difference = delta - lastRender;
    setCanvasDimensions(canvas); // ensures canvas dimensions == viewport

    // GAME AND ANIMATION LOGIC GOES HERE



    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    lastRender = delta;
    window.setTimeout(updateGame, 30);
}

function drawGame(delta) {
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
