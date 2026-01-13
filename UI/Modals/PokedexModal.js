/**
 * Modal Collection - Style moderne One Piece
 */
class PokedexModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '📚 COLLECTION', 950, 620);
        this.player = player;
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY;
        
        // Barre d'info équipement
        const equippedCount = this.player.collection.getEquippedTowers().length;
        const maxEquipped = this.player.collection.getUnlockedSlots();
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        
        const infoBar = this.createCard(this.x, startY + 20, this.width - 60, 40, false);
        
        const leftInfo = this.scene.add.text(
            this.x - this.width / 2 + 50, startY + 20,
            `🔓 ${unlockedTowers.length}/${TOWER_ORDER.length} débloqués`,
            {
                fontSize: '15px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#2ecc71',
                fontStyle: 'bold'
            }
        );
        leftInfo.setOrigin(0, 0.5);
        leftInfo.setDepth(2003);
        this.addElement(leftInfo);
        
        const rightInfo = this.scene.add.text(
            this.x + this.width / 2 - 50, startY + 20,
            `⚔️ ${equippedCount}/${maxEquipped} équipés`,
            {
                fontSize: '15px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: equippedCount >= maxEquipped ? '#e74c3c' : '#d4af37',
                fontStyle: 'bold'
            }
        );
        rightInfo.setOrigin(1, 0.5);
        rightInfo.setDepth(2003);
        this.addElement(rightInfo);
        
        // Grille de personnages
        const gridStartY = startY + 60;
        const itemWidth = 130;
        const itemHeight = 150;
        const spacing = 15;
        const perRow = 6;
        
        const unlockedTowerIds = TOWER_ORDER.filter(towerId => unlockedTowers.includes(towerId));
        
        unlockedTowerIds.forEach((towerId, index) => {
            const config = TOWER_CONFIG[towerId];
            const isEquipped = this.player.collection.isTowerEquipped(towerId);
            
            const row = Math.floor(index / perRow);
            const col = index % perRow;
            const x = this.x - this.width / 2 + 80 + col * (itemWidth + spacing);
            const y = gridStartY + row * (itemHeight + spacing);
            
            // Carte du personnage
            const card = this.scene.add.rectangle(
                x, y + itemHeight / 2 - 10,
                itemWidth, itemHeight - 20,
                this.colors.secondary,
                0.9
            );
            card.setDepth(2002);
            card.setStrokeStyle(2, isEquipped ? this.colors.accent : this.colors.border, isEquipped ? 1 : 0.4);
            this.addElement(card);
            
            // Badge équipé
            if (isEquipped) {
                const badge = this.scene.add.circle(x + itemWidth / 2 - 15, y - 5, 12, this.colors.success, 1);
                badge.setDepth(2004);
                this.addElement(badge);
                
                const badgeCheck = this.scene.add.text(x + itemWidth / 2 - 15, y - 6, '✓', {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold'
                });
                badgeCheck.setOrigin(0.5);
                badgeCheck.setDepth(2005);
                this.addElement(badgeCheck);
            }
            
            // Sprite du personnage - Tailles ajustées pour rentrer dans la carte (max height ~55px)
            if (this.scene.textures.exists(towerId)) {
                const sprite = this.scene.add.sprite(x, y + 35, towerId);
                
                // Tailles adaptées pour rester dans le cadre (carte fait 130x150, zone sprite ~60px)
                const sizes = {
                    'luffy': [36, 55],
                    'zoro': [46, 55],
                    'ussop': [46, 55],
                    'chopper': [36, 52],
                    'franky': [36, 55],
                    'sanji': [41, 55],
                    'nami': [60, 55],
                    'robin': [46, 55],
                    'brook': [46, 55],
                    'jimbe': [46, 55]
                };
                const size = sizes[towerId] || [40, 50];
                sprite.setDisplaySize(size[0], size[1]);
                
                if (towerId === 'luffy') sprite.setFlipX(true);
                
                const animKey = `${towerId}_idle`;
                if (this.scene.anims.exists(animKey)) {
                    sprite.play(animKey);
                }
                
                sprite.setDepth(2003);
                this.addElement(sprite);
            } else {
                const circle = this.scene.add.circle(x, y + 35, 22, config.color);
                circle.setDepth(2003);
                this.addElement(circle);
            }
            
            // Nom
            const name = this.scene.add.text(
                x, y + 75,
                config.name,
                {
                    fontSize: '13px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#d4af37',
                    fontStyle: 'bold'
                }
            );
            name.setOrigin(0.5);
            name.setDepth(2003);
            this.addElement(name);
            
            // Rareté
            const rarityColors = {
                'common': '#8892a0',
                'rare': '#3498db',
                'epic': '#9b59b6',
                'legendary': '#f39c12'
            };
            const rarityText = this.scene.add.text(
                x, y + 92,
                (config.rarity || 'common').toUpperCase(),
                {
                    fontSize: '10px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: rarityColors[config.rarity] || '#8892a0',
                    letterSpacing: 1
                }
            );
            rarityText.setOrigin(0.5);
            rarityText.setDepth(2003);
            this.addElement(rarityText);
            
            // Bouton équiper/déséquiper
            const btnY = y + 115;
            const btnColor = isEquipped ? this.colors.success : this.colors.borderLight;
            
            const equipBtn = this.scene.add.rectangle(
                x, btnY,
                itemWidth - 20, 28,
                btnColor, 0.9
            );
            equipBtn.setDepth(2002);
            equipBtn.setStrokeStyle(1, 0xffffff, 0.2);
            this.addElement(equipBtn);
            
            const equipText = this.scene.add.text(
                x, btnY,
                isEquipped ? '✓ ÉQUIPÉ' : 'ÉQUIPER',
                {
                    fontSize: '11px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            );
            equipText.setOrigin(0.5);
            equipText.setDepth(2003);
            this.addElement(equipText);
            
            // Interactions
            if (towerId !== 'luffy') {
                equipBtn.setInteractive({ useHandCursor: true });
                
                equipBtn.on('pointerover', () => {
                    equipBtn.setFillStyle(isEquipped ? 0x27ae60 : 0x5dade2, 1);
                    equipBtn.setScale(1.02);
                });
                
                equipBtn.on('pointerout', () => {
                    equipBtn.setFillStyle(btnColor, 0.9);
                    equipBtn.setScale(1);
                });
                
                equipBtn.on('pointerdown', () => {
                    if (isEquipped) {
                        const success = this.player.collection.unequipTower(towerId);
                        if (success) {
                            if (this.scene.placementSystem) {
                                this.scene.placementSystem.removeAllTowersOfType(towerId);
                            }
                            if (this.scene.saveManager) this.scene.saveManager.autoSave();
                            if (this.scene.towerMenu) this.scene.towerMenu.refreshMenu();
                            this.topMenu.closeModal();
                            this.topMenu.openTab('pokedex');
                        }
                    } else {
                        const success = this.player.collection.equipTower(towerId);
                        if (success) {
                            if (this.scene.saveManager) this.scene.saveManager.autoSave();
                            if (this.scene.towerMenu) this.scene.towerMenu.refreshMenu();
                            this.topMenu.closeModal();
                            this.topMenu.openTab('pokedex');
                        } else {
                            this.showEquipError();
                        }
                    }
                });
            }
        });
    }
    
    showEquipError() {
        const errorBg = this.scene.add.rectangle(this.x, this.y, 350, 80, 0x1a1a2e, 0.98);
        errorBg.setDepth(2020);
        errorBg.setStrokeStyle(2, this.colors.danger, 0.8);
        this.addElement(errorBg);
        
        const errorText = this.scene.add.text(
            this.x, this.y,
            '⚠️ Équipement plein !\nDéséquipez une tour ou débloquez plus de slots',
            {
                fontSize: '14px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#e74c3c',
                align: 'center',
                fontStyle: 'bold'
            }
        );
        errorText.setOrigin(0.5);
        errorText.setDepth(2021);
        this.addElement(errorText);
        
        this.scene.time.delayedCall(2500, () => {
            errorBg.destroy();
            errorText.destroy();
        });
    }
}
