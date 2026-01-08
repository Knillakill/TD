/**
 * Modal du Pokédex - Collection et équipement des tours
 */
class PokedexModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '📖 POKÉDEX - COLLECTION', 1000, 650);
        this.player = player;
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 20;
        
        // Titre des sections
        const unlockedTitle = this.scene.add.text(
            this.x - this.width / 2 + 40, startY,
            '🔓 TOURS DÉBLOQUÉES',
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
        
        // Tours débloquées
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const cardWidth = 140;
        const cardHeight = 180;
        const spacing = 20;
        const perRow = 6;
        
        TOWER_ORDER.forEach((towerId, index) => {
            const config = TOWER_CONFIG[towerId];
            const isUnlocked = unlockedTowers.includes(towerId);
            const isEquipped = this.player.collection.isTowerEquipped(towerId);
            
            const row = Math.floor(index / perRow);
            const col = index % perRow;
            const x = this.x - this.width / 2 + 80 + col * (cardWidth + spacing);
            const y = startY + 50 + row * (cardHeight + spacing);
            
            // Carte
            const card = this.scene.add.rectangle(
                x, y,
                cardWidth, cardHeight,
                isUnlocked ? 0x16213e : 0x0a0a0a,
                isUnlocked ? 0.9 : 0.5
            );
            card.setDepth(2002);
            card.setStrokeStyle(2, isEquipped ? 0xffd700 : (isUnlocked ? config.color : 0x333333), isEquipped ? 1 : 0.6);
            this.addElement(card);
            
            if (!isUnlocked) {
                // Cadenas
                const lock = this.scene.add.text(
                    x, y,
                    '🔒',
                    { fontSize: '48px' }
                );
                lock.setOrigin(0.5);
                lock.setDepth(2003);
                this.addElement(lock);
                
                const lockText = this.scene.add.text(
                    x, y + 40,
                    'Verrouillé',
                    {
                        fontSize: '14px',
                        fontFamily: 'Arial',
                        color: '#666666'
                    }
                );
                lockText.setOrigin(0.5);
                lockText.setDepth(2003);
                this.addElement(lockText);
            } else {
                // Nom
                const name = this.scene.add.text(
                    x, y - cardHeight / 2 + 25,
                    config.name,
                    {
                        fontSize: '16px',
                        fontFamily: 'Arial',
                        color: '#ffd700',
                        fontStyle: 'bold'
                    }
                );
                name.setOrigin(0.5);
                name.setDepth(2003);
                this.addElement(name);
                
                // Description
                const desc = this.scene.add.text(
                    x, y - 20,
                    config.description,
                    {
                        fontSize: '12px',
                        fontFamily: 'Arial',
                        color: '#cccccc',
                        align: 'center',
                        wordWrap: { width: cardWidth - 20 }
                    }
                );
                desc.setOrigin(0.5);
                desc.setDepth(2003);
                this.addElement(desc);
                
                // Bouton équiper/déséquiper
                if (isEquipped) {
                    const equipBtn = this.scene.add.rectangle(
                        x, y + cardHeight / 2 - 30,
                        110, 30,
                        0x51cf66, 0.9
                    );
                    equipBtn.setDepth(2002);
                    equipBtn.setStrokeStyle(1, 0xffffff, 0.5);
                    this.addElement(equipBtn);
                    
                    const equipText = this.scene.add.text(
                        x, y + cardHeight / 2 - 30,
                        '✓ ÉQUIPÉ',
                        {
                            fontSize: '12px',
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
                                // Sauvegarder
                                if (this.scene.saveManager) {
                                    this.scene.saveManager.autoSave();
                                }
                                // Rafraîchir le menu des tours
                                if (this.scene.towerMenu) {
                                    this.scene.towerMenu.refreshMenu();
                                }
                                // Rafraîchir le pokédex
                                this.topMenu.closeModal();
                                this.topMenu.openTab('pokedex');
                            }
                        });
                    }
                } else {
                    const equipBtn = this.scene.add.rectangle(
                        x, y + cardHeight / 2 - 30,
                        110, 30,
                        0x3d5a80, 0.9
                    );
                    equipBtn.setDepth(2002);
                    equipBtn.setStrokeStyle(1, 0xffffff, 0.5);
                    equipBtn.setInteractive({ useHandCursor: true });
                    this.addElement(equipBtn);
                    
                    const equipText = this.scene.add.text(
                        x, y + cardHeight / 2 - 30,
                        'ÉQUIPER',
                        {
                            fontSize: '12px',
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
                            // Rafraîchir le pokédex
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
            }
        });
    }
}

