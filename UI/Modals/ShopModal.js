/**
 * Modal de la boutique - Style moderne One Piece
 */
class ShopModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '🏴‍☠️ BOUTIQUE', 700, 550);
        this.player = player;
        this.maxPrice = 50000;
        this.basePrice = 10;
        this.exponentFactor = 2.0;
        this.purchaseCount = this.player.collection.berryPurchaseCount || 0;
        this.createContent();
    }

    getBerryCost() {
        const calculatedPrice = Math.ceil(this.basePrice * Math.pow(this.exponentFactor, this.purchaseCount));
        return Math.min(calculatedPrice, this.maxPrice);
    }

    createContent() {
        const centerY = this.y;
        const cost = this.getBerryCost();
        const canBuy = this.player.gold >= cost;
        
        // Panneau central pour le Berry
        const berryCard = this.createCard(this.x, centerY - 30, 350, 200, true);
        
        // Effet de lueur derrière le berry
        const glow = this.scene.add.circle(this.x, centerY - 50, 70, 0xffd700, 0.15);
        glow.setDepth(2002);
        this.addElement(glow);

        // Image du berry ou fallback
        if (this.scene.textures.exists('berry')) {
            const berryImage = this.scene.add.image(this.x, centerY - 50, 'berry');
            berryImage.setDisplaySize(140, 105);
            berryImage.setDepth(2003);
            this.addElement(berryImage);
        } else {
            const berryIcon = this.scene.add.text(this.x, centerY - 50, '🍇', { fontSize: '64px' });
            berryIcon.setOrigin(0.5);
            berryIcon.setDepth(2003);
            this.addElement(berryIcon);
        }
        
        // Label "Berry Mystère"
        const berryLabel = this.scene.add.text(
            this.x, centerY + 30,
            'BERRY MYSTÈRE',
            {
                fontSize: '22px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#d4af37',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 1
            }
        );
        berryLabel.setOrigin(0.5);
        berryLabel.setDepth(2003);
        this.addElement(berryLabel);

        // Description
        const desc = this.scene.add.text(
            this.x, centerY + 65,
            'Débloquez un personnage aléatoire !',
            {
                fontSize: '15px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#b0b0b0',
                align: 'center'
            }
        );
        desc.setOrigin(0.5);
        desc.setDepth(2002);
        this.addElement(desc);

        // Section Prix
        const priceSection = this.scene.add.rectangle(
            this.x, centerY + 115,
            300, 50,
            this.colors.secondary,
            0.9
        );
        priceSection.setDepth(2002);
        priceSection.setStrokeStyle(2, canBuy ? this.colors.success : this.colors.danger, 0.6);
        this.addElement(priceSection);
        
        // Prix
        this.priceText = this.scene.add.text(
            this.x - 60, centerY + 115,
            `💰 ${cost}`,
            {
                fontSize: '24px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        this.priceText.setOrigin(0.5);
        this.priceText.setDepth(2003);
        this.addElement(this.priceText);

        // Séparateur
        const sep = this.scene.add.rectangle(this.x, centerY + 115, 2, 30, 0x4a6fa5, 0.5);
        sep.setDepth(2003);
        this.addElement(sep);
        
        // Or du joueur
        this.goldText = this.scene.add.text(
            this.x + 60, centerY + 115,
            `Vous: ${this.player.gold}`,
            {
                fontSize: '18px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: canBuy ? '#2ecc71' : '#e74c3c'
            }
        );
        this.goldText.setOrigin(0.5);
        this.goldText.setDepth(2003);
        this.addElement(this.goldText);

        // Bouton d'achat stylisé
        this.buyBtn = this.scene.add.rectangle(
            this.x, centerY + 180,
            280, 55,
            canBuy ? this.colors.success : 0x555555,
            0.95
        );
        this.buyBtn.setDepth(2002);
        this.buyBtn.setStrokeStyle(3, canBuy ? 0x27ae60 : 0x444444, 0.8);
        this.addElement(this.buyBtn);

        this.buyText = this.scene.add.text(
            this.x, centerY + 180,
            canBuy ? '🛒 ACHETER' : '❌ OR INSUFFISANT',
            {
                fontSize: '20px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.buyText.setOrigin(0.5);
        this.buyText.setDepth(2003);
        this.addElement(this.buyText);

        // Interactions
        this.buyBtn.setInteractive({ useHandCursor: true });
        this.buyBtn.on('pointerover', () => {
            if (this.player.gold >= this.getBerryCost()) {
                this.buyBtn.setFillStyle(0x27ae60, 1);
                this.buyBtn.setScale(1.03);
            }
        });
        this.buyBtn.on('pointerout', () => {
            if (this.player.gold >= this.getBerryCost()) {
                this.buyBtn.setFillStyle(this.colors.success, 0.95);
                this.buyBtn.setScale(1);
            }
        });
        this.buyBtn.on('pointerdown', () => this.buyBerry());

        // Info sur le nombre de tours restantes
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const remainingTowers = TOWER_ORDER.length - unlockedTowers.length;
        
        const remainingText = this.scene.add.text(
            this.x, this.y + this.height / 2 - 40,
            remainingTowers > 0 
                ? `📦 ${remainingTowers} personnage${remainingTowers > 1 ? 's' : ''} restant${remainingTowers > 1 ? 's' : ''} à débloquer`
                : '✨ Collection complète !',
            {
                fontSize: '14px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: remainingTowers > 0 ? '#8892a0' : '#2ecc71',
                fontStyle: 'italic'
            }
        );
        remainingText.setOrigin(0.5);
        remainingText.setDepth(2002);
        this.addElement(remainingText);
    }

    updateUI() {
        const cost = this.getBerryCost();
        const canBuy = this.player.gold >= cost;

        this.priceText.setText(`💰 ${cost}`);
        this.goldText.setText(`Vous: ${this.player.gold}`);
        this.goldText.setColor(canBuy ? '#2ecc71' : '#e74c3c');

        this.buyBtn.setFillStyle(canBuy ? this.colors.success : 0x555555, 0.95);
        this.buyBtn.setStrokeStyle(3, canBuy ? 0x27ae60 : 0x444444, 0.8);
        this.buyText.setText(canBuy ? '🛒 ACHETER' : '❌ OR INSUFFISANT');
    }

    buyBerry() {
        const cost = this.getBerryCost();
        if (this.player.gold < cost) return;

        this.player.gold -= cost;

        const allTowers = TOWER_ORDER;
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const lockedTowers = allTowers.filter(id => !unlockedTowers.includes(id));
        if (lockedTowers.length === 0) return;

        const randomTower = lockedTowers[Math.floor(Math.random() * lockedTowers.length)];
        
        // Vérifier si un slot est disponible AVANT le déblocage
        const hadSpace = this.player.collection.hasEquipmentSpace();
        
        // Débloquer la tour (l'équipe automatiquement si un slot est dispo)
        this.player.collection.unlockTower(randomTower);

        this.purchaseCount++;
        this.player.collection.berryPurchaseCount = this.purchaseCount;
        this.player.collection.save();

        this.updateUI();

        if (this.scene.saveManager) this.scene.saveManager.autoSave();

        // Rafraîchir le menu des tours si la tour a été équipée
        if (hadSpace && this.scene.towerMenu) {
            this.scene.towerMenu.refreshMenu();
        }

        this.showUnlockAnimation(randomTower, hadSpace);
    }

    showUnlockAnimation(towerId, wasEquipped) {
        const config = TOWER_CONFIG[towerId];
        
        // Overlay pour l'animation
        const animOverlay = this.scene.add.rectangle(this.x, this.y, this.width, this.height, 0x000000, 0.9);
        animOverlay.setDepth(2010);
        this.addElement(animOverlay);
        
        // Texte "NOUVEAU !"
        const newText = this.scene.add.text(this.x, this.y - 80, '✨ NOUVEAU ! ✨', {
            fontSize: '28px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#ffd700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        newText.setOrigin(0.5);
        newText.setDepth(2011);
        newText.setAlpha(0);
        this.addElement(newText);
        
        // Nom du personnage
        const nameText = this.scene.add.text(this.x, this.y + 60, config.name.toUpperCase(), {
            fontSize: '32px',
            fontFamily: "'Segoe UI', Arial, sans-serif",
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#d4af37',
            strokeThickness: 2
        });
        nameText.setOrigin(0.5);
        nameText.setDepth(2011);
        nameText.setAlpha(0);
        this.addElement(nameText);
        
        // Texte d'équipement
        const equipText = this.scene.add.text(
            this.x, 
            this.y + 100, 
            wasEquipped ? '✅ Équipé automatiquement !' : '⚠️ Équipement plein - Allez dans le Pokédex',
            {
                fontSize: '16px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: wasEquipped ? '#2ecc71' : '#f39c12',
                fontStyle: 'bold'
            }
        );
        equipText.setOrigin(0.5);
        equipText.setDepth(2011);
        equipText.setAlpha(0);
        this.addElement(equipText);
        
        // Animation
        this.scene.tweens.add({
            targets: [newText, nameText, equipText],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        
        // Fermer après 2.5 secondes
        this.scene.time.delayedCall(2500, () => {
            animOverlay.destroy();
            newText.destroy();
            nameText.destroy();
            equipText.destroy();
        });
    }
}
