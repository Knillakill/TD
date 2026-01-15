// Configuration des ennemis - Arc Arlong Park
// IMPORTANT: Chaque ID doit être unique (pas de doublons)

const ENEMY_CONFIG = {
    // ============================================
    // === TIER 1 : ANIMAUX FAIBLES (Vagues 1+) ===
    // ============================================
    
    greenfhishmen: {
        id: 'greenfhishmen',
        name: 'Green Fishman',
        description: 'Homme-poisson vert',
        hp: 60,
        speed: 50,
        regen: 0,
        color: 0x2E8B57,
        size: 10,
        reward: 4,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1,
        sprite: 'greenfhishmen'
    },
    
    // ============================================
    // === TIER 2 : ANIMAUX MOYENS (Vagues 4+) ===
    // ============================================
    
    wolf: {
        id: 'wolf',
        name: 'Loup',
        description: 'Prédateur sauvage',
        hp: 120,
        speed: 55,
        regen: 0,
        color: 0x696969,
        size: 11,
        reward: 6,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 2,
        sprite: 'wolf'
    },
    
    shadowbat: {
        id: 'shadowbat',
        name: 'Chauve-souris',
        description: 'Créature volante',
        hp: 80,
        speed: 70,
        regen: 0,
        color: 0x1C1C1C,
        size: 8,
        reward: 5,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 2,
        sprite: 'shadowbat'
    },
    
    raptor: {
        id: 'raptor',
        name: 'Raptor',
        description: 'Dinosaure rapide',
        hp: 150,
        speed: 60,
        regen: 0,
        color: 0x8B4513,
        size: 12,
        reward: 8,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 2,
        sprite: 'raptor'
    },
    
    // ============================================
    // === TIER 3 : ANIMAUX FORTS (Vagues 8+) ===
    // ============================================
    
    golem: {
        id: 'golem',
        name: 'Golem',
        description: 'Créature de pierre',
        hp: 300,
        speed: 30,
        regen: 0,
        color: 0x808080,
        size: 14,
        reward: 12,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 3,
        sprite: 'golem'
    },
    
    kungfu: {
        id: 'kungfu',
        name: 'Guerrier',
        description: 'Combattant martial',
        hp: 250,
        speed: 50,
        regen: 0,
        color: 0xFF4500,
        size: 12,
        reward: 15,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'kungfu'
    },
    
    prisoner: {
        id: 'prisoner',
        name: 'Prisonnier',
        description: 'Évadé dangereux',
        hp: 280,
        speed: 45,
        regen: 0,
        color: 0x654321,
        size: 11,
        reward: 13,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'prisoner'
    },
    
    pterosaur: {
        id: 'pterosaur',
        name: 'Ptérosaure',
        description: 'Reptile volant',
        hp: 200,
        speed: 65,
        regen: 0,
        color: 0x8B0000,
        size: 13,
        reward: 14,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'pterosaur'
    },
    
    // ============================================
    // === TIER 3B : PIRATES BASIQUES (Vagues 10+) ===
    // ============================================
    
    pirate_basic: {
        id: 'pirate_basic',
        name: 'Pirate',
        description: 'Pirate de base',
        hp: 320,
        speed: 40,
        regen: 0,
        color: 0x8B4513,
        size: 10,
        reward: 12,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'swd_pirate_walk'
    },
    
    pirate_recruit: {
        id: 'pirate_recruit',
        name: 'Recrue',
        description: 'Nouveau membre',
        hp: 280,
        speed: 48,
        regen: 0,
        color: 0xA0522D,
        size: 9,
        reward: 10,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'swd_pirate_walk'
    },
    
    pirate_basic2: {
        id: 'pirate_basic2',
        name: 'Vétéran',
        description: 'Pirate expérimenté',
        hp: 380,
        speed: 35,
        regen: 0,
        color: 0x654321,
        size: 11,
        reward: 14,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'swd_pirate_walk'
    },
    
    // ============================================
    // === TIER 4 : PIRATES AVANCÉS (Vagues 14+) ===
    // ============================================
    
    pirate_fast: {
        id: 'pirate_fast',
        name: 'Éclaireur',
        description: 'Pirate rapide',
        hp: 350,
        speed: 75,
        regen: 0,
        color: 0xFF6B35,
        size: 9,
        reward: 15,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 4,
        sprite: 'gun_pirate_walk'
    },
    
    pirate_shield: {
        id: 'pirate_shield',
        name: 'Bouclier',
        description: 'Pirate défensif',
        hp: 600,
        shield: 20,
        speed: 25,
        regen: 0.5,
        color: 0x708090,
        size: 12,
        reward: 18,
        stunVuln: false,
        slowVuln: true,
        burnVuln: false,
        poisonVuln: true,
        tier: 4,
        sprite: 'knife_pirate_walk'
    },
    
    pirate_assassin: {
        id: 'pirate_assassin',
        name: 'Assassin',
        description: 'Tueur silencieux',
        hp: 450,
        speed: 80,
        regen: 0,
        color: 0x2F4F4F,
        size: 9,
        reward: 16,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 4,
        sprite: 'gun_pirate_walk'
    },
    
    // ============================================
    // === TIER 5 : HOMMES-POISSONS BASIQUES (Vagues 18+) ===
    // ============================================
    
    fishman_grunt: {
        id: 'fishman_grunt',
        name: 'Homme-Poisson',
        description: 'Soldat d\'Arlong',
        hp: 800,
        speed: 45,
        regen: 1,
        color: 0x4682B4,
        size: 11,
        reward: 20,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 5,
        sprite: 'fishman'
    },
    
    fishman_swimmer: {
        id: 'fishman_swimmer',
        name: 'Nageur',
        description: 'Homme-poisson rapide',
        hp: 600,
        speed: 65,
        regen: 0.5,
        color: 0x00CED1,
        size: 9,
        reward: 18,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 5,
        sprite: 'fishman'
    },
    
    fishman_spear: {
        id: 'fishman_spear',
        name: 'Lancier',
        description: 'Homme-poisson armé',
        hp: 900,
        speed: 38,
        regen: 0.5,
        color: 0x2F4F4F,
        size: 12,
        reward: 22,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 5,
        sprite: 'fishman'
    },
    
    fishman_brawler: {
        id: 'fishman_brawler',
        name: 'Bagarreur',
        description: 'Homme-poisson costaud',
        hp: 1100,
        speed: 30,
        regen: 1,
        color: 0x8B0000,
        size: 13,
        reward: 25,
        stunVuln: true,
        slowVuln: true,
        burnVuln: false,
        poisonVuln: true,
        tier: 5,
        sprite: 'fishman2'
    },
    
    // ============================================
    // === TIER 6 : HOMMES-POISSONS ÉLITES (Vagues 28+) ===
    // ============================================
    
    fishman_elite: {
        id: 'fishman_elite',
        name: 'Élite',
        description: 'Garde d\'élite d\'Arlong',
        hp: 1000,
        speed: 42,
        regen: 1,
        color: 0x191970,
        size: 13,
        reward: 24,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 6,
        sprite: 'fishman'
    },
    
    fishman_berserker: {
        id: 'fishman_berserker',
        name: 'Berserker',
        description: 'Homme-poisson enragé',
        hp: 700,
        speed: 70,
        regen: 0,
        color: 0xDC143C,
        size: 11,
        reward: 20,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 6,
        sprite: 'fishman'
    },
    
    fishman_officer: {
        id: 'fishman_officer',
        name: 'Officier',
        description: 'Commandant d\'Arlong',
        hp: 1300,
        speed: 35,
        regen: 1.5,
        color: 0x4B0082,
        size: 14,
        reward: 28,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 6,
        sprite: 'fishman'
    },
    
    fishman_merman: {
        id: 'fishman_merman',
        name: 'Triton',
        description: 'Noble homme-poisson',
        hp: 950,
        shield: 15,
        speed: 50,
        regen: 2,
        color: 0x00BFFF,
        size: 12,
        reward: 26,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 6,
        sprite: 'fishman'
    },
    
    // ============================================
    // === TIER 7 : CHAMPIONS + ANIMAUX PUISSANTS (Vagues 38+) ===
    // ============================================
    
    fishman_champion: {
        id: 'fishman_champion',
        name: 'Champion',
        description: 'Guerrier d\'élite',
        hp: 1500,
        shield: 25,
        speed: 38,
        regen: 2,
        color: 0x800080,
        size: 15,
        reward: 32,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 7,
        sprite: 'fishman'
    },
    
    fishman_shaman: {
        id: 'fishman_shaman',
        name: 'Shaman',
        description: 'Soigneur mystique',
        hp: 650,
        speed: 28,
        regen: 5,
        color: 0x98FB98,
        size: 11,
        reward: 30,
        stunVuln: true,
        slowVuln: true,
        burnVuln: false,
        poisonVuln: false,
        tier: 7,
        sprite: 'fishman'
    },
    
    octopus_warrior: {
        id: 'octopus_warrior',
        name: 'Poulpe Guerrier',
        description: 'Guerrier tentaculaire',
        hp: 1200,
        speed: 25,
        regen: 1,
        color: 0xFF69B4,
        size: 16,
        reward: 28,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 7
    },
    
    gorilla: {
        id: 'gorilla',
        name: 'Gorille',
        description: 'Singe puissant',
        hp: 2000,
        speed: 35,
        regen: 1,
        color: 0x2F4F4F,
        size: 16,
        reward: 35,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 7,
        sprite: 'gorilla'
    },
    
    jellyfish: {
        id: 'jellyfish',
        name: 'Méduse',
        description: 'Créature venimeuse',
        hp: 1800,
        speed: 38,
        regen: 2,
        color: 0xFF69B4,
        size: 12,
        reward: 40,
        stunVuln: true,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: false,
        tier: 7,
        sprite: 'jellyfish'
    },
    
    // ============================================
    // === TIER 8 : MONSTRES MARINS (Vagues 41+) ===
    // ============================================
    
    sea_beast: {
        id: 'sea_beast',
        name: 'Bête Marine',
        description: 'Créature des profondeurs',
        hp: 3000,
        speed: 22,
        regen: 3,
        color: 0x006400,
        size: 18,
        reward: 50,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 8
    },
    
    mohmoo_calf: {
        id: 'mohmoo_calf',
        name: 'Bébé Mohmoo',
        description: 'Veau de monstre marin',
        hp: 2200,
        speed: 30,
        regen: 2,
        color: 0x87CEEB,
        size: 17,
        reward: 42,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 8
    },
    
    shark_hunter: {
        id: 'shark_hunter',
        name: 'Requin Chasseur',
        description: 'Prédateur aquatique',
        hp: 1800,
        speed: 55,
        regen: 1,
        color: 0x778899,
        size: 14,
        reward: 38,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 8
    },
    
    // ============================================
    // === TIER 9 : GÉNÉRAUX ET LÉGENDES (Vagues 36+) ===
    // ============================================
    
    fishman_general: {
        id: 'fishman_general',
        name: 'Général',
        description: 'Haut commandant',
        hp: 3500,
        shield: 40,
        speed: 28,
        regen: 3,
        color: 0x4A0080,
        size: 17,
        reward: 60,
        stunVuln: false,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: true,
        tier: 9,
        sprite: 'fishman'
    },
    
    sea_king_spawn: {
        id: 'sea_king_spawn',
        name: 'Rejeton du Roi',
        description: 'Jeune Roi des Mers',
        hp: 4000,
        speed: 20,
        regen: 4,
        color: 0x2E8B57,
        size: 20,
        reward: 65,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 9
    },
    
    ancient_fishman: {
        id: 'ancient_fishman',
        name: 'Ancien',
        description: 'Homme-poisson millénaire',
        hp: 8000,
        shield: 50,
        speed: 22,
        regen: 5,
        color: 0x2F4F4F,
        size: 18,
        reward: 80,
        stunVuln: false,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: false,
        tier: 9,
        sprite: 'fishman'
    },
    
    sea_king: {
        id: 'sea_king',
        name: 'Roi des Mers',
        description: 'Monstre légendaire',
        hp: 12000,
        speed: 18,
        regen: 6,
        color: 0x1E90FF,
        size: 22,
        reward: 100,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 9
    },
    
    // ============================================
    // === MINI-BOSS ===
    // ============================================
    
    chew: {
        id: 'chew',
        name: 'CHEW',
        description: 'Homme-poisson cracheur d\'eau',
        hp: 5000,
        speed: 32,
        regen: 3,
        color: 0x4169E1,
        size: 16,
        reward: 100,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 25,
        isMiniBoss: true,
        bossWave: 25,
        reappearWeight: 2,
        sprite: 'chew_walk'
    },
    
    hachi: {
        id: 'hachi',
        name: 'HACHI',
        description: 'Poulpe à 6 épées',
        hp: 15000,
        shield: 150,
        speed: 28,
        regen: 6,
        color: 0xFF6347,
        size: 18,
        reward: 250,
        stunVuln: true,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: true,
        tier: 50,
        isMiniBoss: true,
        bossWave: 50,
        reappearWeight: 1.5
    },
    
    kuroobi: {
        id: 'kuroobi',
        name: 'KUROOBI',
        description: 'Maître du Fish-Man Karate',
        hp: 25000,
        shield: 200,
        speed: 35,
        regen: 8,
        color: 0x800000,
        size: 19,
        reward: 400,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 75,
        isMiniBoss: true,
        bossWave: 75,
        reappearWeight: 1
    },
    
    // ============================================
    // === BOSS FINAL ===
    // ============================================
    
    arlong: {
        id: 'arlong',
        name: 'ARLONG',
        description: 'Capitaine des Pirates du Soleil',
        hp: 50000,
        shield: 400,
        speed: 25,
        regen: 15,
        color: 0x0000CD,
        size: 26,
        reward: 1000,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 100,
        isBoss: true,
        bossWave: 100
    }
};

/**
 * === SYSTÈME DE HORDES ===
 */
const HORDE_STAT_DIVISOR = 2.5;

function getWaveHpScaling(waveNumber) {
    const linear = 0.04 * waveNumber;
    const quadratic = 0.0005 * waveNumber * waveNumber;
    const baseScaling = 0.5 + linear + quadratic;
    return baseScaling / HORDE_STAT_DIVISOR;
}

function getWaveRewardScaling(waveNumber) {
    return (1 + (waveNumber - 1) * 0.03) / 1.5;
}

function getEnemyStats(enemyType, waveNumber) {
    const config = ENEMY_CONFIG[enemyType];
    if (!config) {
        console.error(`[ENEMY_CONFIG] Type d'ennemi inconnu: ${enemyType}`);
        return null;
    }
    
    const hpScaling = getWaveHpScaling(waveNumber);
    const rewardScaling = getWaveRewardScaling(waveNumber);
    
    const isBossType = config.isBoss || config.isMiniBoss;
    const bossMultiplier = isBossType ? 2.0 : 1.0;
    
    return {
        ...config,
        hp: Math.round(config.hp * hpScaling * bossMultiplier),
        shield: config.shield ? Math.round(config.shield * hpScaling * 0.5 * bossMultiplier) : 0,
        reward: Math.round(config.reward * rewardScaling)
    };
}

function getUnlockedMiniBosses(waveNumber) {
    const miniBosses = [];
    for (const [id, config] of Object.entries(ENEMY_CONFIG)) {
        if (config.isMiniBoss && config.bossWave <= waveNumber) {
            miniBosses.push(id);
        }
    }
    return miniBosses;
}
/**
 * Configuration manuelle des vagues
 * Format: { vague: { 'type_ennemi': nombre, ... } }
 */
const WAVE_ENEMY_DISTRIBUTION = {
    // VAGUES 1-5 : Apprentissage
    1: {
        'greenfhishmen': 3
    },
    2: {
        'greenfhishmen': 3,
        'wolf': 1
    },
    3: {
        'greenfhishmen': 2,
        'wolf': 3,
        'shadowbat': 2
    },
    4: {
        'wolf': 4,
        'shadowbat': 3,
        'raptor': 2
    },
    5: {
        'wolf': 3,
        'shadowbat': 3,
        'raptor': 3,
        'golem': 2
    },
    
    // VAGUES 6-10 : Introduction des animaux forts
    6: {
        'raptor': 4,
        'golem': 3,
        'kungfu': 3
    },
    7: {
        'golem': 4,
        'kungfu': 4,
        'prisoner': 3
    },
    8: {
        'kungfu': 4,
        'prisoner': 4,
        'pterosaur': 3
    },
    9: {
        'prisoner': 5,
        'pterosaur': 4,
        'golem': 3
    },
    10: {
        'pterosaur': 5,
        'golem': 4,
        'pirate_recruit': 4
    },
    
    // VAGUES 11-15 : Pirates basiques
    11: {
        'pirate_recruit': 5,
        'pirate_basic': 4,
        'pterosaur': 3
    },
    12: {
        'pirate_basic': 5,
        'pirate_basic2': 4,
        'pirate_recruit': 3
    },
    13: {
        'pirate_basic2': 6,
        'pirate_basic': 4,
        'pterosaur': 3
    },
    14: {
        'pirate_basic2': 6,
        'pirate_fast': 4,
        'pirate_shield': 3
    },
    15: {
        'pirate_fast': 5,
        'pirate_shield': 5,
        'pirate_assassin': 4
    },
    
    // VAGUES 16-20 : Hommes-poissons basiques
    16: {
        'pirate_shield': 4,
        'fishman_grunt': 5,
        'pirate_fast': 3
    },
    17: {
        'fishman_grunt': 6,
        'fishman_swimmer': 5,
        'pirate_assassin': 3
    },
    18: {
        'fishman_swimmer': 6,
        'fishman_spear': 5,
        'fishman_brawler': 4
    },
    19: {
        'fishman_spear': 6,
        'fishman_brawler': 5,
        'fishman_grunt': 4
    },
    20: {
        'fishman_brawler': 7,
        'fishman_spear': 6,
        'fishman_swimmer': 5
    },
    
    // VAGUES 21-24 : Préparation au premier boss
    21: {
        'fishman_brawler': 7,
        'fishman_elite': 5,
        'fishman_spear': 4
    },
    22: {
        'fishman_elite': 6,
        'fishman_berserker': 5,
        'fishman_brawler': 5
    },
    23: {
        'fishman_berserker': 7,
        'fishman_elite': 6,
        'fishman_officer': 4
    },
    24: {
        'fishman_officer': 6,
        'fishman_berserker': 6,
        'fishman_elite': 6
    },
    
    // VAGUE 25 : BOSS CHEW (le boss est automatiquement ajouté par le WaveManager)
    25: {
        'fishman_elite': 8,
        'fishman_berserker': 7,
        'fishman_officer': 6
        // 'chew' sera ajouté automatiquement par le système de boss
    },
    
    // VAGUES 26-30 : Montée en puissance
    26: {
        'fishman_officer': 8,
        'fishman_merman': 6,
        'fishman_elite': 6
    },
    27: {
        'fishman_merman': 8,
        'fishman_officer': 7,
        'fishman_champion': 5
    },
    28: {
        'fishman_champion': 7,
        'fishman_shaman': 6,
        'fishman_merman': 6
    },
    29: {
        'fishman_shaman': 8,
        'fishman_champion': 7,
        'octopus_warrior': 5
    },
    30: {
        'octopus_warrior': 8,
        'fishman_champion': 8,
        'fishman_shaman': 7
    },
    
    // VAGUES 31-35 : Animaux puissants
    31: {
        'gorilla': 6,
        'jellyfish': 6,
        'fishman_champion': 7,
        'octopus_warrior': 6
    },
    32: {
        'gorilla': 8,
        'jellyfish': 7,
        'octopus_warrior': 7,
        'fishman_shaman': 6
    },
    33: {
        'gorilla': 9,
        'jellyfish': 8,
        'fishman_champion': 8,
        'fishman_officer': 7
    },
    34: {
        'jellyfish': 10,
        'gorilla': 8,
        'fishman_shaman': 8,
        'fishman_merman': 7
    },
    35: {
        'gorilla': 10,
        'jellyfish': 10,
        'fishman_champion': 9,
        'octopus_warrior': 8
    },
    
    // VAGUES 36-40 : Mix intense
    36: {
        'fishman_general': 6,
        'gorilla': 8,
        'jellyfish': 8,
        'fishman_champion': 7
    },
    37: {
        'fishman_general': 7,
        'ancient_fishman': 6,
        'gorilla': 8,
        'jellyfish': 7
    },
    38: {
        'ancient_fishman': 8,
        'fishman_general': 7,
        'octopus_warrior': 8,
        'gorilla': 7
    },
    39: {
        'fishman_general': 9,
        'ancient_fishman': 8,
        'jellyfish': 9,
        'fishman_champion': 7
    },
    40: {
        'ancient_fishman': 10,
        'fishman_general': 9,
        'gorilla': 10,
        'jellyfish': 9
    },
    
    // VAGUES 41-49 : Préparation pour Hachi
    41: {
        'sea_beast': 7,
        'ancient_fishman': 9,
        'fishman_general': 8,
        'gorilla': 8
    },
    42: {
        'sea_beast': 8,
        'mohmoo_calf': 6,
        'ancient_fishman': 9,
        'jellyfish': 8
    },
    43: {
        'mohmoo_calf': 7,
        'sea_beast': 9,
        'fishman_general': 9,
        'gorilla': 8
    },
    44: {
        'sea_beast': 10,
        'mohmoo_calf': 8,
        'shark_hunter': 7,
        'ancient_fishman': 8
    },
    45: {
        'shark_hunter': 8,
        'sea_beast': 10,
        'mohmoo_calf': 8,
        'fishman_general': 9
    },
    46: {
        'shark_hunter': 9,
        'sea_beast': 10,
        'ancient_fishman': 10,
        'gorilla': 9
    },
    47: {
        'sea_beast': 11,
        'shark_hunter': 10,
        'mohmoo_calf': 9,
        'jellyfish': 10
    },
    48: {
        'shark_hunter': 11,
        'sea_beast': 11,
        'fishman_general': 10,
        'ancient_fishman': 10
    },
    49: {
        'sea_beast': 12,
        'shark_hunter': 11,
        'mohmoo_calf': 10,
        'fishman_general': 11
    },
    
    // VAGUE 50 : BOSS HACHI
    50: {
        'sea_beast': 12,
        'shark_hunter': 12,
        'ancient_fishman': 11,
        'fishman_general': 10
        // 'hachi' sera ajouté automatiquement
    },
    
    // VAGUES 51-74 : Montée finale vers Kuroobi et Arlong
    // ... (continuer de la même manière jusqu'à la vague 100)
    
    // VAGUE 75 : BOSS KUROOBI
    75: {
        'sea_king_spawn': 10,
        'ancient_fishman': 15,
        'fishman_general': 15,
        'shark_hunter': 14
        // 'kuroobi' sera ajouté automatiquement
    },
    
    // VAGUE 100 : BOSS FINAL ARLONG
    100: {
        'sea_king': 8,
        'sea_king_spawn': 12,
        'ancient_fishman': 18,
        'fishman_general': 20
        // 'arlong' sera ajouté automatiquement
    }
};

// Note: Les vagues non définies utiliseront la génération par défaut du WaveManager