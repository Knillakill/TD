class TowerMenu {
    constructor(scene) {
        this.scene = scene;
        this.menuWidth = 300;  // Interface droite
        this.menuHeight = scene.cameras.main.height;
        this.menuX = 1400;  // Commence après la map (300 + 1100)
        this.selectedTower = null;
        this.isDragging = false;
        this.dragSprite = null;
        this.dragRangeCircle = null;
        this.dragTowerType = null;
        this.availableTowers = {}; // Suivi des tours disponibles
        this.scrollY = 0;
        this.maxScroll = 0;
        
        // Couleurs de rareté
        this.rarityColors = {
            common: { bg: 0x2563eb, border: 0x3b82f6, text: '#60a5fa' },    // Bleu
            rare: { bg: 0x059669, border: 0x10b981, text: '#34d399' },      // Vert
            epic: { bg: 0x7c3aed, border: 0x8b5cf6, text: '#a78bfa' }       // Violet
        };
        
        // Initialiser toutes les tours comme disponibles
        TOWER_ORDER.forEach(towerId => {
            this.availableTowers[towerId] = true;
        });
        
        this.createMenu();
    }
    
    createMenu() {
        // Fond du menu (à droite de la map)
        this.background = this.scene.add.rectangle(
            this.menuX + this.menuWidth / 2,
            this.menuHeight / 2,
            this.menuWidth,
            this.menuHeight,
            0x1a1a1a,
            0.95
        );
        this.background.setDepth(100);
        this.background.setScrollFactor(0);
        
        // Titre du menu
        this.title = this.scene.add.text(
            this.menuX + this.menuWidth / 2,
            15,
            '⚓ ÉQUIPAGE ⚓',
            {
                fontSize: '18px',
                fill: '#ffd700',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.title.setOrigin(0.5);
        this.title.setDepth(101);
        this.title.setScrollFactor(0);
        
        // Créer les cartes pour chaque personnage (2 colonnes)
        this.buttons = {};
        const cardWidth = 135;
        const cardHeight = 175;
        const startX = this.menuX + 10;
        const startY = 45;
        const gapX = 5;
        const gapY = 5;
        
        TOWER_ORDER.forEach((towerId, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = startX + col * (cardWidth + gapX);
            const y = startY + row * (cardHeight + gapY);
            this.createTowerCard(towerId, x, y, cardWidth, cardHeight);
        });
        
        // Calculer le scroll max
        const totalRows = Math.ceil(TOWER_ORDER.length / 2);
        this.maxScroll = Math.max(0, (totalRows * (cardHeight + gapY)) - (this.menuHeight - 60));
    }
    
    createTowerCard(towerId, x, y, width, height) {
        const towerData = TOWER_CONFIG[towerId];
        const rarity = this.rarityColors[towerData.rarity] || this.rarityColors.common;
        
        // Fond de la carte avec couleur de rareté
        const cardBg = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            rarity.bg,
            1
        );
        cardBg.setDepth(100);
        cardBg.setScrollFactor(0);
        
        // Bordure colorée
        const cardBorder = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x000000,
            0
        );
        cardBorder.setStrokeStyle(3, rarity.border);
        cardBorder.setDepth(100);
        cardBorder.setScrollFactor(0);
        
        // Section haute (nom + niveau)
        const headerBg = this.scene.add.rectangle(
            x + width / 2,
            y + 20,
            width - 4,
            36,
            0x000000,
            0.3
        );
        headerBg.setDepth(101);
        headerBg.setScrollFactor(0);
        
        // Nom du personnage
        const name = this.scene.add.text(
            x + width / 2,
            y + 12,
            towerData.name.toUpperCase(),
            {
                fontSize: '13px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        name.setOrigin(0.5);
        name.setDepth(102);
        name.setScrollFactor(0);
        
        // Niveau
        const level = this.scene.add.text(
            x + width / 2,
            y + 28,
            `Lv ${towerData.level || 1}`,
            {
                fontSize: '11px',
                fill: '#cccccc',
                fontFamily: 'monospace'
            }
        );
        level.setOrigin(0.5);
        level.setDepth(102);
        level.setScrollFactor(0);
        
        // Zone icône (sprite animé pour Luffy/Zoro, image pour les autres, sinon carré coloré)
        let icon;
        if (towerId === 'luffy' && this.scene.textures.exists('luffy')) {
            icon = this.scene.add.sprite(x + width / 2, y + 75, 'luffy');
            icon.setDisplaySize(35, 70); // Ratio 41:83
            icon.play('luffy_idle');
        } else if (towerId === 'zoro' && this.scene.textures.exists('zoro')) {
            icon = this.scene.add.sprite(x + width / 2, y + 75, 'zoro');
            icon.setDisplaySize(35, 75); // Ratio 39:85
            icon.play('zoro_idle');
        } else if (this.scene.textures.exists(towerId)) {
            icon = this.scene.add.image(
                x + width / 2,
                y + 75,
                towerId
            );
            icon.setDisplaySize(50, 50);
        } else {
            icon = this.scene.add.rectangle(
                x + width / 2,
                y + 75,
                45,
                45,
                towerData.color
            );
        }
        icon.setDepth(102);
        icon.setScrollFactor(0);
        
        // Bouton INFOS
        const infosBtn = this.scene.add.rectangle(
            x + width / 2,
            y + 120,
            width - 16,
            22,
            0x1e3a5f,
            1
        );
        infosBtn.setDepth(101);
        infosBtn.setScrollFactor(0);
        infosBtn.setInteractive({ useHandCursor: true });
        infosBtn.setStrokeStyle(1, 0x3b82f6);
        
        const infosText = this.scene.add.text(
            x + width / 2,
            y + 120,
            'INFOS',
            {
                fontSize: '11px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        infosText.setOrigin(0.5);
        infosText.setDepth(102);
        infosText.setScrollFactor(0);
        
        // Bouton DÉPLOYER
        const deployBtn = this.scene.add.rectangle(
            x + width / 2,
            y + 148,
            width - 16,
            22,
            0x1e3a5f,
            1
        );
        deployBtn.setDepth(101);
        deployBtn.setScrollFactor(0);
        deployBtn.setInteractive({ useHandCursor: true });
        deployBtn.setStrokeStyle(1, 0x3b82f6);
        
        const deployText = this.scene.add.text(
            x + width / 2,
            y + 148,
            'DÉPLOYER',
            {
                fontSize: '11px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        deployText.setOrigin(0.5);
        deployText.setDepth(102);
        deployBtn.setScrollFactor(0);
        
        // Prix (affiché sur le bouton déployer si pas gratuit)
        const costDisplay = towerData.cost === 0 ? 'GRATUIT' : `💰${towerData.cost}`;
        
        // Badge "PLACÉ" (caché par défaut)
        const usedBadge = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x000000,
            0.8
        );
        usedBadge.setDepth(103);
        usedBadge.setVisible(false);
        usedBadge.setScrollFactor(0);
        
        const usedText = this.scene.add.text(
            x + width / 2,
            y + height / 2,
            '✓ PLACÉ',
            {
                fontSize: '16px',
                fill: '#666666',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        usedText.setOrigin(0.5);
        usedText.setDepth(104);
        usedText.setVisible(false);
        usedText.setScrollFactor(0);
        
        // Événements
        infosBtn.on('pointerdown', () => {
            this.showTowerInfo(towerId);
        });
        
        infosBtn.on('pointerover', () => {
            infosBtn.setFillStyle(0x2563eb);
        });
        
        infosBtn.on('pointerout', () => {
            infosBtn.setFillStyle(0x1e3a5f);
        });
        
        deployBtn.on('pointerdown', (pointer) => {
            if (this.availableTowers[towerId]) {
                this.startDrag(towerId, pointer, deployBtn);
            }
        });
        
        deployBtn.on('pointerover', () => {
            if (this.availableTowers[towerId]) {
                deployBtn.setFillStyle(0x059669);
            }
        });
        
        deployBtn.on('pointerout', () => {
            deployBtn.setFillStyle(0x1e3a5f);
        });
        
        // Stocker les références
        this.buttons[towerId] = {
            cardBg: cardBg,
            cardBorder: cardBorder,
            headerBg: headerBg,
            icon: icon,
            name: name,
            level: level,
            infosBtn: infosBtn,
            infosText: infosText,
            deployBtn: deployBtn,
            deployText: deployText,
            usedBadge: usedBadge,
            usedText: usedText
        };
    }
    
    showTowerInfo(towerId) {
        // Si une modal est déjà ouverte, la fermer d'abord puis ouvrir la nouvelle
        if (this.modal) {
            this.closeModal();
        }
        
        const towerConfig = TOWER_CONFIG[towerId];
        const playerLevel = this.scene.player.getTowerLevel(towerId);
        const towerData = getTowerStats(towerId, playerLevel);
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        const modalWidth = 380;
        const modalHeight = 480;
        
        this.modal = {};
        this.currentInfoTower = towerId;
        
        // Fond sombre derrière la modal
        this.modal.overlay = this.scene.add.rectangle(
            centerX, centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000, 0.7
        );
        this.modal.overlay.setDepth(500);
        this.modal.overlay.setScrollFactor(0);
        this.modal.overlay.setInteractive();
        this.modal.overlay.on('pointerdown', () => this.closeModal());
        
        // Fond de la modal
        this.modal.bg = this.scene.add.rectangle(
            centerX, centerY,
            modalWidth, modalHeight,
            0x1a1a1a, 1
        );
        this.modal.bg.setDepth(501);
        this.modal.bg.setScrollFactor(0);
        this.modal.bg.setStrokeStyle(3, 0x444444);
        this.modal.bg.setInteractive();  // Rendre interactif pour bloquer les clics
        
        // Titre "DONNÉES UNITÉ"
        this.modal.title = this.scene.add.text(
            centerX - modalWidth/2 + 20,
            centerY - modalHeight/2 + 15,
            'DONNÉES UNITÉ',
            {
                fontSize: '16px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.title.setDepth(502);
        this.modal.title.setScrollFactor(0);
        
        // Bouton X pour fermer
        this.modal.closeBtn = this.scene.add.text(
            centerX + modalWidth/2 - 25,
            centerY - modalHeight/2 + 12,
            'X',
            {
                fontSize: '20px',
                fill: '#ff6666',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.closeBtn.setDepth(502);
        this.modal.closeBtn.setScrollFactor(0);
        this.modal.closeBtn.setInteractive({ useHandCursor: true });
        this.modal.closeBtn.on('pointerdown', () => this.closeModal());
        this.modal.closeBtn.on('pointerover', () => this.modal.closeBtn.setColor('#ff0000'));
        this.modal.closeBtn.on('pointerout', () => this.modal.closeBtn.setColor('#ff6666'));
        
        // Barre de navigation (nom + niveau)
        const navY = centerY - modalHeight/2 + 55;
        this.modal.navBg = this.scene.add.rectangle(
            centerX, navY,
            modalWidth - 20, 35,
            0x2a4a2a, 1
        );
        this.modal.navBg.setDepth(501);
        this.modal.navBg.setScrollFactor(0);
        
        // Flèche gauche
        this.modal.leftArrow = this.scene.add.text(
            centerX - modalWidth/2 + 30, navY,
            '<',
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.leftArrow.setOrigin(0.5);
        this.modal.leftArrow.setDepth(502);
        this.modal.leftArrow.setScrollFactor(0);
        this.modal.leftArrow.setInteractive({ useHandCursor: true });
        this.modal.leftArrow.on('pointerdown', () => this.navigateTower(-1));
        
        // Nom + Niveau
        this.modal.towerName = this.scene.add.text(
            centerX, navY,
            `${towerData.name.toUpperCase()} [${playerLevel}]`,
            {
                fontSize: '16px',
                fill: '#00ff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.towerName.setOrigin(0.5);
        this.modal.towerName.setDepth(502);
        this.modal.towerName.setScrollFactor(0);
        
        // Flèche droite
        this.modal.rightArrow = this.scene.add.text(
            centerX + modalWidth/2 - 30, navY,
            '>',
            {
                fontSize: '24px',
                fill: '#00ff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.rightArrow.setOrigin(0.5);
        this.modal.rightArrow.setDepth(502);
        this.modal.rightArrow.setScrollFactor(0);
        this.modal.rightArrow.setInteractive({ useHandCursor: true });
        this.modal.rightArrow.on('pointerdown', () => this.navigateTower(1));
        
        // Stats
        const statsStartY = navY + 35;
        const labelX = centerX - modalWidth/2 + 30;
        const valueX = centerX + modalWidth/2 - 30;
        const lineHeight = 28;
        
        const stats = [
            { label: 'Puissance', value: towerData.damage, color: '#ffffff' },
            { label: 'Recharge', value: `${towerData.fireRate.toFixed(2)}s`, color: '#ffffff' },
            { label: 'Critique', value: `${towerData.critChance.toFixed(1)}%`, color: '#ffffff' },
            { label: 'Portée', value: Math.round(towerData.range), color: '#ffffff' },
            { label: 'Forme', value: towerData.shape, color: '#ffffff' },
            { label: 'Terrain', value: towerData.terrain, color: '#ffffff' },
            { label: 'Cible', value: towerData.target, color: '#ffffff' }
        ];
        
        this.modal.statLabels = [];
        this.modal.statValues = [];
        
        stats.forEach((stat, index) => {
            const y = statsStartY + index * lineHeight;
            
            const label = this.scene.add.text(labelX, y, stat.label, {
                fontSize: '14px',
                fill: '#888888',
                fontFamily: 'monospace'
            });
            label.setDepth(502);
            label.setScrollFactor(0);
            this.modal.statLabels.push(label);
            
            const value = this.scene.add.text(valueX, y, String(stat.value), {
                fontSize: '14px',
                fill: stat.color,
                fontStyle: 'bold',
                fontFamily: 'monospace'
            });
            value.setOrigin(1, 0);
            value.setDepth(502);
            value.setScrollFactor(0);
            this.modal.statValues.push(value);
        });
        
        // Flèches pour Cible (dernière stat)
        const cibleY = statsStartY + 6 * lineHeight;
        this.modal.cibleLeft = this.scene.add.text(
            centerX - 50, cibleY,
            '<',
            {
                fontSize: '14px',
                fill: '#ff6666',
                fontFamily: 'monospace'
            }
        );
        this.modal.cibleLeft.setDepth(502);
        this.modal.cibleLeft.setScrollFactor(0);
        
        this.modal.cibleRight = this.scene.add.text(
            centerX + 80, cibleY,
            '>',
            {
                fontSize: '14px',
                fill: '#ff6666',
                fontFamily: 'monospace'
            }
        );
        this.modal.cibleRight.setDepth(502);
        this.modal.cibleRight.setScrollFactor(0);
        
        // Section passive (fond sombre)
        const passiveY = statsStartY + 7.5 * lineHeight;
        this.modal.passiveBg = this.scene.add.rectangle(
            centerX, passiveY + 30,
            modalWidth - 30, 70,
            0x2a2a2a, 1
        );
        this.modal.passiveBg.setDepth(501);
        this.modal.passiveBg.setScrollFactor(0);
        
        // Texte passif (vide pour l'instant)
        this.modal.passiveText = this.scene.add.text(
            centerX, passiveY + 30,
            towerData.passive || '',
            {
                fontSize: '13px',
                fill: '#00ff00',
                fontFamily: 'monospace',
                align: 'center',
                wordWrap: { width: modalWidth - 50 }
            }
        );
        this.modal.passiveText.setOrigin(0.5);
        this.modal.passiveText.setDepth(502);
        this.modal.passiveText.setScrollFactor(0);
        
        // Boutons de level up en bas
        const btnY = centerY + modalHeight/2 - 35;
        const currentLevel = this.scene.player.getTowerLevel(towerId);
        const maxLevel = towerConfig.maxLevel;
        const upgradeCost = getUpgradeCost(towerId, currentLevel);
        const canUpgrade = currentLevel < maxLevel && this.scene.player.gold >= upgradeCost;
        
        // Affichage du niveau actuel
        this.modal.levelDisplay = this.scene.add.text(
            centerX - 100, btnY,
            `Nv.${currentLevel}/${maxLevel}`,
            {
                fontSize: '14px',
                fill: '#ffff00',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.modal.levelDisplay.setOrigin(0.5);
        this.modal.levelDisplay.setDepth(502);
        this.modal.levelDisplay.setScrollFactor(0);
        
        // Bouton Level Up (+1)
        const btnUpgrade = this.scene.add.rectangle(
            centerX + 20, btnY,
            120, 30,
            canUpgrade ? 0x2d5a27 : 0x444444, 1
        );
        btnUpgrade.setDepth(501);
        btnUpgrade.setScrollFactor(0);
        btnUpgrade.setStrokeStyle(2, canUpgrade ? 0x4a8c3f : 0x666666);
        if (canUpgrade) {
            btnUpgrade.setInteractive({ useHandCursor: true });
            btnUpgrade.on('pointerdown', () => this.upgradeTowerFromModal(towerId));
            btnUpgrade.on('pointerover', () => btnUpgrade.setFillStyle(0x3d7a37));
            btnUpgrade.on('pointerout', () => btnUpgrade.setFillStyle(0x2d5a27));
        }
        
        const btnUpgradeText = this.scene.add.text(
            centerX + 20, btnY,
            currentLevel >= maxLevel ? 'MAX' : `+1 (${upgradeCost}💰)`,
            {
                fontSize: '13px',
                fill: canUpgrade ? '#ffffff' : '#888888',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        btnUpgradeText.setOrigin(0.5);
        btnUpgradeText.setDepth(502);
        btnUpgradeText.setScrollFactor(0);
        
        // Bouton Level Up (+10)
        const cost10 = this.calculateMultiUpgradeCost(towerId, currentLevel, 10);
        const canUpgrade10 = currentLevel + 10 <= maxLevel && this.scene.player.gold >= cost10;
        
        const btnUpgrade10 = this.scene.add.rectangle(
            centerX + 150, btnY,
            100, 30,
            canUpgrade10 ? 0x2d5a27 : 0x444444, 1
        );
        btnUpgrade10.setDepth(501);
        btnUpgrade10.setScrollFactor(0);
        btnUpgrade10.setStrokeStyle(2, canUpgrade10 ? 0x4a8c3f : 0x666666);
        if (canUpgrade10) {
            btnUpgrade10.setInteractive({ useHandCursor: true });
            btnUpgrade10.on('pointerdown', () => this.upgradeTowerMultiple(towerId, 10));
            btnUpgrade10.on('pointerover', () => btnUpgrade10.setFillStyle(0x3d7a37));
            btnUpgrade10.on('pointerout', () => btnUpgrade10.setFillStyle(0x2d5a27));
        }
        
        const btnUpgrade10Text = this.scene.add.text(
            centerX + 150, btnY,
            `+10 (${cost10}💰)`,
            {
                fontSize: '12px',
                fill: canUpgrade10 ? '#ffffff' : '#888888',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        btnUpgrade10Text.setOrigin(0.5);
        btnUpgrade10Text.setDepth(502);
        btnUpgrade10Text.setScrollFactor(0);
        
        this.modal.btnUpgrade = btnUpgrade;
        this.modal.btnUpgradeText = btnUpgradeText;
        this.modal.btnUpgrade10 = btnUpgrade10;
        this.modal.btnUpgrade10Text = btnUpgrade10Text;
    }
    
    // Calculer le coût pour plusieurs niveaux
    calculateMultiUpgradeCost(towerId, currentLevel, levels) {
        let total = 0;
        for (let i = 0; i < levels; i++) {
            if (currentLevel + i >= TOWER_CONFIG[towerId].maxLevel) break;
            total += getUpgradeCost(towerId, currentLevel + i);
        }
        return total;
    }
    
    // Améliorer depuis le modal
    upgradeTowerFromModal(towerId) {
        if (this.scene.player.upgradeTower(towerId)) {
            // Rafraîchir le modal
            this.closeModal();
            this.showTowerInfo(towerId);
            
            // Mettre à jour l'affichage des stats du joueur
            if (this.scene.enemyInfoPanel) {
                this.scene.enemyInfoPanel.updatePlayerStats(this.scene.player);
            }
        }
    }
    
    // Améliorer plusieurs niveaux
    upgradeTowerMultiple(towerId, levels) {
        let upgraded = 0;
        for (let i = 0; i < levels; i++) {
            if (this.scene.player.upgradeTower(towerId)) {
                upgraded++;
            } else {
                break;
            }
        }
        
        if (upgraded > 0) {
            // Rafraîchir le modal
            this.closeModal();
            this.showTowerInfo(towerId);
            
            // Mettre à jour l'affichage des stats du joueur
            if (this.scene.enemyInfoPanel) {
                this.scene.enemyInfoPanel.updatePlayerStats(this.scene.player);
            }
        }
    }
    
    navigateTower(direction) {
        const currentIndex = TOWER_ORDER.indexOf(this.currentInfoTower);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = TOWER_ORDER.length - 1;
        if (newIndex >= TOWER_ORDER.length) newIndex = 0;
        
        const newTowerId = TOWER_ORDER[newIndex];
        this.closeModal();
        this.showTowerInfo(newTowerId);
    }
    
    closeModal() {
        if (!this.modal) return;
        
        // Détruire tous les éléments de la modal
        Object.keys(this.modal).forEach(key => {
            const item = this.modal[key];
            if (Array.isArray(item)) {
                item.forEach(el => el.destroy());
            } else if (item && item.destroy) {
                item.destroy();
            }
        });
        
        this.modal = null;
        this.currentInfoTower = null;
    }
    
    startDrag(towerId, pointer, buttonBg) {
        // Vérifier si la tour est disponible
        if (!this.availableTowers[towerId]) {
            this.scene.ui.showMessage('Déjà placé!', 1000);
            return;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        
        // Vérifier si le joueur a assez d'argent
        if (this.scene.player.gold < towerData.cost) {
            this.scene.ui.showMessage('Pas assez d\'or!', 1500);
            return;
        }
        
        // Démarrer le drag
        this.isDragging = true;
        this.dragTowerType = towerId;
        
        // Créer le sprite du personnage qui suit la souris
        if (towerId === 'luffy' && this.scene.textures.exists('luffy')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'luffy');
            this.dragSprite.setDisplaySize(45, 90); // Ratio 41:83
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('luffy_idle');
        } else if (towerId === 'zoro' && this.scene.textures.exists('zoro')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'zoro');
            this.dragSprite.setDisplaySize(45, 95); // Ratio 39:85
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('zoro_idle');
        } else if (this.scene.textures.exists(towerId)) {
            this.dragSprite = this.scene.add.image(
                pointer.x,
                pointer.y,
                towerId
            );
            this.dragSprite.setDisplaySize(50, 50);
            this.dragSprite.setAlpha(0.8);
        } else {
            this.dragSprite = this.scene.add.rectangle(
                pointer.x,
                pointer.y,
                40,
                40,
                towerData.color,
                0.8
            );
        }
        this.dragSprite.setDepth(300);
        
        // Nom du personnage pendant le drag
        this.dragName = this.scene.add.text(
            pointer.x,
            pointer.y - 30,
            towerData.name,
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 }
            }
        );
        this.dragName.setOrigin(0.5);
        this.dragName.setDepth(301);
        
        // Créer le cercle de portée
        this.dragRangeCircle = this.scene.add.circle(
            pointer.x,
            pointer.y,
            towerData.range,
            towerData.color,
            0.15
        );
        this.dragRangeCircle.setStrokeStyle(2, towerData.color, 0.5);
        this.dragRangeCircle.setDepth(299);
        
        // Écouter les mouvements de la souris
        this.scene.input.on('pointermove', this.onDragMove, this);
        this.scene.input.on('pointerup', this.onDragEnd, this);
        
        // Informer le système de placement
        if (this.scene.placementSystem) {
            this.scene.placementSystem.startDragging(towerId);
        }
    }
    
    onDragMove(pointer) {
        if (!this.isDragging || !this.dragSprite) return;
        
        // Déplacer le sprite, le nom et le cercle de portée avec la souris
        this.dragSprite.x = pointer.x;
        this.dragSprite.y = pointer.y;
        this.dragName.x = pointer.x;
        this.dragName.y = pointer.y - 30;
        this.dragRangeCircle.x = pointer.x;
        this.dragRangeCircle.y = pointer.y;
        
        // Vérifier si on est sur un emplacement valide
        if (this.scene.placementSystem) {
            const isValid = this.scene.placementSystem.checkValidPlacement(pointer.x, pointer.y);
            
            // Changer la couleur selon la validité
            if (isValid) {
                this.dragSprite.setFillStyle(TOWER_CONFIG[this.dragTowerType].color, 0.8);
                this.dragRangeCircle.setStrokeStyle(2, 0x00ff00, 0.5);
            } else {
                this.dragSprite.setFillStyle(0xff0000, 0.5);
                this.dragRangeCircle.setStrokeStyle(2, 0xff0000, 0.5);
            }
        }
    }
    
    onDragEnd(pointer) {
        if (!this.isDragging) return;
        
        // Tenter de placer la tour
        if (this.scene.placementSystem) {
            this.scene.placementSystem.tryPlaceTower(
                this.dragTowerType,
                pointer.x,
                pointer.y
            );
        }
        
        // Nettoyer le drag
        this.cleanupDrag();
    }
    
    cleanupDrag() {
        this.isDragging = false;
        this.dragTowerType = null;
        
        if (this.dragSprite) {
            this.dragSprite.destroy();
            this.dragSprite = null;
        }
        
        if (this.dragName) {
            this.dragName.destroy();
            this.dragName = null;
        }
        
        if (this.dragRangeCircle) {
            this.dragRangeCircle.destroy();
            this.dragRangeCircle = null;
        }
        
        // Retirer les écouteurs
        this.scene.input.off('pointermove', this.onDragMove, this);
        this.scene.input.off('pointerup', this.onDragEnd, this);
    }
    
    markTowerAsUsed(towerId) {
        // Marquer la tour comme non disponible
        this.availableTowers[towerId] = false;
        
        // Afficher le badge "PLACÉ"
        if (this.buttons[towerId]) {
            const button = this.buttons[towerId];
            button.usedBadge.setVisible(true);
            button.usedText.setVisible(true);
            button.deployBtn.disableInteractive();
            button.cardBg.setAlpha(0.5);
            button.icon.setAlpha(0.3);
            button.name.setAlpha(0.3);
            button.level.setAlpha(0.3);
        }
    }
    
    
}

