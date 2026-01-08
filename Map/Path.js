// Configuration de la map
const MAP_OFFSET_X = 300;
const MAP_WIDTH = 1100;
const MAP_HEIGHT = 800;

// Chemin selon la flèche rouge : maison → bas → droite → haut → Arlong Park
const PATH_PERCENT = [
    // DÉPART : Milieu bas de la maison (toit rouge)
    { x: 0.139, y: 0.15 },
    
    // Descente verticale sur le chemin de sable (plus à droite)
    { x: 0.139, y: 0.90 },
    
    // Virage vers la droite - ligne horizontale en bas
    { x: 0.55, y: 0.90 },
    
    // Remontée verticale à droite
    { x: 0.55, y: 0.80 },
    { x: 0.60, y: 0.80 },
    
    { x: 0.76, y: 0.65 },
    // ARRIVÉE : vers Arlong Park
    { x: 0.76, y: 0.16 },
];

// Convertir les pourcentages en pixels
function convertPath() {
    return PATH_PERCENT.map(point => ({
        x: MAP_OFFSET_X + (point.x * MAP_WIDTH),
        y: point.y * MAP_HEIGHT
    }));
}

const PATH = convertPath();

// Fonction pour compatibilité
function getRandomPath() {
    return PATH;
}

const PATHS = [PATH];

