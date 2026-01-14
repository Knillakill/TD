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
        hp: 500,  // HP moyen pour vague 10-15 (inspiré Pokepath: ennemis moyens 400-600)
        speed: 40,  // Moyen
        regen: 0,
        color: 0x8B4513,
        size: 10,
        reward: 12,  // Inspiré Pokepath: ennemis moyens 10-15g
        // Vulnérabilités (true = vulnérable, false = résistant)
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3
    },
    
    pirate_recruit: {
        id: 'pirate_recruit',
        name: 'Recrue',
        description: 'Nouveau membre de l\'équipage',
        hp: 400,  // HP moyen pour vague 10-15 (inspiré Pokepath)
        speed: 48,  // Plus rapide
        regen: 0,
        color: 0xA0522D,
        size: 9,
        reward: 10,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3
    },
    
    pirate_basic2: {
        id: 'pirate_basic2',
        name: 'Vétéran',
        description: 'Pirate expérimenté',
        hp: 600,  // HP moyen pour vague 10-15 (inspiré Pokepath)
        speed: 32,  // Plus lent mais plus résistant
        regen: 0,
        color: 0x654321,
        size: 11,
        reward: 14,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 3
    },
    
    pirate_fast: {
        id: 'pirate_fast',
        name: 'Éclaireur',
        description: 'Pirate rapide',
        hp: 350,  // HP faible pour vague 15-20 (inspiré Pokepath: rapides = faible HP)
        speed: 75,  // Très rapide (inspiré Pokepath: vitesse élevée)
        regen: 0,
        color: 0x8B4513,
        size: 9,
        reward: 15,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 4
    },
    
    pirate_shield: {
        id: 'pirate_shield',
        name: 'Bouclier',
        description: 'Pirate défensif',
        hp: 800,  // HP élevé pour vague 15-20 (inspiré Pokepath: tanks 700-1000)
        shield: 20,
        speed: 20,  // Lent (inspiré Pokepath: tanks lents)
        regen: 0,
        color: 0x696969,
        size: 12,
        reward: 18,  // Inspiré Pokepath
        stunVuln: false,  // Protégé par le bouclier
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 4
    },
    
    pirate_assassin: {
        id: 'pirate_assassin',
        name: 'Assassin',
        description: 'Tueur silencieux',
        hp: 450,  // HP moyen pour vague 15-20 (inspiré Pokepath)
        speed: 80,  // Très rapide (inspiré Pokepath: assassins rapides)
        regen: 0,
        color: 0x2F4F4F,
        size: 9,
        reward: 16,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Immunisé au poison (expert)
        tier: 4
    },
    
    // ============================================
    // === TIER 5 : HOMMES-POISSONS BASIQUES (Vagues 20-30) ===
    // ============================================
    
    fishman_grunt: {
        id: 'fishman_grunt',
        name: 'Homme-Poisson',
        description: 'Soldat d\'Arlong',
        hp: 800,  // HP élevé pour vague 20-25 (inspiré Pokepath: ennemis moyens-forts 700-1000)
        speed: 45,  // Moyen
        regen: 1,  // Régénération légère (inspiré Pokepath)
        color: 0x4682B4,
        size: 11,
        reward: 20,  // Inspiré Pokepath: ennemis moyens 15-25g
        stunVuln: true,
        slowVuln: false,  // Habitué à l'eau, résiste au slow
        burnVuln: true,
        poisonVuln: true,
        tier: 5
    },
    
    fishman_swimmer: {
        id: 'fishman_swimmer',
        name: 'Nageur',
        description: 'Homme-poisson rapide',
        hp: 600,  // HP moyen pour vague 20-25 (inspiré Pokepath: rapides = moins HP)
        speed: 65,  // Rapide (inspiré Pokepath)
        regen: 0.5,  // Régénération légère
        color: 0x00CED1,
        size: 9,
        reward: 18,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: false,  // Trop rapide dans l'eau
        burnVuln: true,
        poisonVuln: true,
        tier: 5
    },
    
    // ============================================
    // === TIER 3 : SPÉCIALISTES (Vagues 5-15) ===
    // ============================================
    
    pirate_fast: {
        id: 'pirate_fast',
        name: 'Éclaireur',
        description: 'Coureur rapide',
        hp: 10,
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
        hp: 900,  // HP élevé pour vague 20-25 (inspiré Pokepath)
        speed: 38,  // Moyen
        regen: 0.5,  // Régénération légère
        color: 0x2F4F4F,
        size: 12,
        reward: 22,  // Inspiré Pokepath
        stunVuln: false,  // Bonne garde
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 5
    },
    
    fishman_brawler: {
        id: 'fishman_brawler',
        name: 'Bagarreur',
        description: 'Homme-poisson costaud',
        hp: 1100,  // HP très élevé pour vague 20-25 (inspiré Pokepath: tanks 1000-1500)
        speed: 30,  // Lent (inspiré Pokepath: tanks lents)
        regen: 1,  // Régénération (inspiré Pokepath)
        color: 0x8B0000,
        size: 13,
        reward: 25,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: false,  // Peau épaisse
        poisonVuln: true,
        tier: 5
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
        hp: 1000,  // HP élevé (inspiré Pokepath: élites 900-1200)
        speed: 42,  // Moyen
        regen: 1,  // Régénération (inspiré Pokepath)
        color: 0x191970,
        size: 13,
        reward: 24,  // Inspiré Pokepath: élites 20-30g
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
        hp: 700,  // HP moyen (inspiré Pokepath: rapides = moins HP)
        speed: 70,  // Très rapide (inspiré Pokepath)
        regen: 0,
        color: 0xDC143C,
        size: 11,
        reward: 20,  // Inspiré Pokepath
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
        hp: 1300,  // HP élevé (inspiré Pokepath: officiers 1200-1500)
        speed: 35,  // Lent mais résistant
        regen: 1.5,  // Régénération (inspiré Pokepath)
        color: 0x4B0082,
        size: 14,
        reward: 28,  // Inspiré Pokepath: officiers 25-35g
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
        hp: 950,  // HP élevé (inspiré Pokepath)
        shield: 15,
        speed: 50,  // Rapide
        regen: 2,  // Régénération (inspiré Pokepath)
        color: 0x00BFFF,
        size: 12,
        reward: 26,  // Inspiré Pokepath
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
        hp: 1500,  // HP très élevé (inspiré Pokepath: champions 1400-1800)
        shield: 25,
        speed: 38,  // Moyen
        regen: 2,  // Régénération (inspiré Pokepath)
        color: 0x800080,
        size: 15,
        reward: 32,  // Inspiré Pokepath: champions 30-40g
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
        hp: 650,  // HP moyen mais régénération (inspiré Pokepath: soigneurs)
        speed: 28,  // Lent
        regen: 5,  // Forte régénération (inspiré Pokepath: certains ont 3-5/s)
        color: 0x98FB98,
        size: 11,
        reward: 30,  // Inspiré Pokepath
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
        hp: 1200,  // HP élevé (inspiré Pokepath: tanks 1000-1500)
        speed: 25,  // Lent (inspiré Pokepath: tanks lents)
        regen: 1,  // Régénération légère
        color: 0xFF69B4,
        size: 16,
        reward: 28,  // Inspiré Pokepath
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
        hp: 3000,  // HP très élevé (inspiré Pokepath: monstres marins 2500-4000)
        speed: 22,  // Très lent (inspiré Pokepath: tanks 0.6-0.8x)
        regen: 3,  // Régénération (inspiré Pokepath: certains ont 3-4/s)
        color: 0x006400,
        size: 18,
        reward: 50,  // Inspiré Pokepath: monstres puissants 40-60g
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,  // Peau humide
        poisonVuln: false,
        tier: 7
    },
    
    // ============================================
    // === TIER 1 : ANIMAUX FAIBLES (Vagues 1-5) ===
    // ============================================
    
    chauvesouris: {
        id: 'chauvesouris',
        name: 'Chauve-souris',
        description: 'Prédateur nocturne',
        hp: 60,  // HP faible pour vague 1 (inspiré Pokepath: zubat 60)
        speed: 80,  // Très rapide (inspiré Pokepath: vitesse élevée)
        regen: 0,
        color: 0x1C1C1C,
        size: 8,
        reward: 4,  // Inspiré Pokepath: zubat 4g
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1,
        sprite: 'chauvesouris'
    },
    
    spider: {
        id: 'spider',
        name: 'Araignée',
        description: 'Prédateur venimeux',
        hp: 100,  // HP moyen pour vague 1 (inspiré Pokepath)
        speed: 55,  // Moyen
        regen: 0,
        color: 0x8B0000,
        size: 9,
        reward: 5,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Immunisé au poison
        tier: 1,
        sprite: 'spider'
    },
    
    snake: {
        id: 'snake',
        name: 'Serpent',
        description: 'Reptile venimeux',
        hp: 120,  // HP moyen pour vague 1 (inspiré Pokepath)
        speed: 40,  // Lent mais plus résistant
        regen: 0,
        color: 0x228B22,
        size: 10,
        reward: 5,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Immunisé au poison
        tier: 1,
        sprite: 'snake'
    },
    
    crow: {
        id: 'crow',
        name: 'Corbeau',
        description: 'Oiseau de proie',
        hp: 80,  // HP faible pour vague 1 (inspiré Pokepath)
        speed: 70,  // Rapide
        regen: 0,
        color: 0x000000,
        size: 10,
        reward: 6,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 1,
        sprite: 'crow'
    },
    
    // ============================================
    // === TIER 2 : ANIMAUX MOYENS (Vagues 5-15) ===
    // ============================================
    
    wolf: {
        id: 'wolf',
        name: 'Loup',
        description: 'Prédateur sauvage',
        hp: 350,  // HP moyen pour vague 5 (inspiré Pokepath: prédateurs 300-500)
        speed: 65,  // Rapide (inspiré Pokepath)
        regen: 0,
        color: 0x808080,
        size: 11,
        reward: 10,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 2,
        sprite: 'wolf'
    },
    
    shadowbat: {
        id: 'shadowbat',
        name: 'Chauve-souris Ombre',
        description: 'Créature des ténèbres',
        hp: 280,  // HP moyen pour vague 5 (inspiré Pokepath)
        speed: 75,  // Très rapide
        regen: 0.5,
        color: 0x4B0082,
        size: 11,
        reward: 12,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: false,  // Vol rapide
        burnVuln: false,  // Résistant aux ténèbres
        poisonVuln: true,
        tier: 2,
        sprite: 'shadowbat'
    },
    
    raptor: {
        id: 'raptor',
        name: 'Raptor',
        description: 'Prédateur rapide',
        hp: 400,  // HP moyen pour vague 5 (inspiré Pokepath)
        speed: 60,  // Rapide
        regen: 0,
        color: 0x556B2F,
        size: 13,
        reward: 14,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: true,
        burnVuln: true,
        poisonVuln: true,
        tier: 2,
        sprite: 'raptor'
    },
    
    // ============================================
    // === TIER 3 : ANIMAUX FORTS + PIRATES (Vagues 10-20) ===
    // ============================================
    
    golem: {
        id: 'golem',
        name: 'Golem',
        description: 'Créature de pierre',
        hp: 1200,  // HP très élevé pour vague 10 (inspiré Pokepath: golem 1550)
        speed: 12,  // Très lent (inspiré Pokepath: 0.8x)
        regen: 0,
        color: 0x696969,
        size: 16,
        reward: 20,  // Inspiré Pokepath: golem 25g
        stunVuln: false,  // Trop lourd
        slowVuln: false,  // Déjà lent
        burnVuln: false,  // Résistant au feu
        poisonVuln: false,  // Pas de sang
        tier: 3,
        sprite: 'golem'
    },
    
    kungfu: {
        id: 'kungfu',
        name: 'Guerrier',
        description: 'Combattant martial',
        hp: 450,  // HP moyen pour vague 10 (inspiré Pokepath)
        speed: 50,  // Rapide
        regen: 0,
        color: 0xFF4500,
        size: 12,
        reward: 15,  // Inspiré Pokepath
        stunVuln: false,  // Discipline martiale
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
        hp: 550,  // HP moyen pour vague 10 (inspiré Pokepath)
        speed: 45,  // Moyen
        regen: 0,
        color: 0x2F4F4F,
        size: 13,
        reward: 16,  // Inspiré Pokepath
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
        description: 'Reptile volant préhistorique',
        hp: 700,  // HP élevé pour vague 10 (inspiré Pokepath)
        speed: 55,  // Rapide (volant)
        regen: 1,  // Régénération légère
        color: 0x8B7355,
        size: 15,
        reward: 18,  // Inspiré Pokepath
        stunVuln: false,  // Vol puissant
        slowVuln: false,  // Vol rapide
        burnVuln: true,
        poisonVuln: true,
        tier: 3,
        sprite: 'pterosaur'
    },
    
    // ============================================
    // === TIER 4 : CRÉATURES PUISSANTES (Vagues 40-50) ===
    // ============================================
    
    gorilla: {
        id: 'gorilla',
        name: 'Gorille',
        description: 'Primate puissant',
        hp: 2500,  // HP très élevé pour vague 40 (inspiré Pokepath: primates puissants)
        speed: 32,  // Moyen
        regen: 1,  // Régénération légère
        color: 0x2F4F4F,
        size: 18,
        reward: 45,  // Inspiré Pokepath: ennemis puissants 40-50g
        stunVuln: false,  // Très résistant
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Constitution robuste
        tier: 4,
        sprite: 'gorilla'
    },
    
    jellyfish: {
        id: 'jellyfish',
        name: 'Méduse',
        description: 'Créature venimeuse',
        hp: 1800,  // HP élevé pour vague 40 (inspiré Pokepath)
        speed: 38,  // Moyen
        regen: 2,  // Régénération (inspiré Pokepath: certains ont regen)
        color: 0xFF69B4,
        size: 12,
        reward: 40,  // Inspiré Pokepath
        stunVuln: true,
        slowVuln: false,  // Flotte dans l'eau
        burnVuln: false,  // Résistant (eau)
        poisonVuln: false,  // Immunisé au poison
        tier: 4,
        sprite: 'jellyfish'
    },
    
    mohmoo_calf: {
        id: 'mohmoo_calf',
        name: 'Bébé Mohmoo',
        description: 'Veau de monstre marin',
        hp: 2200,  // HP élevé (inspiré Pokepath: créatures marines 2000-3000)
        speed: 30,  // Lent
        regen: 2,  // Régénération (inspiré Pokepath)
        color: 0x87CEEB,
        size: 17,
        reward: 42,  // Inspiré Pokepath
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
        hp: 1800,  // HP élevé (inspiré Pokepath)
        speed: 55,  // Rapide (inspiré Pokepath: prédateurs rapides)
        regen: 1,  // Régénération légère
        color: 0x778899,
        size: 14,
        reward: 38,  // Inspiré Pokepath
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
        hp: 3500,  // HP très élevé (inspiré Pokepath: généraux 3000-5000)
        shield: 40,
        speed: 28,  // Lent
        regen: 3,  // Régénération (inspiré Pokepath)
        color: 0x4A0080,
        size: 17,
        reward: 60,  // Inspiré Pokepath: généraux 50-70g
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
        hp: 4000,  // HP très élevé (inspiré Pokepath: rois des mers 3500-5000)
        speed: 20,  // Très lent
        regen: 4,  // Régénération (inspiré Pokepath)
        color: 0x2E8B57,
        size: 20,
        reward: 65,  // Inspiré Pokepath
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
        hp: 8000,  // HP très élevé (inspiré Pokepath: anciens 7000-10000)
        shield: 50,
        speed: 22,  // Très lent
        regen: 5,  // Régénération (inspiré Pokepath)
        color: 0x2F4F4F,
        size: 18,
        reward: 80,  // Inspiré Pokepath: anciens 70-90g
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
        hp: 12000,  // HP très élevé (inspiré Pokepath: rois 10000-15000)
        speed: 18,  // Très lent
        regen: 6,  // Régénération (inspiré Pokepath)
        color: 0x1E90FF,
        size: 22,
        reward: 100,  // Inspiré Pokepath: rois 90-120g
        stunVuln: false,
        slowVuln: false,
        burnVuln: true,
        poisonVuln: true,
        tier: 9
    },
    
    // ============================================
    // === MINI-BOSS (Tous les 10 niveaux) ===
    // ============================================
    
    // VAGUE 25 - Chew (Boss niveau 25)
    chew: {
        id: 'chew',
        name: 'CHEW',
        description: 'Homme-poisson cracheur d\'eau',
        hp: 5000,  // HP de base pour vague 25 (inspiré Pokepath: boss moyens 3000-8000)
        speed: 32,  // Moyen
        regen: 3,  // Régénération (inspiré Pokepath)
        color: 0x4169E1,
        size: 16,
        reward: 100,  // Inspiré Pokepath: boss 100-300g
        stunVuln: true,
        slowVuln: false,  // Maître de l'eau
        burnVuln: true,   // Vulnérable au feu
        poisonVuln: true,
        tier: 25,
        isMiniBoss: true,
        bossWave: 25,
        reappearWeight: 2
    },
    
    // VAGUE 50 - Hachi (Boss niveau 50) - pas encore de sprite, utiliser gorilla temporairement
    hachi: {
        id: 'hachi',
        name: 'HACHI',
        description: 'Poulpe à 6 épées',
        hp: 15000,  // HP de base pour vague 50 (inspiré Pokepath: boss forts 10000-20000)
        shield: 150,
        speed: 28,  // Lent
        regen: 6,  // Régénération (inspiré Pokepath)
        color: 0xFF6347,
        size: 18,
        reward: 250,  // Inspiré Pokepath: boss forts 200-400g
        stunVuln: true,
        slowVuln: false,  // 6 bras = difficile à arrêter
        burnVuln: false,  // Encre protectrice
        poisonVuln: true,
        tier: 50,
        isMiniBoss: true,
        bossWave: 50,
        reappearWeight: 1.5,
        sprite: 'gorilla'  // Placeholder jusqu'à ce que le sprite soit disponible
    },
    
    // VAGUE 75 - Kuroobi (Boss niveau 75) - pas encore de sprite, utiliser pterosaur temporairement
    kuroobi: {
        id: 'kuroobi',
        name: 'KUROOBI',
        description: 'Maître du Fish-Man Karate',
        hp: 25000,  // HP de base pour vague 75 (inspiré Pokepath: boss très forts 20000-35000)
        shield: 200,
        speed: 35,  // Moyen
        regen: 8,  // Régénération (inspiré Pokepath)
        color: 0x800000,
        size: 19,
        reward: 400,  // Inspiré Pokepath: boss très forts 350-500g
        stunVuln: false,  // Trop puissant
        slowVuln: true,
        burnVuln: true,
        poisonVuln: false,  // Discipline martiale
        tier: 75,
        isMiniBoss: true,
        bossWave: 75,
        reappearWeight: 1,
        sprite: 'pterosaur'  // Placeholder jusqu'à ce que le sprite soit disponible
    },
    
    // VAGUE 40 - Pisaro (Marine corrompu)
    pisaro: {
        id: 'pisaro',
        name: 'PISARO',
        description: 'Officier marine corrompu',
        hp: 300,
        shield: 100,
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
        hp: 18000,  // HP très élevé (inspiré Pokepath: boss forts 15000-20000)
        speed: 18,  // Très lent
        regen: 8,  // Régénération (inspiré Pokepath)
        color: 0x87CEEB,
        size: 24,
        reward: 300,  // Inspiré Pokepath: boss forts 250-350g
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
        hp: 20000,  // HP très élevé (inspiré Pokepath: boss très forts 18000-25000)
        shield: 120,
        speed: 30,  // Lent
        regen: 6,  // Régénération (inspiré Pokepath)
        color: 0x708090,
        size: 19,
        reward: 350,  // Inspiré Pokepath: boss très forts 300-400g
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
        hp: 28000,  // HP très élevé (inspiré Pokepath: légendaires 25000-35000)
        shield: 150,
        speed: 35,  // Moyen
        regen: 7,  // Régénération (inspiré Pokepath)
        color: 0x2F2F2F,
        size: 20,
        reward: 450,  // Inspiré Pokepath: légendaires 400-500g
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
        hp: 35000,  // HP très élevé (inspiré Pokepath: rois 30000-40000)
        shield: 200,
        speed: 22,  // Très lent
        regen: 10,  // Régénération (inspiré Pokepath)
        color: 0x00008B,
        size: 22,
        reward: 500,  // Inspiré Pokepath: rois 450-550g
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
        hp: 40000,  // HP très élevé (inspiré Pokepath: ombres 35000-45000)
        shield: 250,
        speed: 28,  // Lent
        regen: 12,  // Régénération (inspiré Pokepath)
        color: 0x4A0082,
        size: 21,
        reward: 600,  // Inspiré Pokepath: ombres 550-650g
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
        hp: 50000,  // HP très élevé (inspiré Pokepath: boss légendaires 40000-50000+)
        shield: 400,
        speed: 25,  // Lent mais puissant
        regen: 15,  // Régénération très élevée (inspiré Pokepath)
        color: 0x0000CD,
        size: 26,
        reward: 1000,  // Inspiré Pokepath: boss légendaires 500-1000g
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
    // Progression inspirée de Pokepath TD : scaling plus doux au début, plus agressif en fin
    // Vague 1 = x0.5, Vague 25 = x1.2, Vague 50 = x2.0, Vague 75 = x3.0, Vague 100 = x5.0
    // Divisé par HORDE_STAT_DIVISOR pour compenser le nombre d'ennemis
    // Le scaling augmente progressivement avec chaque vague (inspiré Pokepath)
    const linear = 0.04 * waveNumber;
    const quadratic = 0.0005 * waveNumber * waveNumber;
    const baseScaling = 0.5 + linear + quadratic; // Commence à 0.5 pour vague 1
    
    // Diviser par le facteur de horde
    return baseScaling / HORDE_STAT_DIVISOR;
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
    const rewardScaling = getWaveRewardScaling(waveNumber);
    
    // Les boss et mini-boss gardent plus de stats
    const isBossType = config.isBoss || config.isMiniBoss;
    const bossMultiplier = isBossType ? 2.0 : 1.0; // Boss 2x plus résistants
    
    return {
        ...config,
        hp: Math.round(config.hp * hpScaling * bossMultiplier),
        shield: config.shield ? Math.round(config.shield * hpScaling * 0.5 * bossMultiplier) : 0,
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
// NOTE: Les vagues 1-20 utilisent maintenant la génération automatique avec max 4 types
// Cette distribution est conservée pour référence mais n'est plus utilisée
const WAVE_ENEMY_DISTRIBUTION = {
    // === ACTE 1: Premiers animaux (Vagues 1-5) - Animaux uniquement ===
    1: [
        'chauvesouris', 'chauvesouris', 'chauvesouris', 'chauvesouris', 'chauvesouris',
        'spider', 'spider', 'spider', 'spider', 'spider',
        'snake', 'snake', 'snake', 'snake', 'crow'
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
