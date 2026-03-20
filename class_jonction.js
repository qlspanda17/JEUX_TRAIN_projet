class Jonction {
    constructor(x, y, gare, index) {
        this.x = x;
        this.y = y; // Rail principal
        this.gare = gare; // Une seule gare
        this.index = index;
        this.state = 0; // 0: vers gare, 1: tout droit
        this.radius = 25;
    }

    toggle() {
        
        this.state = 1 - this.state;
    }

    draw(ctx) {
      
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();


// Couleur de la flèche

ctx.fillStyle = "#000";  
ctx.strokeStyle = "#000";
ctx.lineWidth = 2;

// Position de base de l'indicateur

let ix = this.x + 2;
let iy = this.y - 2;

ctx.beginPath();

if (this.state === 1) {
    
    ctx.moveTo(ix - 10, iy);
    ctx.lineTo(ix + 10, iy);

    
    ctx.lineTo(ix + 5, iy - 5);
    ctx.moveTo(ix + 10, iy);
    ctx.lineTo(ix + 5, iy + 5);

} else {
   

    const direction = this.gare.y > this.y ? 1 : -1;

    
    ctx.moveTo(ix, iy - 10 * direction);
    ctx.lineTo(ix, iy + 10 * direction);

    
    ctx.lineTo(ix - 5, iy + 5 * direction);
    ctx.moveTo(ix, iy + 10 * direction);
    ctx.lineTo(ix + 5, iy + 5 * direction);
}

ctx.stroke();

       
        
   //RAIL DROIT ENTRE LA JONCTION ET LA GARE

//Angle entre jonction et gare
const angleJG = Math.atan2(this.gare.y - this.y, this.gare.x - this.x);

//Point de départ = bord du cercle de la jonction
const startX = this.x + Math.cos(angleJG) * this.radius;
const startY = this.y + Math.sin(angleJG) * this.radius;

// Point d'arrivée = bord du cercle de la gare

const endX = this.gare.x - Math.cos(angleJG) * this.gare.radius;
const endY = this.gare.y - Math.sin(angleJG) * this.gare.radius;

// 4. Vecteur direction

const dx = endX - startX;
const dy = endY - startY;
const length = Math.hypot(dx, dy);

// Normalisation

const ux = dx / length;
const uy = dy / length;

// Perpendiculaire
const nx = -uy;
const ny = ux;

// Distance entre rails
const offset = 8;

// === DESSIN DES RAILS ===
ctx.strokeStyle = "#444";
ctx.lineWidth = 5;

// Rail haut
ctx.beginPath();
ctx.moveTo(startX + nx * offset, startY + ny * offset);
ctx.lineTo(endX + nx * offset, endY + ny * offset);
ctx.stroke();

// Rail bas
ctx.beginPath();
ctx.moveTo(startX - nx * offset, startY - ny * offset);
ctx.lineTo(endX - nx * offset, endY - ny * offset);
ctx.stroke();

//TRAVERSES
ctx.strokeStyle = "#888";
ctx.lineWidth = 2;

const spacing = 26;
for (let d = 0; d <= length; d += spacing) {

    const x = startX + ux * d;
    const y = startY + uy * d;

    ctx.beginPath();
    ctx.moveTo(x - nx * 7, y - ny * 7);
    ctx.lineTo(x + nx * 7, y + ny * 7);
    ctx.stroke();
}
    }

    contains(x, y) {
        
        const distance = Math.hypot(x - this.x, y - this.y);
        return distance < this.radius;
    }

    getDestination() {

        // Retourne la destination selon l'état (vers gare ou tout droit)

        if (this.state === 0) {
            return { y: this.gare.y, gare: this.gare };
        } else {
            return null; 
        }
    }
}