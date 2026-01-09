class ShopModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '🛒 BOUTIQUE - BERRY MYSTÈRE', 800, 500);
        this.player = player;
        this.purchaseCount = 0; // Nombre de berries achetés
        this.createContent();
    }

    // Calcul du prix selon la progression quadratique
    getBerryCost() {
        return Math.ceil(2 * this.purchaseCount * this.purchaseCount + 35 * this.purchaseCount + 10);
    }

    createContent() {
        const centerY = this.y;

        // Image du berry
        if (this.scene.textures.exists('berry')) {
            const berryImage = this.scene.add.image(this.x, centerY - 50, 'berry');
            berryImage.setDisplaySize(160, 120);
            berryImage.setDepth(2003);
            this.addElement(berryImage);
        } else {
            const berryCircle = this.scene.add.circle(this.x, centerY - 50, 60, 0xffd700, 1);
            berryCircle.setDepth(2002);
            berryCircle.setStrokeStyle(5, 0xffffff, 1);
            this.addElement(berryCircle);

            const berryIcon = this.scene.add.text(this.x, centerY - 50, '💰', { fontSize: '48px' });
            berryIcon.setOrigin(0.5);
            berryIcon.setDepth(2003);
            this.addElement(berryIcon);
        }

        // Description
        const desc = this.scene.add.text(
            this.x, centerY + 60,
            'Achetez un Berry Mystère pour débloquer\nune tour aléatoire que vous ne possédez pas encore !',
            { fontSize: '18px', fontFamily: 'Arial', color: '#e0e0e0', align: 'center' }
        );
        desc.setOrigin(0.5);
        desc.setDepth(2002);
        this.addElement(desc);

        // Texte du prix
        this.priceText = this.scene.add.text(
            this.x, centerY + 120,
            `Prix: ${this.getBerryCost()} 💰`,
            { fontSize: '24px', fontFamily: 'Arial', color: '#ffd700', fontStyle: 'bold' }
        );
        this.priceText.setOrigin(0.5);
        this.priceText.setDepth(2002);
        this.addElement(this.priceText);

        // Texte de l'or du joueur
        this.goldText = this.scene.add.text(
            this.x, centerY + 155,
            `Votre or: ${this.player.gold} 💰`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: this.player.gold >= this.getBerryCost() ? '#51cf66' : '#ff6b6b'
            }
        );
        this.goldText.setOrigin(0.5);
        this.goldText.setDepth(2002);
        this.addElement(this.goldText);

        // Bouton d'achat
        this.buyBtn = this.scene.add.rectangle(this.x, centerY + 200, 250, 50,
            this.player.gold >= this.getBerryCost() ? 0x51cf66 : 0x666666,
            0.9
        );
        this.buyBtn.setDepth(2002);
        this.buyBtn.setStrokeStyle(3, 0xffffff, 0.8);
        this.addElement(this.buyBtn);

        this.buyText = this.scene.add.text(
            this.x, centerY + 200,
            this.player.gold >= this.getBerryCost() ? '🛒 ACHETER UN BERRY' : '❌ PAS ASSEZ D\'OR',
            { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold' }
        );
        this.buyText.setOrigin(0.5);
        this.buyText.setDepth(2003);
        this.addElement(this.buyText);

        // Interaction
        this.buyBtn.setInteractive({ useHandCursor: true });
        this.buyBtn.on('pointerover', () => {
            if (this.player.gold >= this.getBerryCost()) this.buyBtn.setFillStyle(0x69db7c, 0.9);
        });
        this.buyBtn.on('pointerout', () => {
            if (this.player.gold >= this.getBerryCost()) this.buyBtn.setFillStyle(0x51cf66, 0.9);
        });
        this.buyBtn.on('pointerdown', () => this.buyBerry());
    }

    // Mise à jour du texte et du bouton
    updateUI() {
        const cost = this.getBerryCost();
        const canBuy = this.player.gold >= cost;

        this.priceText.setText(`Prix: ${cost} 💰`);
        this.goldText.setText(`Votre or: ${this.player.gold} 💰`);
        this.goldText.setColor(canBuy ? '#51cf66' : '#ff6b6b');

        this.buyBtn.setFillStyle(canBuy ? 0x51cf66 : 0x666666, 0.9);
        this.buyText.setText(canBuy ? '🛒 ACHETER UN BERRY' : '❌ PAS ASSEZ D\'OR');
    }

    buyBerry() {
        const cost = this.getBerryCost();
        if (this.player.gold < cost) return;

        // Déduire l'or
        this.player.gold -= cost;

        // Débloquer une tour aléatoire
        const allTowers = TOWER_ORDER;
        const unlockedTowers = this.player.collection.getUnlockedTowers();
        const lockedTowers = allTowers.filter(id => !unlockedTowers.includes(id));
        if (lockedTowers.length === 0) return;

        const randomTower = lockedTowers[Math.floor(Math.random() * lockedTowers.length)];
        this.player.collection.unlockTower(randomTower);

        // 🔥 Incrémenter le compteur avant de recalculer le prix
        this.purchaseCount++;

        // Mettre à jour le texte et le bouton
        this.updateUI();

        // Sauvegarde
        if (this.scene.saveManager) this.scene.saveManager.autoSave();

        // Animation
        this.showUnlockAnimation(randomTower, this.player.collection.hasEquipmentSpace());
    }

    showUnlockAnimation(towerId, isEquipped) {
        const config = TOWER_CONFIG[towerId];
        // ... reste identique à ton code
    }
}
