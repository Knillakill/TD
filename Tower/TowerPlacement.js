class TowerPlacement {
    constructor(scene) {
        this.scene = scene;
        this.selectedTowerType = null;
        this.placementSpots = [];
        this.previewTower = null;
        this.isDragging = false;
        this.clickPlacementMode = false; // Mode placement au clic
        this.clickPlacementTowerId = null;
        this.draggedTower = null; // Tour en cours de déplacement
        this.selectedTower = null; // Tour sélectionnée pour déplacement/interversion
        this.selectionClickHandler = null; // Handler pour le clic global en mode sélection
        
        this.createPlacementSpots();
    }
    
    createPlacementSpots() {
        // Configuration de la map
        const MAP_OFFSET_X = 300;
        const MAP_WIDTH = 1100;
        const MAP_HEIGHT = 800;
        
        // Emplacements avec position et type de terrain
        // Terrains: 'herbe', 'plaine', 'montagne', 'mer'
        const spotsPercent = [
            // Cage en haut gauche (plaine/sable)
            { x: 0.26, y: 0.31, terrain: 'herbe' },
            { x: 0.32, y: 0.31, terrain: 'plaine' },
            
            // Cage haut droite (plaine/sable)
            { x: 0.51, y: 0.31, terrain: 'plaine' },
            { x: 0.57, y: 0.31, terrain: 'herbe' },
            
            // Herbe bas (herbe)
            { x: 0.25, y: 0.85, terrain: 'herbe' },
            { x: 0.17, y: 0.85, terrain: 'herbe' },
            { x: 0.33, y: 0.85, terrain: 'herbe' },
            { x: 0.41, y: 0.85, terrain: 'herbe' },
            { x: 0.49, y: 0.85, terrain: 'herbe' },
            
            // Lac (mer/eau)
            { x: 0.23, y: 0.50, terrain: 'mer' },
            { x: 0.63, y: 0.50, terrain: 'mer' },
            { x: 0.43, y: 0.59, terrain: 'mer' },
            { x: 0.23, y: 0.67, terrain: 'mer' },
            { x: 0.63, y: 0.67, terrain: 'mer' },
            
            // Montagne
            { x: 0.79, y: 0.47, terrain: 'montagne' },
            { x: 0.79, y: 0.57, terrain: 'montagne' },
            { x: 0.79, y: 0.85, terrain: 'plaine' },
        ];
        
        // Convertir en pixels et créer les spots
        spotsPercent.forEach((p, index) => {
            const x = MAP_OFFSET_X + (p.x * MAP_WIDTH);
            const y = p.y * MAP_HEIGHT;
            this.createSpot(x, y, index, p.terrain);
        });
    }
    
    createSpot(x, y, id, terrain = 'plaine') {
        // Récupérer les visuels du terrain
        const terrainVisual = TERRAIN_VISUALS[terrain] || TERRAIN_VISUALS.plaine;
        
        // Cercle pour indiquer l'emplacement (INVISIBLE par défaut)
        // Couleur verte par défaut (sera ajustée selon compatibilité)
        const spotCircle = this.scene.add.circle(x, y, 16, 0x00ff00, 0.4);
        spotCircle.setStrokeStyle(3, 0x00ff00, 0.8);
        spotCircle.setInteractive({ useHandCursor: true });
        spotCircle.setDepth(8); // Au-dessus de la map
        spotCircle.setVisible(false); // Invisible par défaut
        
        const spot = {
            id: id,
            x: x,
            y: y,
            terrain: terrain,
            terrainVisual: terrainVisual,
            circle: spotCircle,
            occupied: false,
            tower: null,
            towerId: null
        };
        
        // Événements pour le placement (pendant le drag ou mode clic)
        spotCircle.on('pointerover', () => {
            if (!spot.occupied && (this.isDragging || this.clickPlacementMode)) {
                // Vérifier si l'emplacement est compatible (donc visible)
                const towerId = this.selectedTowerType || this.clickPlacementTowerId;
                if (!this.canPlaceOnTerrain(towerId, terrain)) {
                    return; // Ne rien faire si incompatible
                }
                // Effet de survol - agrandir et éclaircir
                spotCircle.setFillStyle(0x00ff00, 0.7);
                spotCircle.setStrokeStyle(4, 0x00ff00, 1);
                spotCircle.setScale(1.2);
            }
        });
        
        spotCircle.on('pointerout', () => {
            if (!spot.occupied && (this.isDragging || this.clickPlacementMode)) {
                // Vérifier si l'emplacement est compatible (donc visible)
                const towerId = this.selectedTowerType || this.clickPlacementTowerId;
                if (!this.canPlaceOnTerrain(towerId, terrain)) {
                    return; // Ne rien faire si incompatible
                }
                // Remettre l'apparence normale
                spotCircle.setFillStyle(0x00ff00, 0.4);
                spotCircle.setStrokeStyle(3, 0x00ff00, 0.8);
                spotCircle.setScale(1);
            }
        });
        
        // Clic sur un emplacement pour placer (mode clic)
        spotCircle.on('pointerdown', () => {
            if (!spot.occupied && this.clickPlacementMode && this.clickPlacementTowerId) {
                if (this.canPlaceOnTerrain(this.clickPlacementTowerId, terrain)) {
                    this.tryPlaceTower(this.clickPlacementTowerId, spot.x, spot.y);
                    this.deactivateClickPlacement();
                } else {
                    const towerConfig = TOWER_CONFIG[this.clickPlacementTowerId];
                    this.scene.ui.showMessage(`${towerConfig.name} ne peut pas être placé sur ${terrainVisual.name}!`, 2000);
                }
            }
        });
        
        this.placementSpots.push(spot);
    }
    
    // Vérifier si une tour peut être placée sur un terrain
    canPlaceOnTerrain(towerId, terrain) {
        if (!towerId) return true;
        const towerConfig = TOWER_CONFIG[towerId];
        if (!towerConfig) return true;
        
        // Si terrain est un tableau, vérifier si le terrain est inclus
        if (Array.isArray(towerConfig.terrain)) {
            return towerConfig.terrain.includes(terrain);
        }
        // Si c'est 'Tous' ou une chaîne simple
        return towerConfig.terrain === 'Tous' || towerConfig.terrain === terrain;
    }
    
    // Afficher uniquement les emplacements compatibles (non occupés)
    showAvailableSpots(towerId = null) {
        const checkTowerId = towerId || this.selectedTowerType || this.clickPlacementTowerId;
        
        this.placementSpots.forEach(spot => {
            if (!spot.occupied) {
                // Vérifier la compatibilité terrain
                const canPlace = this.canPlaceOnTerrain(checkTowerId, spot.terrain);
                
                if (canPlace) {
                    // Compatible - afficher en vert et activer l'interactivité
                    spot.circle.setVisible(true);
                    spot.circle.setInteractive({ useHandCursor: true });
                    spot.circle.setFillStyle(0x00ff00, 0.4);
                    spot.circle.setStrokeStyle(3, 0x00ff00, 0.8);
                } else {
                    // Incompatible - cacher et désactiver l'interactivité
                    spot.circle.setVisible(false);
                    spot.circle.disableInteractive();
                }
            } else {
                // Occupé - cacher
                spot.circle.setVisible(false);
                spot.circle.disableInteractive();
            }
        });
    }
    
    // Cacher tous les emplacements (occupés et non occupés)
    hideAllSpots() {
        this.placementSpots.forEach(spot => {
            spot.circle.setVisible(false);
            spot.circle.disableInteractive();
            spot.circle.setScale(1);
            // Réinitialiser en vert par défaut
            spot.circle.setFillStyle(0x00ff00, 0.4);
            spot.circle.setStrokeStyle(3, 0x00ff00, 0.8);
        });
    }
    
    selectTowerType(type) {
        this.selectedTowerType = type;
    }
    
    startDragging(type) {
        this.isDragging = true;
        this.selectedTowerType = type;
        // Afficher les emplacements disponibles avec indication de compatibilité
        this.showAvailableSpots(type);
    }
    
    stopDragging() {
        this.isDragging = false;
        this.selectedTowerType = null;
        // Cacher les emplacements
        this.hideAllSpots();
    }
    
    activateClickPlacement(towerId) {
        // Activer le mode placement au clic
        this.clickPlacementMode = true;
        this.clickPlacementTowerId = towerId;
        
        // Afficher les emplacements avec indication de compatibilité
        this.showAvailableSpots(towerId);
    }
    
    deactivateClickPlacement() {
        // Désactiver le mode placement au clic
        this.clickPlacementMode = false;
        this.clickPlacementTowerId = null;
        
        // Cacher les emplacements
        this.hideAllSpots();
    }
    
    checkValidPlacement(x, y) {
        // Vérifier si on est proche d'un emplacement disponible
        const spot = this.findNearestSpot(x, y, 30); // 30 pixels de tolérance
        return spot && !spot.occupied;
    }
    
    findNearestSpot(x, y, maxDistance = 30, allowOccupied = false) {
        let nearestSpot = null;
        let minDist = maxDistance;
        
        this.placementSpots.forEach(spot => {
            // Si allowOccupied est false, ignorer les spots occupés
            if (!allowOccupied && spot.occupied) return;
            
            const dist = Math.sqrt(
                Math.pow(spot.x - x, 2) + Math.pow(spot.y - y, 2)
            );
            
            if (dist < minDist) {
                minDist = dist;
                nearestSpot = spot;
            }
        });
        
        return nearestSpot;
    }
    
    tryPlaceTower(towerId, x, y) {
        // Vérifier si la tour est disponible (pas déjà placée)
        if (this.scene.towerMenu && !this.scene.towerMenu.availableTowers[towerId]) {
            this.scene.ui.showMessage('Cette tour est déjà placée!', 1000);
            this.isDragging = false;
            this.selectedTowerType = null;
            return false;
        }
        
        // Chercher un emplacement proche (occupé ou non)
        const spot = this.findNearestSpot(x, y, 50, true); // allowOccupied = true
        
        if (!spot) {
            this.isDragging = false;
            this.selectedTowerType = null;
            return false;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        
        // Vérifier la compatibilité terrain (sauf si interversion)
        if (!spot.occupied && !this.canPlaceOnTerrain(towerId, spot.terrain)) {
            const terrainVisual = spot.terrainVisual || TERRAIN_VISUALS[spot.terrain];
            this.scene.ui.showMessage(`${towerData.name} ne peut pas être placé sur ${terrainVisual.name}!`, 2000);
            this.isDragging = false;
            this.selectedTowerType = null;
            return false;
        }
        
        // Si l'emplacement est occupé, vérifier la compatibilité terrain avant de remplacer
        if (spot.occupied) {
            // Vérifier si la nouvelle tour peut être placée sur ce terrain
            if (!this.canPlaceOnTerrain(towerId, spot.terrain)) {
                const terrainVisual = spot.terrainVisual || TERRAIN_VISUALS[spot.terrain];
                this.scene.ui.showMessage(`${towerData.name} ne peut pas être placé sur ${terrainVisual.name}!`, 2000);
                this.isDragging = false;
                this.selectedTowerType = null;
                return false;
            }
            
            const existingTower = spot.tower;
            const existingTowerId = spot.towerId;
            
            // Retirer l'ancienne tour de l'emplacement (sans la supprimer)
            spot.tower = null;
            spot.towerId = null;
            spot.occupied = false;
            
            // Retirer du tableau des tours
            const index = this.scene.towers.indexOf(existingTower);
            if (index > -1) {
                this.scene.towers.splice(index, 1);
            }
            
            // Détruire l'ancienne tour
            if (existingTower && existingTower.destroy) {
                existingTower.destroy();
            }
            
            // Marquer l'ancienne tour comme disponible dans le menu
            if (this.scene.towerMenu) {
                this.scene.towerMenu.markTowerAsAvailable(existingTowerId);
            }
            
            // Créer la nouvelle tour
            const tower = new Tower(
                this.scene,
                spot.x,
                spot.y,
                towerId,
                towerData
            );
            
            // Marquer l'emplacement comme occupé
            spot.occupied = true;
            spot.tower = tower;
            spot.towerId = towerId;
            spot.circle.setVisible(false);
            
            // Ajouter la tour au tableau des tours
            this.scene.towers.push(tower);
            
            // Configurer les événements sur la tour placée
            this.setupTowerInteractions(tower, spot);
            
            // Marquer la nouvelle tour comme utilisée dans le menu
            this.scene.towerMenu.markTowerAsUsed(towerId);
            
            // Réinitialiser l'état
            this.isDragging = false;
            this.selectedTowerType = null;
            
            // Mettre à jour l'interface
            const waveInfo = this.scene.waveManager.getWaveInfo();
            this.scene.ui.update(waveInfo);
            
            // Message de confirmation
            const existingTowerData = TOWER_CONFIG[existingTowerId];
            this.scene.ui.showMessage(`${towerData.name} remplace ${existingTowerData.name}!`, 1500);
            
            return true;
        }
        
        // Emplacement libre - placement normal
        const tower = new Tower(
            this.scene,
            spot.x,
            spot.y,
            towerId,
            towerData
        );
        
        // Marquer l'emplacement comme occupé
        spot.occupied = true;
        spot.tower = tower;
        spot.towerId = towerId;
        spot.circle.setVisible(false);
        
        // Ajouter la tour au tableau des tours
        this.scene.towers.push(tower);
        
        // Configurer les événements sur la tour placée
        this.setupTowerInteractions(tower, spot);
        
        // Marquer la tour comme utilisée dans le menu
        this.scene.towerMenu.markTowerAsUsed(towerId);
        
        // Réinitialiser l'état
        this.isDragging = false;
        this.selectedTowerType = null;
        
        // Mettre à jour l'interface
        const waveInfo = this.scene.waveManager.getWaveInfo();
        this.scene.ui.update(waveInfo);
        
        // Message de confirmation
        this.scene.ui.showMessage(`${towerData.name} rejoint l'équipe!`, 1500);
        
        return true;
    }
    
    
    setupTowerInteractions(tower, spot) {
        // Nettoyer les anciens événements
        tower.sprite.removeAllListeners();
        
        // Rendre le sprite de la tour cliquable
        tower.sprite.setInteractive({ useHandCursor: true });
        
        // Clic sur la tour : activer le mode sélection
        tower.sprite.on('pointerdown', (pointer) => {
            // Éviter de sélectionner si on est déjà en mode sélection
            if (this.selectedTower) {
                return;
            }
            
            // Activer le mode sélection pour cette tour
            this.activateTowerSelectionMode(tower, spot);
        });
        
        // Événements de survol pour les stats
        tower.sprite.on('pointerover', () => {
            if (!this.selectedTower) {
                // Fonction pour assombrir une couleur (pour la bordure)
                const darkenColor = (color, factor = 0.6) => {
                    const r = Math.floor(((color >> 16) & 0xFF) * factor);
                    const g = Math.floor(((color >> 8) & 0xFF) * factor);
                    const b = Math.floor((color & 0xFF) * factor);
                    return (r << 16) | (g << 8) | b;
                };
                
                const darkerColor = darkenColor(tower.color, 0.6);
                
                // Afficher le cercle de portée maximum avec bordure foncée
                tower.rangeCircle.setFillStyle(tower.color, 0.1);
                tower.rangeCircle.setStrokeStyle(2, darkerColor, 0.8);
                tower.rangeCircle.setVisible(true);
                
                // Pour Jimbe, afficher aussi le cercle de portée minimum (transparent)
                if (tower.minRangeCircle && tower.minRange > 0) {
                    tower.minRangeCircle.setFillStyle(tower.color, 0); // Transparent
                    tower.minRangeCircle.setStrokeStyle(2, darkerColor, 0.8); // Bordure foncée
                    tower.minRangeCircle.setVisible(true);
                }
                
                tower.showStats();
            }
        });
        
        tower.sprite.on('pointerout', () => {
            if (!this.selectedTower) {
                // Cacher le cercle de portée maximum
                tower.rangeCircle.setFillStyle(tower.color, 0);
                tower.rangeCircle.setStrokeStyle(2, tower.color, 0);
                tower.rangeCircle.setVisible(false);
                
                // Cacher le cercle de portée minimum
                if (tower.minRangeCircle) {
                    tower.minRangeCircle.setFillStyle(tower.color, 0);
                    tower.minRangeCircle.setStrokeStyle(2, tower.color, 0);
                    tower.minRangeCircle.setVisible(false);
                }
                
                tower.hideStats();
            }
        });
    }
    
    /**
     * Active le mode sélection pour une tour
     * - Clic sur emplacement vide = déplacer
     * - Clic sur emplacement occupé = intervertir
     * - Clic ailleurs = retirer la tour
     */
    activateTowerSelectionMode(tower, spot) {
        this.selectedTower = { tower, spot };
        const towerId = spot.towerId;
        
        // Mettre en évidence la tour sélectionnée
        tower.sprite.setAlpha(0.8);
        tower.rangeCircle.setFillStyle(0x00ffff, 0.2);
        tower.rangeCircle.setStrokeStyle(3, 0x00ffff, 0.8);
        tower.rangeCircle.setVisible(true);
        
        // Mettre en évidence les emplacements compatibles uniquement
        this.placementSpots.forEach(s => {
            if (s === spot) {
                // L'emplacement actuel en cyan (toujours visible)
                s.circle.setVisible(true);
                s.circle.setInteractive({ useHandCursor: true });
                s.circle.setFillStyle(0x00ffff, 0.5);
                s.circle.setStrokeStyle(3, 0x00ffff, 1);
            } else if (s.occupied) {
                // Emplacements occupés en orange (interversion possible, toujours visible)
                s.circle.setVisible(true);
                s.circle.setInteractive({ useHandCursor: true });
                s.circle.setFillStyle(0xffa500, 0.5);
                s.circle.setStrokeStyle(3, 0xffa500, 1);
            } else {
                // Emplacements libres - vérifier compatibilité terrain
                const canPlace = this.canPlaceOnTerrain(towerId, s.terrain);
                if (canPlace) {
                    s.circle.setVisible(true);
                    s.circle.setInteractive({ useHandCursor: true });
                    s.circle.setFillStyle(0x00ff00, 0.5);
                    s.circle.setStrokeStyle(3, 0x00ff00, 1);
                } else {
                    // Incompatible - cacher et désactiver
                    s.circle.setVisible(false);
                    s.circle.disableInteractive();
                }
            }
        });
        
        // Message d'instruction
        this.scene.ui.showMessage('Cliquez: emplacement = déplacer, tour = intervertir, ailleurs = retirer', 3000);
        
        // Écouter le prochain clic global
        this.selectionClickHandler = (pointer) => {
            this.handleSelectionClick(pointer);
        };
        
        // Attendre un court délai avant d'activer le listener global
        // pour éviter que le clic actuel ne soit capturé
        this.scene.time.delayedCall(50, () => {
            this.scene.input.once('pointerdown', this.selectionClickHandler);
        });
    }
    
    /**
     * Gère le clic pendant le mode sélection
     */
    handleSelectionClick(pointer) {
        if (!this.selectedTower) return;
        
        const { tower, spot } = this.selectedTower;
        const clickX = pointer.x;
        const clickY = pointer.y;
        
        // Chercher si on a cliqué sur un emplacement (occupé ou non)
        const clickedSpot = this.findNearestSpot(clickX, clickY, 40, true);
        
        if (clickedSpot && clickedSpot !== spot) {
            if (clickedSpot.occupied) {
                // === INTERVERSION DES TOURS ===
                // Vérifier la compatibilité de terrain pour les deux tours
                const tower1CanGoToSpot2 = this.canPlaceOnTerrain(tower.towerId, clickedSpot.terrain);
                const tower2CanGoToSpot1 = this.canPlaceOnTerrain(clickedSpot.tower.towerId, spot.terrain);
                
                if (tower1CanGoToSpot2 && tower2CanGoToSpot1) {
                    this.swapTowers(tower, spot, clickedSpot.tower, clickedSpot);
                } else {
                    // Afficher un message d'erreur détaillé
                    const terrain1Name = clickedSpot.terrainVisual?.name || clickedSpot.terrain;
                    const terrain2Name = spot.terrainVisual?.name || spot.terrain;
                    if (!tower1CanGoToSpot2 && !tower2CanGoToSpot1) {
                        this.scene.ui.showMessage(`Échange impossible : les deux tours ne peuvent pas être placées sur ces terrains`, 3000);
                    } else if (!tower1CanGoToSpot2) {
                        this.scene.ui.showMessage(`Échange impossible : cette tour ne peut pas être placée sur ${terrain1Name}`, 3000);
                    } else {
                        this.scene.ui.showMessage(`Échange impossible : l'autre tour ne peut pas être placée sur ${terrain2Name}`, 3000);
                    }
                }
            } else {
                // === DÉPLACEMENT VERS UN EMPLACEMENT VIDE ===
                // Vérifier la compatibilité de terrain
                if (this.canPlaceOnTerrain(tower.towerId, clickedSpot.terrain)) {
                    this.moveTowerToSpot(tower, spot, clickedSpot);
                } else {
                    const terrainName = clickedSpot.terrainVisual?.name || clickedSpot.terrain;
                    this.scene.ui.showMessage(`Déplacement impossible : cette tour ne peut pas être placée sur ${terrainName}`, 3000);
                }
            }
        } else if (clickedSpot === spot) {
            // Clic sur le même emplacement = annuler
            this.scene.ui.showMessage('Sélection annulée', 1000);
        } else {
            // === CLIC AILLEURS = RETIRER LA TOUR ===
            this.recallTower(tower, spot);
        }
        
        // Désactiver le mode sélection
        this.deactivateTowerSelectionMode();
    }
    
    /**
     * Intervertit deux tours
     */
    swapTowers(tower1, spot1, tower2, spot2) {
        // Déplacer tower1 vers spot2
        tower1.sprite.x = spot2.x;
        tower1.sprite.y = spot2.y;
        tower1.rangeCircle.x = spot2.x;
        tower1.rangeCircle.y = spot2.y;
        if (tower1.minRangeCircle) {
            tower1.minRangeCircle.x = spot2.x;
            tower1.minRangeCircle.y = spot2.y;
        }
        tower1.x = spot2.x;
        tower1.y = spot2.y;
        
        // Déplacer tower2 vers spot1
        tower2.sprite.x = spot1.x;
        tower2.sprite.y = spot1.y;
        tower2.rangeCircle.x = spot1.x;
        tower2.rangeCircle.y = spot1.y;
        if (tower2.minRangeCircle) {
            tower2.minRangeCircle.x = spot1.x;
            tower2.minRangeCircle.y = spot1.y;
        }
        tower2.x = spot1.x;
        tower2.y = spot1.y;
        
        // Mettre à jour les références des spots
        spot1.tower = tower2;
        spot1.towerId = tower2.towerId;
        
        spot2.tower = tower1;
        spot2.towerId = tower1.towerId;
        
        // Reconfigurer les interactions
        this.setupTowerInteractions(tower1, spot2);
        this.setupTowerInteractions(tower2, spot1);
        
        this.scene.ui.showMessage('Tours interverties !', 1500);
    }
    
    /**
     * Déplace une tour vers un emplacement vide
     */
    moveTowerToSpot(tower, oldSpot, newSpot) {
        // Déplacer la tour
        tower.sprite.x = newSpot.x;
        tower.sprite.y = newSpot.y;
        tower.rangeCircle.x = newSpot.x;
        tower.rangeCircle.y = newSpot.y;
        if (tower.minRangeCircle) {
            tower.minRangeCircle.x = newSpot.x;
            tower.minRangeCircle.y = newSpot.y;
        }
        tower.x = newSpot.x;
        tower.y = newSpot.y;
        
        // Libérer l'ancien emplacement (ne pas rendre visible, hideAllSpots s'en chargera)
        oldSpot.occupied = false;
        oldSpot.tower = null;
        oldSpot.towerId = null;
        
        // Occuper le nouvel emplacement
        newSpot.occupied = true;
        newSpot.tower = tower;
        newSpot.towerId = tower.towerId;
        
        // Reconfigurer les interactions
        this.setupTowerInteractions(tower, newSpot);
        
        this.scene.ui.showMessage('Tour déplacée !', 1500);
    }
    
    /**
     * Désactive le mode sélection
     */
    deactivateTowerSelectionMode() {
        if (this.selectedTower) {
            const { tower } = this.selectedTower;
            
            // Restaurer l'apparence de la tour
            tower.sprite.setAlpha(1);
            tower.rangeCircle.setVisible(false);
        }
        
        this.selectedTower = null;
        
        // Cacher tous les emplacements (invisibles par défaut)
        this.hideAllSpots();
        
        // Retirer l'écouteur global si présent
        if (this.selectionClickHandler) {
            this.scene.input.off('pointerdown', this.selectionClickHandler);
            this.selectionClickHandler = null;
        }
    }
    
    recallTower(tower, spot) {
        // Rappeler la tour dans le menu
        const towerId = tower.towerId;
        const towerData = TOWER_CONFIG[towerId];
        
        // Rembourser le coût
        this.scene.player.gold += towerData.cost;
        
        // Détruire la tour
        tower.destroy();
        
        // Libérer l'emplacement (ne pas rendre visible, hideAllSpots s'en chargera)
        spot.occupied = false;
        spot.tower = null;
        spot.towerId = null;
        
        // Retirer du tableau des tours
        const index = this.scene.towers.indexOf(tower);
        if (index > -1) {
            this.scene.towers.splice(index, 1);
        }
        
        // Marquer comme disponible dans le menu
        if (this.scene.towerMenu) {
            this.scene.towerMenu.markTowerAsAvailable(towerId);
        }
        
        // Message de confirmation
        this.scene.ui.showMessage(`${towerData.name} rappelé(e) ! (+${towerData.cost}💰)`, 1500);
        
        // Mettre à jour l'interface
        const waveInfo = this.scene.waveManager.getWaveInfo();
        this.scene.ui.update(waveInfo);
    }
    
    removeTower(spot) {
        if (!spot.occupied) return;
        
        const tower = spot.tower;
        const towerId = tower ? tower.towerId : null;
        
        // Détruire la tour
        if (tower && tower.destroy) {
            tower.destroy();
        }
        
        // Libérer l'emplacement
        spot.occupied = false;
        spot.tower = null;
        
        // Retirer du tableau des tours
        const index = this.scene.towers.indexOf(tower);
        if (index > -1) {
            this.scene.towers.splice(index, 1);
        }
        
        return towerId;
    }
    
    removeTowerByType(towerId) {
        // Trouver l'emplacement qui contient cette tour
        for (const spot of this.placementSpots) {
            if (spot.occupied && spot.tower && spot.tower.towerId === towerId) {
                this.removeTower(spot);
                return true;
            }
        }
        return false;
    }
    
    /**
     * Retire TOUTES les tours d'un type donné de la map
     * Utilisé quand on déséquipe une tour de la collection
     */
    removeAllTowersOfType(towerId) {
        let removedCount = 0;
        
        // Parcourir tous les emplacements et retirer les tours de ce type
        for (const spot of this.placementSpots) {
            if (spot.occupied && spot.tower && spot.tower.towerId === towerId) {
                this.removeTower(spot);
                removedCount++;
            }
        }
        
        return removedCount;
    }
    
    /**
     * Place une tour à un emplacement spécifique (utilisé pour la restauration de sauvegarde)
     */
    placeTowerAtSpot(spot, towerId) {
        if (!spot || spot.occupied) {
            console.warn(`[TowerPlacement] Impossible de placer ${towerId} - spot invalide ou occupé`);
            return false;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        if (!towerData) {
            console.warn(`[TowerPlacement] Tour inconnue: ${towerId}`);
            return false;
        }
        
        // Créer la tour
        const tower = new Tower(
            this.scene,
            spot.x,
            spot.y,
            towerId,
            towerData
        );
        
        // Marquer l'emplacement comme occupé
        spot.occupied = true;
        spot.tower = tower;
        spot.towerId = towerId;
        spot.circle.setVisible(false);
        
        // Ajouter la tour au tableau des tours
        this.scene.towers.push(tower);
        
        // Marquer la tour comme utilisée dans le menu
        if (this.scene.towerMenu) {
            this.scene.towerMenu.markTowerAsUsed(towerId);
        }
        
        // Configurer les interactions
        this.setupTowerInteractions(tower, spot);
        
        console.log(`[TowerPlacement] Tour ${towerId} placée à l'emplacement (${spot.x}, ${spot.y})`);
        return true;
    }
}

