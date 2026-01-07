// Chemin suivant le cercle GRIS de la porte (bas-gauche) à la croix (haut-droite)
// Offset X = 300 (panneau gauche), Map 1100x800
// Centre approximatif: X=850, Y=400, Rayon ~280px
const PATH = [
    // START - Porte en bas à gauche
    { x: 370, y: 710 },
    
    // Montée le long du côté GAUCHE
    { x: 360, y: 660 },
    { x: 350, y: 610 },
    { x: 345, y: 560 },
    { x: 345, y: 510 },
    { x: 350, y: 460 },
    { x: 360, y: 410 },
    { x: 375, y: 360 },
    { x: 395, y: 315 },
    { x: 420, y: 270 },
    
    // Virage HAUT-GAUCHE vers HAUT
    { x: 455, y: 230 },
    { x: 500, y: 195 },
    { x: 550, y: 165 },
    { x: 605, y: 145 },
    { x: 660, y: 135 },
    { x: 715, y: 130 },
    { x: 770, y: 135 },
    
    // Section HAUT vers HAUT-DROITE
    { x: 825, y: 145 },
    { x: 875, y: 165 },
    { x: 920, y: 195 },
    { x: 960, y: 230 },
    { x: 995, y: 270 },
    
    // Descente le long du côté DROIT
    { x: 1020, y: 315 },
    { x: 1040, y: 360 },
    { x: 1055, y: 410 },
    { x: 1065, y: 460 },
    { x: 1070, y: 510 },
    { x: 1070, y: 560 },
    { x: 1065, y: 610 },
    { x: 1055, y: 660 },
    
    // Virage BAS-DROITE vers BAS
    { x: 1040, y: 705 },
    { x: 1015, y: 745 },
    { x: 980, y: 775 },
    { x: 935, y: 795 },
    { x: 885, y: 805 },
    
    // Section BAS vers centre-bas
    { x: 835, y: 805 },
    { x: 785, y: 795 },
    { x: 740, y: 775 },
    { x: 700, y: 745 },
    { x: 665, y: 710 },
    { x: 640, y: 670 },
    { x: 625, y: 625 },
    
    // Remontée vers le centre puis sortie vers la CROIX (haut-droite)
    { x: 620, y: 575 },
    { x: 625, y: 525 },
    { x: 640, y: 480 },
    { x: 665, y: 440 },
    { x: 700, y: 410 },
    { x: 745, y: 390 },
    { x: 800, y: 380 },
    { x: 860, y: 385 },
    { x: 920, y: 405 },
    { x: 975, y: 435 },
    { x: 1020, y: 475 },
    { x: 1055, y: 520 },
    { x: 1080, y: 570 },
    { x: 1095, y: 620 },
    { x: 1105, y: 670 },
    { x: 1110, y: 720 },
    
    // Sortie finale vers la CROIX (haut-droite)
    { x: 1150, y: 700 },
    { x: 1200, y: 650 },
    { x: 1250, y: 580 },
    { x: 1290, y: 500 },
    { x: 1320, y: 410 },
    { x: 1340, y: 310 },
    { x: 1350, y: 200 },
    { x: 1355, y: 100 },  // END - CROIX en haut à droite
];

