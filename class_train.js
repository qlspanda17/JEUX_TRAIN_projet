// class_train.js
class Train {
    constructor(x, y, color, id, speed = 1) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.id = id;
        this.width = 25;
        this.height = 18;
        this.speed = speed;
        this.active = true;

        this.surCourbe = false;
        this.courbeData = null;

     
        this.prevX = x;
        this.jonctionsTraitees = new Set();
    }


    draw(ctx) {

        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);

        // Corps
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Bordure
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Fenêtre
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-7, -5, 7, 8);

        // Roues
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(-8, this.height / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(8,  this.height / 2, 3, 0, Math.PI * 2); ctx.fill();

        ctx.restore();
    }

    update(map, railY) {
        if (!this.active) return;

        if (!this.surCourbe) {

            // Avance sur le rail principal
            
            const oldX = this.x;
            this.prevX = oldX;
            this.x += this.speed;
            this.y = railY;

            // Détectiondès que l'on passe de la jonction

            for (const jonction of map.jonctions) {
                if (this.jonctionsTraitees.has(jonction.index)) continue;

                // On a traversé la verticale de la jonction pendant cette frame
                if (oldX < jonction.x && this.x >= jonction.x) {
                    this.jonctionsTraitees.add(jonction.index);

                    const dest = jonction.getDestination(); // état ACTUEL au moment du passage
                    if (dest) {
                        this.surCourbe = true;
                        this.courbeData = {
                            jonctionX: jonction.x + 15,
                            startY: railY,
                            gareX: dest.gare.x,
                            gareY: dest.gare.y,
                            gare: dest.gare
                        };
                        break; // on prend au plus une jonction par frame
                    }
                }
            }
        } else {
    const d = this.courbeData;

    // Vecteur vers la gare
    const dx = d.gareX - this.x;
    const dy = d.gareY - this.y;

    const dist = Math.hypot(dx, dy);

    if (dist > this.speed) {
        // Déplacement vers la gare (direction normalisée)
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
    } else {
        // Arrivé à la gare
        this.x = d.gareX;
        this.y = d.gareY;
        this.surCourbe = false;
    }
}
    }

    hors_limites(canvas) {
        return (
            this.x > canvas.width + 100 ||
            this.y < -100 ||
            this.y > canvas.height + 100
        );
    }
}