const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const TILE_SIZE = 32;
const RATE = 30;
const GREEN = '#71f341';

/*
*   CLASSES
*/
class Unit {
    constructor(name, hp, speed, rotation, x, y, sprite) {
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.rotation = rotation;
        this.size = TILE_SIZE;
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.style.transition = '0.3s';
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
    drawBox() {
        const diff = 14;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = '3';
        ctx.strokeStyle = GREEN;
        ctx.rect(this.x - diff, this.y - diff, this.size, this.size);
        ctx.stroke();
        ctx.restore();
    }
    collision(target) {
        let x = (target.x > this.x) ? target.x - this.x : this.x - target.x;
        let y = (target.y > this.y) ? target.y - this.y : this.y - target.y;
        return (x <= 16 && y <= 16) ? true : false;
    }
}

class Enemy extends Unit {
    constructor(name, x, y) {
        super(name, 1, 2, x, y, './sprites/test.png');
    }
}

class Player extends Unit {
    constructor(name, crosshair) {
        const startingHealth = 3;
        super(name, startingHealth, 30, 0,(canvas.width / 2), (canvas.height / 2), './sprites/player.png');
        this.rotation = this.getRotationAngle(crosshair);
        this.time = new Date();
        this.kills = 0;
        this.startingHealth = startingHealth;
    }
    addControls() {
        window.addEventListener('keypress', (e) => {
            let delays = 3;
            const threshold = 100;
            if (e.key == 'a' || e.key == 'ArrowLeft') {
                if (this.x > threshold) {
                    this.x -= 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.x -= 1 * this.speed), RATE);
                        delays--;
                    }
                }
            } else if (e.key == 'd' || e.key == 'ArrowRight') {
                if (this.x < canvas.width - threshold) {
                    this.x += 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.x += 1 * this.speed), RATE);
                        delays--;
                    }
                }
            } else if (e.key == 'w' || e.key == 'ArrowUp') {
                if (this.y > threshold) {
                    this.y -= 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.y -= 1 * this.speed), RATE);
                        delays--;
                    }
                }
            } else if (e.key == 's' || e.key == 'ArrowDown') {
                if (this.y < (canvas.height - threshold)) {
                    this.y += 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.y += 1 * this.speed), RATE);
                        delays--;
                    }
                }
            }
        });
    }
    getRotationAngle(target) {
        const newRotation = Math.atan2(
            target.x - (this.x + 16),
            -(target.y - (this.y + 16)) ,
          );
        this.rotation = newRotation;
        return newRotation;
    }
    render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(player.getRotationAngle(crosshairs));
        ctx.drawImage(this.sprite, -this.sprite.width / 2, -this.sprite.height / 2);
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

class UI {
    constructor(player) {
        this.build(player.hp);
    }
    updateHp(h) {
        document.getElementById('hp').setAttribute('value', h);
    }
    build(hp) {
        let div = document.createElement('div');
        div.style = 'position: absolute; top: 2%; left: 2%; width:15%; height:5%; display:flex; flex-wrap:no-wrap; justify-content:center; margin:0;';
        let text = document.createElement('p');
        text.style = 'margin:0; padding:15px 10px 0px 5px; color: #fff;';
        text.textContent = 'HP';
        let meter = document.createElement('meter');
        meter.setAttribute('max', `${hp}`);
        meter.setAttribute('id', 'hp');
        meter.style = 'height:100%; width:80%; display:inline-block;';

        div.append(text);
        div.appendChild(meter);
        document.body.appendChild(div);
        // add other parts next
    }
}

/*
*   SET UP GLOBALS
*/
let crosshairs;
let player;
let ui;
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
    // pre-load & setup
    canvas.style.backgroundColor = '#000';
    crosshairs = new Crosshair();
    player = new Player('player', crosshairs);
    ui = new UI(player);
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
    window.setTimeout(updateGame, RATE);
}

function drawGame(delta) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // RENDERING HAPPENS HERE
    player.render();
    player.drawBox();
    crosshairs.render();
    ui.updateHp(player.hp);
    

    window.requestAnimationFrame(drawGame);
}


/* 
* Helper Functions
*/

function setCanvasDimensions(c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}
