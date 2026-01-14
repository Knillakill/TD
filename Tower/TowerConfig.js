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
        // Stats exactes Pokepath TD: Gardevoir - Base 40, Scale 4, Speed 1500ms, Range 160, Crit 0% (+0.2/level)
        baseDamage: 40,         // Pokepath TD: Gardevoir Base 40
        baseFireRate: 1.5,       // secondes (1500ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Gardevoir Crit 0
        baseRange: 160,          // Pokepath TD: Gardevoir Range 160
        // Bonus par niveau (scaling progressif)
        damagePerLevel: 4,       // Pokepath TD: Gardevoir Scale 4
        fireRatePerLevel: -0.002, // Amélioration (Speed -2 dans Pokepath)
        critPerLevel: 0.2,       // Pokepath TD: Gardevoir Crit Scale 0.2
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Maractus - Base 30, Scale 3.5, Speed 1800ms, Range 140, Crit 0% (+0.1/level)
        baseDamage: 30,         // Pokepath TD: Maractus Base 30
        baseFireRate: 1.8,       // secondes (1800ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Maractus Crit 0
        baseRange: 140,          // Pokepath TD: Maractus Range 140
        // Spécialité: dégâts (scaling exact Pokepath TD)
        damagePerLevel: 3.5,     // Pokepath TD: Maractus Scale 3.5
        fireRatePerLevel: -0.001, // Amélioration (Speed -1 dans Pokepath)
        critPerLevel: 0.1,       // Pokepath TD: Maractus Crit Scale 0.1
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Lapras - Base 10, Scale 6.6, Speed 6300ms, Range 150, Crit 3% (+0/level)
        baseDamage: 10,         // Pokepath TD: Lapras Base 10
        baseFireRate: 6.3,       // secondes (6300ms Pokepath TD - très lent)
        baseCritChance: 3,       // Pokepath TD: Lapras Crit 3
        baseRange: 150,          // Pokepath TD: Lapras Range 150
        // Spécialité: portée + zone stun
        damagePerLevel: 6.6,     // Pokepath TD: Lapras Scale 6.6
        fireRatePerLevel: -0.0058, // Amélioration (Speed -5.8 dans Pokepath)
        critPerLevel: 0,         // Pokepath TD: Lapras Crit Scale 0
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Torkoal - Base 30, Scale 3, Speed 2000ms, Range 120, Crit 0% (+0/level)
        baseDamage: 30,         // Pokepath TD: Torkoal Base 30
        baseFireRate: 2.0,       // secondes (2000ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Torkoal Crit 0
        baseRange: 120,          // Pokepath TD: Torkoal Range 120
        // Spécialité: vitesse d'attaque + DOT feu
        damagePerLevel: 3,       // Pokepath TD: Torkoal Scale 3
        fireRatePerLevel: -0.002, // Amélioration (Speed -2 dans Pokepath)
        critPerLevel: 0,         // Pokepath TD: Torkoal Crit Scale 0
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Ferrothorn - Base 25, Scale 2.5, Speed 2500ms, Range 130, Crit 0% (+0/level)
        baseDamage: 25,         // Pokepath TD: Ferrothorn Base 25
        baseFireRate: 2.5,       // secondes (2500ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Ferrothorn Crit 0
        baseRange: 130,          // Pokepath TD: Ferrothorn Range 130
        // Spécialité: contrôle (slow)
        damagePerLevel: 2.5,     // Pokepath TD: Ferrothorn Scale 2.5
        fireRatePerLevel: -0.002, // Amélioration (Speed -2 dans Pokepath)
        critPerLevel: 0,         // Pokepath TD: Ferrothorn Crit Scale 0
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Machamp - Base 70, Scale 17.5, Speed 1600ms, Range 125, Crit 0% (+0.1/level)
        baseDamage: 70,         // Pokepath TD: Machamp Base 70
        baseFireRate: 1.6,       // secondes (1600ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Machamp Crit 0
        baseRange: 125,          // Pokepath TD: Machamp Range 125
        // Spécialité: gros dégâts + perçant
        damagePerLevel: 17.5,    // Pokepath TD: Machamp Scale 17.5 (scaling très fort)
        fireRatePerLevel: -0.001, // Amélioration (Speed -1 dans Pokepath)
        critPerLevel: 0.1,       // Pokepath TD: Machamp Crit Scale 0.1
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Meganium - Base 80, Scale 8.4, Speed 2000ms, Range 130, Crit 4% (+0/level)
        baseDamage: 80,         // Pokepath TD: Meganium Base 80
        baseFireRate: 2.0,       // secondes (2000ms Pokepath TD)
        baseCritChance: 4,       // Pokepath TD: Meganium Crit 4
        baseRange: 130,          // Pokepath TD: Meganium Range 130
        // Spécialité: support (buffs futurs)
        damagePerLevel: 8.4,     // Pokepath TD: Meganium Scale 8.4
        fireRatePerLevel: -0.003, // Amélioration (Speed -3 dans Pokepath)
        critPerLevel: 0,         // Pokepath TD: Meganium Crit Scale 0
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Clawitzer - Base 45, Scale 4.5, Speed 1200ms, Range 140, Crit 5% (+0.2/level)
        baseDamage: 45,         // Pokepath TD: Clawitzer Base 45
        baseFireRate: 1.2,       // secondes (1200ms Pokepath TD - très rapide)
        baseCritChance: 5,       // Pokepath TD: Clawitzer Crit 5
        baseRange: 140,          // Pokepath TD: Clawitzer Range 140
        // Spécialité: attaque ultra rapide
        damagePerLevel: 4.5,     // Pokepath TD: Clawitzer Scale 4.5
        fireRatePerLevel: -0.002, // Amélioration (Speed -2 dans Pokepath)
        critPerLevel: 0.2,       // Pokepath TD: Clawitzer Crit Scale 0.2
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Pidgeot - Base 35, Scale 3.5, Speed 1400ms, Range 180, Crit 0% (+0.1/level)
        baseDamage: 35,         // Pokepath TD: Pidgeot Base 35
        baseFireRate: 1.4,       // secondes (1400ms Pokepath TD)
        baseCritChance: 0,       // Pokepath TD: Pidgeot Crit 0
        baseRange: 180,          // Pokepath TD: Pidgeot Range 180 (longue portée sniper)
        // Spécialité: sniper (portée + poison)
        damagePerLevel: 3.5,     // Pokepath TD: Pidgeot Scale 3.5
        fireRatePerLevel: -0.002, // Amélioration (Speed -2 dans Pokepath)
        critPerLevel: 0.1,       // Pokepath TD: Pidgeot Crit Scale 0.1
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
        // Stats exactes Pokepath TD: Corsola - Base 20, Scale 2, Speed 3000ms, Range 220, Crit 0% (+0/level)
        baseDamage: 20,         // Pokepath TD: Corsola Base 20
        baseFireRate: 3.0,       // secondes (3000ms Pokepath TD - très lent)
        baseCritChance: 0,       // Pokepath TD: Corsola Crit 0
        baseRange: 220,          // Pokepath TD: Corsola Range 220 (très longue portée)
        baseMinRange: 80,       // Portée minimum (ne peut pas attaquer trop proche)
        // Spécialité: sniper aquatique (très longue portée, portée minimum)
        damagePerLevel: 2,       // Pokepath TD: Corsola Scale 2
        fireRatePerLevel: -0.003, // Amélioration (Speed -3 dans Pokepath)
        critPerLevel: 0,         // Pokepath TD: Corsola Crit Scale 0
        rangePerLevel: 0,        // Pokepath TD: Range Scale 0
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
    
    // Scaling exact Pokepath TD : Base + (Scale * (level - 1))
    // Pas de multiplicateur supplémentaire pour correspondre exactement à Pokepath TD
    const baseDamageBonus = config.damagePerLevel * levelBonus;
    const scaledDamage = Math.max(1, Math.round(config.baseDamage + baseDamageBonus)); // Minimum 1 dégât
    
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
