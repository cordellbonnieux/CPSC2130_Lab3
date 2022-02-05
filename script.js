const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d');
const TILE_SIZE = 32;
const RATE = 30;
const GREEN = '#71f341';
const DIFFICULTY = { EASY: 10, MED: 25, HARD: 40 };

/*
*   CLASSES
*/
class Unit {
    constructor(name, hp, speed, rotation, x, y, sprite, size) {
        this.name = name;
        this.hp = hp;
        this.speed = speed;
        this.rotation = rotation;
        this.size = size;
        this.x = x;
        this.y = y;
        this.sprite = new Image();
        this.sprite.src = sprite;
        this.sprite.style.transition = '0.3s';
        this.sprite.width = size;
        this.sprite.height = size;
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
    constructor(name, hp, x, y, sprite, speed, size) {
        super(name, hp, speed, 0, x, y, sprite, size);
    }
}

class Player extends Unit {
    constructor(name, crosshair) {
        const startingHealth = 3;
        super(name, startingHealth, 33.3, 0, (canvas.width / 2), (canvas.height / 2), './sprites/player.png', TILE_SIZE);
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

class Meteor extends Enemy {
    constructor(name, x, y) {
        super(name, 1, x, y, './sprites/meteor.png', 1, 16);
        this.sprite.width = TILE_SIZE / 2;
        this.sprite.height = TILE_SIZE / 2;
        this.direction = Math.random() * (10 - (-5)) + (-5);
        this.trajectory = Math.random() * (10 - 1) + 1;
    }
    move() {
        if (this.y > canvas.height) {
            this.y = -1000;
        }

        this.y += this.speed * this.trajectory;

        if (this.x > canvas.width || this.x < 0) {
            this.direction = -this.direction;
        } 

        this.x += this.speed * this.direction;
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
        this.buildHp(player.hp);
    }
    updateHp(h) {
        document.getElementById('hp').setAttribute('value', h);
    }
    buildHp(hp) {
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
    }
    showMenu(paused) {
        if (paused) {
            // build pause menu
        } else {
            // build start menu
            this.buildStartMenu();
        }
    }
    buildStartMenu() {
        const div = document.createElement('div');
        div.setAttribute('class', 'layout menu');
        div.setAttribute('id', 'startMenu')

        const h1 = document.createElement('h1');
        h1.textContent = 'Cordell Bonnieux\'s Lab 3';
        const description = document.createElement('p');
        description.textContent = 'This is a top-down space shooter, meteors and enemies will fly at you, shoot them for points and try to stay alive.';
        const controls = document.createElement('p');
        controls.textContent = 'Use W-A-S-D to move, mouse to aim and left-click to shoot.';

        const h2 = document.createElement('h2');
        h2.textContent = 'Choose your difficulty';
        const div2 = document.createElement('div');
        const easy = document.createElement('input');
        easy.setAttribute('class', 'difficulty');
        easy.type = 'button';
        easy.value = 'Easy';
        const med = document.createElement('input');
        med.setAttribute('class', 'difficulty');
        med.type = 'button';
        med.value = 'Medium';
        const hard = document.createElement('input');
        hard.setAttribute('class', 'difficulty');
        hard.type = 'button';
        hard.value = 'Hard';
        div2.append(easy, med, hard);

        div.append(h1, description, controls, h2, div2);
        document.body.appendChild(div);
    }
}

/*
*   SET UP GLOBALS
*/
let crosshairs;
let player;
let ui;
let lastRender = 0;
let meteors = [[],[],[],[]];
let meteorSpawnTimer = 0;
let meteorReplace = 1;
let currentDifficulty = null;


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
    setCanvasDimensions(canvas);
    //
    crosshairs = new Crosshair();
    player = new Player('player', crosshairs);
    ui = new UI(player);
    ui.showMenu(false);
    //
    crosshairs.addToContext();
    player.addControls();
    player.time = new Date(); // this will need altering

    document.body.querySelectorAll('.difficulty').forEach((b) => {
        b.addEventListener('click', (e) => {
            switch (b.value) {
                case 'Easy': currentDifficulty = DIFFICULTY.EASY;
                    player.hp = 6
                    // set ui total health to be 6 too
                    // hide menu start game
                    break;
                case 'Medium': currentDifficulty = DIFFICULTY.MED;
                    player.hp = 4
                    // set ui total health to b
                    // hide menu start game
                    break;
                case 'Hard': currentDifficulty = DIFFICULTY.HARD;
                    player.hp = 2;
                    // set ui total health to b
                    // hide menu start game
                    break;
            }
        })
    })

    // start
    updateGame();
    window.requestAnimationFrame(drawGame);

}

// Called Every
function updateGame(delta) {
    const difference = delta - lastRender;
    meteorSpawnTimer++;
    setCanvasDimensions(canvas);

    // GAME AND ANIMATION LOGIC GOES HERE
    if ((meteorSpawnTimer / RATE) > 10) {
        meteorSpawnTimer = 0;
        switch (meteorReplace) {
            case 0: spawnMeteors(currentDifficulty, meteors[0]);
                break;
            case 1: spawnMeteors(currentDifficulty, meteors[1]);
                break;
            case 2: spawnMeteors(currentDifficulty, meteors[2]);
                break;
            case 3: spawnMeteors(currentDifficulty, meteors[3]);
                break;
            default: pawnMeteors(currentDifficulty, meteors[0]);
        }
        meteorReplace = (meteorReplace < 3) ? meteorReplace + 1 : 0;
    }

    meteors.forEach((arr) => {
        arr.forEach((m) => {
            m.move();
            if (m.collision(player)) {
                player.hp -= 1;
                arr.splice(arr.indexOf(m), 1);
            }
        })
    });

    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    lastRender = delta;
    window.setTimeout(updateGame, RATE);
}

function drawGame(delta) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // RENDERING HAPPENS HERE
    player.render();
    crosshairs.render();
    ui.updateHp(player.hp);
    meteors.forEach((arr) => {
        arr.forEach((m) => {
            m.render();
        })
    });
    

    window.requestAnimationFrame(drawGame);
}

/* 
* Helper Functions
*/

function setCanvasDimensions(c) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}

function spawnMeteors(n, arr) {
    //arr = [];
    let l = arr.length;
    for (let i = 0; i < (n - l); i++) {
        let x = Math.random() * canvas.width * 2;
        let y = -1000;
        let m = new Meteor(`meteor${i}`, x, y);
        arr.push(m);
    }
}