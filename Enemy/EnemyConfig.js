// Configuration des différents types d'ennemis (Pirates)
const ENEMY_CONFIG = {
    pirate_basic: {
        id: 'pirate_basic',
        name: 'Pirate',
        hp: 5,
        speed: 60,
        color: 0x8B4513, // Marron
        size: 10,
        reward: 10,
        description: 'Pirate basique'
    },
    pirate_shield: {
        id: 'pirate_shield',
        name: 'Pirate Blindé',
        hp: 15,
        speed: 40,
        color: 0x708090, // Gris métallique
        size: 12,
        reward: 20,
        description: 'Pirate avec armure - Lent mais résistant'
    },
    pirate_fast: {
        id: 'pirate_fast',
        name: 'Pirate Rapide',
        hp: 3,
        speed: 100,
        color: 0xFF4500, // Rouge-orange
        size: 8,
        reward: 15,
        description: 'Pirate agile - Rapide mais fragile'
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

