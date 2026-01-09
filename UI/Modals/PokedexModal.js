/**
 * Modal Collection - Collection et équipement des tours
 */
class PokedexModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '📚 COLLECTION', 1000, 650);
        this.player = player;
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 20;
        
        // Titre des sections
        const unlockedTitle = this.scene.add.text(
            this.x - this.width / 2 + 40, startY,
            '🔓 PERSONNAGES DÉBLOQUÉS',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#51cf66',
                fontStyle: 'bold'
            }
        );
        unlockedTitle.setDepth(2002);
        this.addElement(unlockedTitle);
        
        // Afficher le nombre de places d'équipement
        const equippedCount = this.player.collection.getEquippedTowers().length;
        const maxEquipped = this.player.collection.maxEquipped;
        const equipmentInfo = this.scene.add.text(
            this.x + this.width / 2 - 40, startY,
            `⚔️ Équipement: ${equippedCount}/${maxEquipped}`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: equippedCount >= maxEquipped ? '#ff6b6b' : '#ffd700',
                fontStyle: 'bold'
            }
        );
        equipmentInfo.setOrigin(1, 0);
        equipmentInfo.setDepth(2002);
        this.addElement(equipmentInfo);
        
        // Seulement les tours débloquées
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const itemWidth = 120;
        const itemHeight = 140;
        const spacing = 25;
        const perRow = 6;
        
        // Filtrer pour n'avoir que les tours débloquées
        const unlockedTowerIds = TOWER_ORDER.filter(towerId => unlockedTowers.includes(towerId));
        
        unlockedTowerIds.forEach((towerId, index) => {
            const config = TOWER_CONFIG[towerId];
            const isEquipped = this.player.collection.isTowerEquipped(towerId);
            
            const row = Math.floor(index / perRow);
            const col = index % perRow;
            const x = this.x - this.width / 2 + 90 + col * (itemWidth + spacing);
            const y = startY + 100 + row * (itemHeight + spacing); // Descendu de 60 à 100
            
            // Fond arrondi pour le sprite
            const bgCircle = this.scene.add.graphics();
            bgCircle.fillStyle(0x16213e, 0.9);
            bgCircle.fillRoundedRect(x - itemWidth/2, y - 50, itemWidth, 80, 10);
            bgCircle.lineStyle(2, isEquipped ? 0xffd700 : config.color, isEquipped ? 1 : 0.6);
            bgCircle.strokeRoundedRect(x - itemWidth/2, y - 50, itemWidth, 80, 10);
            bgCircle.setDepth(2002);
            this.addElement(bgCircle);
            
            // Sprite animé du personnage
            let sprite;
            if (this.scene.textures.exists(towerId)) {
                sprite = this.scene.add.sprite(x, y - 10, towerId);
                
                // Taille adaptée selon le personnage
                if (towerId === 'luffy') {
                    sprite.setDisplaySize(35, 55);
                    sprite.setFlipX(true);
                    if (this.scene.anims.exists('luffy_idle')) {
                        sprite.play('luffy_idle');
                    }
                } else if (towerId === 'zoro') {
                    sprite.setDisplaySize(35, 75);
                    if (this.scene.anims.exists('zoro_idle')) {
                        sprite.play('zoro_idle');
                    }
                } else if (towerId === 'ussop') {
                    sprite.setDisplaySize(28, 55); // Même taille que Zoro/Luffy
                    if (this.scene.anims.exists('ussop_idle')) {
                        sprite.play('ussop_idle');
                    }
                } else if (towerId === 'chopper') {
                    sprite.setDisplaySize(28, 39);
                    if (this.scene.anims.exists('chopper_idle')) {
                        sprite.play('chopper_idle');
                    }
                } else if (towerId === 'franky') {
                    sprite.setDisplaySize(45, 56);
                    if (this.scene.anims.exists('franky_idle')) {
                        sprite.play('franky_idle');
                    }
                } else if (towerId === 'sanji') {
                    sprite.setDisplaySize(22, 55); // Même taille que Zoro/Luffy
                    if (this.scene.anims.exists('sanji_idle')) {
                        sprite.play('sanji_idle');
                    }
                } else if (towerId === 'nami') {
                    sprite.setDisplaySize(30, 65);
                    if (this.scene.anims.exists('nami_idle')) {
                        sprite.play('nami_idle');
                    }
                } else {
                    sprite.setDisplaySize(40, 50);
                }
                sprite.setDepth(2003);
                this.addElement(sprite);
            } else {
                // Fallback: cercle coloré si pas de sprite
                const circle = this.scene.add.circle(x, y - 10, 25, config.color);
                circle.setDepth(2003);
                this.addElement(circle);
            }
            
            // Nom en dessous
            const name = this.scene.add.text(
                x, y + 40,
                config.name,
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: '#ffd700',
                    fontStyle: 'bold'
                }
            );
            name.setOrigin(0.5);
            name.setDepth(2003);
            this.addElement(name);
            
            // Bouton équiper/déséquiper
            if (isEquipped) {
                const equipBtn = this.scene.add.rectangle(
                    x, y + 60,
                    100, 26,
                    0x51cf66, 0.9
                );
                equipBtn.setDepth(2002);
                equipBtn.setStrokeStyle(1, 0xffffff, 0.5);
                this.addElement(equipBtn);
                
                const equipText = this.scene.add.text(
                    x, y + 60,
                    '✓ ÉQUIPÉ',
                    {
                        fontSize: '11px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }
                );
                equipText.setOrigin(0.5);
                equipText.setDepth(2003);
                this.addElement(equipText);
                
                if (towerId !== 'luffy') {
                    equipBtn.setInteractive({ useHandCursor: true });
                    
                    equipBtn.on('pointerover', () => {
                        equipBtn.setFillStyle(0x69db7c, 0.9);
                    });
                    
                    equipBtn.on('pointerout', () => {
                        equipBtn.setFillStyle(0x51cf66, 0.9);
                    });
                    
                equipBtn.on('pointerdown', () => {
                    const success = this.player.collection.unequipTower(towerId);
                    if (success) {
                        // Retirer TOUTES les tours de ce type de la map
                        if (this.scene.placementSystem) {
                            const removedCount = this.scene.placementSystem.removeAllTowersOfType(towerId);
                            if (removedCount > 0) {
                                const config = TOWER_CONFIG[towerId];
                                const towerName = config ? config.name : towerId;
                                this.scene.ui.showMessage(`${removedCount} ${towerName} retiré${removedCount > 1 ? 's' : ''} de la map !`, 2000);
                            }
                        }
                        
                        // Sauvegarder
                        if (this.scene.saveManager) {
                            this.scene.saveManager.autoSave();
                        }
                        // Rafraîchir le menu des tours
                        if (this.scene.towerMenu) {
                            this.scene.towerMenu.refreshMenu();
                        }
                        // Rafraîchir la collection
                        this.topMenu.closeModal();
                        this.topMenu.openTab('pokedex');
                    }
                });
                }
            } else {
                const equipBtn = this.scene.add.rectangle(
                    x, y + 60,
                    100, 26,
                    0x3d5a80, 0.9
                );
                equipBtn.setDepth(2002);
                equipBtn.setStrokeStyle(1, 0xffffff, 0.5);
                equipBtn.setInteractive({ useHandCursor: true });
                this.addElement(equipBtn);
                
                const equipText = this.scene.add.text(
                    x, y + 60,
                    'ÉQUIPER',
                    {
                        fontSize: '11px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }
                );
                equipText.setOrigin(0.5);
                equipText.setDepth(2003);
                this.addElement(equipText);
                
                equipBtn.on('pointerover', () => {
                    equipBtn.setFillStyle(0x4a6fa5, 0.9);
                });
                
                equipBtn.on('pointerout', () => {
                    equipBtn.setFillStyle(0x3d5a80, 0.9);
                });
                
                equipBtn.on('pointerdown', () => {
                    const success = this.player.collection.equipTower(towerId);
                    if (success) {
                        // Sauvegarder
                        if (this.scene.saveManager) {
                            this.scene.saveManager.autoSave();
                        }
                        // Rafraîchir le menu des tours
                        if (this.scene.towerMenu) {
                            this.scene.towerMenu.refreshMenu();
                        }
                        // Rafraîchir la collection
                        this.topMenu.closeModal();
                        this.topMenu.openTab('pokedex');
                    } else {
                        // Afficher un message d'erreur
                        const unlockedSlots = this.player.collection.getUnlockedSlots();
                        const lockedSlots = this.player.collection.getLockedSlots();
                        let message = `⚠️ Équipement plein ! (${unlockedSlots}/${this.player.collection.maxEquipped} slots débloqués)\nDéséquipez une tour d'abord`;
                        
                        if (lockedSlots > 0) {
                            message += `\nou débloquez plus de slots dans les Réglages`;
                        }
                        
                        const errorMsg = this.scene.add.text(
                            this.x, this.y - this.height / 2 + 100,
                            message,
                            {
                                fontSize: '16px',
                                fontFamily: 'Arial',
                                color: '#ff6b6b',
                                align: 'center',
                                fontStyle: 'bold'
                            }
                        );
                        errorMsg.setOrigin(0.5);
                        errorMsg.setDepth(2020);
                        this.addElement(errorMsg);
                        
                        setTimeout(() => {
                            if (errorMsg) errorMsg.destroy();
                        }, 3000);
                    }
                });
            }
        });
    }
}

