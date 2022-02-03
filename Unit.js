export default class Unit {
    constructor(context, name, hp, speed, size, x, y, sprite) {
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
        context.drawImage(this.sprite, this.x, this.y);
    }
    moveTo (x, y) {
        this.x = x;
        this.y = y;
        // add animate logic
    }
    animate() {

    }
    
}