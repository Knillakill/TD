// Configuration des différents types d'ennemis (Pirates)
const ENEMY_CONFIG = {
    pirate_basic: {
        id: 'pirate_basic',
        name: 'PIRATE',
        hp: 15,
        armor: 0,
        speed: 80,
        power: 1,
        regen: 0,
        color: 0x8B4513, // Marron
        size: 10,
        reward: 10,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        invisible: false
    },
    pirate_shield: {
        id: 'pirate_shield',
        name: 'BLINDÉ',
        hp: 150,
        armor: 5,
        speed: 50,
        power: 2,
        regen: 1,
        color: 0x708090, // Gris métallique
        size: 12,
        reward: 25,
        stunVuln: false,
        slowVuln: true,
        burnVuln: false,
        poisonVuln: true,
        invisible: false
    },
    pirate_fast: {
        id: 'pirate_fast',
        name: 'RAPIDE',
        hp: 30,
        armor: 0,
        speed: 120,
        power: 1,
        regen: 0,
        color: 0xFF4500, // Rouge-orange
        size: 8,
        reward: 15,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        invisible: false
    }
};

// Distribution des ennemis par vague
const WAVE_ENEMY_DISTRIBUTION = {
    1: ['pirate_basic', 'pirate_basic', 'pirate_basic', 'pirate_basic', 'pirate_basic'],
    2: ['pirate_basic', 'pirate_basic', 'pirate_basic', 'pirate_fast', 'pirate_fast'],
    3: ['pirate_basic', 'pirate_shield', 'pirate_basic', 'pirate_fast', 'pirate_basic'],
    4: ['pirate_fast', 'pirate_fast', 'pirate_shield', 'pirate_basic', 'pirate_fast'],
    5: ['pirate_shield', 'pirate_shield', 'pirate_fast', 'pirate_fast', 'pirate_basic']
    // Après la vague 5, génération automatique avec plus de variété
};

