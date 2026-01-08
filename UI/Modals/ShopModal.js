/**
 * Modal de la boutique - Achat de tours aléatoires
 */
class ShopModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '🛒 BOUTIQUE - BERRY MYSTÈRE', 800, 500);
        this.player = player;
        this.berryCost = 150; // Coût d'un berry
        this.createContent();
    }
    
    createContent() {
        const centerY = this.y;
        
        // Image du berry (grand cercle coloré)
        const berryCircle = this.scene.add.circle(
            this.x, centerY - 50,
            80,
            0xff6b9d, 1
        );
        berryCircle.setDepth(2002);
        berryCircle.setStrokeStyle(5, 0xffd700, 1);
        this.addElement(berryCircle);
        
        // Icône du berry
        const berryIcon = this.scene.add.text(
            this.x, centerY - 50,
            '🍓',
            { fontSize: '64px' }
        );
        berryIcon.setOrigin(0.5);
        berryIcon.setDepth(2003);
        this.addElement(berryIcon);
        
        // Description
        const desc = this.scene.add.text(
            this.x, centerY + 60,
            'Achetez un Berry Mystère pour débloquer\nune tour aléatoire que vous ne possédez pas encore !',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#e0e0e0',
                align: 'center'
            }
        );
        desc.setOrigin(0.5);
        desc.setDepth(2002);
        this.addElement(desc);
        
        // Prix
        const priceText = this.scene.add.text(
            this.x, centerY + 120,
            `Prix: ${this.berryCost} 💰`,
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        priceText.setOrigin(0.5);
        priceText.setDepth(2002);
        this.addElement(priceText);
        
        // Or actuel du joueur
        const goldText = this.scene.add.text(
            this.x, centerY + 155,
            `Votre or: ${this.player.gold} 💰`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: this.player.gold >= this.berryCost ? '#51cf66' : '#ff6b6b'
            }
        );
        goldText.setOrigin(0.5);
        goldText.setDepth(2002);
        this.addElement(goldText);
        
        // Bouton d'achat
        const buyBtn = this.scene.add.rectangle(
            this.x, centerY + 200,
            250, 50,
            this.player.gold >= this.berryCost ? 0x51cf66 : 0x666666,
            0.9
        );
        buyBtn.setDepth(2002);
        buyBtn.setStrokeStyle(3, 0xffffff, 0.8);
        this.addElement(buyBtn);
        
        const buyText = this.scene.add.text(
            this.x, centerY + 200,
            this.player.gold >= this.berryCost ? '🛒 ACHETER UN BERRY' : '❌ PAS ASSEZ D\'OR',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        buyText.setOrigin(0.5);
        buyText.setDepth(2003);
        this.addElement(buyText);
        
        if (this.player.gold >= this.berryCost) {
            buyBtn.setInteractive({ useHandCursor: true });
            
            buyBtn.on('pointerover', () => {
                buyBtn.setFillStyle(0x69db7c, 0.9);
            });
            
            buyBtn.on('pointerout', () => {
                buyBtn.setFillStyle(0x51cf66, 0.9);
            });
            
            buyBtn.on('pointerdown', () => {
                this.buyBerry();
            });
        }
    }
    
    buyBerry() {
        // Vérifier l'or
        if (this.player.gold < this.berryCost) {
            return;
        }
        
        // Récupérer les tours non débloquées
        const allTowers = TOWER_ORDER;
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const lockedTowers = allTowers.filter(id => !unlockedTowers.includes(id));
        
        if (lockedTowers.length === 0) {
            // Toutes les tours sont débloquées
            const msg = this.scene.add.text(
                this.x, this.y + 100,
                'Vous avez déjà débloqué toutes les tours !',
                {
                    fontSize: '20px',
                    fontFamily: 'Arial',
                    color: '#ffd700',
                    fontStyle: 'bold'
                }
            );
            msg.setOrigin(0.5);
            msg.setDepth(2004);
            this.addElement(msg);
            
            setTimeout(() => {
                if (msg) msg.destroy();
            }, 2000);
            
            return;
        }
        
        // Choisir une tour aléatoire
        const randomTower = lockedTowers[Math.floor(Math.random() * lockedTowers.length)];
        
        // Déduire l'or
        this.player.gold -= this.berryCost;
        this.player.collection.updateStats('goldSpent', this.berryCost);
        
        // Débloquer la tour
        this.player.collection.unlockTower(randomTower);
        
        // Équiper automatiquement si il y a de la place
        const hasSpace = this.player.collection.hasEquipmentSpace();
        if (hasSpace) {
            this.player.collection.equipTower(randomTower);
        }
        
        // Sauvegarder la progression
        if (this.scene.saveManager) {
            this.scene.saveManager.autoSave();
        }
        
        // Afficher l'animation de déverrouillage
        this.showUnlockAnimation(randomTower, hasSpace);
    }
    
    showUnlockAnimation(towerId, isEquipped) {
        const config = TOWER_CONFIG[towerId];
        
        // Overlay sombre
        const overlay = this.scene.add.rectangle(
            this.x, this.y,
            this.width, this.height,
            0x000000, 0.8
        );
        overlay.setDepth(2010);
        this.addElement(overlay);
        
        // Message
        const unlockText = this.scene.add.text(
            this.x, this.y - 80,
            '🎉 NOUVELLE TOUR DÉBLOQUÉE ! 🎉',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        unlockText.setOrigin(0.5);
        unlockText.setDepth(2011);
        this.addElement(unlockText);
        
        // Nom de la tour
        const towerName = this.scene.add.text(
            this.x, this.y,
            config.name,
            {
                fontSize: '36px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        towerName.setOrigin(0.5);
        towerName.setDepth(2011);
        towerName.setScale(0);
        this.addElement(towerName);
        
        // Animation d'apparition
        this.scene.tweens.add({
            targets: towerName,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Description
        const desc = this.scene.add.text(
            this.x, this.y + 60,
            config.description,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#e0e0e0',
                align: 'center'
            }
        );
        desc.setOrigin(0.5);
        desc.setDepth(2011);
        this.addElement(desc);
        
        // Message d'équipement
        const equipMessage = this.scene.add.text(
            this.x, this.y + 100,
            isEquipped ? '✓ Ajouté à votre équipement !' : '⚠️ Équipement plein ! Allez dans le Pokédex pour l\'équiper',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: isEquipped ? '#51cf66' : '#ffa94d',
                align: 'center',
                wordWrap: { width: 400 }
            }
        );
        equipMessage.setOrigin(0.5);
        equipMessage.setDepth(2011);
        this.addElement(equipMessage);
        
        // Bouton OK
        setTimeout(() => {
            const okBtn = this.scene.add.rectangle(
                this.x, this.y + 130,
                150, 45,
                0x51cf66, 0.9
            );
            okBtn.setDepth(2011);
            okBtn.setStrokeStyle(2, 0xffffff, 0.8);
            okBtn.setInteractive({ useHandCursor: true });
            this.addElement(okBtn);
            
            const okText = this.scene.add.text(
                this.x, this.y + 130,
                'OK',
                {
                    fontSize: '20px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            );
            okText.setOrigin(0.5);
            okText.setDepth(2012);
            this.addElement(okText);
            
            okBtn.on('pointerover', () => okBtn.setFillStyle(0x69db7c, 0.9));
            okBtn.on('pointerout', () => okBtn.setFillStyle(0x51cf66, 0.9));
            okBtn.on('pointerdown', () => {
                // Rafraîchir le menu des tours
                if (this.scene.towerMenu) {
                    this.scene.towerMenu.refreshMenu();
                }
                this.topMenu.closeModal();
            });
        }, 500);
    }
}

