// Configuration des tours (Personnages One Piece)
// Stats de base niveau 1 + bonus par niveau selon spécialité
// ÉQUILIBRÉ POUR ROGUELIKE - Tours faibles au début, scaling progressif sur 100 niveaux

// Types de terrain disponibles
const TERRAIN_TYPES = {
    HERBE: 'herbe',       // 🌿 Zones d'herbe
    PLAINE: 'plaine',     // 🏜️ Zones plates/sable
    MONTAGNE: 'montagne', // ⛰️ Zones rocheuses/élevées
    MER: 'mer'            // 🌊 Zones aquatiques/plage
};

// Couleurs et icônes pour chaque terrain
const TERRAIN_VISUALS = {
    herbe: { color: 0x22c55e, icon: '🌿', name: 'Herbe' },
    plaine: { color: 0xfbbf24, icon: '🏜️', name: 'Plaine' },
    montagne: { color: 0x78716c, icon: '⛰️', name: 'Montagne' },
    mer: { color: 0x3b82f6, icon: '🌊', name: 'Mer' }
};

const TOWER_CONFIG = {
    luffy: {
        id: 'luffy',
        name: 'Luffy',
        description: 'Attaque en cône, équilibré',
        cost: 0,
        // Stats de base niveau 1 (faibles pour roguelike)
        baseDamage: 3,
        baseFireRate: 3.0,      // secondes (lent au début)
        baseCritChance: 2,
        baseRange: 100,          // +15 portée de base
        // Bonus par niveau (scaling progressif)
        damagePerLevel: 0.8,
        fireRatePerLevel: -0.015,
        critPerLevel: 0.2,
        rangePerLevel: 0.4,     // +0.1 pour meilleur scaling
        // Coût de level up
        upgradeCost: 25,
        shape: 'Cône',
        terrain: ['herbe', 'plaine'], // Luffy peut aller partout
        target: 'Cône',
        color: 0xef4444,
        rarity: 'common',
        level: 1,
        maxLevel: 100,
        passive: 'Gomu Gomu: Attaque tous les ennemis dans un cône'
    },
    zoro: {
        id: 'zoro',
        name: 'Zoro',
        description: 'Attaque en zone, dégâts élevés',
        cost: 100,
        baseDamage: 5,          // Augmenté de 4 à 5
        baseFireRate: 4.5,
        baseCritChance: 3,
        baseRange: 100,         // +15 portée de base
        // Spécialité: dégâts (scaling fort)
        damagePerLevel: 0.6,    // Augmenté de 0.5 à 0.6
        fireRatePerLevel: -0.012,
        critPerLevel: 0.35,
        rangePerLevel: 0.3,     // +0.1 pour meilleur scaling
        upgradeCost: 40,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine', 'montagne'], // Zoro - terrestre seulement
        target: 'Zone',
        color: 0x22c55e,
        rarity: 'rare',
        level: 1,
        maxLevel: 100,
        passive: 'Santoryu: Attaque tous les ennemis autour de lui'
    },
    nami: {
        id: 'nami',
        name: 'Nami',
        description: 'Éclairs + stun en zone',
        cost: 80,
        baseDamage: 2,
        baseFireRate: 4.0,
        baseCritChance: 5,
        baseRange: 150,         // +15 portée de base
        // Spécialité: portée + zone stun
        damagePerLevel: 0.6,
        fireRatePerLevel: -0.015,
        critPerLevel: 0.25,
        rangePerLevel: 1.0,     // +0.2 (spécialiste portée)
        upgradeCost: 30,
        shape: 'Cercle',
        terrain: [ 'plaine', 'mer'], // Nami - navigatrice, pas de montagne
        target: 'Zone Stun',
        color: 0xf97316,
        rarity: 'common',
        level: 1,
        maxLevel: 100,
        passive: 'Thunder Tempo: 30% chance de stun les ennemis'
    },
    sanji: {
        id: 'sanji',
        name: 'Sanji',
        description: 'Attaque rapide + brûlure',
        cost: 90,
        baseDamage: 2,
        baseFireRate: 2.0,
        baseCritChance: 3,
        baseRange: 100,          // +15 portée de base
        // Spécialité: vitesse d'attaque + DOT feu
        damagePerLevel: 0.5,
        fireRatePerLevel: -0.01,
        critPerLevel: 0.15,
        rangePerLevel: 0.2,     // +0.1 pour meilleur scaling
        upgradeCost: 35,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine', 'montagne'], // Sanji - cuisinier, pas de montagne
        target: 'Solo + Brûlure',
        color: 0xfbbf24,
        rarity: 'rare',
        level: 1,
        maxLevel: 100,
        passive: 'Diable Jambe: Brûle les ennemis (10% DPS pendant 10s)'
    },
    robin: {
        id: 'robin',
        name: 'Robin',
        description: 'Ralentissement en zone',
        cost: 120,
        baseDamage: 2,
        baseFireRate: 3.0,
        baseCritChance: 1,
        baseRange: 150,          // +20 portée de base
        // Spécialité: contrôle (slow)
        damagePerLevel: 0.4,
        fireRatePerLevel: -0.012,
        critPerLevel: 0.1,
        rangePerLevel: 0.5,     // +0.1 pour meilleur scaling
        upgradeCost: 45,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine'], // Robin - archéologue, terrains calmes
        target: 'Zone Slow',
        color: 0xa855f7,
        rarity: 'epic',
        level: 1,
        maxLevel: 100,
        passive: 'Clutch: Ralentit les ennemis de 50% pendant 2s'
    },
    franky: {
        id: 'franky',
        name: 'Franky',
        description: 'Laser perçant, très lent',
        cost: 150,
        baseDamage: 6,
        baseFireRate: 5.0,
        baseCritChance: 8,
        baseRange: 100,         // +15 portée de base
        // Spécialité: gros dégâts + perçant
        damagePerLevel: 2,
        fireRatePerLevel: -0.015,
        critPerLevel: 0.5,
        rangePerLevel: 0.4,     // +0.1 pour meilleur scaling
        upgradeCost: 50,
        shape: 'Ligne',
        terrain: ['plaine', 'montagne'], // Franky - cyborg, terrains solides
        target: 'Perçant',
        color: 0x06b6d4,
        rarity: 'epic',
        level: 1,
        maxLevel: 100,
        passive: 'Radical Beam: Traverse tous les ennemis'
    },
    chopper: {
        id: 'chopper',
        name: 'Chopper',
        description: 'Support, faibles dégâts',
        cost: 60,
        baseDamage: 1,
        baseFireRate: 2.0,
        baseCritChance: 0,
        baseRange: 100,         // +15 portée de base
        // Spécialité: support (buffs futurs)
        damagePerLevel: 0.3,
        fireRatePerLevel: -0.008,
        critPerLevel: 0,
        rangePerLevel: 0.6,     // +0.1 pour meilleur scaling
        upgradeCost: 20,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine', 'montagne'], // Chopper - renne, terrestre
        target: 'Solo',
        color: 0xf472b6,
        rarity: 'common',
        level: 1,
        maxLevel: 50,
        passive: 'Médecin: Faible DPS mais attaque rapide'
    },
    brook: {
        id: 'brook',
        name: 'Brook',
        description: 'Très rapide, faible puissance',
        cost: 70,
        baseDamage: 2,          // Augmenté de 1 à 2
        baseFireRate: 0.8,
        baseCritChance: 5,
        baseRange: 75,          // +15 portée de base
        // Spécialité: attaque ultra rapide
        damagePerLevel: 0.6,    // Augmenté de 0.5 à 0.6
        fireRatePerLevel: -0.004,
        critPerLevel: 0.5,
        rangePerLevel: 0.2,     // +0.1 pour meilleur scaling
        upgradeCost: 25,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine', 'mer'], // Brook - musicien, peut marcher sur l'eau
        target: 'Solo',
        color: 0xe2e8f0,
        rarity: 'rare',
        level: 1,
        maxLevel: 100,
        passive: 'Soul King: Attaque extrêmement rapide'
    },
    ussop: {
        id: 'ussop',
        name: 'Usopp',
        description: 'Sniper + poison',
        cost: 90,
        baseDamage: 3,          // Augmenté de 2 à 3
        baseFireRate: 2.5,
        baseCritChance: 4,
        baseRange: 200,         // +20 portée de base (sniper)
        // Spécialité: sniper (portée + poison)
        damagePerLevel: 0.6,    // Augmenté de 0.5 à 0.6
        fireRatePerLevel: -0.01,
        critPerLevel: 0.2,
        rangePerLevel: 0.8,     // +0.2 (spécialiste sniper)
        upgradeCost: 35,
        shape: 'Cercle',
        terrain: ['herbe', 'plaine', 'montagne'], // Usopp - sniper, points hauts
        target: 'Solo + Poison',
        color: 0xeab308,
        rarity: 'rare',
        level: 1,
        maxLevel: 100,
        passive: 'Pop Green: Empoisonne (15% DPS pendant 8s)'
    },
    jimbe: {
        id: 'jimbe',
        name: 'Jimbe',
        description: 'Sniper aquatique, portée longue',
        cost: 120,
        baseDamage: 3,
        baseFireRate: 3.5,
        baseCritChance: 5,
        baseRange: 250,         // Portée très longue
        baseMinRange: 80,       // Portée minimum (ne peut pas attaquer trop proche)
        // Spécialité: sniper aquatique (très longue portée, portée minimum)
        damagePerLevel: 0.6,
        fireRatePerLevel: -0.012,
        critPerLevel: 0.3,
        rangePerLevel: 1.0,     // Scaling de portée élevé
        upgradeCost: 45,
        shape: 'Cercle',
        terrain: ['mer'], // Jimbe - homme-poisson, uniquement sur l'eau
        target: 'Solo',
        color: 0x0ea5e9,
        rarity: 'epic',
        level: 1,
        maxLevel: 100,
        passive: 'Vagabond des Mers: Portée très longue avec portée minimum'
    }
};

// Fonction pour calculer les stats d'une tour à un niveau donné
// Scaling quadratique léger pour rendre les hauts niveaux significatifs
function getTowerStats(towerId, level) {
    const config = TOWER_CONFIG[towerId];
    if (!config) return null;
    
    const lvl = Math.min(level, config.maxLevel);
    const levelBonus = lvl - 1;
    
    // Scaling légèrement exponentiel pour les dégâts (plus fort aux hauts niveaux)
    const damageScaling = 1 + (levelBonus * 0.005); // +0.5% par niveau supplémentaire
    const baseDamageBonus = config.damagePerLevel * levelBonus;
    const scaledDamage = Math.max(1, Math.round((config.baseDamage + baseDamageBonus) * damageScaling)); // Minimum 1 dégât
    
    // Calcul de la portée avec bonus tous les 20 niveaux
    // Bonus de portée: +15 au niveau 20, +30 au niveau 40, +45 au niveau 60, +60 au niveau 80, +75 au niveau 100
    const rangeBonus = config.rangePerLevel * levelBonus;
    const rangeTierBonus = Math.floor(lvl / 20) * 15; // +15 portée tous les 20 niveaux
    const totalRange = config.baseRange + rangeBonus + rangeTierBonus;
    
    return {
        ...config,
        level: lvl,
        damage: scaledDamage,
        fireRate: Math.max(0.15, config.baseFireRate + config.fireRatePerLevel * levelBonus),
        critChance: Math.min(75, config.baseCritChance + config.critPerLevel * levelBonus),
        range: totalRange,
        minRange: config.baseMinRange || 0 // Portée minimum (pour Jimbe)
    };
}

// Fonction pour calculer le coût de level up
// Scaling exponentiel pour ralentir la progression
function getUpgradeCost(towerId, currentLevel) {
    const config = TOWER_CONFIG[towerId];
    if (!config) return Infinity;
    if (currentLevel >= config.maxLevel) return Infinity;
    
    // Coût augmente de 12% par niveau (plus accessible au début)
    // Avec un palier tous les 10 niveaux (+50%)
    const baseCost = config.upgradeCost * Math.pow(1.12, currentLevel - 1);
    const tierBonus = Math.floor(currentLevel / 10) * 0.5; // +50% tous les 10 niveaux
    
    return Math.round(baseCost * (1 + tierBonus));
}

// Ordre d'affichage dans le menu
const TOWER_ORDER = ['luffy', 'zoro', 'nami', 'sanji', 'robin', 'franky', 'chopper', 'brook', 'ussop', 'jimbe'];
