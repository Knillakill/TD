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
        
        // Couleurs de rareté (plus douces et élégantes)
        this.rarityColors = {
            common: { bg: 0x1e293b, border: 0x475569, text: '#94a3b8' },    // Gris-bleu sombre
            rare: { bg: 0x164e63, border: 0x0891b2, text: '#06b6d4' },      // Cyan profond
            epic: { bg: 0x581c87, border: 0x7e22ce, text: '#a855f7' }       // Violet royal
        };
        
        // Initialiser les tours équipées comme disponibles
        const equippedTowers = this.scene.player.collection.getEquippedTowers();
        equippedTowers.forEach(towerId => {
            this.availableTowers[towerId] = true;
        });
        
        this.createMenu();
    }
    
    createMenu() {
        // Fond du menu (à droite de la map) - style moderne
        this.background = this.scene.add.rectangle(
            this.menuX + this.menuWidth / 2,
            this.menuHeight / 2,
            this.menuWidth,
            this.menuHeight,
            0x0f172a,
            0.98
        );
        this.background.setDepth(100);
        this.background.setScrollFactor(0);
        
        // Bordure gauche décorative
        const leftBorder = this.scene.add.rectangle(
            this.menuX + 2,
            this.menuHeight / 2,
            3,
            this.menuHeight,
            0x0891b2,
            0.6
        );
        leftBorder.setDepth(100);
        leftBorder.setScrollFactor(0);
        
        // === PANNEAU STATS JOUEUR (en haut) ===
        this.createPlayerPanel();
        
        // Titre du menu "ÉQUIPAGE"
        this.title = this.scene.add.text(
            this.menuX + this.menuWidth / 2,
            190,
            'ÉQUIPAGE',
            {
                fontSize: '12px',
                fill: '#64748b',
                fontStyle: 'bold',
                fontFamily: 'Arial',
                letterSpacing: 2
            }
        );
        this.title.setOrigin(0.5);
        this.title.setDepth(101);
        this.title.setScrollFactor(0);
        
        // Ligne décorative sous le titre
        const titleLine = this.scene.add.rectangle(
            this.menuX + this.menuWidth / 2,
            200,
            80,
            1,
            0x475569,
            0.5
        );
        titleLine.setDepth(101);
        titleLine.setScrollFactor(0);
        
        // Créer les cartes pour chaque personnage (2 colonnes, 10 emplacements)
        this.buttons = {};
        this.lockedSlots = {}; // Emplacements verrouillés
        const cardWidth = 135;
        const cardHeight = 108;  // Réduit pour afficher 10 slots (5 lignes)
        const startX = this.menuX + 10;
        const startY = 210;  // Décalé pour laisser place au panneau joueur + titre
        const gapX = 5;
        const gapY = 4;
        
        // Coût en étoiles pour débloquer les slots 7-10
        this.slotUnlockCosts = {
            6: 10,   // Slot 7 (index 6) : 10 étoiles
            7: 25,   // Slot 8 (index 7) : 25 étoiles
            8: 50,   // Slot 9 (index 8) : 50 étoiles
            9: 100   // Slot 10 (index 9) : 100 étoiles
        };
        
        // Récupérer les tours équipées
        const equippedTowers = this.scene.player.collection.getEquippedTowers();
        
        // Créer 10 emplacements
        for (let index = 0; index < 10; index++) {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = startX + col * (cardWidth + gapX);
            const y = startY + row * (cardHeight + gapY);
            
            // Vérifier si cet emplacement est débloqué
            const isLocked = index >= 6 && !this.isSlotUnlocked(index);
            
            if (isLocked) {
                // Créer un emplacement verrouillé
                this.createLockedSlot(index, x, y, cardWidth, cardHeight);
            } else if (index < equippedTowers.length) {
                // Créer une carte de tour
                const towerId = equippedTowers[index];
                console.log(towerId)
                this.createTowerCard(towerId, x, y, cardWidth, cardHeight);
            } else {
                // Créer un emplacement vide (débloqué mais pas de tour équipée)
                this.createEmptySlot(index, x, y, cardWidth, cardHeight);
            }
        }
        
        // Calculer le scroll max (5 lignes pour 10 emplacements)
        const totalRows = 5;
        this.maxScroll = Math.max(0, (totalRows * (cardHeight + gapY)) - (this.menuHeight - 170));
    }
    
    isSlotUnlocked(slotIndex) {
        // Les 6 premiers slots sont toujours débloqués
        if (slotIndex < 6) return true;
        
        // Vérifier si le slot a été débloqué (stocké dans la collection du joueur)
        return this.scene.player.collection.unlockedSlots > slotIndex;
    }
    
    createLockedSlot(slotIndex, x, y, width, height) {
        const cost = this.slotUnlockCosts[slotIndex];
        const playerStars = this.scene.player.collection.getStars();
        const canUnlock = playerStars >= cost;
        
        // Fond grisé
        const cardBg = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x1a1a2e,
            1
        );
        cardBg.setDepth(100);
        cardBg.setScrollFactor(0);
        
        // Bordure
        const cardBorder = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x000000,
            0
        );
        cardBorder.setStrokeStyle(2, 0x333344, 0.8);
        cardBorder.setDepth(100);
        cardBorder.setScrollFactor(0);
        
        // Icône de cadenas
        const lockIcon = this.scene.add.text(
            x + width / 2,
            y + 35,
            '🔒',
            {
                fontSize: '24px'
            }
        );
        lockIcon.setOrigin(0.5);
        lockIcon.setDepth(101);
        lockIcon.setScrollFactor(0);
        
        // Texte "SLOT X"
        const slotText = this.scene.add.text(
            x + width / 2,
            y + 58,
            `SLOT ${slotIndex + 1}`,
            {
                fontSize: '10px',
                fill: '#666688',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        slotText.setOrigin(0.5);
        slotText.setDepth(101);
        slotText.setScrollFactor(0);
        
        // Coût en étoiles
        const costText = this.scene.add.text(
            x + width / 2,
            y + 75,
            `⭐ ${cost}`,
            {
                fontSize: '12px',
                fill: canUnlock ? '#fbbf24' : '#666666',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        costText.setOrigin(0.5);
        costText.setDepth(101);
        costText.setScrollFactor(0);
        
        // Bouton débloquer
        const unlockBtn = this.scene.add.rectangle(
            x + width / 2,
            y + 95,
            width - 12,
            16,
            canUnlock ? 0xfbbf24 : 0x444444,
            1
        );
        unlockBtn.setDepth(101);
        unlockBtn.setScrollFactor(0);
        unlockBtn.setStrokeStyle(1, canUnlock ? 0xfcd34d : 0x555555, 0.7);
        
        const unlockText = this.scene.add.text(
            x + width / 2,
            y + 95,
            canUnlock ? '🔓 DÉBLOQUER' : '🔒 VERROUILLÉ',
            {
                fontSize: '8px',
                fill: canUnlock ? '#1a1a2e' : '#888888',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        unlockText.setOrigin(0.5);
        unlockText.setDepth(102);
        unlockText.setScrollFactor(0);
        
        if (canUnlock) {
            unlockBtn.setInteractive({ useHandCursor: true });
            unlockBtn.on('pointerdown', () => {
                this.unlockSlot(slotIndex);
            });
            unlockBtn.on('pointerover', () => {
                unlockBtn.setFillStyle(0xfcd34d);
            });
            unlockBtn.on('pointerout', () => {
                unlockBtn.setFillStyle(0xfbbf24);
            });
        }
        
        // Stocker les références
        this.lockedSlots[slotIndex] = {
            cardBg,
            cardBorder,
            lockIcon,
            slotText,
            costText,
            unlockBtn,
            unlockText
        };
    }
    
    createEmptySlot(slotIndex, x, y, width, height) {
        // Fond semi-transparent
        const cardBg = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x1e293b,
            0.5
        );
        cardBg.setDepth(100);
        cardBg.setScrollFactor(0);
        
        // Bordure pointillée (simulée)
        const cardBorder = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x000000,
            0
        );
        cardBorder.setStrokeStyle(2, 0x475569, 0.5);
        cardBorder.setDepth(100);
        cardBorder.setScrollFactor(0);
        
        // Icône "+"
        const plusIcon = this.scene.add.text(
            x + width / 2,
            y + 45,
            '+',
            {
                fontSize: '30px',
                fill: '#475569',
                fontStyle: 'bold'
            }
        );
        plusIcon.setOrigin(0.5);
        plusIcon.setDepth(101);
        plusIcon.setScrollFactor(0);
        
        // Texte
        const emptyText = this.scene.add.text(
            x + width / 2,
            y + 75,
            'VIDE',
            {
                fontSize: '10px',
                fill: '#64748b',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        emptyText.setOrigin(0.5);
        emptyText.setDepth(101);
        emptyText.setScrollFactor(0);
        
        // Stocker les références
        this.lockedSlots[`empty_${slotIndex}`] = {
            cardBg,
            cardBorder,
            plusIcon,
            emptyText
        };
    }
    
    unlockSlot(slotIndex) {
        const cost = this.slotUnlockCosts[slotIndex];
        const collection = this.scene.player.collection;
        
        // Vérifier si le joueur a assez d'étoiles
        if (collection.getStars() < cost) {
            this.scene.ui.showMessage('Pas assez d\'étoiles!', 1500);
            return;
        }
        
        // Dépenser les étoiles
        collection.spendStars(cost);
        
        // Débloquer le slot
        collection.unlockedSlots = Math.max(collection.unlockedSlots, slotIndex + 1);
        collection.save();
        
        // Message de confirmation
        this.scene.ui.showMessage(`Slot ${slotIndex + 1} débloqué!`, 1500);
        
        // Rafraîchir le menu
        this.refreshMenu();
    }
    
    createPlayerPanel() {
        const panelX = this.menuX;
        const panelY = 8;
        const panelWidth = this.menuWidth;
        const panelHeight = 160;
        
        // Fond principal avec effet de profondeur
        const mainBg = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + panelHeight / 2,
            panelWidth - 16,
            panelHeight,
            0x1e293b,
            1
        );
        mainBg.setDepth(100);
        mainBg.setScrollFactor(0);
        
        // Bordure lumineuse dégradée
        const borderGlow = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + panelHeight / 2,
            panelWidth - 16,
            panelHeight,
            0x000000,
            0
        );
        borderGlow.setDepth(101);
        borderGlow.setScrollFactor(0);
        borderGlow.setStrokeStyle(3, 0x0891b2, 0.8);
        
        // Barre supérieure brillante
        const topAccent = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + 3,
            panelWidth - 22,
            4,
            0x06b6d4,
            1
        );
        topAccent.setDepth(102);
        topAccent.setScrollFactor(0);
        
        // Effet de dégradé sur le fond (simulation)
        const gradientOverlay = this.scene.add.rectangle(
            panelX + panelWidth / 2,
            panelY + 15,
            panelWidth - 20,
            30,
            0x0f172a,
            0.5
        );
        gradientOverlay.setDepth(101);
        gradientOverlay.setScrollFactor(0);
        
        // Section Avatar (gauche)
        const avatarX = panelX + 50;
        const avatarY = panelY + panelHeight / 2 + 8;
        
        // Hexagone décoratif derrière l'avatar (simulation avec cercle)
        const hexaBg = this.scene.add.circle(avatarX, avatarY, 40, 0x0f172a, 0.8);
        hexaBg.setDepth(102);
        hexaBg.setScrollFactor(0);
        
        // Double bordure pour l'avatar
        const outerRing = this.scene.add.circle(avatarX, avatarY, 38, 0x000000, 0);
        outerRing.setDepth(103);
        outerRing.setScrollFactor(0);
        outerRing.setStrokeStyle(3, 0xfbbf24, 0.9);
        
        const innerRing = this.scene.add.circle(avatarX, avatarY, 35, 0x000000, 0);
        innerRing.setDepth(103);
        innerRing.setScrollFactor(0);
        innerRing.setStrokeStyle(2, 0x0891b2, 0.6);
        
        // Fond de l'avatar
        const avatarBg = this.scene.add.circle(avatarX, avatarY, 33, 0x0f172a);
        avatarBg.setDepth(103);
        avatarBg.setScrollFactor(0);
        
        // Avatar Luffy
        if (this.scene.textures.exists('luffy')) {
            this.playerAvatar = this.scene.add.image(avatarX, avatarY, 'luffy');
            this.playerAvatar.setDisplaySize(64, 64);
            this.playerAvatar.setDepth(104);
            this.playerAvatar.setScrollFactor(0);
            
            const mask = this.scene.make.graphics();
            mask.fillStyle(0xffffff);
            mask.fillCircle(avatarX, avatarY, 32);
            this.playerAvatar.setMask(mask.createGeometryMask());
        }
        
        // Badge de niveau sur l'avatar
        const levelBadge = this.scene.add.circle(avatarX + 28, avatarY - 25, 12, 0xef4444, 1);
        levelBadge.setDepth(105);
        levelBadge.setScrollFactor(0);
        levelBadge.setStrokeStyle(2, 0x1e293b);
        
        const levelText = this.scene.add.text(
            avatarX + 28,
            avatarY - 25,
            '1',
            {
                fontSize: '12px',
                fill: '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        levelText.setOrigin(0.5);
        levelText.setDepth(106);
        levelText.setScrollFactor(0);
        
        // Bouton pour uploader une image de profil
        const uploadBtn = this.scene.add.circle(avatarX + 28, avatarY + 25, 14, 0x0891b2, 1);
        uploadBtn.setDepth(105);
        uploadBtn.setScrollFactor(0);
        uploadBtn.setStrokeStyle(2, 0x06b6d4);
        uploadBtn.setInteractive({ useHandCursor: true });
        
        const uploadIcon = this.scene.add.text(
            avatarX + 28,
            avatarY + 25,
            '📷',
            {
                fontSize: '16px'
            }
        );
        uploadIcon.setOrigin(0.5);
        uploadIcon.setDepth(106);
        uploadIcon.setScrollFactor(0);
        
        // Créer un input file invisible
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Effet hover sur le bouton
        uploadBtn.on('pointerover', () => {
            uploadBtn.setFillStyle(0x06b6d4);
            uploadBtn.setScale(1.1);
        });
        
        uploadBtn.on('pointerout', () => {
            uploadBtn.setFillStyle(0x0891b2);
            uploadBtn.setScale(1);
        });
        
        // Clic pour ouvrir le sélecteur de fichier
        uploadBtn.on('pointerdown', () => {
            fileInput.click();
        });
        
        // Quand un fichier est sélectionné
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Créer une nouvelle texture avec l'image uploadée
                    const img = new Image();
                    img.onload = () => {
                        // Ajouter la texture à Phaser
                        if (this.scene.textures.exists('custom_profile')) {
                            this.scene.textures.remove('custom_profile');
                        }
                        this.scene.textures.addImage('custom_profile', img);
                        
                        // Remplacer l'avatar
                        if (this.playerAvatar) {
                            this.playerAvatar.destroy();
                        }
                        
                        this.playerAvatar = this.scene.add.image(avatarX, avatarY, 'custom_profile');
                        this.playerAvatar.setDisplaySize(64, 64);
                        this.playerAvatar.setDepth(104);
                        this.playerAvatar.setScrollFactor(0);
                        
                        // Recréer le masque circulaire
                        const mask = this.scene.make.graphics();
                        mask.fillStyle(0xffffff);
                        mask.fillCircle(avatarX, avatarY, 32);
                        this.playerAvatar.setMask(mask.createGeometryMask());
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Section Info (droite)
        const infoX = panelX + 105;
        const infoY = panelY + 20;
        
        // Titre "CAPITAINE"
        this.playerLabel = this.scene.add.text(
            infoX,
            infoY,
            'CAPITAINE',
            {
                fontSize: '11px',
                fill: '#64748b',
                fontStyle: 'normal',
                fontFamily: 'Arial',
                letterSpacing: 2
            }
        );
        this.playerLabel.setOrigin(0, 0);
        this.playerLabel.setDepth(103);
        this.playerLabel.setScrollFactor(0);
        
        // Nom du joueur
        const playerName = this.scene.add.text(
            infoX,
            infoY + 16,
            'MONKEY D. LUFFY',
            {
                fontSize: '14px',
                fill: '#f1f5f9',
                fontStyle: 'bold',
                fontFamily: 'Arial',
                letterSpacing: 0.5
            }
        );
        playerName.setOrigin(0, 0);
        playerName.setDepth(103);
        playerName.setScrollFactor(0);
        
        // Container de stats moderne
        const statsY = infoY + 42;
        
        // Vie (avec barre de progression)
        const hpBarBg = this.scene.add.rectangle(
            infoX,
            statsY,
            185,
            26,
            0x0f172a,
            0.7
        );
        hpBarBg.setOrigin(0, 0);
        hpBarBg.setDepth(102);
        hpBarBg.setScrollFactor(0);
        hpBarBg.setStrokeStyle(1, 0x334155, 0.5);
        
        // Icône coeur
        const hpIcon = this.scene.add.text(
            infoX + 8,
            statsY + 13,
            '❤️',
            {
                fontSize: '14px'
            }
        );
        hpIcon.setOrigin(0, 0.5);
        hpIcon.setDepth(103);
        hpIcon.setScrollFactor(0);
        
        const hpLabel = this.scene.add.text(
            infoX + 30,
            statsY + 13,
            'VIE',
            {
                fontSize: '10px',
                fill: '#94a3b8',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        hpLabel.setOrigin(0, 0.5);
        hpLabel.setDepth(103);
        hpLabel.setScrollFactor(0);
        
        this.playerHpText = this.scene.add.text(
            infoX + 177,
            statsY + 13,
            '14',
            {
                fontSize: '16px',
                fill: '#22c55e',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.playerHpText.setOrigin(1, 0.5);
        this.playerHpText.setDepth(103);
        this.playerHpText.setScrollFactor(0);
        
        // Barre de progression HP (visuelle)
        this.hpBarFill = this.scene.add.rectangle(
            infoX + 2,
            statsY + 23,
            181,
            2,
            0x22c55e,
            0.8
        );
        this.hpBarFill.setOrigin(0, 0);
        this.hpBarFill.setDepth(103);
        this.hpBarFill.setScrollFactor(0);
        
        // Or (avec icône)
        const goldY = statsY + 32;
        
        const goldBarBg = this.scene.add.rectangle(
            infoX,
            goldY,
            185,
            20,
            0x0f172a,
            0.7
        );
        goldBarBg.setOrigin(0, 0);
        goldBarBg.setDepth(102);
        goldBarBg.setScrollFactor(0);
        goldBarBg.setStrokeStyle(1, 0x334155, 0.5);
        
        // Icône pièce
        const goldIcon = this.scene.add.text(
            infoX + 8,
            goldY + 10,
            '💰',
            {
                fontSize: '12px'
            }
        );
        goldIcon.setOrigin(0, 0.5);
        goldIcon.setDepth(103);
        goldIcon.setScrollFactor(0);
        
        const goldLabel = this.scene.add.text(
            infoX + 30,
            goldY + 10,
            'OR',
            {
                fontSize: '10px',
                fill: '#94a3b8',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        goldLabel.setOrigin(0, 0.5);
        goldLabel.setDepth(103);
        goldLabel.setScrollFactor(0);
        
        this.playerGoldText = this.scene.add.text(
            infoX + 177,
            goldY + 10,
            '10',
            {
                fontSize: '16px',
                fill: '#fbbf24',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.playerGoldText.setOrigin(1, 0.5);
        this.playerGoldText.setDepth(103);
        this.playerGoldText.setScrollFactor(0);
        
        // Étoiles (avec icône)
        const starsY = goldY + 25;
        
        const starsBarBg = this.scene.add.rectangle(
            infoX,
            starsY,
            185,
            20,
            0x0f172a,
            0.7
        );
        starsBarBg.setOrigin(0, 0);
        starsBarBg.setDepth(102);
        starsBarBg.setScrollFactor(0);
        starsBarBg.setStrokeStyle(1, 0x334155, 0.5);
        
        // Icône étoile
        const starIcon = this.scene.add.text(
            infoX + 8,
            starsY + 10,
            '⭐',
            {
                fontSize: '12px'
            }
        );
        starIcon.setOrigin(0, 0.5);
        starIcon.setDepth(103);
        starIcon.setScrollFactor(0);
        
        const starsLabel = this.scene.add.text(
            infoX + 30,
            starsY + 10,
            'ÉTOILES',
            {
                fontSize: '10px',
                fill: '#94a3b8',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        starsLabel.setOrigin(0, 0.5);
        starsLabel.setDepth(103);
        starsLabel.setScrollFactor(0);
        
        this.playerStarsText = this.scene.add.text(
            infoX + 177,
            starsY + 10,
            '0',
            {
                fontSize: '16px',
                fill: '#fbbf24',
                fontStyle: 'bold',
                fontFamily: 'monospace'
            }
        );
        this.playerStarsText.setOrigin(1, 0.5);
        this.playerStarsText.setDepth(103);
        this.playerStarsText.setScrollFactor(0);
    }
    
    createTowerCard(towerId, x, y, width, height) {
        const towerData = TOWER_CONFIG[towerId];
        console.log(towerData)
        const rarity = this.rarityColors[towerData.rarity] || this.rarityColors.common;
        
        // Fond de la carte avec couleur de rareté (plus sombre)
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
        
        // Image de fond personnalisée pour certaines tours (mug)
        let cardMug = null;
        if (towerId === 'luffy' && this.scene.textures.exists('luffymug')) {
            cardMug = this.scene.add.image(x + width / 2, y + height / 2, 'luffymug');
            cardMug.setDisplaySize(width - 4, height - 4);
            cardMug.setAlpha(0.3); // Semi-transparent pour ne pas cacher le sprite
            cardMug.setDepth(100);
            cardMug.setScrollFactor(0);
        }
        
        // Bordure subtile
        const cardBorder = this.scene.add.rectangle(
            x + width / 2,
            y + height / 2,
            width,
            height,
            0x000000,
            0
        );
        cardBorder.setStrokeStyle(2, rarity.border, 0.8);
        cardBorder.setDepth(100);
        cardBorder.setScrollFactor(0);
        
        // Barre de rareté en haut
        const rarityBar = this.scene.add.rectangle(
            x + width / 2,
            y + 2,
            width - 4,
            2,
            rarity.border,
            0.9
        );
        rarityBar.setDepth(101);
        rarityBar.setScrollFactor(0);
        
        // Nom du personnage (compact)
        const name = this.scene.add.text(
            x + width / 2,
            y + 10,
            towerData.name.toUpperCase(),
            {
                fontSize: '10px',
                fill: '#f1f5f9',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        name.setOrigin(0.5);
        name.setDepth(102);
        name.setScrollFactor(0);
        
        // Niveau avec badge
        const levelBadge = this.scene.add.rectangle(
            x + width / 2,
            y + 23,
            30,
            12,
            rarity.border,
            0.3
        );
        levelBadge.setDepth(101);
        levelBadge.setScrollFactor(0);
        
        const level = this.scene.add.text(
            x + width / 2,
            y + 23,
            `Nv.${towerData.level || 1}`,
            {
                fontSize: '8px',
                fill: rarity.text,
                fontFamily: 'monospace'
            }
        );
        level.setOrigin(0.5);
        level.setDepth(102);
        level.setScrollFactor(0);
        
        // Zone icône (sprite animé pour Luffy/Zoro, image pour les autres, sinon carré coloré)
        let icon;
        const iconY = y + 52; // Position de l'icône ajustée
        if (towerId === 'luffy' && this.scene.textures.exists('luffy')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'luffy');
            icon.setDisplaySize(22, 34); // Réduit pour correspondre à Zoro
            icon.setFlipX(true);
            icon.play('luffy_idle');
        } else if (towerId === 'zoro' && this.scene.textures.exists('zoro')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'zoro');
            icon.setDisplaySize(22, 48); // Réduit
            icon.play('zoro_idle');
        } else if (towerId === 'ussop' && this.scene.textures.exists('ussop')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'ussop');
            icon.setDisplaySize(22, 45); // Taille réduite pour la carte
            icon.setOrigin(0.5, 0.5);
            icon.play('ussop_idle');
        } else if (towerId === 'chopper' && this.scene.textures.exists('chopper')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'chopper');
            icon.setDisplaySize(22, 30);
            icon.setOrigin(0.5, 0.5);
            icon.play('chopper_idle');
        } else if (towerId === 'franky' && this.scene.textures.exists('franky')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'franky');
            icon.setDisplaySize(32, 40);
            icon.setOrigin(0.5, 0.5);
            icon.play('franky_idle');
        } else if (towerId === 'sanji' && this.scene.textures.exists('sanji')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'sanji');
            icon.setDisplaySize(18, 45); // Réduit pour la carte
            icon.setOrigin(0.5, 0.5);
            icon.play('sanji_idle');
        } else if (towerId === 'nami' && this.scene.textures.exists('nami')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'nami');
            icon.setDisplaySize(24, 52);
            icon.setOrigin(0.5, 0.5);
            icon.play('nami_idle');
        } else if (this.scene.textures.exists(towerId)) {
            icon = this.scene.add.image(x + width / 2, iconY, towerId);
            icon.setDisplaySize(35, 35);
        } else {
            icon = this.scene.add.rectangle(x + width / 2, iconY, 30, 30, towerData.color);
        }
        icon.setDepth(102);
        icon.setScrollFactor(0);
        icon.setInteractive({ draggable: true, useHandCursor: true });
        
        // Drag and drop sur le sprite de la tour
        icon.on('dragstart', (pointer) => {
            if (this.availableTowers[towerId]) {
                this.startDrag(towerId, pointer, icon);
            }
        });
        
        // Bouton INFOS (style moderne) - position ajustée
        const infosBtn = this.scene.add.rectangle(
            x + width / 2,
            y + 78,
            width - 12,
            16,
            0x334155,
            1
        );
        infosBtn.setDepth(101);
        infosBtn.setScrollFactor(0);
        infosBtn.setInteractive({ useHandCursor: true });
        infosBtn.setStrokeStyle(1, 0x475569, 0.5);
        
        const infosText = this.scene.add.text(
            x + width / 2,
            y + 78,
            'ⓘ INFOS',
            {
                fontSize: '8px',
                fill: '#cbd5e1',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        infosText.setOrigin(0.5);
        infosText.setDepth(102);
        infosText.setScrollFactor(0);
        
        // Bouton DÉPLOYER (style moderne) - position ajustée
        const deployBtn = this.scene.add.rectangle(
            x + width / 2,
            y + 96,
            width - 12,
            16,
            0x0891b2,
            1
        );
        deployBtn.setDepth(101);
        deployBtn.setScrollFactor(0);
        deployBtn.setInteractive({ useHandCursor: true });
        deployBtn.setStrokeStyle(1, 0x06b6d4, 0.7);
        
        const deployText = this.scene.add.text(
            x + width / 2,
            y + 96,
            '⚓ DÉPLOYER',
            {
                fontSize: '8px',
                fill: '#f0f9ff',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        deployText.setOrigin(0.5);
        deployText.setDepth(102);
        deployText.setScrollFactor(0);
                
        // Événements
        infosBtn.on('pointerdown', () => {
            this.showTowerInfo(towerId);
        });
        
        infosBtn.on('pointerover', () => {
            infosBtn.setFillStyle(0x475569);
            infosBtn.setStrokeStyle(1, 0x64748b, 0.8);
        });
        
        infosBtn.on('pointerout', () => {
            infosBtn.setFillStyle(0x334155);
            infosBtn.setStrokeStyle(1, 0x475569, 0.5);
        });
        
        deployBtn.on('pointerdown', (pointer) => {
            if (this.availableTowers[towerId]) {
                // Mode clic : activer la sélection pour placement au clic
                this.selectTowerForPlacement(towerId);
            }
        });
        
        deployBtn.on('pointerover', () => {
            if (this.availableTowers[towerId]) {
                deployBtn.setFillStyle(0x06b6d4);
                deployBtn.setStrokeStyle(1, 0x22d3ee, 0.9);
            }
        });
        
        deployBtn.on('pointerout', () => {
            deployBtn.setFillStyle(0x0891b2);
            deployBtn.setStrokeStyle(1, 0x06b6d4, 0.7);
        });
        
        // Stocker les références
        this.buttons[towerId] = {
            cardBg: cardBg,
            cardBorder: cardBorder,
            cardMug: cardMug,
            icon: icon,
            name: name,
            level: level,
            levelBadge: levelBadge,
            infosBtn: infosBtn,
            infosText: infosText,
            deployBtn: deployBtn,
            deployText: deployText
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
    
    selectTowerForPlacement(towerId) {
        // Mode clic : sélectionner une tour pour placement au clic
        if (!this.availableTowers[towerId]) {
            this.scene.ui.showMessage('Déjà placé!', 1000);
            return;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        
        // Les tours ne coûtent pas d'or lors de la pose
        // Elles sont déjà achetées/débloquées dans la boutique
        
        // Activer le mode placement par clic
        if (this.scene.placementSystem) {
            this.scene.placementSystem.activateClickPlacement(towerId);
            this.scene.ui.showMessage(`Cliquez sur un emplacement pour placer ${towerData.name}`, 3000);
        }
    }
    
    startDrag(towerId, pointer, buttonBg) {
        // Vérifier si la tour est disponible
        if (!this.availableTowers[towerId]) {
            this.scene.ui.showMessage('Déjà placé!', 1000);
            return;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        
        // Les tours ne coûtent pas d'or lors de la pose
        // Elles sont déjà achetées/débloquées dans la boutique
        
        // Démarrer le drag
        this.isDragging = true;
        this.dragTowerType = towerId;
        
        // Créer le sprite du personnage qui suit la souris
        if (towerId === 'luffy' && this.scene.textures.exists('luffy')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'luffy');
            this.dragSprite.setDisplaySize(28, 44); // Réduit pour correspondre à Zoro
            this.dragSprite.setFlipX(true); // Retourner horizontalement
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('luffy_idle');
        } else if (towerId === 'zoro' && this.scene.textures.exists('zoro')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'zoro');
            this.dragSprite.setDisplaySize(28, 60); // Ratio 39:85, réduit
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('zoro_idle');
        } else if (towerId === 'ussop' && this.scene.textures.exists('ussop')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'ussop');
            this.dragSprite.setDisplaySize(28, 55); // Même taille que sur la map
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('ussop_idle');
        } else if (towerId === 'chopper' && this.scene.textures.exists('chopper')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'chopper');
            this.dragSprite.setDisplaySize(28, 39); // 4 frames de 28x39 (équidistant)
            this.dragSprite.setOrigin(0.5, 1.0); // Pieds en bas
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('chopper_idle');
        } else if (towerId === 'franky' && this.scene.textures.exists('franky')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'franky');
            this.dragSprite.setDisplaySize(40, 50); // 4 frames de 81x102 -> réduit
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('franky_idle');
        } else if (towerId === 'sanji' && this.scene.textures.exists('sanji')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'sanji');
            this.dragSprite.setDisplaySize(22, 55); // Même taille que sur la map
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('sanji_idle');
        } else if (towerId === 'nami' && this.scene.textures.exists('nami')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'nami');
            this.dragSprite.setDisplaySize(30, 65); // 3 frames de 40x86 réduit
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('nami_idle');
        } else if (this.scene.textures.exists(towerId)) {
            this.dragSprite = this.scene.add.image(
                pointer.x,
                pointer.y,
                towerId
            );
            this.dragSprite.setDisplaySize(35, 35); // Réduit
            this.dragSprite.setAlpha(0.8);
        } else {
            this.dragSprite = this.scene.add.rectangle(
                pointer.x,
                pointer.y,
                30,
                30,
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
                // Utiliser setTint pour les sprites animés, setFillStyle pour les cercles
                if (this.dragSprite.setTint) {
                    this.dragSprite.clearTint();
                    this.dragSprite.setAlpha(0.8);
                } else if (this.dragSprite.setFillStyle) {
                this.dragSprite.setFillStyle(TOWER_CONFIG[this.dragTowerType].color, 0.8);
                }
                this.dragRangeCircle.setStrokeStyle(2, 0x00ff00, 0.5);
            } else {
                if (this.dragSprite.setTint) {
                    this.dragSprite.setTint(0xff0000);
                    this.dragSprite.setAlpha(0.5);
                } else if (this.dragSprite.setFillStyle) {
                this.dragSprite.setFillStyle(0xff0000, 0.5);
                }
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
        
        // Mettre à jour l'apparence de la carte
        if (this.buttons[towerId]) {
            const button = this.buttons[towerId];
            
            // Changer le bouton DÉPLOYER en RETIRER
            button.deployText.setText('⛔ RETIRER');
            button.deployBtn.setFillStyle(0xdc2626); // Rouge
            button.deployBtn.setStrokeStyle(1, 0xef4444, 0.7);
            
            // Assombrir légèrement l'icône
            button.icon.setAlpha(0.6);
            
            // Ajouter un indicateur "déployé" sur la carte
            if (!button.deployedIndicator) {
                const cardBounds = button.cardBg.getBounds();
                button.deployedIndicator = this.scene.add.text(
                    cardBounds.x + cardBounds.width - 8,
                    cardBounds.y + 8,
                    '✓',
                    {
                        fontSize: '14px',
                        fill: '#22c55e',
                        fontStyle: 'bold'
                    }
                );
                button.deployedIndicator.setOrigin(1, 0);
                button.deployedIndicator.setDepth(103);
                button.deployedIndicator.setScrollFactor(0);
            }
            
            // Configurer le bouton pour retirer la tour
            button.deployBtn.removeAllListeners('pointerdown');
            button.deployBtn.on('pointerdown', () => {
                this.removeTower(towerId);
            });
            
            button.deployBtn.removeAllListeners('pointerover');
            button.deployBtn.on('pointerover', () => {
                button.deployBtn.setFillStyle(0xef4444);
                button.deployBtn.setStrokeStyle(1, 0xf87171, 0.9);
            });
            
            button.deployBtn.removeAllListeners('pointerout');
            button.deployBtn.on('pointerout', () => {
                button.deployBtn.setFillStyle(0xdc2626);
                button.deployBtn.setStrokeStyle(1, 0xef4444, 0.7);
            });
        }
    }
    
    markTowerAsAvailable(towerId) {
        // Marquer la tour comme disponible
        this.availableTowers[towerId] = true;
        
        // Remettre l'apparence normale de la carte
        if (this.buttons[towerId]) {
            const button = this.buttons[towerId];
            
            // Remettre le bouton DÉPLOYER
            button.deployText.setText('⚓ DÉPLOYER');
            button.deployBtn.setFillStyle(0x0891b2); // Cyan
            button.deployBtn.setStrokeStyle(1, 0x06b6d4, 0.7);
            
            // Remettre l'opacité normale
            button.icon.setAlpha(1);
            
            // Supprimer l'indicateur "déployé"
            if (button.deployedIndicator) {
                button.deployedIndicator.destroy();
                button.deployedIndicator = null;
            }
            
            // Reconfigurer le bouton pour déployer
            button.deployBtn.removeAllListeners('pointerdown');
            button.deployBtn.on('pointerdown', () => {
                if (this.availableTowers[towerId]) {
                    this.selectTowerForPlacement(towerId);
                }
            });
            
            button.deployBtn.removeAllListeners('pointerover');
            button.deployBtn.on('pointerover', () => {
                if (this.availableTowers[towerId]) {
                    button.deployBtn.setFillStyle(0x06b6d4);
                    button.deployBtn.setStrokeStyle(1, 0x22d3ee, 0.9);
                }
            });
            
            button.deployBtn.removeAllListeners('pointerout');
            button.deployBtn.on('pointerout', () => {
                button.deployBtn.setFillStyle(0x0891b2);
                button.deployBtn.setStrokeStyle(1, 0x06b6d4, 0.7);
            });
        }
    }
    
    removeTower(towerId) {
        // Trouver et retirer la tour du terrain
        if (this.scene.placementSystem) {
            const removed = this.scene.placementSystem.removeTowerByType(towerId);
            if (removed) {
                this.markTowerAsAvailable(towerId);
                this.scene.ui.showMessage(`${TOWER_CONFIG[towerId].name} retiré!`, 1500);
            }
        }
    }
    
    update() {
        // Mettre à jour les stats du joueur
        const player = this.scene.player;
        
        // Mettre à jour l'or
        if (this.playerGoldText) {
            this.playerGoldText.setText(`${player.gold}`);
        }
        
        // Mettre à jour les étoiles
        if (this.playerStarsText) {
            this.playerStarsText.setText(`${player.collection.getStars()}`);
        }
        
        // Mettre à jour la vie
        if (this.playerHpText) {
            this.playerHpText.setText(`${player.hp}`);
            
            // Calculer le pourcentage de vie (max = 10)
            const maxHp = 10;
            const hpPercent = Math.max(0, Math.min(1, player.hp / maxHp));
            
            // Mettre à jour la barre de vie
            if (this.hpBarFill) {
                this.hpBarFill.width = 181 * hpPercent;
                
                // Changer la couleur de la barre selon les HP
                if (hpPercent > 0.7) {
                    this.hpBarFill.setFillStyle(0x22c55e, 0.8); // Vert
                    this.playerHpText.setColor('#22c55e');
                } else if (hpPercent > 0.3) {
                    this.hpBarFill.setFillStyle(0xf59e0b, 0.8); // Orange
                    this.playerHpText.setColor('#f59e0b');
                } else {
                    this.hpBarFill.setFillStyle(0xef4444, 0.9); // Rouge
                    this.playerHpText.setColor('#ef4444');
                }
            }
        }
    }
    
    refreshMenu() {
        // Détruire toutes les cartes existantes
        Object.keys(this.buttons).forEach(towerId => {
            const button = this.buttons[towerId];
            // Détruire tous les éléments graphiques de la carte
            Object.keys(button).forEach(key => {
                if (button[key] && button[key].destroy) {
                    button[key].destroy();
                }
            });
        });
        
        // Détruire les emplacements verrouillés/vides
        Object.keys(this.lockedSlots).forEach(slotKey => {
            const slot = this.lockedSlots[slotKey];
            Object.keys(slot).forEach(key => {
                if (slot[key] && slot[key].destroy) {
                    slot[key].destroy();
                }
            });
        });
        
        // Réinitialiser
        this.buttons = {};
        this.lockedSlots = {};
        this.availableTowers = {};
        
        // Réinitialiser les tours équipées comme disponibles
        const equippedTowers = this.scene.player.collection.getEquippedTowers();
        equippedTowers.forEach(towerId => {
            this.availableTowers[towerId] = true;
        });
        
        // Recréer les emplacements
        const cardWidth = 135;
        const cardHeight = 108;
        const startX = this.menuX + 10;
        const startY = 210;
        const gapX = 5;
        const gapY = 4;
        
        // Créer 10 emplacements
        for (let index = 0; index < 10; index++) {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = startX + col * (cardWidth + gapX);
            const y = startY + row * (cardHeight + gapY);
            
            // Vérifier si cet emplacement est débloqué
            const isLocked = index >= 6 && !this.isSlotUnlocked(index);
            
            if (isLocked) {
                // Créer un emplacement verrouillé
                this.createLockedSlot(index, x, y, cardWidth, cardHeight);
            } else if (index < equippedTowers.length) {
                // Créer une carte de tour
                const towerId = equippedTowers[index];
                this.createTowerCard(towerId, x, y, cardWidth, cardHeight);
            } else {
                // Créer un emplacement vide (débloqué mais pas de tour équipée)
                this.createEmptySlot(index, x, y, cardWidth, cardHeight);
            }
        }
        
        // Recalculer le scroll max (5 lignes pour 10 emplacements)
        const totalRows = 5;
        this.maxScroll = Math.max(0, (totalRows * (cardHeight + gapY)) - (this.menuHeight - 170));
    }
    
}

