class EnemyInfoPanel {
    constructor(scene) {
        this.scene = scene;
        this.panelX = 10;
        this.panelY = 20;
        this.panelWidth = 280;
        this.panelHeight = 760;
        this.currentWave = 1;
        this.selectedEnemyType = null;
        
        // Mode stats de combat
        this.towerStatsMode = false;
        this.towerStatsElements = [];
        this.combatStatRows = [];
        
        // Fond du panneau
        this.background = scene.add.rectangle(
            this.panelX,
            this.panelY,
            this.panelWidth,
            this.panelHeight,
            0x1a1a1a,
            0.95
        );
        this.background.setOrigin(0, 0);
        this.background.setDepth(100);
        this.background.setScrollFactor(0);
        
        // === SECTION VAGUE (en haut) ===
        this.waveTitle = scene.add.text(
            this.panelX + this.panelWidth / 2,
            this.panelY + 20,
            'VAGUE  1',
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.waveTitle.setOrigin(0.5);
        this.waveTitle.setDepth(101);
        this.waveTitle.setScrollFactor(0);
        
        // Étoiles du joueur (sous le titre vague)
        this.starsText = scene.add.text(
            this.panelX + this.panelWidth / 2,
            this.panelY + 50,
            '★0',
            {
                fontSize: '18px',
                fill: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.starsText.setOrigin(0.5);
        this.starsText.setDepth(101);
        this.starsText.setScrollFactor(0);
        
        // === SECTION ICÔNES ENNEMIS ===
        this.enemyIconsY = this.panelY + 85;
        this.enemyIcons = [];
        this.enemyCounts = {};
        
        // Fond pour les icônes
        this.iconsBackground = scene.add.rectangle(
            this.panelX + 10,
            this.enemyIconsY,
            this.panelWidth - 20,
            50,
            0x333333,
            0.8
        );
        this.iconsBackground.setOrigin(0, 0);
        this.iconsBackground.setDepth(101);
        this.iconsBackground.setScrollFactor(0);
        
        // Séparateur
        this.separator1 = scene.add.rectangle(
            this.panelX + this.panelWidth / 2,
            this.enemyIconsY + 60,
            this.panelWidth - 20,
            2,
            0x444444
        );
        this.separator1.setDepth(101);
        this.separator1.setScrollFactor(0);
        
        // === SECTION DÉTAILS ENNEMI ===
        this.detailsY = this.enemyIconsY + 75;
        this.createEnemyDetails();
        
        // === SECTION VIE JOUEUR (en bas) ===
        this.createPlayerStats();
    }
    
    clearEnemyIcons() {
        this.enemyIcons.forEach(item => {
            if (item.icon) item.icon.destroy();
            if (item.countText) item.countText.destroy();
            if (item.hitArea) item.hitArea.destroy();
        });
        this.enemyIcons = [];
    }
    
    createEnemyIcon(type, count, xPos) {
        const config = ENEMY_CONFIG[type];
        const item = {};
        
        // Zone cliquable
        item.hitArea = this.scene.add.rectangle(xPos, this.enemyIconsY + 25, 60, 45, 0x000000, 0);
        item.hitArea.setDepth(103);
        item.hitArea.setScrollFactor(0);
        item.hitArea.setInteractive({ useHandCursor: true });
        
        // Mapping des types d'ennemis vers les sprites et animations
        // Les ennemis sans sprite utilisent un cercle coloré
        // width/height définissent la taille d'affichage visuelle pour compenser les différences de spritesheet
        const spriteMapping = {
            // === TIER 1: Animaux faibles (vagues 1+) ===
            'chauvesouris': { sprite: 'chauvesouris', anim: 'chauvesouris', width: 24, height: 28 },
            'spider': { sprite: 'spider', anim: 'spider', width: 22, height: 26 },
            'snake': { sprite: 'snake', anim: 'snake', width: 24, height: 28 },
            'crow': { sprite: 'crow', anim: 'crow', width: 26, height: 30 },
            
            // === TIER 2: Animaux moyens (vagues 5+) ===
            'wolf': { sprite: 'wolf', anim: 'wolf', width: 28, height: 30 },
            'shadowbat': { sprite: 'shadowbat', anim: 'shadowbat', width: 26, height: 28 },
            'raptor': { sprite: 'raptor', anim: 'raptor', width: 28, height: 30 },
            
            // === TIER 3: Animaux forts (vagues 10+) ===
            'golem': { sprite: 'golem', anim: 'golem', width: 32, height: 36 },
            'kungfu': { sprite: 'kungfu', anim: 'kungfu', width: 24, height: 28 },
            'prisoner': { sprite: 'prisoner', anim: 'prisoner', width: 28, height: 32 },
            'pterosaur': { sprite: 'pterosaur', anim: 'pterosaur', width: 36, height: 40 },
            
            // === TIER 4: Animaux puissants (vagues 40+) ===
            'gorilla': { sprite: 'gorilla', anim: 'gorilla', width: 38, height: 42 },
            'jellyfish': { sprite: 'jellyfish', anim: 'jellyfish', width: 30, height: 32 },
            
            // === TIER 1: Pirates basiques ===
            // swd_pirate_walk: frame ~35x50, personnage occupe ~80%
            'pirate_basic': { sprite: 'swd_pirate_walk', anim: 'swd_pirate_walk', tint: null, width: 22, height: 32 },
            'pirate_recruit': { sprite: 'swd_pirate_walk', anim: 'swd_pirate_walk', tint: 0xA0522D, width: 22, height: 32 },
            'pirate_basic2': { sprite: 'swd_pirate_walk', anim: 'swd_pirate_walk', tint: 0x654321, width: 22, height: 32 },
            
            // === TIER 2-3: Hommes-poissons et spécialistes ===
            'fishman_grunt': { sprite: 'fishman', anim: 'fishman', width: 28, height: 32 },
            'fishman_swimmer': { sprite: 'fishman', anim: 'fishman', tint: 0x00CED1, width: 28, height: 32 },
            // gun_pirate_walk: frame ~40x50, personnage occupe ~75%
            'pirate_fast': { sprite: 'gun_pirate_walk', anim: 'gun_pirate_walk', tint: 0xFF6B35, width: 24, height: 32 },
            'fishman_spear': { sprite: 'fishman', anim: 'fishman', tint: 0x2F4F4F, width: 28, height: 32 },
            'fishman_brawler': { sprite: 'fishman2', anim: 'fishman2', width: 30, height: 34 },
            
            // === TIER 4: Élites ===
            // knife_pirate_walk: frame ~35x50, personnage occupe ~80%
            'pirate_shield': { sprite: 'knife_pirate_walk', anim: 'knife_pirate_walk', tint: 0x708090, width: 22, height: 32 },
            'fishman_elite': { sprite: 'fishman', anim: 'fishman', tint: 0x191970, width: 28, height: 32 },
            'fishman_berserker': { sprite: 'fishman', anim: 'fishman', tint: 0xDC143C, width: 28, height: 32 },
            
            // === TIER 5: Officiers ===
            'fishman_officer': { sprite: 'fishman', anim: 'fishman', tint: 0x4B0082, width: 28, height: 32 },
            'fishman_merman': { sprite: 'fishman', anim: 'fishman', tint: 0x00BFFF, width: 28, height: 32 },
            'pirate_assassin': { sprite: 'gun_pirate_walk', anim: 'gun_pirate_walk', tint: 0x2F4F4F, width: 24, height: 32 },
            
            // === TIER 6: Champions ===
            'fishman_champion': { sprite: 'fishman', anim: 'fishman', tint: 0x800080, width: 28, height: 32 },
            'fishman_shaman': { sprite: 'fishman', anim: 'fishman', tint: 0x98FB98, width: 28, height: 32 },
            'octopus_warrior': { sprite: null, color: 0xFF69B4 },
            
            // === TIER 7: Monstres marins ===
            'sea_beast': { sprite: null, color: 0x006400 },
            'mohmoo_calf': { sprite: null, color: 0x87CEEB },
            'shark_hunter': { sprite: null, color: 0x778899 },
            
            // === TIER 8-9: Généraux et Légendes ===
            'fishman_general': { sprite: 'fishman', anim: 'fishman', tint: 0x4A0080, width: 30, height: 34 },
            'sea_king_spawn': { sprite: null, color: 0x2E8B57 },
            'ancient_fishman': { sprite: 'fishman', anim: 'fishman', tint: 0x2F4F4F, width: 30, height: 34 },
            'sea_king': { sprite: null, color: 0x1E90FF },
            
            // === MINI-BOSS ===
            // chew_walk: peut avoir des dimensions différentes
            'chew': { sprite: 'chew_walk', anim: 'chew_walk', tint: null, width: 26, height: 34 },
            'kuroobi': { sprite: null, color: 0x800000, size: 14 },
            'hatchan': { sprite: null, color: 0xFF6347, size: 14 },
            'pisaro': { sprite: null, color: 0x1C1C1C, size: 14 },
            'mohmoo': { sprite: null, color: 0x87CEEB, size: 16 },
            'saw_fishman': { sprite: null, color: 0x708090, size: 14 },
            'shadow_beast': { sprite: null, color: 0x2F2F2F, size: 14 },
            'sea_king_alpha': { sprite: null, color: 0x00008B, size: 15 },
            'arlong_shadow': { sprite: null, color: 0x4A0082, size: 14 },
            
            // === BOSS FINAL ===
            'arlong': { sprite: null, color: 0x0000CD, size: 16 }
        };
        
        // Obtenir le mapping pour ce type d'ennemi
        const mapping = spriteMapping[type] || { sprite: null, color: config?.color || 0x888888 };
        const spriteKey = mapping.sprite;
        const animKey = mapping.anim;
        
        // Icône de l'ennemi (sprite animé ou cercle coloré)
        if (spriteKey && this.scene.textures.exists(spriteKey)) {
            item.icon = this.scene.add.sprite(xPos, this.enemyIconsY + 18, spriteKey);
            // Utiliser les dimensions personnalisées pour compenser les différences de spritesheet
            const displayWidth = mapping.width || 32;
            const displayHeight = mapping.height || 32;
            item.icon.setDisplaySize(displayWidth, displayHeight);
            
            // Jouer l'animation correspondante
            if (animKey && this.scene.anims.exists(animKey)) {
                item.icon.play(animKey);
            }
            
            // Appliquer la teinte si définie
            if (mapping.tint) {
                item.icon.setTint(mapping.tint);
            }
        } else {
            // Cercle coloré pour les ennemis sans sprite
            // Taille uniforme pour tous les cercles (même rayon)
            const circleColor = mapping.color || config?.color || 0x888888;
            const baseRadius = 12; // Rayon de base pour tous
            const circleRadius = mapping.size || baseRadius;
            item.icon = this.scene.add.circle(xPos, this.enemyIconsY + 18, Math.min(circleRadius, 16), circleColor);
            
            // Bordure pour les mini-boss et boss
            if (config?.isMiniBoss || config?.isBoss) {
                item.icon.setStrokeStyle(2, 0xffd700); // Bordure dorée
            }
        }
        item.icon.setDepth(102);
        item.icon.setScrollFactor(0);
        
        // Nombre
        item.countText = this.scene.add.text(xPos, this.enemyIconsY + 38, `x${count}`, {
            fontSize: '12px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'monospace'
        });
        item.countText.setOrigin(0.5);
        item.countText.setDepth(102);
        item.countText.setScrollFactor(0);
        
        item.type = type;
        
        // Événement clic pour afficher les détails
        item.hitArea.on('pointerdown', () => {
            this.selectEnemy(type);
        });
        
        item.hitArea.on('pointerover', () => {
            if (item.icon.setStrokeStyle) {
                item.icon.setStrokeStyle(2, 0xffffff);
            } else {
                item.icon.setScale(1.2);
            }
        });
        
        item.hitArea.on('pointerout', () => {
            if (this.selectedEnemyType !== type) {
                if (item.icon.setStrokeStyle) {
                    item.icon.setStrokeStyle(0);
                } else {
                    item.icon.setScale(1);
                }
            }
        });
        
        this.enemyIcons.push(item);
    }
    
    createEnemyDetails() {
        const x = this.panelX + 20;
        const labelX = x;
        const valueX = this.panelX + this.panelWidth - 30;
        let y = this.detailsY;
        const lineHeight = 22;
        
        // Nom de l'ennemi
        this.enemyNameText = this.scene.add.text(
            this.panelX + this.panelWidth / 2,
            y,
            '- - -',
            {
                fontSize: '18px',
                    fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.enemyNameText.setOrigin(0.5);
        this.enemyNameText.setDepth(101);
        this.enemyNameText.setScrollFactor(0);
        
        y += 35;
        
        // Séparateur sous le nom
        this.nameSeparator = this.scene.add.rectangle(
            this.panelX + this.panelWidth / 2,
            y - 10,
            this.panelWidth - 40,
            1,
            0x666666
        );
        this.nameSeparator.setDepth(101);
        this.nameSeparator.setScrollFactor(0);
        
        // Stats
        const stats = [
            { label: 'SANTÉ', key: 'hp', color: '#ff6b6b' },
            { label: 'VITESSE', key: 'speed', color: '#4ecdc4' },
            { label: 'PUISSANCE', key: 'power', color: '#ff9f43' },
            { label: 'RÉGÉ.', key: 'regen', color: '#2ecc71', suffix: '/s' },
            { label: 'ÉTOUR.', key: 'stunVuln', color: '#e74c3c', isVuln: true },
            { label: 'RALENT.', key: 'slowVuln', color: '#3498db', isVuln: true },
            { label: 'BRÛL.', key: 'burnVuln', color: '#e67e22', isVuln: true },
            { label: 'EMPOIS.', key: 'poisonVuln', color: '#9b59b6', isVuln: true },
            { label: 'INVISIBLE', key: 'invisible', color: '#95a5a6', isInvis: true },
            { label: 'OR', key: 'reward', color: '#f1c40f', prefix: '$' }
        ];
        
        this.statTexts = {};
        
        stats.forEach(stat => {
            // Label
            const label = this.scene.add.text(labelX, y, stat.label, {
                fontSize: '13px',
                fill: '#888888',
                fontFamily: 'monospace'
            });
            label.setDepth(101);
            label.setScrollFactor(0);
            
            // Valeur
            const value = this.scene.add.text(valueX, y, '-', {
                fontSize: '13px',
                fill: stat.color,
                fontStyle: 'bold',
                fontFamily: 'monospace'
            });
            value.setOrigin(1, 0);
            value.setDepth(101);
            value.setScrollFactor(0);
            
            this.statTexts[stat.key] = { text: value, stat: stat };
            
            y += lineHeight;
        });
    }
    
    selectEnemy(type) {
        this.selectedEnemyType = type;
        const config = ENEMY_CONFIG[type];
        
        // Mettre à jour le nom
        this.enemyNameText.setText(config.name);
        
        // Mettre à jour les stats
        Object.keys(this.statTexts).forEach(key => {
            const { text, stat } = this.statTexts[key];
            let value = config[key];
            
            if (stat.isVuln) {
                text.setText(value ? 'VULN' : 'RES');
                text.setColor(value ? '#2ecc71' : '#e74c3c');
            } else if (stat.isInvis) {
                text.setText(value ? 'OUI' : 'NON');
            } else {
                let displayValue = (stat.prefix || '') + value + (stat.suffix || '');
                text.setText(displayValue);
            }
        });
        
        // Highlight l'icône sélectionnée
        this.enemyIcons.forEach(item => {
            if (item.type === type) {
                if (item.icon.setStrokeStyle) {
                    item.icon.setStrokeStyle(2, 0xffffff);
                } else {
                    item.icon.setScale(1.2);
                }
            } else {
                if (item.icon.setStrokeStyle) {
                    item.icon.setStrokeStyle(0);
                } else {
                    item.icon.setScale(1);
                }
            }
        });
    }
    
    createPlayerStats() {
        const bottomY = this.panelY + this.panelHeight - 70;
        
        // Séparateur
        this.separator2 = this.scene.add.rectangle(
            this.panelX + this.panelWidth / 2,
            bottomY - 15,
            this.panelWidth - 20,
            2,
            0x444444
        );
        this.separator2.setDepth(101);
        this.separator2.setScrollFactor(0);
        
        // HP du joueur
        this.playerHpText = this.scene.add.text(
            this.panelX + this.panelWidth / 2,
            bottomY + 5,
            '❤️ 10',
            {
                fontSize: '20px',
                fill: '#00ff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.playerHpText.setOrigin(0.5);
        this.playerHpText.setDepth(101);
        this.playerHpText.setScrollFactor(0);
        
        // Or du joueur
        this.playerGoldText = this.scene.add.text(
            this.panelX + this.panelWidth / 2,
            bottomY + 35,
            '💰 100',
            {
                fontSize: '20px',
                fill: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.playerGoldText.setOrigin(0.5);
        this.playerGoldText.setDepth(101);
        this.playerGoldText.setScrollFactor(0);
    }
    
    updateWaveEnemies(waveEnemies, waveNumber = null) {
        // Fermer automatiquement le mode stats tour quand une nouvelle vague commence
        if (this.towerStatsMode) {
            this.hideTowerStats();
        }
        
        if (waveNumber) {
            this.currentWave = waveNumber;
            this.waveTitle.setText(`VAGUE  ${waveNumber}`);
        }
        
        // Compter les ennemis par type
        const counts = {};
        waveEnemies.forEach(type => {
            if (!counts[type]) counts[type] = 0;
            counts[type]++;
        });
        
        // Effacer les icônes existantes
        this.clearEnemyIcons();
        
        // Créer les icônes pour les ennemis présents
        const types = Object.keys(counts);
        const spacing = this.panelWidth / (types.length + 1);
        
        types.forEach((type, index) => {
            const xPos = this.panelX + spacing * (index + 1);
            this.createEnemyIcon(type, counts[type], xPos);
        });
        
        // Sélectionner le premier ennemi par défaut
        if (types.length > 0) {
            this.selectEnemy(types[0]);
        }
    }
    
    updatePlayerStats(player) {
        this.playerHpText.setText(`❤️ ${player.hp}`);
        this.playerGoldText.setText(`💰 ${player.gold}`);
        
        // Étoiles du niveau actuel = nombre de vagues complétées dans cette map
        const levelStars = Object.keys(player.completedWaves).length;
        this.starsText.setText(`★${levelStars}`);
        
        // Couleur HP selon niveau
        if (player.hp > 7) {
            this.playerHpText.setColor('#00ff00');
        } else if (player.hp > 3) {
            this.playerHpText.setColor('#ffff00');
        } else {
            this.playerHpText.setColor('#ff0000');
        }
    }
    
    // ==================== MODE STATS COMBAT ====================
    
    /**
     * Affiche les stats de combat en temps réel (remplace temporairement les infos ennemis)
     */
    showCombatStats() {
        this.towerStatsMode = true;
        
        // Cacher les éléments ennemis
        this.hideEnemyElements();
        
        // Créer les éléments de stats de combat
        this.createCombatStats();
    }
    
    /**
     * Affiche les stats d'une tour dans le panneau (remplace temporairement les infos ennemis)
     */
    showTowerStats(towerId) {
        if (!TOWER_CONFIG[towerId]) return;
        
        this.currentTowerId = towerId;
        this.towerStatsMode = true;
        
        // Cacher les éléments ennemis
        this.hideEnemyElements();
        
        // Créer ou mettre à jour les éléments de stats tour
        this.createOrUpdateTowerStats(towerId);
    }
    
    /**
     * Retourne au mode affichage ennemis (appelé à chaque nouvelle vague)
     */
    hideTowerStats() {
        if (!this.towerStatsMode) return;
        
        this.towerStatsMode = false;
        this.currentTowerId = null;
        
        // Détruire les éléments de stats tour/combat
        this.destroyTowerStatsElements();
        
        // Nettoyer les lignes de stats de combat
        if (this.combatStatRows) {
            this.combatStatRows.forEach(el => {
                if (el && el.destroy) el.destroy();
            });
            this.combatStatRows = [];
        }
        
        // Réafficher les éléments ennemis
        this.showEnemyElements();
    }
    
    hideEnemyElements() {
        // Cacher les icônes ennemis
        this.enemyIcons.forEach(item => {
            if (item.icon) item.icon.setVisible(false);
            if (item.countText) item.countText.setVisible(false);
            if (item.hitArea) item.hitArea.setVisible(false);
        });
        
        // Cacher les détails ennemis
        if (this.enemyNameText) this.enemyNameText.setVisible(false);
        if (this.nameSeparator) this.nameSeparator.setVisible(false);
        Object.values(this.statTexts || {}).forEach(({ text }) => {
            if (text) text.setVisible(false);
        });
        
        // Cacher le fond des icônes et les labels de stats
        if (this.iconsBackground) this.iconsBackground.setVisible(false);
        if (this.separator1) this.separator1.setVisible(false);
    }
    
    showEnemyElements() {
        // Réafficher les icônes ennemis
        this.enemyIcons.forEach(item => {
            if (item.icon) item.icon.setVisible(true);
            if (item.countText) item.countText.setVisible(true);
            if (item.hitArea) item.hitArea.setVisible(true);
        });
        
        // Réafficher les détails ennemis
        if (this.enemyNameText) this.enemyNameText.setVisible(true);
        if (this.nameSeparator) this.nameSeparator.setVisible(true);
        Object.values(this.statTexts || {}).forEach(({ text }) => {
            if (text) text.setVisible(true);
        });
        
        // Réafficher le fond des icônes
        if (this.iconsBackground) this.iconsBackground.setVisible(true);
        if (this.separator1) this.separator1.setVisible(true);
    }
    
    destroyTowerStatsElements() {
        if (this.towerStatsElements) {
            this.towerStatsElements.forEach(el => {
                if (el && el.destroy) el.destroy();
            });
            this.towerStatsElements = [];
        }
        
        // Arrêter le timer de mise à jour
        if (this.towerStatsUpdateTimer) {
            this.towerStatsUpdateTimer.destroy();
            this.towerStatsUpdateTimer = null;
        }
    }
    
    /**
     * Crée l'affichage des stats de combat en temps réel
     */
    createCombatStats() {
        this.destroyTowerStatsElements();
        this.towerStatsElements = [];
        this.combatStatRows = [];
        
        const centerX = this.panelX + this.panelWidth / 2;
        let y = this.enemyIconsY - 5;
        
        // Titre
        const title = this.scene.add.text(centerX, y, '📊 STATS DE COMBAT', {
            fontSize: '20px',
            fill: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        title.setOrigin(0.5);
        title.setDepth(102);
        title.setScrollFactor(0);
        this.towerStatsElements.push(title);
        
        y += 30;
        
        // Sous-titre
        const subtitle = this.scene.add.text(centerX, y, 'Dégâts & Éliminations en temps réel', {
            fontSize: '12px',
            fill: '#888888',
            fontFamily: 'Arial'
        });
        subtitle.setOrigin(0.5);
        subtitle.setDepth(102);
        subtitle.setScrollFactor(0);
        this.towerStatsElements.push(subtitle);
        
        y += 25;
        
        // Séparateur
        const sep = this.scene.add.rectangle(centerX, y, this.panelWidth - 40, 2, 0x444444);
        sep.setDepth(101);
        sep.setScrollFactor(0);
        this.towerStatsElements.push(sep);
        
        y += 15;
        
        // Zone de contenu scrollable (si nécessaire)
        this.combatStatsStartY = y;
        this.combatStatsContentY = y;
        
        // Bouton fermer en bas
        const closeY = this.panelY + this.panelHeight - 80;
        
        const closeBtn = this.scene.add.rectangle(centerX, closeY, 140, 32, 0x374151, 0.9);
        closeBtn.setDepth(102);
        closeBtn.setScrollFactor(0);
        closeBtn.setStrokeStyle(2, 0x6b7280, 0.8);
        closeBtn.setInteractive({ useHandCursor: true });
        this.towerStatsElements.push(closeBtn);
        
        const closeBtnText = this.scene.add.text(centerX, closeY, '❌ FERMER', {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        closeBtnText.setOrigin(0.5);
        closeBtnText.setDepth(103);
        closeBtnText.setScrollFactor(0);
        this.towerStatsElements.push(closeBtnText);
        
        closeBtn.on('pointerdown', () => {
            this.hideTowerStats();
            // Aussi réinitialiser l'onglet dans TopMenu
            if (this.scene.topMenu) {
                this.scene.topMenu.closeModal();
            }
        });
        closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x4b5563));
        closeBtn.on('pointerout', () => closeBtn.setFillStyle(0x374151));
        
        // Timer pour mise à jour des stats
        this.towerStatsUpdateTimer = this.scene.time.addEvent({
            delay: 500,
            callback: () => this.updateCombatStatsDisplay(),
            loop: true
        });
        
        // Affichage initial
        this.updateCombatStatsDisplay();
    }
    
    /**
     * Met à jour l'affichage des stats de combat
     */
    updateCombatStatsDisplay() {
        if (!this.towerStatsMode) return;
        
        // Nettoyer les anciennes lignes
        this.combatStatRows.forEach(el => {
            if (el && el.destroy) el.destroy();
        });
        this.combatStatRows = [];
        
        const towers = this.scene.towers || [];
        const centerX = this.panelX + this.panelWidth / 2;
        let y = this.combatStatsContentY;
        
        if (towers.length === 0) {
            const noTowers = this.scene.add.text(centerX, y + 50, 'Aucune tour placée', {
                fontSize: '16px',
                fill: '#666666',
                fontFamily: 'Arial'
            });
            noTowers.setOrigin(0.5);
            noTowers.setDepth(102);
            noTowers.setScrollFactor(0);
            this.combatStatRows.push(noTowers);
            return;
        }
        
        // Trier par dégâts totaux
        const towerStats = towers.map(tower => ({
            tower: tower,
            damage: tower.totalDamage || 0,
            kills: tower.enemyKills || 0
        })).sort((a, b) => b.damage - a.damage);
        
        // Total
        const totalDamage = towerStats.reduce((sum, t) => sum + t.damage, 0);
        const totalKills = towerStats.reduce((sum, t) => sum + t.kills, 0);
        
        // Afficher le total
        const totalBg = this.scene.add.rectangle(centerX, y + 12, this.panelWidth - 30, 28, 0x1e3a5f, 0.9);
        totalBg.setDepth(101);
        totalBg.setScrollFactor(0);
        totalBg.setStrokeStyle(2, 0x3b82f6, 0.8);
        this.combatStatRows.push(totalBg);
        
        const totalText = this.scene.add.text(centerX, y + 12, 
            `💥 ${this.formatNumber(totalDamage)} total  |  ☠️ ${totalKills} kills`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        totalText.setOrigin(0.5);
        totalText.setDepth(102);
        totalText.setScrollFactor(0);
        this.combatStatRows.push(totalText);
        
        y += 35;
        
        // Afficher chaque tour
        const rowHeight = 45;
        const maxRows = 8;
        
        towerStats.slice(0, maxRows).forEach((stat, index) => {
            const config = TOWER_CONFIG[stat.tower.towerId];
            if (!config) return;
            
            // Barre de progression pour les dégâts
            const dmgPercent = totalDamage > 0 ? stat.damage / totalDamage : 0;
            const barWidth = (this.panelWidth - 40) * dmgPercent;
            
            // Fond de la ligne
            const rowBg = this.scene.add.rectangle(centerX, y + rowHeight/2, this.panelWidth - 30, rowHeight - 4, 0x16213e, 0.7);
            rowBg.setDepth(101);
            rowBg.setScrollFactor(0);
            this.combatStatRows.push(rowBg);
            
            // Barre de dégâts
            if (barWidth > 2) {
                const bar = this.scene.add.rectangle(
                    this.panelX + 15 + barWidth/2, 
                    y + rowHeight/2, 
                    barWidth, 
                    rowHeight - 8, 
                    config.color || 0x3498db, 
                    0.3
                );
                bar.setDepth(101);
                bar.setScrollFactor(0);
                this.combatStatRows.push(bar);
            }
            
            // Rang
            const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32', '#888888'];
            const rank = this.scene.add.text(this.panelX + 22, y + 8, `#${index + 1}`, {
                fontSize: '11px',
                fill: rankColors[Math.min(index, 3)],
                fontStyle: 'bold',
                fontFamily: 'Arial'
            });
            rank.setDepth(102);
            rank.setScrollFactor(0);
            this.combatStatRows.push(rank);
            
            // Nom de la tour
            const name = this.scene.add.text(this.panelX + 45, y + 6, config.name, {
                fontSize: '13px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            });
            name.setDepth(102);
            name.setScrollFactor(0);
            this.combatStatRows.push(name);
            
            // Dégâts
            const dmg = this.scene.add.text(this.panelX + 45, y + 24, `💥 ${this.formatNumber(stat.damage)}`, {
                fontSize: '12px',
                fill: '#ff6b6b',
                fontFamily: 'Arial'
            });
            dmg.setDepth(102);
            dmg.setScrollFactor(0);
            this.combatStatRows.push(dmg);
            
            // Kills
            const kills = this.scene.add.text(this.panelX + 150, y + 24, `☠️ ${stat.kills}`, {
                fontSize: '12px',
                fill: '#51cf66',
                fontFamily: 'Arial'
            });
            kills.setDepth(102);
            kills.setScrollFactor(0);
            this.combatStatRows.push(kills);
            
            // Pourcentage
            const percent = this.scene.add.text(this.panelX + this.panelWidth - 25, y + 15, 
                `${(dmgPercent * 100).toFixed(0)}%`, {
                fontSize: '12px',
                fill: '#888888',
                fontFamily: 'Arial'
            });
            percent.setOrigin(1, 0.5);
            percent.setDepth(102);
            percent.setScrollFactor(0);
            this.combatStatRows.push(percent);
            
            y += rowHeight;
        });
    }
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.floor(num).toString();
    }
    
    createOrUpdateTowerStats(towerId) {
        // Détruire les anciens éléments
        this.destroyTowerStatsElements();
        this.towerStatsElements = [];
        
        const config = TOWER_CONFIG[towerId];
        const playerLevel = this.scene.player.getTowerLevel(towerId);
        const stats = getTowerStats(towerId, playerLevel);
        
        const x = this.panelX + 15;
        const centerX = this.panelX + this.panelWidth / 2;
        let y = this.enemyIconsY - 5;
        
        // Titre avec nom de la tour
        const title = this.scene.add.text(centerX, y, `⚔️ ${config.name.toUpperCase()} ⚔️`, {
            fontSize: '20px',
            fill: '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        title.setOrigin(0.5);
        title.setDepth(102);
        title.setScrollFactor(0);
        this.towerStatsElements.push(title);
        
        y += 30;
        
        // Niveau
        const levelBadge = this.scene.add.rectangle(centerX, y, 100, 24, 0x3b82f6, 0.9);
        levelBadge.setDepth(101);
        levelBadge.setScrollFactor(0);
        levelBadge.setStrokeStyle(2, 0x60a5fa, 1);
        this.towerStatsElements.push(levelBadge);
        
        const levelText = this.scene.add.text(centerX, y, `NIVEAU ${playerLevel}`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        levelText.setOrigin(0.5);
        levelText.setDepth(102);
        levelText.setScrollFactor(0);
        this.towerStatsElements.push(levelText);
        
        y += 35;
        
        // Séparateur
        const sep = this.scene.add.rectangle(centerX, y, this.panelWidth - 40, 2, 0x444444);
        sep.setDepth(101);
        sep.setScrollFactor(0);
        this.towerStatsElements.push(sep);
        
        y += 20;
        
        // Stats en temps réel
        const statsList = [
            { label: 'DÉGÂTS', value: Math.floor(stats.damage), color: '#ff6b6b', icon: '⚔️' },
            { label: 'CADENCE', value: (stats.fireRate / 1000).toFixed(2) + 's', color: '#4ecdc4', icon: '⏱️' },
            { label: 'CRITIQUE', value: Math.floor(stats.critChance) + '%', color: '#f1c40f', icon: '💥' },
            { label: 'PORTÉE', value: Math.floor(stats.range), color: '#3498db', icon: '🎯' },
            { label: 'TYPE', value: config.attackType || 'Physique', color: '#a855f7', icon: '✨' },
            { label: 'RARETÉ', value: config.rarity.toUpperCase(), color: this.getRarityColor(config.rarity), icon: '💎' }
        ];
        
        this.towerStatValues = {};
        
        statsList.forEach(stat => {
            // Fond de ligne
            const lineBg = this.scene.add.rectangle(centerX, y + 8, this.panelWidth - 30, 24, 0x1a1a2e, 0.7);
            lineBg.setDepth(101);
            lineBg.setScrollFactor(0);
            this.towerStatsElements.push(lineBg);
            
            // Icon + Label
            const label = this.scene.add.text(x, y, `${stat.icon} ${stat.label}`, {
                fontSize: '14px',
                fill: '#888888',
                fontFamily: 'Arial'
            });
            label.setDepth(102);
            label.setScrollFactor(0);
            this.towerStatsElements.push(label);
            
            // Valeur
            const value = this.scene.add.text(this.panelX + this.panelWidth - 20, y, stat.value, {
                fontSize: '14px',
                fill: stat.color,
                fontStyle: 'bold',
                fontFamily: 'Arial'
            });
            value.setOrigin(1, 0);
            value.setDepth(102);
            value.setScrollFactor(0);
            this.towerStatsElements.push(value);
            
            this.towerStatValues[stat.label] = value;
            
            y += 28;
        });
        
        y += 10;
        
        // Séparateur
        const sep2 = this.scene.add.rectangle(centerX, y, this.panelWidth - 40, 2, 0x444444);
        sep2.setDepth(101);
        sep2.setScrollFactor(0);
        this.towerStatsElements.push(sep2);
        
        y += 20;
        
        // Coût d'amélioration
        const upgradeCost = getUpgradeCost(towerId, playerLevel);
        const canUpgrade = playerLevel < config.maxLevel;
        
        const upgradeBg = this.scene.add.rectangle(centerX, y + 8, this.panelWidth - 30, 28, 0x0a2e0a, 0.8);
        upgradeBg.setDepth(101);
        upgradeBg.setScrollFactor(0);
        upgradeBg.setStrokeStyle(2, 0x10b981, 0.8);
        this.towerStatsElements.push(upgradeBg);
        
        const upgradeText = this.scene.add.text(centerX, y + 8, 
            canUpgrade ? `💰 AMÉLIORATION: ${upgradeCost} or` : '🏆 NIVEAU MAX', {
            fontSize: '13px',
            fill: canUpgrade ? '#10b981' : '#ffd700',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        upgradeText.setOrigin(0.5);
        upgradeText.setDepth(102);
        upgradeText.setScrollFactor(0);
        this.towerStatsElements.push(upgradeText);
        this.towerUpgradeText = upgradeText;
        
        y += 40;
        
        // Bouton fermer
        const closeBtn = this.scene.add.rectangle(centerX, y + 10, 120, 30, 0x374151, 0.9);
        closeBtn.setDepth(102);
        closeBtn.setScrollFactor(0);
        closeBtn.setStrokeStyle(2, 0x6b7280, 0.8);
        closeBtn.setInteractive({ useHandCursor: true });
        this.towerStatsElements.push(closeBtn);
        
        const closeBtnText = this.scene.add.text(centerX, y + 10, '❌ FERMER', {
            fontSize: '12px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial'
        });
        closeBtnText.setOrigin(0.5);
        closeBtnText.setDepth(103);
        closeBtnText.setScrollFactor(0);
        this.towerStatsElements.push(closeBtnText);
        
        closeBtn.on('pointerdown', () => {
            this.hideTowerStats();
        });
        closeBtn.on('pointerover', () => {
            closeBtn.setFillStyle(0x4b5563);
        });
        closeBtn.on('pointerout', () => {
            closeBtn.setFillStyle(0x374151);
        });
        
        // Timer pour mise à jour en temps réel
        this.towerStatsUpdateTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => this.updateTowerStatsDisplay(towerId),
            loop: true
        });
    }
    
    updateTowerStatsDisplay(towerId) {
        if (!this.towerStatsMode || this.currentTowerId !== towerId) return;
        
        const playerLevel = this.scene.player.getTowerLevel(towerId);
        const stats = getTowerStats(towerId, playerLevel);
        const config = TOWER_CONFIG[towerId];
        
        // Mettre à jour les valeurs
        if (this.towerStatValues) {
            if (this.towerStatValues['DÉGÂTS']) {
                this.towerStatValues['DÉGÂTS'].setText(Math.floor(stats.damage));
            }
            if (this.towerStatValues['CADENCE']) {
                this.towerStatValues['CADENCE'].setText((stats.fireRate / 1000).toFixed(2) + 's');
            }
            if (this.towerStatValues['CRITIQUE']) {
                this.towerStatValues['CRITIQUE'].setText(Math.floor(stats.critChance) + '%');
            }
            if (this.towerStatValues['PORTÉE']) {
                this.towerStatValues['PORTÉE'].setText(Math.floor(stats.range));
            }
        }
        
        // Mettre à jour le coût d'amélioration
        if (this.towerUpgradeText) {
            const upgradeCost = getUpgradeCost(towerId, playerLevel);
            const canUpgrade = playerLevel < config.maxLevel;
            this.towerUpgradeText.setText(
                canUpgrade ? `💰 AMÉLIORATION: ${upgradeCost} or` : '🏆 NIVEAU MAX'
            );
            this.towerUpgradeText.setColor(canUpgrade ? '#10b981' : '#ffd700');
        }
    }
    
    getRarityColor(rarity) {
        const colors = {
            'common': '#94a3b8',
            'rare': '#06b6d4',
            'epic': '#a855f7'
        };
        return colors[rarity] || '#94a3b8';
    }
}

