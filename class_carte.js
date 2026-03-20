class Carte {
    
    constructor(width, height, difficulty = 'medium') {
        this.width = width;
        this.height = height;
        this.difficulty = difficulty;
        this.gares = [];
        this.jonctions = [];
        this.tunnel = { x: 30, y: height / 2 };
        this.railY = height / 2; 
        this.generer();
    }

    generer() {
        
        
        const nbJonctions = {
            easy: 2,
            medium: 3,
            hard: 4
        }[this.difficulty];

        const colors = ['#FF0000', '#00AA00', '#FFFF00', '#FF6600'];

 
        const espacement = (this.width - 200) / nbJonctions;
        
        for (let i = 0; i < nbJonctions; i++) {
            const jonctionX = 150 + espacement * i;
            
            // Les gares sont séparées en X (plus loin que la jonction)

            const gareX = jonctionX;
            
            // Les gares alternent : haut pour i pair, bas pour i impair

            const gareY = i % 2 === 0 ? 
                this.railY - 150 : // Haut pour jonction 0, 2, 4...
                this.railY + 150;  // Bas pour jonction 1, 3, 5...
            
            const couleur = colors[i % colors.length];
            
            // Créer la gare

            const gare = new Gare(gareX, gareY, couleur);
            this.gares.push(gare);
            
            // Créer la jonction avec UNE seule gare

            const jonction = new Jonction(jonctionX, this.railY, gare, i);
            this.jonctions.push(jonction);
        }
    }

    dessiner(ctx) {

       

        ctx.strokeStyle = '#444';
        ctx.lineWidth = 6;
        
        // Rail 1

        ctx.beginPath();
        ctx.moveTo(30, this.railY - 10);
        ctx.lineTo(this.width, this.railY - 10);
        ctx.stroke();

        // Rail 2
        ctx.beginPath();
        ctx.moveTo(30, this.railY + 10);
        ctx.lineTo(this.width, this.railY + 10);
        ctx.stroke();

        // Traverses
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;
        for (let x = 30; x < this.width; x += 35) {
            ctx.beginPath();
            ctx.moveTo(x, this.railY - 10);
            ctx.lineTo(x, this.railY + 10);
            ctx.stroke();
        }

        // Tunnel
        ctx.fillStyle = '#222';
        ctx.fillRect(0, this.railY - 25, 50, 50);
        ctx.fillStyle = '#111';
        ctx.fillRect(8, this.railY - 18, 35, 36);

        // Jonctions
        for (let jonction of this.jonctions) {
            jonction.draw(ctx);
        }

        // Gares
        for (let gare of this.gares) {
            gare.draw(ctx);
        }
    }
}