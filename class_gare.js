class Gare {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 25;
    }

    draw(ctx) {

       

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        
        ctx.strokeStyle = '#050202';

        ctx.lineWidth = 3;
        ctx.stroke();
    }

    contientTrain(train) {
        const distance = Math.hypot(train.x - this.x, train.y - this.y);
        return distance < this.radius + 15;
    }
}