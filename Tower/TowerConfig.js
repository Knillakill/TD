// Configuration des tours (Personnages One Piece)
const TOWER_CONFIG = {
    luffy: {
        id: 'luffy',
        name: 'Luffy',
        description: 'Équilibré et polyvalent',
        cost: 0, // Gratuit au début
        damage: 2,
        fireRate: 800,
        range: 100,
        color: 0xff0000, // Rouge
        rarity: 'common'
    },
    zoro: {
        id: 'zoro',
        name: 'Zoro',
        description: 'Dégâts élevés',
        cost: 100,
        damage: 4,
        fireRate: 1200,
        range: 90,
        color: 0x00ff00, // Vert
        rarity: 'rare'
    },
    nami: {
        id: 'nami',
        name: 'Nami',
        description: 'Portée exceptionnelle',
        cost: 80,
        damage: 1.5,
        fireRate: 1000,
        range: 150,
        color: 0xff8800, // Orange
        rarity: 'common'
    },
    sanji: {
        id: 'sanji',
        name: 'Sanji',
        description: 'Attaque rapide',
        cost: 90,
        damage: 2,
        fireRate: 500,
        range: 85,
        color: 0xffff00, // Jaune
        rarity: 'rare'
    },
    robin: {
        id: 'robin',
        name: 'Robin',
        description: 'Zone d\'effet',
        cost: 120,
        damage: 1,
        fireRate: 1500,
        range: 120,
        color: 0x9900ff, // Violet
        rarity: 'epic'
    },
    franky: {
        id: 'franky',
        name: 'Franky',
        description: 'Puissance dévastatrice',
        cost: 150,
        damage: 6,
        fireRate: 2000,
        range: 110,
        color: 0x00ffff, // Cyan
        rarity: 'epic'
    },
    chopper: {
        id: 'chopper',
        name: 'Chopper',
        description: 'Support et soins',
        cost: 60,
        damage: 1,
        fireRate: 800,
        range: 95,
        color: 0xff69b4, // Rose
        rarity: 'common'
    },
    brook: {
        id: 'brook',
        name: 'Brook',
        description: 'Vitesse extrême',
        cost: 70,
        damage: 1.5,
        fireRate: 400,
        range: 80,
        color: 0xffffff, // Blanc
        rarity: 'rare'
    }
};

// Ordre d'affichage dans le menu
const TOWER_ORDER = ['luffy', 'zoro', 'nami', 'sanji', 'robin', 'franky', 'chopper', 'brook'];

