// Configuration de la map
const MAP_OFFSET_X = 300;
const MAP_WIDTH = 1100;
const MAP_HEIGHT = 800;

// Chemin selon la flèche rouge : maison → bas → droite → haut → Arlong Park
const PATH_PERCENT = [
    // DÉPART : Milieu bas de la maison (toit rouge)
    { x: 0.15, y: 0 },
    
    // Descente verticale sur le chemin de sable (plus à droite)
    { x: 0.15, y: 0.78 },
    
    // Virage vers la droite - ligne horizontale en bas
    { x: 1, y: 0.78 },
    
    // Remontée verticale à droite
    // { x: 0.55, y: 0.80 },
    // { x: 0.60, y: 0.80 },
    
    // { x: 0.76, y: 0.65 },
    // // ARRIVÉE : vers Arlong Park
    // { x: 0.76, y: 0.16 },
];
const PATH_PERCENT2 = [
    // DÉPART : Milieu bas de la maison (toit rouge)
    { x: 0.15, y: 0 },
    
    // Descente verticale sur le chemin de sable (plus à droite)
    { x: 0.15, y: 0.40 },
    { x: 0.715, y: 0.40 },
    { x: 0.715, y: 0.78 },
    

    // Virage vers la droite - ligne horizontale en bas
    { x: 1, y: 0.78 },
    
    // Remontée verticale à droite
    // { x: 0.55, y: 0.80 },
    // { x: 0.60, y: 0.80 },
    
    // { x: 0.76, y: 0.65 },
    // // ARRIVÉE : vers Arlong Park
    // { x: 0.76, y: 0.16 },
];

// Convertir les pourcentages en pixels
function convertPath(pathPercent) {
    return pathPercent.map(point => ({
        x: MAP_OFFSET_X + (point.x * MAP_WIDTH),
        y: point.y * MAP_HEIGHT
    }));
}

// Convertir les deux chemins
const PATH = convertPath(PATH_PERCENT);
const PATH2 = convertPath(PATH_PERCENT2);

// Tableau des chemins disponibles
const PATHS = [PATH, PATH2];

// Système d'alternance équitable pour les chemins
let pathQueue = [];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fonction pour obtenir un chemin avec distribution équitable
function getRandomPath() {
    // Si la queue est vide, la remplir avec un lot équilibré
    if (pathQueue.length === 0) {
        // Créer un lot de 10 chemins (5 de chaque) et mélanger
        const batch = [];
        for (let i = 0; i < 5; i++) {
            batch.push(PATH);
            batch.push(PATH2);
        }
        pathQueue = shuffleArray(batch);
    }
    
    // Retourner le prochain chemin de la queue
    return pathQueue.pop();
}

