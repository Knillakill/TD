class EnemyInfoPanel {
    constructor(scene) {
        this.scene = scene;
        this.panelX = 10;
        this.panelY = 20;
        this.panelWidth = 280;
        this.panelHeight = 760;
        this.currentWave = 1;
        this.selectedEnemyType = null;
        
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
        
        // Déterminer le sprite à utiliser selon le type d'ennemi
        let spriteKey = 'swd_pirate_walk'; // Par défaut
        if (type === 'pirate_fast') {
            spriteKey = 'gun_pirate_walk';
        } else if (type === 'pirate_shield') {
            spriteKey = 'swd_pirate_walk';
        }
        
        // Icône de l'ennemi (sprite animé)
        if (this.scene.textures.exists(spriteKey)) {
            item.icon = this.scene.add.sprite(xPos, this.enemyIconsY + 18, spriteKey);
            item.icon.setDisplaySize(28, 28);
            item.icon.play(spriteKey === 'swd_pirate_walk' ? 'swd_pirate_walk' : 'gun_pirate_walk');
            
            // Teinter selon le type
            if (type === 'pirate_shield') {
                item.icon.setTint(0x708090); // Gris métallique pour blindé
            } else if (type === 'pirate_fast') {
                item.icon.setTint(0xFF6B35); // Orange pour rapide
            }
        } else {
            // Fallback sur cercle coloré
            item.icon = this.scene.add.circle(xPos, this.enemyIconsY + 18, config.size + 2, config.color);
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
            { label: 'ARMURE', key: 'armor', color: '#a0a0a0' },
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
        this.starsText.setText(`★${player.stars}`);
        
        // Couleur HP selon niveau
        if (player.hp > 7) {
            this.playerHpText.setColor('#00ff00');
        } else if (player.hp > 3) {
            this.playerHpText.setColor('#ffff00');
        } else {
            this.playerHpText.setColor('#ff0000');
        }
    }
}

