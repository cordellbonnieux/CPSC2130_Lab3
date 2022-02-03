var canvas = document.getElementById("demoCanvas");
var context = canvas.getContext("2d");

main();

function main()
{
    startGame();
}

function startGame()
{
    updateGame();
    window.requestAnimationFrame(drawGame);
}

function updateGame()
{
    // GAME AND ANIMATION LOGIC GOES HERE

    // CHANGE THE NUMBER OF MILLISECONDS TO ADJUST FRAME RATE
    window.setTimeout(updateGame, 100);
}

function drawGame()
{
    context.clearRect(0,0,canvas.width,canvas.height);

    // RENDERING HAPPENS HERE

    window.requestAnimationFrame(drawGame);
}