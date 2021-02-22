import {resetTransforms} from '../helpers.js';

export class Rect{
    constructor(x = 0, y = 0, width = 10, height = 10, color = 'rgb(255, 255, 255)', rotation = 0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.rotation = rotation * Math.PI / 180;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export class Triangle extends Rect{
    constructor(x, y, width, height, color, size = 200, rotation){
        super(x, y, width, height, color, rotation);
        this.lineWidth = 10;
        this.size = size;
        this.height = Math.round(this.size * Math.cos(Math.PI / 6));
    }
    draw(ctx){
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.x, -this.y);

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x + this.size / 2, this.y - this.height);
        ctx.closePath();

        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        resetTransforms(ctx);
    }
}

export class Arrow extends Rect{
    constructor(x, y, width, height, color, rotation){
        super(x, y, width, height, color, rotation);
        this.size = this.height * 2;
        this.triangle = new Triangle(x + width, y - this.size / 4, width, height, color, this.size, 90);
    }
    draw(ctx){
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.translate(-this.x, -this.y);

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        this.triangle.draw(ctx);
        resetTransforms(ctx);
    }
}

export class NewLink extends Rect{
    constructor(value, x, y, width, height, color){
        super(x, y, width, height, color);
        this.arrowHeight = height;
        this.value = value;
        this.rect = new Rect(x, y, width/2, height, color);
        this.arrow = new Arrow(x + width/4 + width/32, y + this.height, width/2, this.arrowHeight/4, color, 90);
    }
    draw(ctx){
        this.rect.draw(ctx);
        this.arrow.draw(ctx);
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        ctx.fillText(`Data: ${this.value}`, this.x + this.width/4, this.y + this.height/2 + 9);
        ctx.font = '15px bold Arial';
        ctx.fillStyle = 'rgb(0, 250, 0)';
        ctx.fillText(`NEXT`, this.x, this.y + this.height*2);
        resetTransforms(ctx);
    }
}

