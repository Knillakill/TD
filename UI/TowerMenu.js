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
            20,
            '⚓ ÉQUIPAGE ⚓',
            {
                fontSize: '18px',
                fill: '#ffd700',
                fontStyle: 'bold'
            }
        );
        this.title.setOrigin(0.5);
        this.title.setDepth(101);
        this.title.setScrollFactor(0);
        
        // Créer les boutons pour chaque personnage
        this.buttons = {};
        let yPos = 70;
        
        TOWER_ORDER.forEach((towerId, index) => {
            this.createTowerButton(towerId, yPos);
            yPos += 95;
        });
    }
    
    createTowerButton(towerId, yPos) {
        const towerData = TOWER_CONFIG[towerId];
        const centerX = this.menuX + this.menuWidth / 2;
        
        // Conteneur pour le bouton
        const buttonBg = this.scene.add.rectangle(
            centerX,
            yPos,
            280,
            85,
            0x2a2a2a,
            0.9
        );
        buttonBg.setDepth(100);
        buttonBg.setInteractive({ useHandCursor: true });
        buttonBg.setStrokeStyle(2, 0x444444);
        buttonBg.setScrollFactor(0);
        
        // Icône du personnage (sprite si disponible, sinon carré coloré)
        let icon;
        if (this.scene.textures.exists(towerId)) {
            icon = this.scene.add.image(
                this.menuX + 35,
                yPos,
                towerId
            );
            icon.setDisplaySize(50, 50);
        } else {
            icon = this.scene.add.rectangle(
                this.menuX + 35,
                yPos,
                50,
                50,
                towerData.color
            );
        }
        icon.setDepth(101);
        icon.setScrollFactor(0);
        
        // Nom du personnage
        const name = this.scene.add.text(
            this.menuX + 75,
            yPos - 25,
            towerData.name,
            {
                fontSize: '16px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        name.setDepth(101);
        name.setScrollFactor(0);
        
        // Description
        const desc = this.scene.add.text(
            this.menuX + 75,
            yPos - 5,
            towerData.description,
            {
                fontSize: '11px',
                fill: '#aaaaaa'
            }
        );
        desc.setDepth(101);
        desc.setScrollFactor(0);
        
        // Prix
        const costText = towerData.cost === 0 ? 'GRATUIT' : `💰 ${towerData.cost}`;
        const cost = this.scene.add.text(
            this.menuX + 75,
            yPos + 20,
            costText,
            {
                fontSize: '13px',
                fill: towerData.cost === 0 ? '#00ff00' : '#ffff00',
                fontStyle: 'bold'
            }
        );
        cost.setDepth(101);
        cost.setScrollFactor(0);
        
        // Badge "UTILISÉ" (caché par défaut)
        const usedBadge = this.scene.add.rectangle(
            centerX,
            yPos,
            280,
            85,
            0x000000,
            0.7
        );
        usedBadge.setDepth(102);
        usedBadge.setVisible(false);
        usedBadge.setScrollFactor(0);
        
        const usedText = this.scene.add.text(
            centerX,
            yPos,
            '✓ PLACÉ',
            {
                fontSize: '18px',
                fill: '#666666',
                fontStyle: 'bold'
            }
        );
        usedText.setOrigin(0.5);
        usedText.setDepth(103);
        usedText.setVisible(false);
        usedText.setScrollFactor(0);
        
        // Événements de drag and drop
        buttonBg.on('pointerdown', (pointer) => {
            if (this.availableTowers[towerId]) {
                this.startDrag(towerId, pointer, buttonBg);
            }
        });
        
        // Hover effect
        buttonBg.on('pointerover', () => {
            if (this.availableTowers[towerId]) {
                buttonBg.setStrokeStyle(2, towerData.color);
            }
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.setStrokeStyle(2, 0x444444);
        });
        
        // Stocker les références
        this.buttons[towerId] = {
            bg: buttonBg,
            icon: icon,
            name: name,
            desc: desc,
            cost: cost,
            usedBadge: usedBadge,
            usedText: usedText
        };
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
        if (this.scene.textures.exists(towerId)) {
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
        
        // Afficher le badge "UTILISÉ"
        if (this.buttons[towerId]) {
            const button = this.buttons[towerId];
            button.usedBadge.setVisible(true);
            button.usedText.setVisible(true);
            button.bg.disableInteractive();
            button.bg.setAlpha(0.5);
            button.icon.setAlpha(0.3);
            button.name.setAlpha(0.3);
            button.desc.setAlpha(0.3);
            button.cost.setAlpha(0.3);
        }
    }
    
    
}

