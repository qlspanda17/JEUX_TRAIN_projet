class JeuMiniTrain {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 1200;
        this.canvas.height = 600;

        this.score = 0;
        this.temps = 60;
        this.tempsRestant = this.temps;
        this.jouEnCours = false;
        this.trains = [];
        this.compteurTrain = 0;
        this.prochainTrain = 0;
        this.difficulty = 'medium';
        this.map = new Carte(this.canvas.width, this.canvas.height, this.difficulty);

        this.initEvenements();

        
        this.background = new Image();
        this.background.src = "ok.webp"; 

// Redessine quand l'image est chargée

        this.background.onload = () => this.dessiner();


        this.mettreAJourAffichage();
    }

    initEvenements() {
        document.getElementById('startBtn').addEventListener('click', () => this.demarrer());
        document.getElementById('resetBtn').addEventListener('click', () => this.reinitialiser());
        document.getElementById('restartBtn').addEventListener('click', () => this.nouvellePartie());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.reinitialiser();
        });

        this.canvas.addEventListener('click', (e) => this.gererClicCanvas(e));
    }

    demarrer() {

        if (!this.jouEnCours) {
            this.jouEnCours = true;

            // Vitesse des trains (Lumosity-like)

            this.vitesseTrain = {
                easy: 0.7,
                medium: 1.0,
                hard: 1.35
            }[this.difficulty];

            // Distance minimale entre trains 

            this.minTrainGap = {
                easy: 140,
                medium: 110,
                hard: 85
            }[this.difficulty];

            this.debutPartie = null;
            document.getElementById('startBtn').disabled = true;
            this.boucleJeu();
        }
    }

    reinitialiser() {
        this.jouEnCours = false;
        this.score = 0;
        this.tempsRestant = this.temps;
        this.trains = [];
        this.compteurTrain = 0;
        this.prochainTrain = 0;
        this.debutPartie = null;
        this.map = new Carte(this.canvas.width, this.canvas.height, this.difficulty);
        document.getElementById('startBtn').disabled = false;
        this.mettreAJourAffichage();
        this.dessiner();
    }

    nouvellePartie() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.reinitialiser();
    }

    // class_minitrain.js

gererClicCanvas(event) {
    if (!this.jouEnCours) return;

    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Vérifier si on clique sur une jonction

    for (let jonction of this.map.jonctions) {
        if (jonction.contains(x, y)) {
            jonction.toggle();
            break;
        }
    }
}

    genererTrain() {

    // couleurs autorisées = celles des gares de la carte (selon la difficulté)
    const couleursAutorisees = this.map.gares.map(g => g.color);

    if (!couleursAutorisees || couleursAutorisees.length === 0) {
        console.error("Aucune gare -> aucune couleur possible");
        return;
    }

    const couleur = couleursAutorisees[Math.floor(Math.random() * couleursAutorisees.length)];

    const train = new Train(
        this.map.tunnel.x + 25,
        this.map.railY,
        couleur,
        this.compteurTrain++,
        this.vitesseTrain   // définie selon difficulté
    );

    this.trains.push(train);
    }

    peutGenererTrain() {
        if (this.trains.length === 0) return true;

        const dernier = this.trains[this.trains.length - 1];

        // Position de spawn (celle utilisée dans genererTrain)

        const spawnX = this.map.tunnel.x + 25;

        // Si le dernier train est encore trop proche du tunnel, on attend

        return (dernier.x - spawnX) >= this.minTrainGap;
    }

    mettreAJourAffichage() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = Math.ceil(this.tempsRestant);
    }

    dessiner() {

        
// Image de fond

    this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);

    // Carte (rails, gares, jonctions)

    this.map.dessiner(this.ctx);

    // Trains
    
    for (let train of this.trains) {
        train.draw(this.ctx);
    }

    }

    boucleJeu() {
        if (!this.jouEnCours) return;

        const tempsActuel = Date.now();
        if (!this.debutPartie) {
            this.debutPartie = tempsActuel;
        }

        // Gérer le temps
        const tempsEcoule = (tempsActuel - this.debutPartie) / 1000;
        this.tempsRestant = Math.max(0, this.temps - tempsEcoule);

        // Générer des trains selon la difficulté
        const rythmeGeneration = {
            easy: 3000,
            medium: 2000,
            hard: 1200
        }[this.difficulty];

        if (tempsActuel >= this.prochainTrain) {
            if (this.peutGenererTrain()) {
                this.genererTrain();
                this.prochainTrain = tempsActuel + rythmeGeneration;
            } else {
                // On retente très vite, sans attendre tout le rythmeGeneration
                this.prochainTrain = tempsActuel + 120;
            }
        }

        // Mettre à jour les trains
        for (let i = this.trains.length - 1; i >= 0; i--) {
            const train = this.trains[i];
            train.update(this.map, this.map.railY);

            // Vérifier les gares
            let toucheGare = false;
            for (let gare of this.map.gares) {
                if (gare.contientTrain(train)) {
                    if (train.color === gare.color) {
                        this.score += 1;
                    }
                    train.active = false;
                    this.trains.splice(i, 1);
                    toucheGare = true;
                    break;
                }
            }

            if (!toucheGare) {
                // Vérifier les limites
                if (train.active && train.hors_limites(this.canvas)) {
                    train.active = false;
                    this.trains.splice(i, 1);
                }
            }
        }

        // Mettre à jour l'affichage
        this.mettreAJourAffichage();

        // Dessiner
        this.dessiner();

        // Vérifier la fin du jeu
        if (this.tempsRestant <= 0) {
            this.jouEnCours = false;
            this.afficherFinDePartie();
            return;
        }

        requestAnimationFrame(() => this.boucleJeu());
    }

    afficherFinDePartie() {

        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
}