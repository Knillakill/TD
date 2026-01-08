// Configuration des tours (Personnages One Piece)
// Stats de base niveau 1 + bonus par niveau selon spécialité
const TOWER_CONFIG = {
    luffy: {
        id: 'luffy',
        name: 'Luffy',
        description: 'Attaque en cône, équilibré',
        cost: 0,
        // Stats de base niveau 1
        baseDamage: 5,
        baseFireRate: 2.5,      // secondes
        baseCritChance: 3,
        baseRange: 100,
        // Bonus par niveau (spécialité: équilibré)
        damagePerLevel: 3,
        fireRatePerLevel: -0.05, // réduit = plus rapide
        critPerLevel: 0.5,
        rangePerLevel: 2,
        // Coût de level up
        upgradeCost: 50,        // coût de base, augmente avec le niveau
        shape: 'Cône',
        terrain: 'Tous',
        target: 'Cône',
        color: 0xef4444, // Rouge doux
        rarity: 'common',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    zoro: {
        id: 'zoro',
        name: 'Zoro',
        description: 'Attaque en zone, dégâts élevés',
        cost: 100,
        baseDamage: 8,
        baseFireRate: 3.0,
        baseCritChance: 5,
        baseRange: 120,
        // Spécialité: dégâts
        damagePerLevel: 6,
        fireRatePerLevel: -0.03,
        critPerLevel: 0.8,
        rangePerLevel: 3,
        upgradeCost: 80,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Zone',
        color: 0x22c55e, // Vert émeraude
        rarity: 'rare',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    nami: {
        id: 'nami',
        name: 'Nami',
        description: 'Longue portée, critique élevé',
        cost: 80,
        baseDamage: 4,
        baseFireRate: 1.5,
        baseCritChance: 10,
        baseRange: 180,
        // Spécialité: portée + critique
        damagePerLevel: 2,
        fireRatePerLevel: -0.02,
        critPerLevel: 1.5,
        rangePerLevel: 5,
        upgradeCost: 60,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Solo',
        color: 0xf97316, // Orange mandarine
        rarity: 'common',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    sanji: {
        id: 'sanji',
        name: 'Sanji',
        description: 'Attaque très rapide',
        cost: 90,
        baseDamage: 3,
        baseFireRate: 0.8,
        baseCritChance: 5,
        baseRange: 90,
        // Spécialité: vitesse d'attaque
        damagePerLevel: 2,
        fireRatePerLevel: -0.015,
        critPerLevel: 0.3,
        rangePerLevel: 1,
        upgradeCost: 70,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Solo',
        color: 0xfbbf24, // Jaune doré
        rarity: 'rare',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    robin: {
        id: 'robin',
        name: 'Robin',
        description: 'Zone d\'effet moyenne',
        cost: 120,
        baseDamage: 6,
        baseFireRate: 2.0,
        baseCritChance: 2,
        baseRange: 130,
        // Spécialité: zone équilibrée
        damagePerLevel: 4,
        fireRatePerLevel: -0.04,
        critPerLevel: 0.2,
        rangePerLevel: 3,
        upgradeCost: 90,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Zone',
        color: 0xa855f7, // Violet améthyste
        rarity: 'epic',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    franky: {
        id: 'franky',
        name: 'Franky',
        description: 'Puissance brute, lent',
        cost: 150,
        baseDamage: 15,
        baseFireRate: 3.5,
        baseCritChance: 15,
        baseRange: 120,
        // Spécialité: gros dégâts + critique
        damagePerLevel: 8,
        fireRatePerLevel: -0.02,
        critPerLevel: 1.0,
        rangePerLevel: 2,
        upgradeCost: 100,
        shape: 'Ligne',
        terrain: 'Tous',
        target: 'Perçant',
        color: 0x06b6d4, // Cyan turquoise
        rarity: 'epic',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    chopper: {
        id: 'chopper',
        name: 'Chopper',
        description: 'Support, soigne les alliés',
        cost: 60,
        baseDamage: 2,
        baseFireRate: 1.5,
        baseCritChance: 0,
        baseRange: 110,
        // Spécialité: support (stats faibles mais effet spécial)
        damagePerLevel: 1,
        fireRatePerLevel: -0.02,
        critPerLevel: 0,
        rangePerLevel: 2,
        upgradeCost: 40,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Solo',
        color: 0xf472b6, // Rose bonbon
        rarity: 'common',
        level: 1,
        maxLevel: 50,
        passive: 'Soins alliés'
    },
    brook: {
        id: 'brook',
        name: 'Brook',
        description: 'Vitesse extrême, faible puissance',
        cost: 70,
        baseDamage: 2,
        baseFireRate: 0.5,
        baseCritChance: 8,
        baseRange: 100,
        // Spécialité: attaque ultra rapide
        damagePerLevel: 1.5,
        fireRatePerLevel: -0.01,
        critPerLevel: 0.6,
        rangePerLevel: 1,
        upgradeCost: 50,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Solo',
        color: 0xe2e8f0, // Blanc-gris
        rarity: 'rare',
        level: 1,
        maxLevel: 50,
        passive: ''
    },
    usopp: {
        id: 'usopp',
        name: 'Usopp',
        description: 'Tireur d\'élite, longue portée',
        cost: 90,
        baseDamage: 3,
        baseFireRate: 0.5,
        baseCritChance: 12,
        baseRange: 200,
        // Spécialité: sniper (portée + critique)
        damagePerLevel: 3,
        fireRatePerLevel: -0.03,
        critPerLevel: 1.2,
        rangePerLevel: 6,
        upgradeCost: 70,
        shape: 'Cercle',
        terrain: 'Tous',
        target: 'Solo',
        color: 0xeab308, // Jaune doré
        rarity: 'rare',
        level: 1,
        maxLevel: 50,
        passive: 'Sniper'
    }
};

// Fonction pour calculer les stats d'une tour à un niveau donné
function getTowerStats(towerId, level) {
    const config = TOWER_CONFIG[towerId];
    if (!config) return null;
    
    const lvl = Math.min(level, config.maxLevel);
    const levelBonus = lvl - 1;
    
    return {
        ...config,
        level: lvl,
        damage: Math.round(config.baseDamage + config.damagePerLevel * levelBonus),
        fireRate: Math.max(0.2, config.baseFireRate + config.fireRatePerLevel * levelBonus),
        critChance: config.baseCritChance + config.critPerLevel * levelBonus,
        range: config.baseRange + config.rangePerLevel * levelBonus
    };
}

// Fonction pour calculer le coût de level up
function getUpgradeCost(towerId, currentLevel) {
    const config = TOWER_CONFIG[towerId];
    if (!config) return Infinity;
    if (currentLevel >= config.maxLevel) return Infinity;
    
    // Coût augmente de 20% par niveau
    return Math.round(config.upgradeCost * Math.pow(1.2, currentLevel - 1));
}

// Ordre d'affichage dans le menu
const TOWER_ORDER = ['luffy', 'zoro', 'nami', 'sanji', 'robin', 'franky', 'chopper', 'brook', 'usopp'];
