const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');


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




let test = new Unit("player", 100, 5, 32, 100, 150, './sprites/test.png');
main();

// Called first
function main() {
    startGame();
    console.log('heyheyhey');
    canvas.style.backgroundColor = "blue";
}

// Called on start
function startGame() {
    updateGame();
    window.requestAnimationFrame(drawGame);
}

// Called Every
function updateGame() {
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


