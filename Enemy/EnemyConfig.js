// Configuration des ennemis - Arc Arlong Park
// Chaque ennemi a des vulnérabilités/résistances uniques pour varier le gameplay

const ENEMY_CONFIG = {
    // ============================================
    // === TIER 1 : PIRATES DE BASE (Vagues 1-5) ===
    // ============================================
    
    pirate_basic: {
        id: 'pirate_basic',
        name: 'Pirate',
        description: 'Simple pirate du village',
        hp: 12,
        armor: 0,
        speed: 35,
        regen: 0,
        color: 0x8B4513,
        size: 10,
        reward: 3,
        // Vulnérabilités (true = vulnérable, false = résistant)
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1
    },
    
    pirate_recruit: {
        id: 'pirate_recruit',
        name: 'Recrue',
        description: 'Nouveau membre de l\'équipage',
        hp: 8,
        armor: 0,
        speed: 40,
        regen: 0,
        color: 0xA0522D,
        size: 9,
        reward: 2,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1
    },
    
    pirate_basic2: {
        id: 'pirate_basic2',
        name: 'Vétéran',
        description: 'Pirate expérimenté',
        hp: 18,
        armor: 2,
        speed: 32,
        regen: 0,
        color: 0x654321,
        size: 11,
        reward: 4,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1
    },
    
    // ============================================
    // === TIER 2 : HOMMES-POISSONS BASIQUES (Vagues 3-10) ===
    // ============================================
    
    fishman_grunt: {
        id: 'fishman_grunt',
        name: 'Homme-Poisson',
        description: 'Soldat d\'Arlong',
        hp: 20,
        armor: 3,
        speed: 38,
        regen: 0.5,
        color: 0x4682B4,
        size: 11,
        reward: 5,
        stunVuln: true,
        slowVuln: false,  // Habitué à l'eau, résiste au slow
        burnVuln: true,
        poisonVuln: true,
        tier: 2
    },
    
    fishman_swimmer: {
        id: 'fishman_swimmer',
        name: 'Nageur',
        description: 'Homme-poisson rapide',
        hp: 14,
        armor: 0,
        speed: 55,
        regen: 0,
        color: 0x00CED1,
        size: 9,
        reward: 4,
        stunVuln: true,
        slowVuln: false,  // Trop rapide dans l'eau
        burnVuln: true,
        poisonVuln: true,
        tier: 2
    },
    
    // ============================================
    // === TIER 3 : SPÉCIALISTES (Vagues 5-15) ===
    // ============================================
    
    pirate_fast: {
        id: 'pirate_fast',
        name: 'Éclaireur',
        description: 'Coureur rapide',
        hp: 10,
        armor: 0,
        speed: 70,
        regen: 0,
        color: 0xFF4500,
        size: 8,
        reward: 4,
        stunVuln: true,
        slowVuln: false,  // Trop agile
        burnVuln: true,
        poisonVuln: true,
        tier: 3
    },
    
    fishman_spear: {
        id: 'fishman_spear',
        name: 'Lancier',
        description: 'Homme-poisson armé',
        hp: 25,
        armor: 5,
        speed: 30,
        regen: 0,
        color: 0x2F4F4F,
        size: 12,
        reward: 6,
        stunVuln: false,  // Bonne garde
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3
    },
    
    fishman_brawler: {
        id: 'fishman_brawler',
        name: 'Bagarreur',
        description: 'Homme-poisson costaud',
        hp: 30,
        armor: 8,
        speed: 28,
        regen: 0.3,
        color: 0x8B0000,
        size: 13,
        reward: 7,
        stunVuln: true,
        slowVuln: true,
        burnVuln: false,  // Peau épaisse
        poisonVuln: true,
        tier: 3
    },
    
    // ============================================
    // === TIER 4 : ÉLITES (Vagues 8-20) ===
    // ============================================
    
    pirate_shield: {
        id: 'pirate_shield',
        name: 'Bouclier',
        description: 'Défenseur avec bouclier',
        hp: 35,
        shield: 20,
        armor: 10,
        speed: 25,
        regen: 0.5,
        color: 0x708090,
        size: 12,
        reward: 8,
        stunVuln: false,  // Bouclier bloque les stuns
        slowVuln: true,
        burnVuln: false,  // Bouclier protège
        poisonVuln: true,
        tier: 4
    },
    
    fishman_elite: {
        id: 'fishman_elite',
        name: 'Élite',
        description: 'Garde d\'élite d\'Arlong',
        hp: 40,
        armor: 12,
        speed: 35,
        regen: 1,
        color: 0x191970,
        size: 13,
        reward: 10,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 4
    },
    
    fishman_berserker: {
        id: 'fishman_berserker',
        name: 'Berserker',
        description: 'Homme-poisson enragé',
        hp: 28,
        armor: 3,
        speed: 50,
        regen: 0,
        color: 0xDC143C,
        size: 11,
        reward: 8,
        stunVuln: false,  // Trop enragé
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Rage ignore le poison
        tier: 4
    },
    
    // ============================================
    // === TIER 5 : OFFICIERS (Vagues 12-30) ===
    // ============================================
    
    fishman_officer: {
        id: 'fishman_officer',
        name: 'Officier',
        description: 'Commandant d\'Arlong',
        hp: 55,
        armor: 15,
        speed: 30,
        regen: 1.5,
        color: 0x4B0082,
        size: 14,
        reward: 12,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Constitution robuste
        tier: 5
    },
    
    fishman_merman: {
        id: 'fishman_merman',
        name: 'Triton',
        description: 'Noble homme-poisson',
        hp: 45,
        shield: 15,
        armor: 8,
        speed: 40,
        regen: 2,
        color: 0x00BFFF,
        size: 12,
        reward: 11,
        stunVuln: true,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 5
    },
    
    pirate_assassin: {
        id: 'pirate_assassin',
        name: 'Assassin',
        description: 'Tueur silencieux',
        hp: 22,
        armor: 0,
        speed: 60,
        regen: 0,
        color: 0x2F4F4F,
        size: 9,
        reward: 9,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Immunisé au poison (expert)
        tier: 5
    },
    
    // ============================================
    // === TIER 6 : CHAMPIONS (Vagues 18-40) ===
    // ============================================
    
    fishman_champion: {
        id: 'fishman_champion',
        name: 'Champion',
        description: 'Guerrier d\'élite',
        hp: 70,
        shield: 25,
        armor: 18,
        speed: 32,
        regen: 2,
        color: 0x800080,
        size: 15,
        reward: 15,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 6
    },
    
    fishman_shaman: {
        id: 'fishman_shaman',
        name: 'Shaman',
        description: 'Soigneur mystique',
        hp: 35,
        armor: 5,
        speed: 28,
        regen: 5,  // Forte régén
        color: 0x98FB98,
        size: 11,
        reward: 14,
        stunVuln: true,
        slowVuln: true,
        burnVuln: false,  // Protection magique
        poisonVuln: false,  // Protection magique
        tier: 6
    },
    
    octopus_warrior: {
        id: 'octopus_warrior',
        name: 'Poulpe Guerrier',
        description: 'Guerrier tentaculaire',
        hp: 60,
        armor: 10,
        speed: 25,
        regen: 1,
        color: 0xFF69B4,
        size: 16,
        reward: 13,
        stunVuln: true,
        slowVuln: false,  // 8 tentacules = difficile à ralentir
        burnVuln: true,
        poisonVuln: false,  // Encre protectrice
        tier: 6
    },
    
    // ============================================
    // === TIER 7 : MONSTRES MARINS (Vagues 25-50) ===
    // ============================================
    
    sea_beast: {
        id: 'sea_beast',
        name: 'Bête Marine',
        description: 'Créature des profondeurs',
        hp: 90,
        armor: 20,
        speed: 22,
        regen: 3,
        color: 0x006400,
        size: 18,
        reward: 18,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,  // Peau humide
        poisonVuln: false,
        tier: 7
    },
    
    mohmoo_calf: {
        id: 'mohmoo_calf',
        name: 'Bébé Mohmoo',
        description: 'Veau de monstre marin',
        hp: 80,
        armor: 15,
        speed: 30,
        regen: 2,
        color: 0x87CEEB,
        size: 17,
        reward: 16,
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 7
    },
    
    shark_hunter: {
        id: 'shark_hunter',
        name: 'Requin Chasseur',
        description: 'Prédateur aquatique',
        hp: 65,
        armor: 12,
        speed: 50,
        regen: 1,
        color: 0x778899,
        size: 14,
        reward: 17,
        stunVuln: false,  // Prédateur féroce
        slowVuln: false,  // Très rapide dans l'eau
        burnVuln: true,
        poisonVuln: true,
        tier: 7
    },
    
    // ============================================
    // === TIER 8 : GÉNÉRAUX (Vagues 35-60) ===
    // ============================================
    
    fishman_general: {
        id: 'fishman_general',
        name: 'Général',
        description: 'Haut commandant',
        hp: 120,
        shield: 40,
        armor: 25,
        speed: 28,
        regen: 3,
        color: 0x4A0080,
        size: 17,
        reward: 25,
        stunVuln: false,
        slowVuln: false,
        burnVuln: false,  // Armure ignifugée
        poisonVuln: true,
        tier: 8
    },
    
    sea_king_spawn: {
        id: 'sea_king_spawn',
        name: 'Rejeton du Roi',
        description: 'Jeune Roi des Mers',
        hp: 150,
        armor: 30,
        speed: 20,
        regen: 4,
        color: 0x2E8B57,
        size: 20,
        reward: 28,
        stunVuln: false,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,
        tier: 8
    },
    
    // ============================================
    // === TIER 9 : LÉGENDES (Vagues 50-80) ===
    // ============================================
    
    ancient_fishman: {
        id: 'ancient_fishman',
        name: 'Ancien',
        description: 'Homme-poisson millénaire',
        hp: 200,
        shield: 50,
        armor: 35,
        speed: 22,
        regen: 5,
        color: 0x2F4F4F,
        size: 18,
        reward: 35,
        stunVuln: false,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: false,  // Immunité totale aux altérations
        tier: 9
    },
    
    sea_king: {
        id: 'sea_king',
        name: 'Roi des Mers',
        description: 'Monstre légendaire',
        hp: 250,
        armor: 40,
        speed: 18,
        regen: 6,
        color: 0x1E90FF,
        size: 22,
        reward: 40,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 9
    },
    
    // ============================================
    // === MINI-BOSS (Tous les 10 niveaux) ===
    // ============================================
    
    // VAGUE 10 - Chew (le premier à apparaître)
    chew: {
        id: 'chew',
        name: 'CHEW',
        description: 'Homme-poisson cracheur d\'eau',
        hp: 100,
        armor: 15,
        speed: 28,
        regen: 2,
        color: 0x4169E1,
        size: 16,
        reward: 50,
        stunVuln: true,
        slowVuln: false,  // Maître de l'eau
        burnVuln: true,   // Vulnérable au feu
        poisonVuln: true,
        tier: 10,
        isMiniBoss: true,
        bossWave: 10,
        // Après la vague 10, Chew peut réapparaître
        reappearWeight: 3  // Poids de réapparition (plus faible = plus rare)
    },
    
    // VAGUE 20 - Kuroobi
    kuroobi: {
        id: 'kuroobi',
        name: 'KUROOBI',
        description: 'Maître du Fish-Man Karate',
        hp: 180,
        shield: 50,
        armor: 25,
        speed: 32,
        regen: 3,
        color: 0x800000,
        size: 17,
        reward: 80,
        stunVuln: false,  // Trop puissant
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Discipline martiale
        tier: 20,
        isMiniBoss: true,
        bossWave: 20,
        reappearWeight: 2
    },
    
    // VAGUE 25 - Hatchan (Boss niveau 25)
    hatchan: {
        id: 'hatchan',
        name: 'HATCHAN',
        description: 'Poulpe à 6 épées',
        hp: 250,
        shield: 80,
        armor: 20,
        speed: 26,
        regen: 4,
        color: 0xFF6347,
        size: 18,
        reward: 120,
        stunVuln: true,
        slowVuln: false,  // 6 bras = difficile à arrêter
        burnVuln: false,  // Encre protectrice
        poisonVuln: true,
        tier: 25,
        isMiniBoss: true,
        bossWave: 25,
        reappearWeight: 2
    },
    
    // VAGUE 40 - Pisaro (Marine corrompu)
    pisaro: {
        id: 'pisaro',
        name: 'PISARO',
        description: 'Officier marine corrompu',
        hp: 300,
        shield: 100,
        armor: 35,
        speed: 24,
        regen: 5,
        color: 0x1C1C1C,
        size: 17,
        reward: 160,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 40,
        isMiniBoss: true,
        bossWave: 40,
        reappearWeight: 1.5
    },
    
    // VAGUE 50 - Mohmoo
    mohmoo: {
        id: 'mohmoo',
        name: 'MOHMOO',
        description: 'Monstre marin géant',
        hp: 450,
        armor: 40,
        speed: 18,
        regen: 8,
        color: 0x87CEEB,
        size: 24,
        reward: 200,
        stunVuln: true,  // Peut être étourdi malgré sa taille
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 50,
        isMiniBoss: true,
        bossWave: 50,
        reappearWeight: 1
    },
    
    // VAGUE 60 - Nez-Long (homme-poisson scie)
    saw_fishman: {
        id: 'saw_fishman',
        name: 'NEZ-LONG',
        description: 'Homme-poisson scie',
        hp: 380,
        shield: 120,
        armor: 45,
        speed: 30,
        regen: 6,
        color: 0x708090,
        size: 19,
        reward: 250,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 60,
        isMiniBoss: true,
        bossWave: 60,
        reappearWeight: 1
    },
    
    // VAGUE 70 - Shirahoshi's Shadow (ombre menaçante)
    shadow_beast: {
        id: 'shadow_beast',
        name: 'OMBRE DES MERS',
        description: 'Créature de légende',
        hp: 500,
        shield: 150,
        armor: 50,
        speed: 35,
        regen: 7,
        color: 0x2F2F2F,
        size: 20,
        reward: 300,
        stunVuln: false,
        slowVuln: false,
        burnVuln: false,
        poisonVuln: true,  // Seule faiblesse
        tier: 70,
        isMiniBoss: true,
        bossWave: 70,
        reappearWeight: 0.8
    },
    
    // VAGUE 75 - Sea King Alpha (Boss niveau 75)
    sea_king_alpha: {
        id: 'sea_king_alpha',
        name: 'ROI ALPHA',
        description: 'Roi des Mers dominant',
        hp: 650,
        shield: 200,
        armor: 55,
        speed: 22,
        regen: 10,
        color: 0x00008B,
        size: 22,
        reward: 400,
        stunVuln: false,
        slowVuln: true,   // Lent mais puissant
        burnVuln: true,
        poisonVuln: false,
        tier: 75,
        isMiniBoss: true,
        bossWave: 75,
        reappearWeight: 0.6
    },
    
    // VAGUE 90 - Arlong's Shadow (version ombre)
    arlong_shadow: {
        id: 'arlong_shadow',
        name: 'OMBRE D\'ARLONG',
        description: 'Manifestation de haine',
        hp: 800,
        shield: 250,
        armor: 60,
        speed: 28,
        regen: 12,
        color: 0x4A0082,
        size: 21,
        reward: 500,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: false,
        tier: 90,
        isMiniBoss: true,
        bossWave: 90,
        reappearWeight: 0.4
    },
    
    // ============================================
    // === BOSS FINAL - VAGUE 100 ===
    // ============================================
    
    arlong: {
        id: 'arlong',
        name: 'ARLONG',
        description: 'Capitaine des Pirates du Soleil',
        hp: 1500,
        shield: 400,
        armor: 70,
        speed: 25,
        regen: 15,
        color: 0x0000CD,
        size: 26,
        reward: 1000,
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,   // Vulnérable au feu (comme tous les hommes-poissons)
        poisonVuln: false,
        tier: 100,
        isBoss: true,
        bossWave: 100
    }
};

/**
 * === SYSTÈME DE HORDES ===
 * Plus d'ennemis avec moins de stats individuelles
 * Diviseur de stats pour équilibrer avec le nombre accru d'ennemis
 */
const HORDE_STAT_DIVISOR = 2.5; // Les ennemis ont 2.5x moins de HP

/**
 * Calcule le scaling des HP en fonction de la vague
 * @param {number} waveNumber - Numéro de la vague (1-100)
 * @returns {number} - Multiplicateur de HP (déjà divisé pour le mode horde)
 */
function getWaveHpScaling(waveNumber) {
    // Progression qui augmente avec le nombre de vague
    // Vague 1 = x0.4, Vague 25 = x1.5, Vague 50 = x2.4, Vague 75 = x3.5, Vague 100 = x6
    // Divisé par HORDE_STAT_DIVISOR pour compenser le nombre d'ennemis
    // Le scaling augmente de manière significative avec chaque vague
    const linear = 0.06 * waveNumber;
    const quadratic = 0.0008 * waveNumber * waveNumber;
    const baseScaling = 1 + linear + quadratic;
    
    // Diviser par le facteur de horde
    return baseScaling / HORDE_STAT_DIVISOR;
}

/**
 * Calcule le scaling de l'armure en fonction de la vague
 * @param {number} waveNumber - Numéro de la vague
 * @returns {number} - Bonus d'armure
 */
function getWaveArmorScaling(waveNumber) {
    // Armure réduite pour le mode horde (était 0.15 par niveau)
    return waveNumber * 0.08;
}

/**
 * Calcule le scaling de la récompense en fonction de la vague
 * Récompense ajustée car plus d'ennemis = plus de gold global
 * @param {number} waveNumber - Numéro de la vague
 * @returns {number} - Multiplicateur de récompense (réduit)
 */
function getWaveRewardScaling(waveNumber) {
    // Récompense réduite car plus d'ennemis
    return (1 + (waveNumber - 1) * 0.03) / 1.5;
}

/**
 * Récupère les stats d'un ennemi avec le scaling de vague appliqué
 * @param {string} enemyType - Type d'ennemi
 * @param {number} waveNumber - Numéro de vague pour le scaling
 * @returns {object} - Stats de l'ennemi avec scaling (mode horde)
 */
function getEnemyStats(enemyType, waveNumber) {
    const config = ENEMY_CONFIG[enemyType];
    if (!config) return null;
    
    const hpScaling = getWaveHpScaling(waveNumber);
    const armorBonus = getWaveArmorScaling(waveNumber);
    const rewardScaling = getWaveRewardScaling(waveNumber);
    
    // Les boss et mini-boss gardent plus de stats
    const isBossType = config.isBoss || config.isMiniBoss;
    const bossMultiplier = isBossType ? 2.0 : 1.0; // Boss 2x plus résistants
    
    return {
        ...config,
        hp: Math.round(config.hp * hpScaling * bossMultiplier),
        shield: config.shield ? Math.round(config.shield * hpScaling * 0.5 * bossMultiplier) : 0,
        armor: Math.round((config.armor + armorBonus) / (isBossType ? 1 : 1.5)),
        reward: Math.round(config.reward * rewardScaling)
    };
}

/**
 * Retourne la liste des mini-boss débloqués jusqu'à une vague donnée
 * @param {number} waveNumber - Vague actuelle
 * @returns {array} - Liste des IDs de mini-boss
 */
function getUnlockedMiniBosses(waveNumber) {
    const miniBosses = [];
    for (const [id, config] of Object.entries(ENEMY_CONFIG)) {
        if (config.isMiniBoss && config.bossWave <= waveNumber) {
            miniBosses.push(id);
        }
    }
    return miniBosses;
}

// Distribution des ennemis par vague (vagues 1-20 définies manuellement)
// === MODE HORDE : Plus d'ennemis avec moins de stats ===
const WAVE_ENEMY_DISTRIBUTION = {
    // === ACTE 1: Premiers pirates (Vagues 1-5) - 10 à 14 ennemis ===
    1: [
        'pirate_recruit', 'pirate_recruit', 'pirate_recruit', 'pirate_recruit', 'pirate_recruit',
        'pirate_basic', 'pirate_basic', 'pirate_recruit', 'pirate_recruit', 'pirate_basic'
    ],
    2: [
        'pirate_basic', 'pirate_basic', 'pirate_recruit', 'pirate_recruit', 'pirate_recruit',
        'pirate_basic', 'pirate_basic', 'pirate_recruit', 'pirate_basic', 'pirate_recruit', 'pirate_basic'
    ],
    3: [
        'pirate_basic', 'pirate_basic', 'pirate_basic', 'pirate_basic2', 'pirate_recruit',
        'fishman_grunt', 'pirate_basic', 'pirate_recruit', 'pirate_recruit', 'pirate_basic',
        'pirate_basic2', 'fishman_grunt'
    ],
    4: [
        'fishman_grunt', 'fishman_grunt', 'pirate_basic', 'pirate_basic', 'pirate_basic2',
        'fishman_swimmer', 'pirate_basic', 'pirate_recruit', 'pirate_basic', 'fishman_grunt',
        'pirate_basic2', 'pirate_basic', 'fishman_swimmer'
    ],
    5: [
        'pirate_basic2', 'fishman_grunt', 'fishman_swimmer', 'pirate_fast', 'fishman_grunt',
        'pirate_basic2', 'pirate_basic', 'fishman_grunt', 'pirate_fast', 'fishman_swimmer',
        'pirate_basic2', 'pirate_basic', 'fishman_grunt', 'pirate_basic2'
    ],
    
    // === ACTE 2: Arrivée des hommes-poissons (Vagues 6-10) - 15 à 20 ennemis ===
    6: [
        'fishman_grunt', 'fishman_grunt', 'fishman_swimmer', 'fishman_swimmer', 'pirate_fast',
        'fishman_spear', 'pirate_basic2', 'fishman_grunt', 'pirate_fast', 'fishman_grunt',
        'pirate_basic2', 'fishman_swimmer', 'pirate_basic', 'fishman_grunt', 'pirate_fast'
    ],
    7: [
        'fishman_spear', 'fishman_brawler', 'pirate_fast', 'fishman_grunt', 'fishman_swimmer',
        'pirate_basic2', 'fishman_grunt', 'pirate_fast', 'fishman_spear', 'fishman_grunt',
        'pirate_fast', 'fishman_swimmer', 'fishman_grunt', 'pirate_basic2', 'fishman_brawler', 'pirate_fast'
    ],
    8: [
        'pirate_shield', 'fishman_brawler', 'fishman_spear', 'pirate_fast', 'fishman_elite',
        'fishman_grunt', 'pirate_fast', 'fishman_grunt', 'fishman_spear', 'pirate_shield',
        'fishman_swimmer', 'pirate_fast', 'fishman_brawler', 'fishman_grunt', 'pirate_fast', 'fishman_spear', 'fishman_grunt'
    ],
    9: [
        'fishman_elite', 'fishman_brawler', 'pirate_shield', 'fishman_spear', 'pirate_fast',
        'pirate_fast', 'fishman_grunt', 'fishman_elite', 'fishman_spear', 'pirate_shield',
        'fishman_brawler', 'pirate_fast', 'fishman_grunt', 'fishman_grunt', 'pirate_fast', 'fishman_spear', 'fishman_swimmer', 'pirate_fast'
    ],
    10: [ // MINI-BOSS CHEW
        'fishman_elite', 'fishman_elite', 'fishman_brawler', 'fishman_brawler', 'pirate_shield',
        'fishman_spear', 'fishman_spear', 'pirate_fast', 'pirate_fast', 'fishman_grunt',
        'fishman_grunt', 'fishman_grunt', 'fishman_elite', 'fishman_brawler', 'pirate_shield',
        'fishman_spear', 'pirate_fast', 'fishman_grunt', 'fishman_swimmer', 'chew'
    ],
    
    // === ACTE 3: Montée en puissance (Vagues 11-20) - 20 à 30 ennemis ===
    11: [
        'fishman_elite', 'fishman_elite', 'fishman_berserker', 'pirate_assassin', 'fishman_brawler',
        'fishman_spear', 'fishman_grunt', 'fishman_grunt', 'pirate_fast', 'fishman_brawler',
        'fishman_elite', 'pirate_shield', 'fishman_spear', 'fishman_grunt', 'pirate_fast',
        'fishman_swimmer', 'fishman_brawler', 'pirate_assassin', 'fishman_grunt', 'fishman_elite'
    ],
    12: [
        'fishman_officer', 'pirate_assassin', 'fishman_berserker', 'fishman_elite', 'pirate_shield',
        'fishman_elite', 'fishman_brawler', 'pirate_fast', 'fishman_grunt', 'fishman_berserker',
        'pirate_assassin', 'fishman_officer', 'fishman_elite', 'pirate_shield', 'fishman_brawler',
        'fishman_spear', 'pirate_fast', 'fishman_grunt', 'fishman_elite', 'pirate_assassin', 'fishman_berserker'
    ],
    13: [
        'fishman_officer', 'fishman_merman', 'fishman_berserker', 'pirate_assassin', 'fishman_elite',
        'fishman_brawler', 'fishman_officer', 'fishman_elite', 'pirate_shield', 'fishman_berserker',
        'fishman_merman', 'pirate_assassin', 'fishman_officer', 'fishman_elite', 'fishman_brawler',
        'pirate_fast', 'fishman_grunt', 'fishman_berserker', 'fishman_elite', 'pirate_assassin', 'fishman_merman', 'fishman_officer'
    ],
    14: [
        'fishman_merman', 'fishman_champion', 'fishman_officer', 'fishman_berserker', 'pirate_assassin',
        'fishman_merman', 'fishman_elite', 'fishman_officer', 'fishman_brawler', 'fishman_champion',
        'pirate_assassin', 'fishman_berserker', 'fishman_merman', 'fishman_officer', 'fishman_elite',
        'pirate_shield', 'fishman_brawler', 'fishman_berserker', 'fishman_champion', 'pirate_assassin', 'fishman_merman', 'fishman_officer', 'fishman_elite'
    ],
    15: [
        'fishman_champion', 'fishman_shaman', 'fishman_officer', 'fishman_merman', 'fishman_elite',
        'fishman_champion', 'fishman_berserker', 'pirate_assassin', 'fishman_officer', 'fishman_shaman',
        'fishman_merman', 'fishman_elite', 'fishman_champion', 'fishman_officer', 'fishman_berserker',
        'pirate_assassin', 'fishman_merman', 'fishman_shaman', 'fishman_elite', 'fishman_champion', 'fishman_officer', 'fishman_berserker', 'fishman_merman', 'fishman_elite'
    ],
    16: [
        'fishman_shaman', 'octopus_warrior', 'fishman_champion', 'fishman_officer', 'fishman_merman',
        'fishman_shaman', 'fishman_champion', 'fishman_berserker', 'pirate_assassin', 'octopus_warrior',
        'fishman_officer', 'fishman_merman', 'fishman_shaman', 'fishman_champion', 'fishman_elite',
        'fishman_berserker', 'octopus_warrior', 'fishman_officer', 'fishman_merman', 'fishman_shaman', 'fishman_champion', 'pirate_assassin', 'fishman_elite', 'fishman_officer', 'octopus_warrior'
    ],
    17: [
        'octopus_warrior', 'fishman_shaman', 'fishman_champion', 'sea_beast', 'fishman_officer',
        'octopus_warrior', 'fishman_shaman', 'fishman_merman', 'fishman_champion', 'sea_beast',
        'fishman_berserker', 'octopus_warrior', 'fishman_shaman', 'fishman_officer', 'fishman_champion',
        'fishman_merman', 'sea_beast', 'fishman_shaman', 'octopus_warrior', 'fishman_champion', 'fishman_officer', 'fishman_berserker', 'fishman_merman', 'octopus_warrior', 'sea_beast', 'fishman_shaman'
    ],
    18: [
        'sea_beast', 'mohmoo_calf', 'octopus_warrior', 'fishman_champion', 'fishman_shaman',
        'sea_beast', 'octopus_warrior', 'fishman_champion', 'mohmoo_calf', 'fishman_officer',
        'fishman_shaman', 'sea_beast', 'octopus_warrior', 'fishman_merman', 'fishman_champion',
        'mohmoo_calf', 'fishman_shaman', 'sea_beast', 'octopus_warrior', 'fishman_officer', 'fishman_champion', 'fishman_berserker', 'mohmoo_calf', 'sea_beast', 'octopus_warrior', 'fishman_shaman', 'fishman_champion'
    ],
    19: [
        'mohmoo_calf', 'shark_hunter', 'sea_beast', 'octopus_warrior', 'fishman_champion', 'fishman_shaman',
        'mohmoo_calf', 'sea_beast', 'shark_hunter', 'fishman_officer', 'octopus_warrior', 'fishman_champion',
        'fishman_shaman', 'mohmoo_calf', 'sea_beast', 'shark_hunter', 'octopus_warrior', 'fishman_merman',
        'fishman_champion', 'fishman_shaman', 'mohmoo_calf', 'sea_beast', 'shark_hunter', 'octopus_warrior', 'fishman_officer', 'fishman_champion', 'fishman_berserker', 'mohmoo_calf', 'sea_beast'
    ],
    20: [ // MINI-BOSS KUROOBI
        'sea_beast', 'sea_beast', 'shark_hunter', 'shark_hunter', 'fishman_champion', 'fishman_champion',
        'octopus_warrior', 'octopus_warrior', 'mohmoo_calf', 'mohmoo_calf', 'fishman_shaman',
        'fishman_officer', 'fishman_merman', 'sea_beast', 'shark_hunter', 'fishman_champion',
        'octopus_warrior', 'fishman_shaman', 'mohmoo_calf', 'sea_beast', 'shark_hunter', 'fishman_officer',
        'fishman_champion', 'octopus_warrior', 'fishman_berserker', 'mohmoo_calf', 'sea_beast', 'fishman_champion', 'shark_hunter', 'kuroobi'
    ]
};
