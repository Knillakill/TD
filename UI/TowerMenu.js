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
        this.hoverRangeCircle = null; // Cercle de portée au survol
        this.hoverMinRangeCircle = null; // Cercle de portée minimum (pour Jimbe)
        this.hoverMinRangeText = null; // Texte pour la zone d'exclusion de Jimbe
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
        // S'assurer que slotUnlockCosts est défini
        if (!this.slotUnlockCosts) {
            this.slotUnlockCosts = {
                6: 10,   // Slot 7 (index 6) : 10 étoiles
                7: 25,   // Slot 8 (index 7) : 25 étoiles
                8: 50,   // Slot 9 (index 8) : 50 étoiles
                9: 100   // Slot 10 (index 9) : 100 étoiles
            };
        }
        
        const cost = this.slotUnlockCosts[slotIndex];
        if (cost === undefined) {
            console.error(`[TowerMenu] Coût non défini pour le slot ${slotIndex}`);
            return;
        }
        
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
        unlockText.setDepth(100); // Même profondeur que le bouton pour ne pas bloquer
        unlockText.setScrollFactor(0);
        // Ne pas rendre le texte interactif - ne pas appeler setInteractive() du tout
        
        if (canUnlock) {
            unlockBtn.setInteractive({ useHandCursor: true });
            // Utiliser pointerdown au lieu de pointerup pour être plus réactif
            unlockBtn.on('pointerdown', (pointer) => {
                console.log(`[TowerMenu] Clic sur débloquer slot ${slotIndex + 1} (coût: ${cost} étoiles)`);
                pointer.event.stopPropagation(); // Empêcher la propagation
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
        // Vérifier que le slotIndex est valide
        if (!this.slotUnlockCosts.hasOwnProperty(slotIndex)) {
            console.error(`[TowerMenu] Slot ${slotIndex} n'a pas de coût défini`);
            this.scene.ui.showMessage('Erreur: slot invalide', 1500);
            return;
        }
        
        const cost = this.slotUnlockCosts[slotIndex];
        const collection = this.scene.player.collection;
        
        // Vérifier si le joueur a assez d'étoiles
        const currentStars = collection.getStars();
        if (currentStars < cost) {
            this.scene.ui.showMessage(`Pas assez d'étoiles! (${currentStars}/${cost})`, 2000);
            return;
        }
        
        // Dépenser les étoiles
        const spent = collection.spendStars(cost);
        if (!spent) {
            console.error(`[TowerMenu] Échec du dépense d'étoiles: ${cost}`);
            this.scene.ui.showMessage('Erreur lors du déblocage', 2000);
            return;
        }
        
        // Débloquer le slot
        const previousSlots = collection.unlockedSlots;
        collection.unlockedSlots = Math.max(collection.unlockedSlots, slotIndex + 1);
        collection.save();
        
        // Vérifier que le slot a bien été débloqué
        if (collection.unlockedSlots <= previousSlots) {
            console.error(`[TowerMenu] Le slot n'a pas été débloqué. unlockedSlots: ${collection.unlockedSlots}, slotIndex: ${slotIndex}`);
            this.scene.ui.showMessage('Erreur: le slot n\'a pas été débloqué', 2000);
            // Rembourser les étoiles
            collection.addStars(cost);
            collection.save();
            return;
        }
        
        console.log(`[TowerMenu] Slot ${slotIndex + 1} débloqué avec succès! Coût: ${cost} étoiles`);
        
        // Message de confirmation
        this.scene.ui.showMessage(`Slot ${slotIndex + 1} débloqué! (-${cost}⭐)`, 2000);
        
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
        // Récupérer le niveau RÉEL du joueur pour cette tour
        const playerLevel = this.scene.player.getTowerLevel(towerId);
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
        
        // Niveau avec badge amélioré
        const levelBadge = this.scene.add.rectangle(
            x + width / 2,
            y + 24,
            width - 12,
            16,
            0x1e293b,
            0.95
        );
        levelBadge.setDepth(101);
        levelBadge.setScrollFactor(0);
        levelBadge.setStrokeStyle(2, rarity.border, 0.8);
        
        const level = this.scene.add.text(
            x + width / 2,
            y + 24,
            `NIVEAU ${playerLevel}`,
            {
                fontSize: '10px',
                fill: '#fbbf24',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );
        level.setOrigin(0.5);
        level.setDepth(102);
        level.setScrollFactor(0);
        
        // Zone icône (sprite animé pour les personnages, sinon carré coloré)
        // === TAILLES UNIFORMES - Hauteur visuelle cible: ~38px ===
        let icon;
        const iconY = y + 52;
        const targetHeight = 38; // Taille réduite pour bien rentrer dans la carte
        
        // Fond rectangulaire sombre avec dégradé pour faire ressortir le sprite
        const iconBgGlow = this.scene.add.rectangle(
            x + width / 2,
            iconY,
            width - 8,
            42,
            0x000000, 0.6
        );
        iconBgGlow.setDepth(100);
        iconBgGlow.setScrollFactor(0);
        iconBgGlow.setStrokeStyle(2, rarity.border, 0.4);
        
        // Pas de deuxième fond - juste le rectangle sombre
        const iconBg = null;
        
        if (towerId === 'luffy' && this.scene.textures.exists('luffy')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'luffy');
            icon.setDisplaySize(25, targetHeight);
            icon.setFlipX(true);
            icon.play('luffy_idle');
        } else if (towerId === 'zoro' && this.scene.textures.exists('zoro')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'zoro');
            icon.setDisplaySize(18, targetHeight);
            icon.play('zoro');
        } else if (towerId === 'ussop' && this.scene.textures.exists('ussop')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'ussop');
            icon.setDisplaySize(34, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('ussop_idle');
        } else if (towerId === 'chopper' && this.scene.textures.exists('chopper')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'chopper');
            icon.setDisplaySize(24, 32);
            icon.setOrigin(0.5, 0.5);
            icon.play('chopper_idle');
        } else if (towerId === 'franky' && this.scene.textures.exists('franky')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'franky');
            icon.setDisplaySize(42, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('franky_idle');
        } else if (towerId === 'sanji' && this.scene.textures.exists('sanji')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'sanji');
            icon.setDisplaySize(16, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('sanji_idle');
        } else if (towerId === 'nami' && this.scene.textures.exists('nami')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'nami');
            icon.setDisplaySize(32, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('nami_idle');
        } else if (towerId === 'robin' && this.scene.textures.exists('robin')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'robin');
            icon.setDisplaySize(34, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('robin_idle');
        } else if (towerId === 'brook' && this.scene.textures.exists('brook')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'brook');
            icon.setDisplaySize(34, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('brook');
        } else if (towerId === 'jimbe' && this.scene.textures.exists('jimbe')) {
            icon = this.scene.add.sprite(x + width / 2, iconY, 'jimbe');
            icon.setDisplaySize(42, targetHeight);
            icon.setOrigin(0.5, 0.5);
            icon.play('jimbe_idle');
        } else if (this.scene.textures.exists(towerId)) {
            icon = this.scene.add.image(x + width / 2, iconY, towerId);
            icon.setDisplaySize(34, 34);
        } else {
            icon = this.scene.add.rectangle(x + width / 2, iconY, 28, 28, towerData.color);
        }
        icon.setDepth(103);
        icon.setScrollFactor(0);
        icon.setInteractive({ draggable: true, useHandCursor: true });
        
        // Effet de surbrillance au survol - léger agrandissement
        icon.on('pointerover', () => {
            icon.setTint(0xaaddff); // Teinte bleu clair
            if (icon.setScale) icon.setScale(1.08); // Agrandissement léger
            iconBgGlow.setStrokeStyle(3, 0x60a5fa, 1);
            iconBgGlow.setFillStyle(0x1e3a5f, 0.8);
            
            // Afficher la portée sur la map
            this.showHoverRange(towerId, towerData);
        });
        icon.on('pointerout', () => {
            icon.clearTint();
            if (icon.setScale) icon.setScale(1.0);
            iconBgGlow.setStrokeStyle(2, rarity.border, 0.4);
            iconBgGlow.setFillStyle(0x000000, 0.6);
            
            // Cacher la portée
            this.hideHoverRange();
        });
        
        // Drag and drop sur le sprite de la tour
        icon.on('dragstart', (pointer) => {
            if (this.availableTowers[towerId]) {
                this.startDrag(towerId, pointer, icon);
            }
        });
        
        // === BOUTONS SUR LA MÊME LIGNE ===
        const buttonY = y + 90;
        const buttonWidth = (width - 16) / 2; // Deux boutons côte à côte
        const buttonHeight = 20;
        
        // Bouton INFOS (gauche) - Bleu
        const infosBtn = this.scene.add.rectangle(
            x + 6 + buttonWidth / 2,
            buttonY,
            buttonWidth,
            buttonHeight,
            0x3b82f6,
            1
        );
        infosBtn.setDepth(101);
        infosBtn.setScrollFactor(0);
        infosBtn.setInteractive({ useHandCursor: true });
        infosBtn.setStrokeStyle(2, 0x60a5fa, 0.9);
        
        const infosText = this.scene.add.text(
            x + 6 + buttonWidth / 2,
            buttonY,
            'ℹ️',
            {
                fontSize: '12px',
                fontFamily: 'Arial'
            }
        );
        infosText.setOrigin(0.5);
        infosText.setDepth(102);
        infosText.setScrollFactor(0);
        
        // Bouton DÉPLOYER (droite) - plus visible avec couleur vive
        const deployBtn = this.scene.add.rectangle(
            x + width - 6 - buttonWidth / 2,
            buttonY,
            buttonWidth,
            buttonHeight,
            0x059669,
            1
        );
        deployBtn.setDepth(101);
        deployBtn.setScrollFactor(0);
        deployBtn.setInteractive({ useHandCursor: true });
        deployBtn.setStrokeStyle(2, 0x10b981, 0.9);
        
        const deployText = this.scene.add.text(
            x + width - 6 - buttonWidth / 2,
            buttonY,
            '⚔️',
            {
                fontSize: '12px',
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
            infosBtn.setFillStyle(0x60a5fa);
            infosBtn.setStrokeStyle(2, 0x93c5fd, 1);
            infosBtn.setScale(1.05);
            infosText.setScale(1.05);
        });
        
        infosBtn.on('pointerout', () => {
            infosBtn.setFillStyle(0x3b82f6);
            infosBtn.setStrokeStyle(2, 0x60a5fa, 0.9);
            infosBtn.setScale(1);
            infosText.setScale(1);
        });
        
        deployBtn.on('pointerdown', (pointer) => {
            if (this.availableTowers[towerId]) {
                // Mode clic : activer la sélection pour placement au clic
                this.selectTowerForPlacement(towerId);
            }
        });
        
        deployBtn.on('pointerover', () => {
            if (this.availableTowers[towerId]) {
                deployBtn.setFillStyle(0x10b981);
                deployBtn.setStrokeStyle(2, 0x34d399, 1);
                deployBtn.setScale(1.05);
                deployText.setScale(1.05);
            }
        });
        
        deployBtn.on('pointerout', () => {
            deployBtn.setFillStyle(0x059669);
            deployBtn.setStrokeStyle(2, 0x10b981, 0.9);
            deployBtn.setScale(1);
            deployText.setScale(1);
        });
        
        // Stocker les références
        this.buttons[towerId] = {
            cardBg: cardBg,
            cardBorder: cardBorder,
            cardMug: cardMug,
            iconBgGlow: iconBgGlow,
            icon: icon,
            name: name,
            level: level,
            levelBadge: levelBadge,
            rarityBar: rarityBar,
            infosBtn: infosBtn,
            infosText: infosText,
            deployBtn: deployBtn,
            deployText: deployText
        };
    }
    
    showTowerInfo(towerId) {
        if (this.modal) {
            this.closeModal();
        }
        
        const towerConfig = TOWER_CONFIG[towerId];
        const playerLevel = this.scene.player.getTowerLevel(towerId);
        const towerData = getTowerStats(towerId, playerLevel);
        const centerX = this.scene.cameras.main.width / 2;
        const centerY = this.scene.cameras.main.height / 2;
        const modalWidth = 420;
        const modalHeight = 520;
        
        // Couleurs thème
        const colors = {
            primary: 0x1a1a2e,
            secondary: 0x16213e,
            accent: 0xd4af37,
            border: 0x2d4a6f,
            success: 0x2ecc71,
            danger: 0xe74c3c
        };
        
        this.modal = {};
        this.currentInfoTower = towerId;
        
        // Overlay sombre
        this.modal.overlay = this.scene.add.rectangle(
            centerX, centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000, 0.85
        );
        this.modal.overlay.setDepth(500);
        this.modal.overlay.setScrollFactor(0);
        this.modal.overlay.setInteractive();
        this.modal.overlay.on('pointerdown', () => this.closeModal());
        
        // Ombre
        const shadow = this.scene.add.rectangle(centerX + 6, centerY + 6, modalWidth, modalHeight, 0x000000, 0.5);
        shadow.setDepth(500);
        shadow.setScrollFactor(0);
        this.modal.shadow = shadow;
        
        // Bordure extérieure
        const bgOuter = this.scene.add.rectangle(centerX, centerY, modalWidth + 4, modalHeight + 4, colors.border, 1);
        bgOuter.setDepth(501);
        bgOuter.setScrollFactor(0);
        this.modal.bgOuter = bgOuter;
        
        // Fond principal
        this.modal.bg = this.scene.add.rectangle(centerX, centerY, modalWidth, modalHeight, colors.primary, 1);
        this.modal.bg.setDepth(501);
        this.modal.bg.setScrollFactor(0);
        // Rendre le fond interactif pour bloquer les clics (empêcher la fermeture)
        this.modal.bg.setInteractive();
        this.modal.bg.on('pointerdown', (pointer) => {
            pointer.event.stopPropagation();
        });
        
        // Barre de titre
        const titleBar = this.scene.add.rectangle(centerX, centerY - modalHeight/2 + 30, modalWidth - 20, 40, colors.secondary, 1);
        titleBar.setDepth(502);
        titleBar.setScrollFactor(0);
        this.modal.titleBar = titleBar;
        
        // Ligne dorée sous titre
        const titleLine = this.scene.add.rectangle(centerX, centerY - modalHeight/2 + 52, modalWidth - 40, 2, colors.accent, 0.8);
        titleLine.setDepth(502);
        titleLine.setScrollFactor(0);
        this.modal.titleLine = titleLine;
        
        // Titre
        this.modal.title = this.scene.add.text(
            centerX, centerY - modalHeight/2 + 30,
            '⚔️ FICHE PERSONNAGE',
            {
                fontSize: '18px',
                color: '#d4af37',
                fontStyle: 'bold',
                fontFamily: "'Segoe UI', Arial, sans-serif"
            }
        );
        this.modal.title.setOrigin(0.5);
        this.modal.title.setDepth(503);
        this.modal.title.setScrollFactor(0);
        
        // Bouton fermer
        const closeBtnBg = this.scene.add.circle(centerX + modalWidth/2 - 30, centerY - modalHeight/2 + 30, 15, colors.danger, 0.9);
        closeBtnBg.setDepth(503);
        closeBtnBg.setScrollFactor(0);
        closeBtnBg.setInteractive({ useHandCursor: true });
        closeBtnBg.on('pointerover', () => closeBtnBg.setFillStyle(0xff6b6b, 1));
        closeBtnBg.on('pointerout', () => closeBtnBg.setFillStyle(colors.danger, 0.9));
        closeBtnBg.on('pointerdown', () => this.closeModal());
        this.modal.closeBtnBg = closeBtnBg;
        
        this.modal.closeBtn = this.scene.add.text(centerX + modalWidth/2 - 30, centerY - modalHeight/2 + 29, '✕', {
            fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
        });
        this.modal.closeBtn.setOrigin(0.5);
        this.modal.closeBtn.setDepth(504);
        this.modal.closeBtn.setScrollFactor(0);
        
        // Section personnage (nom + navigation)
        const charY = centerY - modalHeight/2 + 85;
        const charCard = this.scene.add.rectangle(centerX, charY, modalWidth - 40, 50, colors.secondary, 0.9);
        charCard.setDepth(502);
        charCard.setScrollFactor(0);
        charCard.setStrokeStyle(2, colors.accent, 0.6);
        this.modal.charCard = charCard;
        
        // Flèches navigation
        this.modal.leftArrow = this.scene.add.text(centerX - modalWidth/2 + 45, charY, '◀', {
            fontSize: '22px', color: '#d4af37', fontStyle: 'bold'
        });
        this.modal.leftArrow.setOrigin(0.5);
        this.modal.leftArrow.setDepth(503);
        this.modal.leftArrow.setScrollFactor(0);
        this.modal.leftArrow.setInteractive({ useHandCursor: true });
        this.modal.leftArrow.on('pointerover', () => this.modal.leftArrow.setColor('#ffd700'));
        this.modal.leftArrow.on('pointerout', () => this.modal.leftArrow.setColor('#d4af37'));
        this.modal.leftArrow.on('pointerdown', () => this.navigateTower(-1));
        
        this.modal.rightArrow = this.scene.add.text(centerX + modalWidth/2 - 45, charY, '▶', {
            fontSize: '22px', color: '#d4af37', fontStyle: 'bold'
        });
        this.modal.rightArrow.setOrigin(0.5);
        this.modal.rightArrow.setDepth(503);
        this.modal.rightArrow.setScrollFactor(0);
        this.modal.rightArrow.setInteractive({ useHandCursor: true });
        this.modal.rightArrow.on('pointerover', () => this.modal.rightArrow.setColor('#ffd700'));
        this.modal.rightArrow.on('pointerout', () => this.modal.rightArrow.setColor('#d4af37'));
        this.modal.rightArrow.on('pointerdown', () => this.navigateTower(1));
        
        // Nom + niveau
        this.modal.towerName = this.scene.add.text(centerX, charY, `${towerData.name.toUpperCase()}`, {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
        });
        this.modal.towerName.setOrigin(0.5);
        this.modal.towerName.setDepth(503);
        this.modal.towerName.setScrollFactor(0);
        
        // Badge niveau
        const lvlBadge = this.scene.add.rectangle(centerX + 80, charY, 50, 24, colors.accent, 0.9);
        lvlBadge.setDepth(503);
        lvlBadge.setScrollFactor(0);
        this.modal.lvlBadge = lvlBadge;
        
        const lvlText = this.scene.add.text(centerX + 80, charY, `Nv.${playerLevel}`, {
            fontSize: '12px', color: '#1a1a2e', fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
        });
        lvlText.setOrigin(0.5);
        lvlText.setDepth(504);
        lvlText.setScrollFactor(0);
        this.modal.lvlText = lvlText;
        
        // Stats avec icônes
        const statsStartY = charY + 45;
        const labelX = centerX - modalWidth/2 + 40;
        const valueX = centerX + modalWidth/2 - 40;
        const lineHeight = 32;
        
        const stats = [
            { icon: '⚔️', label: 'Puissance', value: towerData.damage, color: '#ff6b6b' },
            { icon: '⏱️', label: 'Recharge', value: `${towerData.fireRate.toFixed(2)}s`, color: '#74b9ff' },
            { icon: '💥', label: 'Critique', value: `${towerData.critChance.toFixed(1)}%`, color: '#ffeaa7' },
            { icon: '🎯', label: 'Portée', value: Math.round(towerData.range), color: '#55efc4' },
            { icon: '📐', label: 'Forme', value: towerData.shape || 'Cercle', color: '#a29bfe' },
            { icon: '🎪', label: 'Cible', value: towerData.target || 'Premier', color: '#fd79a8' }
        ];
        
        this.modal.statLabels = [];
        this.modal.statValues = [];
        this.modal.statBgs = []; // Stocker les fonds des stats pour les détruire à la fermeture
        
        stats.forEach((stat, index) => {
            const y = statsStartY + index * lineHeight;
            
            // Ligne de stat
            const statBg = this.scene.add.rectangle(centerX, y + 10, modalWidth - 50, 26, colors.secondary, index % 2 === 0 ? 0.4 : 0.2);
            statBg.setDepth(502);
            statBg.setScrollFactor(0);
            this.modal.statBgs.push(statBg); // Stocker pour destruction
            
            const label = this.scene.add.text(labelX, y + 10, `${stat.icon} ${stat.label}`, {
                fontSize: '14px', color: '#8892a0', fontFamily: "'Segoe UI', Arial, sans-serif"
            });
            label.setOrigin(0, 0.5);
            label.setDepth(503);
            label.setScrollFactor(0);
            this.modal.statLabels.push(label);
            
            const value = this.scene.add.text(valueX, y + 10, String(stat.value), {
                fontSize: '15px', color: stat.color, fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
            });
            value.setOrigin(1, 0.5);
            value.setDepth(503);
            value.setScrollFactor(0);
            this.modal.statValues.push(value);
        });
        
        // Section passive
        const passiveY = statsStartY + stats.length * lineHeight + 15;
        const passiveBg = this.scene.add.rectangle(centerX, passiveY + 25, modalWidth - 50, 55, colors.secondary, 0.7);
        passiveBg.setDepth(502);
        passiveBg.setScrollFactor(0);
        passiveBg.setStrokeStyle(1, colors.border, 0.5);
        this.modal.passiveBg = passiveBg;
        
        const passiveLabel = this.scene.add.text(centerX, passiveY + 8, '✨ PASSIF', {
            fontSize: '11px', color: '#d4af37', fontStyle: 'bold', letterSpacing: 2
        });
        passiveLabel.setOrigin(0.5);
        passiveLabel.setDepth(503);
        passiveLabel.setScrollFactor(0);
        this.modal.passiveLabel = passiveLabel;
        
        this.modal.passiveText = this.scene.add.text(centerX, passiveY + 35, towerData.passive || 'Aucun passif', {
            fontSize: '13px', color: towerData.passive ? '#55efc4' : '#6c7a89', fontFamily: "'Segoe UI', Arial, sans-serif",
            align: 'center', wordWrap: { width: modalWidth - 70 }
        });
        this.modal.passiveText.setOrigin(0.5);
        this.modal.passiveText.setDepth(503);
        this.modal.passiveText.setScrollFactor(0);
        
        // Section amélioration
        const btnY = centerY + modalHeight/2 - 50;
        const currentLevel = this.scene.player.getTowerLevel(towerId);
        const maxLevel = towerConfig.maxLevel;
        const upgradeCost = getUpgradeCost(towerId, currentLevel);
        const canUpgrade = currentLevel < maxLevel && this.scene.player.gold >= upgradeCost;
        
        // Barre de niveau
        const lvlBarBg = this.scene.add.rectangle(centerX - 50, btnY - 30, 200, 8, 0x2a2a3a, 1);
        lvlBarBg.setDepth(502);
        lvlBarBg.setScrollFactor(0);
        this.modal.lvlBarBg = lvlBarBg;
        
        const lvlProgress = currentLevel / maxLevel;
        const lvlBar = this.scene.add.rectangle(centerX - 50 - 100 + (200 * lvlProgress / 2), btnY - 30, 200 * lvlProgress, 8, colors.accent, 1);
        lvlBar.setDepth(503);
        lvlBar.setScrollFactor(0);
        this.modal.lvlBar = lvlBar;
        
        // Texte niveau
        this.modal.levelDisplay = this.scene.add.text(centerX + 70, btnY - 30, `${currentLevel}/${maxLevel}`, {
            fontSize: '13px', color: '#d4af37', fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
        });
        this.modal.levelDisplay.setOrigin(0, 0.5);
        this.modal.levelDisplay.setDepth(503);
        this.modal.levelDisplay.setScrollFactor(0);
        
        // Or disponible
        const goldInfo = this.scene.add.text(centerX - 150, btnY - 30, `💰 ${this.scene.player.gold}`, {
            fontSize: '13px', color: '#ffd700', fontFamily: "'Segoe UI', Arial, sans-serif"
        });
        goldInfo.setOrigin(0, 0.5);
        goldInfo.setDepth(503);
        goldInfo.setScrollFactor(0);
        this.modal.goldInfo = goldInfo;
        
        // Boutons d'amélioration
        const btnWidth = 100;
        const btnGap = 15;
        const btnStartX = centerX - btnWidth - btnGap;
        
        // Stocker les références pour la mise à jour des boutons
        this.modal.upgradeBtns = [];
        this.modal.previewTexts = []; // Pour la prévisualisation des stats
        
        // Créer les textes de prévisualisation (verts, à côté des valeurs)
        stats.forEach((stat, index) => {
            const y = statsStartY + index * lineHeight;
            const previewText = this.scene.add.text(valueX + 10, y + 10, '', {
                fontSize: '13px', color: '#2ecc71', fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
            });
            previewText.setOrigin(0, 0.5);
            previewText.setDepth(504);
            previewText.setScrollFactor(0);
            previewText.setVisible(false);
            this.modal.previewTexts.push(previewText);
        });
        
        // Fonction pour afficher la prévisualisation
        const showPreview = (levels) => {
            const futureLevel = Math.min(currentLevel + levels, maxLevel);
            const futureStats = getTowerStats(towerId, futureLevel);
            const currentStats = getTowerStats(towerId, currentLevel);
            
            const statDiffs = [
                { diff: futureStats.damage - currentStats.damage, format: (v) => `+${v}` },
                { diff: currentStats.fireRate - futureStats.fireRate, format: (v) => `-${v.toFixed(2)}s` },
                { diff: futureStats.critChance - currentStats.critChance, format: (v) => `+${v.toFixed(1)}%` },
                { diff: futureStats.range - currentStats.range, format: (v) => `+${Math.round(v)}` },
                { diff: 0, format: () => '' }, // Forme ne change pas
                { diff: 0, format: () => '' }  // Cible ne change pas
            ];
            
            statDiffs.forEach((stat, index) => {
                if (stat.diff > 0) {
                    this.modal.previewTexts[index].setText(stat.format(stat.diff));
                    this.modal.previewTexts[index].setVisible(true);
                } else {
                    this.modal.previewTexts[index].setVisible(false);
                }
            });
        };
        
        // Fonction pour cacher la prévisualisation
        const hidePreview = () => {
            this.modal.previewTexts.forEach(text => text.setVisible(false));
        };
        
        // Fonction pour créer un bouton d'amélioration
        const createUpgradeBtn = (x, levels, cost, canUpgradeNow) => {
            const btn = this.scene.add.rectangle(x, btnY, btnWidth, 35, canUpgradeNow ? colors.success : 0x444444, 0.9);
            btn.setDepth(502);
            btn.setScrollFactor(0);
            btn.setStrokeStyle(2, canUpgradeNow ? 0x27ae60 : 0x555555, 0.6);
            btn.setInteractive({ useHandCursor: true });
            
            const text = this.scene.add.text(x, btnY, currentLevel + levels > maxLevel ? 'MAX' : `+${levels} (${cost})`, {
                fontSize: '13px', color: canUpgradeNow ? '#ffffff' : '#666666', fontStyle: 'bold', fontFamily: "'Segoe UI', Arial, sans-serif"
            });
            text.setOrigin(0.5);
            text.setDepth(503);
            text.setScrollFactor(0);
            
            btn.on('pointerdown', () => {
                if (this.canUpgradeNow(towerId, levels)) {
                    if (levels === 1) {
                        this.upgradeTowerFromModal(towerId);
                    } else {
                        this.upgradeTowerMultiple(towerId, levels);
                    }
                }
            });
            
            btn.on('pointerover', () => {
                if (this.canUpgradeNow(towerId, levels)) {
                    btn.setFillStyle(0x27ae60, 1);
                    showPreview(levels);
                }
            });
            
            btn.on('pointerout', () => {
                const canNow = this.canUpgradeNow(towerId, levels);
                btn.setFillStyle(canNow ? colors.success : 0x444444, 0.9);
                hidePreview();
            });
            
            return { btn, text, levels, cost };
        };
        
        // Bouton +1
        const btn1 = createUpgradeBtn(btnStartX, 1, upgradeCost, canUpgrade);
        this.modal.btnUpgrade = btn1.btn;
        this.modal.btnUpgradeText = btn1.text;
        this.modal.upgradeBtns.push({ ...btn1, x: btnStartX });
        
        // Bouton +5
        const cost5 = this.calculateMultiUpgradeCost(towerId, currentLevel, 5);
        const canUpgrade5 = currentLevel + 5 <= maxLevel && this.scene.player.gold >= cost5;
        const btn5 = createUpgradeBtn(centerX, 5, cost5, canUpgrade5);
        this.modal.btnUpgrade5 = btn5.btn;
        this.modal.btnUpgrade5Text = btn5.text;
        this.modal.upgradeBtns.push({ ...btn5, x: centerX });
        
        // Bouton +10
        const cost10 = this.calculateMultiUpgradeCost(towerId, currentLevel, 10);
        const canUpgrade10 = currentLevel + 10 <= maxLevel && this.scene.player.gold >= cost10;
        const btn10X = btnStartX + btnWidth + btnGap + btnWidth + btnGap;
        const btn10 = createUpgradeBtn(btn10X, 10, cost10, canUpgrade10);
        this.modal.btnUpgrade10 = btn10.btn;
        this.modal.btnUpgrade10Text = btn10.text;
        this.modal.upgradeBtns.push({ ...btn10, x: btn10X });
        
        // Timer pour mise à jour en temps réel des boutons et de l'or
        this.modal.updateTimer = this.scene.time.addEvent({
            delay: 100, // Vérifier toutes les 100ms
            callback: () => this.updateModalButtons(towerId, colors),
            loop: true
        });
    }
    
    // Vérifier si on peut améliorer maintenant
    canUpgradeNow(towerId, levels) {
        const currentLevel = this.scene.player.getTowerLevel(towerId);
        const maxLevel = TOWER_CONFIG[towerId].maxLevel;
        const cost = levels === 1 ? 
            getUpgradeCost(towerId, currentLevel) : 
            this.calculateMultiUpgradeCost(towerId, currentLevel, levels);
        return currentLevel + levels <= maxLevel && this.scene.player.gold >= cost;
    }
    
    // Mettre à jour les boutons en temps réel
    updateModalButtons(towerId, colors) {
        if (!this.modal || !this.modal.upgradeBtns) return;
        
        const currentLevel = this.scene.player.getTowerLevel(towerId);
        const maxLevel = TOWER_CONFIG[towerId].maxLevel;
        
        // Mettre à jour l'affichage de l'or
        if (this.modal.goldInfo) {
            this.modal.goldInfo.setText(`💰 ${this.scene.player.gold}`);
        }
        
        // Mettre à jour chaque bouton
        this.modal.upgradeBtns.forEach(btnData => {
            const levels = btnData.levels;
            const cost = levels === 1 ? 
                getUpgradeCost(towerId, currentLevel) : 
                this.calculateMultiUpgradeCost(towerId, currentLevel, levels);
            const canNow = currentLevel + levels <= maxLevel && this.scene.player.gold >= cost;
            
            // Mettre à jour l'apparence du bouton
            btnData.btn.setFillStyle(canNow ? colors.success : 0x444444, 0.9);
            btnData.btn.setStrokeStyle(2, canNow ? 0x27ae60 : 0x555555, 0.6);
            
            // Mettre à jour le texte du bouton
            const textContent = currentLevel + levels > maxLevel ? 'MAX' : `+${levels} (${cost})`;
            btnData.text.setText(textContent);
            btnData.text.setColor(canNow ? '#ffffff' : '#666666');
        });
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
            
            // Rafraîchir le menu pour mettre à jour le niveau sur les cartes
            this.refreshMenu();
            
            // Sauvegarder les niveaux
            if (this.scene.saveManager) {
                this.scene.saveManager.autoSave();
            }
            
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
            
            // Rafraîchir le menu pour mettre à jour le niveau sur les cartes
            this.refreshMenu();
            
            // Sauvegarder les niveaux
            if (this.scene.saveManager) {
                this.scene.saveManager.autoSave();
            }
            
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
        
        // Arrêter le timer de mise à jour
        if (this.modal.updateTimer) {
            this.modal.updateTimer.remove();
            this.modal.updateTimer = null;
        }
        
        // Détruire tous les éléments de la modal
        Object.keys(this.modal).forEach(key => {
            const item = this.modal[key];
            if (key === 'updateTimer') return; // Déjà géré
            if (key === 'upgradeBtns') {
                // Structure spéciale avec btn et text
                item.forEach(btnData => {
                    if (btnData.btn) btnData.btn.destroy();
                    if (btnData.text) btnData.text.destroy();
                });
                return;
            }
            if (Array.isArray(item)) {
                item.forEach(el => {
                    if (el && el.destroy) el.destroy();
                });
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
        
        // Cacher la portée au survol si elle est affichée
        this.hideHoverRange();
        
        // Activer le mode placement par clic
        if (this.scene.placementSystem) {
            this.scene.placementSystem.activateClickPlacement(towerId);
            this.scene.ui.showMessage(`Cliquez sur un emplacement pour placer ${towerData.name}`, 3000);
        }
    }
    
    startDrag(towerId, pointer, buttonBg) {
        // Cacher la portée au survol si elle est affichée
        this.hideHoverRange();
        
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
            this.dragSprite.play('zoro');
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
        } else if (towerId === 'jimbe' && this.scene.textures.exists('jimbe')) {
            this.dragSprite = this.scene.add.sprite(pointer.x, pointer.y, 'jimbe');
            this.dragSprite.setDisplaySize(40, 55); // 4 frames de 101x85 réduit
            this.dragSprite.setAlpha(0.8);
            this.dragSprite.play('jimbe_idle');
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
        // IMPORTANT: Ne pas rendre ce cercle interactif - il est uniquement visuel
        // Ne pas appeler setInteractive() du tout pour éviter les erreurs hitAreaCallback
        
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
        
        // Vérifier si on est sur un emplacement (libre ou occupé)
        if (this.scene.placementSystem) {
            const nearestSpot = this.scene.placementSystem.findNearestSpot(pointer.x, pointer.y, 50, true);
            const canPlaceOnNearest = nearestSpot && (nearestSpot.occupied || this.scene.placementSystem.canPlaceOnTerrain(this.dragTowerType, nearestSpot.terrain));
            
            // Mettre à jour l'affichage des spots (seulement les compatibles)
            this.scene.placementSystem.placementSpots.forEach(spot => {
                // Vérifier la compatibilité terrain pour les spots non occupés
                const isCompatible = spot.occupied || this.scene.placementSystem.canPlaceOnTerrain(this.dragTowerType, spot.terrain);
                
                if (!isCompatible) {
                    // Incompatible - rester invisible
                    return;
                }
                
                if (spot === nearestSpot && canPlaceOnNearest) {
                    // Spot le plus proche et compatible - mettre en évidence
                    spot.circle.setScale(1.2);
                    if (spot.occupied) {
                        // Emplacement occupé = remplacement possible (orange)
                        spot.circle.setFillStyle(0xffa500, 0.7);
                        spot.circle.setStrokeStyle(4, 0xffa500, 1);
                    } else {
                        // Emplacement libre (vert vif)
                        spot.circle.setFillStyle(0x00ff00, 0.7);
                        spot.circle.setStrokeStyle(4, 0x00ff00, 1);
                    }
                } else if (!spot.occupied) {
                    // Autres spots compatibles - apparence normale
                    spot.circle.setScale(1);
                    spot.circle.setFillStyle(0x00ff00, 0.4);
                    spot.circle.setStrokeStyle(3, 0x00ff00, 0.8);
                }
            });
            
            // Changer la couleur du sprite selon la validité
            if (canPlaceOnNearest) {
                if (nearestSpot.occupied) {
                    // Remplacement possible (orange)
                    if (this.dragSprite.setTint) {
                        this.dragSprite.setTint(0xffa500);
                        this.dragSprite.setAlpha(0.8);
                    } else if (this.dragSprite.setFillStyle) {
                        this.dragSprite.setFillStyle(0xffa500, 0.8);
                    }
                    this.dragRangeCircle.setStrokeStyle(2, 0xffa500, 0.5);
                } else {
                    // Placement possible (vert)
                if (this.dragSprite.setTint) {
                    this.dragSprite.clearTint();
                    this.dragSprite.setAlpha(0.8);
                } else if (this.dragSprite.setFillStyle) {
                this.dragSprite.setFillStyle(TOWER_CONFIG[this.dragTowerType].color, 0.8);
                }
                this.dragRangeCircle.setStrokeStyle(2, 0x00ff00, 0.5);
                }
            } else {
                // Pas d'emplacement compatible proche (rouge)
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
        
        // Cacher les emplacements (ils sont invisibles par défaut)
        if (this.scene.placementSystem) {
            this.scene.placementSystem.hideAllSpots();
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
            
            // Changer le bouton DÉPLOYER en RETIRER (avec emoji)
            button.deployText.setText('🔙');
            button.deployBtn.setFillStyle(0xdc2626); // Rouge
            button.deployBtn.setStrokeStyle(2, 0xef4444, 0.9);
            
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
                button.deployBtn.setStrokeStyle(2, 0xf87171, 1);
                button.deployBtn.setScale(1.05);
                button.deployText.setScale(1.05);
            });
            
            button.deployBtn.removeAllListeners('pointerout');
            button.deployBtn.on('pointerout', () => {
                button.deployBtn.setFillStyle(0xdc2626);
                button.deployBtn.setStrokeStyle(2, 0xef4444, 0.9);
                button.deployBtn.setScale(1);
                button.deployText.setScale(1);
            });
        }
    }
    
    markTowerAsAvailable(towerId) {
        // Marquer la tour comme disponible
        this.availableTowers[towerId] = true;
        
        // Remettre l'apparence normale de la carte
        if (this.buttons[towerId]) {
            const button = this.buttons[towerId];
            
            // Remettre le bouton DÉPLOYER (avec emoji)
            button.deployText.setText('⚔️');
            button.deployBtn.setFillStyle(0x059669); // Vert
            button.deployBtn.setStrokeStyle(2, 0x10b981, 0.9);
            
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
                    button.deployBtn.setFillStyle(0x10b981);
                    button.deployBtn.setStrokeStyle(2, 0x34d399, 1);
                    button.deployBtn.setScale(1.05);
                    button.deployText.setScale(1.05);
                }
            });
            
            button.deployBtn.removeAllListeners('pointerout');
            button.deployBtn.on('pointerout', () => {
                button.deployBtn.setFillStyle(0x059669);
                button.deployBtn.setStrokeStyle(2, 0x10b981, 0.9);
                button.deployBtn.setScale(1);
                button.deployText.setScale(1);
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
        
        // S'assurer que slotUnlockCosts est défini
        if (!this.slotUnlockCosts) {
            this.slotUnlockCosts = {
                6: 10,   // Slot 7 (index 6) : 10 étoiles
                7: 25,   // Slot 8 (index 7) : 25 étoiles
                8: 50,   // Slot 9 (index 8) : 50 étoiles
                9: 100   // Slot 10 (index 9) : 100 étoiles
            };
        }
        
        // Récupérer les tours déjà placées sur la map
        const placedTowerIds = new Set();
        if (this.scene.placementSystem && this.scene.placementSystem.placementSpots) {
            this.scene.placementSystem.placementSpots.forEach(spot => {
                if (spot.occupied && spot.towerId) {
                    placedTowerIds.add(spot.towerId);
                }
            });
        }
        
        // Réinitialiser les tours équipées comme disponibles, sauf celles déjà placées
        const equippedTowers = this.scene.player.collection.getEquippedTowers();
        equippedTowers.forEach(towerId => {
            // Si la tour est déjà sur la map, elle n'est pas disponible
            this.availableTowers[towerId] = !placedTowerIds.has(towerId);
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
        
        // Mettre à jour visuellement les tours déjà placées sur la map
        placedTowerIds.forEach(towerId => {
            if (this.buttons[towerId]) {
                this.markTowerAsUsed(towerId);
            }
        });
        
        // Recalculer le scroll max (5 lignes pour 10 emplacements)
        const totalRows = 5;
        this.maxScroll = Math.max(0, (totalRows * (cardHeight + gapY)) - (this.menuHeight - 170));
    }
    
    /**
     * Affiche la portée d'une tour au survol dans le menu
     */
    showHoverRange(towerId, towerData) {
        // Cacher les cercles précédents s'ils existent
        this.hideHoverRange();
        
        // Obtenir le niveau actuel de la tour
        const playerLevel = this.scene.player ? this.scene.player.getTowerLevel(towerId) : 1;
        const stats = getTowerStats(towerId, playerLevel);
        
        if (!stats) return;
        
        // Position au centre de la map (approximative, on pourrait améliorer en suivant la souris)
        const mapCenterX = 300 + 550; // MAP_OFFSET_X + MAP_WIDTH/2
        const mapCenterY = 400; // MAP_HEIGHT/2
        
        // Créer le cercle de portée maximum
        this.hoverRangeCircle = this.scene.add.circle(
            mapCenterX,
            mapCenterY,
            stats.range,
            towerData.color,
            0.1
        );
        this.hoverRangeCircle.setStrokeStyle(2, towerData.color, 0.6);
        this.hoverRangeCircle.setDepth(10);
        this.hoverRangeCircle.setScrollFactor(1); // Suit la caméra de la map
        // IMPORTANT: Ne pas rendre ce cercle interactif - il est uniquement visuel
        // Ne pas appeler setInteractive() du tout pour éviter les erreurs hitAreaCallback
        
        // Pour Jimbe, afficher aussi la portée minimum (zone d'exclusion)
        if (towerId === 'jimbe' && stats.minRange > 0) {
            // Cercle de portée minimum - zone où Jimbe ne peut PAS attaquer
            this.hoverMinRangeCircle = this.scene.add.circle(
                mapCenterX,
                mapCenterY,
                stats.minRange,
                0xff0000, // Rouge vif
                0.25 // Remplissage plus opaque pour mieux voir
            );
            this.hoverMinRangeCircle.setStrokeStyle(3, 0xff0000, 1); // Trait épais et rouge vif
            this.hoverMinRangeCircle.setDepth(11); // Au-dessus du cercle de portée max
            this.hoverMinRangeCircle.setScrollFactor(1);
            // IMPORTANT: Ne pas rendre ce cercle interactif - il est uniquement visuel
            // Ne pas appeler setInteractive() du tout pour éviter les erreurs hitAreaCallback
            
            // Ajouter un texte pour indiquer "Zone d'exclusion"
            this.hoverMinRangeText = this.scene.add.text(
                mapCenterX,
                mapCenterY - stats.minRange - 20,
                'Zone d\'exclusion',
                {
                    fontSize: '14px',
                    fill: '#ff0000',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            this.hoverMinRangeText.setOrigin(0.5, 0.5);
            this.hoverMinRangeText.setDepth(12);
            this.hoverMinRangeText.setScrollFactor(1);
        }
    }
    
    /**
     * Cache la portée affichée au survol
     */
    hideHoverRange() {
        if (this.hoverRangeCircle) {
            this.hoverRangeCircle.destroy();
            this.hoverRangeCircle = null;
        }
        if (this.hoverMinRangeCircle) {
            this.hoverMinRangeCircle.destroy();
            this.hoverMinRangeCircle = null;
        }
        if (this.hoverMinRangeText) {
            this.hoverMinRangeText.destroy();
            this.hoverMinRangeText = null;
        }
    }
    
}

