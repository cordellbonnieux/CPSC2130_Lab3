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
        super(name, startingHealth, 13.33, 0, (canvas.width / 2), (canvas.height / 2), './sprites/player.png', TILE_SIZE);
        this.rotation = this.getRotationAngle(crosshair);
        this.time = new Date().getTime();
        this.kills = 0;
        this.startingHealth = startingHealth;
        this.play = false;
        this.dead = false;
        this.newGame;
        this.aliveFor;
    }
    addControls() {
        window.addEventListener('keypress', (e) => {
            let delays = 3;
            const threshold = 100;
            if (e.key == 'a' || e.key == 'ArrowLeft') {
                if (this.x > threshold) {
                    this.x -= 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.x -= 1 * this.speed), RATE/this.speed);
                        delays--;
                    }
                }
            } else if (e.key == 'd' || e.key == 'ArrowRight') {
                if (this.x < canvas.width - threshold) {
                    this.x += 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.x += 1 * this.speed), RATE/this.speed);
                        delays--;
                    }
                }
            } else if (e.key == 'w' || e.key == 'ArrowUp') {
                if (this.y > threshold) {
                    this.y -= 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.y -= 1 * this.speed), RATE/this.speed);
                        delays--;
                    }
                }
            } else if (e.key == 's' || e.key == 'ArrowDown') {
                if (this.y < (canvas.height - threshold)) {
                    this.y += 1 * this.speed;
                    while (delays > 0) {
                        setTimeout(()=> (this.y += 1 * this.speed), RATE/this.speed);
                        delays--;
                    }
                }
            }
        });
        canvas.addEventListener('mousedown', (e) => {
            if (e.button == 0) {
                projectiles.push(new Projectile(crosshairs.x, crosshairs.y));
            }
        })
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
    checkForDeath() {
        if (player.hp <= 0) {
            player.dead = true;
            player.play = false;
        } else {
            player.dead = false;
            player.play = true;
        }
    }
}

class Projectile {
    constructor(targetX, targetY) {
        this.x = player.x;
        this.y = player.y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.rise = this.setRise();
        this.run = this.setRun();
        this.w = 8;
        this. h = 8;
        this.speed = 2;
        this.color = GREEN;
        this.sprite;
    }
    render() {
        this.updatePOS();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    updatePOS() {
        console.log(this.rise, this.run)
        this.x += this.speed * this.run;
        this.y += this.speed * this.rise;
    }
    reduce(rise, run) {
        rise = Math.floor(rise * 10);
        run = Math.floor(run * 10);
        let divisor, counter = 0;
        while (counter < 10) {
            let riseIsInt = Number(rise % counter) === (rise % counter) && (rise % counter) % 1 === 0;
            let runIsInt = Number(run % counter) === (run % counter) && (run % counter) % 1 === 0;
            if (riseIsInt && runIsInt) {
                divisor = counter;
            }
            counter++;
        }

        if (rise > 0) {
            while (rise > 10) {
                rise = rise / divisor;
            }
        } else if (rise < 0) {
            while (rise < -10) {
                rise = rise / divisor;
            }
        }

        if (run > 0) {
            while (run > 10) {
                run = run / divisor;
            }
        } else if (run < 0) {
            while (run < -10) {
                run = run / divisor;
            }
        }

        return [-rise, -run]
    }
    collision(target) {
        let x = (target.x > this.x) ? target.x - this.x : this.x - target.x;
        let y = (target.y > this.y) ? target.y - this.y : this.y - target.y;
        return (x <= (this.h * 4) && y <= (this.h * 4)) ? true : false;
    }
    slope() {
        let num = (this.y - this.targetY);
        let denom = (this.x - this.targetX);
        return this.reduce(num, denom);
    }
    setRise() {
        let r = this.slope()[0]
        return r;
    }
    setRun() {
        let r = this.slope()[1]
        return r;
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
    hideCursor(bool) {
        const cursor = bool ? 'noCursor' : '';
        canvas.setAttribute('class', cursor);
    }
}

class UI {
    constructor(player) {
        this.buildHp(player.hp);
        this.buildDeathScreen();
        this.buildTopRightContainer();
        this.buildScore();
        this.buildTime();
        this.deathScreen = false;
    }
    updateHp(h) {
        document.getElementById('hp').setAttribute('value', h);
    }
    updateMaxHp(h) {
        document.getElementById('hp').setAttribute('max', h);
    }
    updateTime(t) {
        let now = new Date().getTime();
        player.aliveFor = -Math.floor(((t - now) % (1000 * 60)) / 1000);
        document.getElementById('time').textContent = player.aliveFor;
    }
    updateScore(s) {
        document.getElementById('score').textContent = s;
    }
    buildTopRightContainer () {
        let div = document.createElement('div');
        div.setAttribute('id','topRight');
        div.style = 'position: absolute; top: 2%; right: 2%; height:5%; display:flex; flex-wrap:no-wrap; justify-content:center; margin:0; color: #fff;';
        document.body.appendChild(div);
    }
    buildScore() {
        let div = document.getElementById('topRight');

        let text = document.createElement('p');
        text.style = 'margin:0; padding:15px 10px 0px 5px;';
        text.textContent = 'Score:';

        let time = document.createElement('p');
        time.setAttribute('id', 'score');
        time.style = 'height:100%; width:80%; display:inline-block;';

        div.append(text, time);
    }
    buildTime() {
        let div = document.getElementById('topRight');
        
        let text = document.createElement('p');
        text.style = 'margin:0; padding:15px 10px 0px 5px;';
        text.textContent = 'Time:';

        let time = document.createElement('p');
        time.setAttribute('id', 'time');
        time.style = 'height:100%; width:80%; display:inline-block;';

        div.append(text, time);
    }
    buildHp(hp) {
        let div = document.createElement('div');
        div.style = 'position: absolute; top: 2%; left: 2%; width:15%; height:5%; display:flex; flex-wrap:no-wrap; justify-content:center; margin:0;';
        let text = document.createElement('p');
        text.textContent = 'HP';
        let meter = document.createElement('meter');
        meter.setAttribute('min', `0`);
        meter.setAttribute('low', `${hp / 4}`);
        meter.setAttribute('optimum', `${hp / 2}`);
        meter.setAttribute('high', `${(hp / 4) * 3}`);
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
            document.body.querySelectorAll('.difficulty').forEach((b) => {
                b.addEventListener('click', (e) => {
                    meteors = [[], [], [], []];
                    switch (b.value) {
                        case 'Easy': currentDifficulty = DIFFICULTY.EASY;
                            player.hp = 6;
                            break;
                        case 'Medium': currentDifficulty = DIFFICULTY.MED;
                            player.hp = 4;
                            break;
                        case 'Hard': currentDifficulty = DIFFICULTY.HARD;
                            player.hp = 2;
                            break;
                    }
                    this.updateMaxHp(player.hp)
                    this.updateHp(player.hp);
                    this.showStartMenu(false);
                    player.dead = false;
                    player.play = true;
                    player.time = new Date();
                    crosshairs.hideCursor(true);
                    player.newGame = true;
                    player.aliveFor = 0;
                })
            })
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
    showStartMenu(bool) {
        const value = bool ? 'block' : 'none';
        document.getElementById('startMenu').style.display = value;
    }
    buildDeathScreen() {
        this.deathScreen = true;
        const div = document.createElement('div');
        div.setAttribute('class', 'menu layout');
        div.setAttribute('id', 'dead');

        const h1 = document.createElement('h1');
        h1.textContent = 'You are dead.';

        const btn = document.createElement('input');
        btn.type = 'button';
        btn.value = 'Play Again';
        btn.addEventListener('click', (e) => {
            player.dead = false;
            this.deathScreen = false;
            this.showDeathScreen(false);
            this.showStartMenu(true);
        });

        div.append(h1, btn)
        document.body.appendChild(div);
        crosshairs.hideCursor(false);
        this.showDeathScreen(false);
    }
    showDeathScreen(bool) {
        const val = bool ? 'block' : 'none';
        this.deathScreen = bool;
        crosshairs.hideCursor(false);
        document.getElementById('dead').style.display = val;
    }
    dead() {
        this.showDeathScreen(true);
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
let projectiles = [];
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
    // canvas set up
    canvas.style.backgroundColor = '#000';
    setCanvasDimensions(canvas);
    // set up game objects
    crosshairs = new Crosshair();
    player = new Player('player', crosshairs);
    ui = new UI(player);
    ui.showMenu(false);
    // add user input 
    crosshairs.addToContext();
    player.addControls();
    // start
    updateGame();
    window.requestAnimationFrame(drawGame);

}

// Called Every
function updateGame(delta) {
    const difference = delta - lastRender;
    setCanvasDimensions(canvas);

    if (player.play) {
        ui.updateTime(player.time);
        ui.updateScore(player.kills);
        player.checkForDeath();
        meteorSpawnTimer++;
        if (((meteorSpawnTimer / RATE) > 10) || player.newGame) {
            player.newGame = false;
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
                    player.kills += 1;
                    arr.splice(arr.indexOf(m), 1);
                }
                projectiles.forEach((p) => {
                    if (p.collision(m)) {
                        arr.splice(arr.indexOf(m), 1);
                        projectiles.splice(projectiles.indexOf(p), 1);
                        player.kills += 1;
                    } else if (p.x > canvas.width || p.x < 0 || p.y > canvas.height || p.y < 0) {
                        projectiles.splice(projectiles.indexOf(p), 1);
                    }
                });
            })
        });
    } else if (player.dead) {
        ui.dead();
        player.play = false;
        meteors.forEach((arr) => {
            arr = [];
        })
        projectiles = [];
    }


    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    lastRender = delta;
    window.setTimeout(updateGame, RATE);
}

function drawGame(delta) {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (player.play) {
        player.render();
        crosshairs.render();
        ui.updateHp(player.hp);
        meteors.forEach((arr) => {
            arr.forEach((m) => {
                m.render();
            })
        });
        projectiles.forEach((p) => {
            p.render();
        });
    }

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
    let l = arr.length;
    for (let i = 0; i < (n - l); i++) {
        let x = Math.random() * canvas.width * 2;
        let y = -200;
        let m = new Meteor(`meteor${i}`, x, y);
        arr.push(m);
    }
}