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
        
        this.createPlacementSpots();
    }
    
    createPlacementSpots() {
        // Configuration de la map
        const MAP_OFFSET_X = 300;
        const MAP_WIDTH = 1100;
        const MAP_HEIGHT = 800;
        
        // Emplacements en pourcentages (selon les croix de l'utilisateur)
        const spotsPercent = [
            // Croix haut-gauche (à gauche de l'arbre orange du haut)
            { x: 0.19, y: 0.37 },
            { x: 0.19, y: 0.44 },
            
            // Croix bas-gauche (près des plantes bleues, sur le sable)
            // { x: 0.145, y: 0.74 },
            
            // Croix bas-centre (entre les arbres orange du bas)
            { x: 0.24, y: 0.82 },
            
            // Croix centre (ponton sud du lac)
            { x: 0.39, y: 0.61 },
            
            // Croix droite du lac (près du ponton est)
            { x: 0.49, y: 0.46 },
            
            // Croix bas-droite (sur la plage près de la mer)
            { x: 0.565, y: 0.75 },
        ];
        
        // Convertir en pixels
        const spots = spotsPercent.map(p => ({
            x: MAP_OFFSET_X + (p.x * MAP_WIDTH),
            y: p.y * MAP_HEIGHT
        }));
        
        spots.forEach((spot, index) => {
            this.createSpot(spot.x, spot.y, index);
        });
    }
    
    createSpot(x, y, id) {
        // Cercle pour indiquer l'emplacement (semi-transparent pour voir la map)
        const spotCircle = this.scene.add.circle(x, y, 18, 0xffffff, 0.3);
        spotCircle.setStrokeStyle(3, 0xffd700, 0.7); // Bordure dorée
        spotCircle.setInteractive({ useHandCursor: true });
        spotCircle.setDepth(8); // Au-dessus de la map
        
        // Icône pirate au centre
        const icon = this.scene.add.text(x, y, '⚓', {
            fontSize: '18px',
            fill: '#ffd700'
        });
        icon.setOrigin(0.5);
        icon.setDepth(9);
        
        const spot = {
            id: id,
            x: x,
            y: y,
            circle: spotCircle,
            icon: icon,
            occupied: false,
            tower: null,
            towerId: null
        };
        
        // Événements pour le placement (pendant le drag ou mode clic)
        spotCircle.on('pointerover', () => {
            if (!spot.occupied && (this.isDragging || this.clickPlacementMode)) {
                spotCircle.setFillStyle(0x00ff00, 0.6);
                spotCircle.setStrokeStyle(4, 0x00ff00, 1);
                icon.setColor('#00ff00');
            }
        });
        
        spotCircle.on('pointerout', () => {
            if (!spot.occupied) {
                spotCircle.setFillStyle(0xffffff, 0.3);
                spotCircle.setStrokeStyle(3, 0xffd700, 0.7);
                icon.setColor('#ffd700');
            }
        });
        
        // Clic sur un emplacement pour placer (mode clic)
        spotCircle.on('pointerdown', () => {
            if (!spot.occupied && this.clickPlacementMode && this.clickPlacementTowerId) {
                this.tryPlaceTower(this.clickPlacementTowerId, spot.x, spot.y);
                this.deactivateClickPlacement();
            }
        });
        
        this.placementSpots.push(spot);
    }
    
    selectTowerType(type) {
        this.selectedTowerType = type;
    }
    
    startDragging(type) {
        this.isDragging = true;
        this.selectedTowerType = type;
    }
    
    activateClickPlacement(towerId) {
        // Activer le mode placement au clic
        this.clickPlacementMode = true;
        this.clickPlacementTowerId = towerId;
        
        // Mettre en évidence les emplacements disponibles
        this.placementSpots.forEach(spot => {
            if (!spot.occupied) {
                spot.circle.setStrokeStyle(4, 0x00ff00, 0.9);
                spot.circle.setFillStyle(0x00ff00, 0.2);
            }
        });
    }
    
    deactivateClickPlacement() {
        // Désactiver le mode placement au clic
        this.clickPlacementMode = false;
        this.clickPlacementTowerId = null;
        
        // Restaurer l'apparence des emplacements
        this.placementSpots.forEach(spot => {
            if (!spot.occupied) {
                spot.circle.setStrokeStyle(3, 0xffd700, 0.7);
                spot.circle.setFillStyle(0xffffff, 0.3);
            }
        });
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
        const spot = this.findNearestSpot(x, y, 30);
        
        if (!spot || spot.occupied) {
            this.isDragging = false;
            this.selectedTowerType = null;
            return false;
        }
        
        const towerData = TOWER_CONFIG[towerId];
        
        // Les tours ne coûtent pas d'or lors de la pose
        // Elles sont déjà achetées/débloquées dans la boutique
        
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
        spot.towerId = towerId; // Stocker l'ID pour référence
        spot.circle.setVisible(false);
        spot.icon.setVisible(false);
        
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
        
        // Rendre le sprite de la tour draggable
        tower.sprite.setInteractive({ draggable: true, useHandCursor: true });
        this.scene.input.setDraggable(tower.sprite);
        
        // Variable pour tracker si on est en train de drag
        let isDragging = false;
        let dragStartTime = 0;
        
        // Drag start : commencer le déplacement
        tower.sprite.on('dragstart', (pointer) => {
            isDragging = true;
            dragStartTime = Date.now();
            this.draggedTower = { tower, originalSpot: spot };
            tower.sprite.setAlpha(0.7);
            tower.rangeCircle.setAlpha(0.5);
            tower.rangeCircle.setVisible(true);
            
            // Désactiver la tour pendant le drag
            tower.isBeingDragged = true;
            
            // Libérer temporairement l'emplacement
            spot.occupied = false;
            spot.circle.setVisible(true);
            spot.icon.setVisible(true);
        });
        
        // Drag : suivre la souris
        tower.sprite.on('drag', (pointer, dragX, dragY) => {
            tower.sprite.x = dragX;
            tower.sprite.y = dragY;
            tower.rangeCircle.x = dragX;
            tower.rangeCircle.y = dragY;
            
            // Vérifier si on est sur un emplacement valide
            const nearestSpot = this.findNearestSpot(dragX, dragY, 50);
            if (nearestSpot && !nearestSpot.occupied) {
                nearestSpot.circle.setFillStyle(0x00ff00, 0.6);
                nearestSpot.circle.setStrokeStyle(4, 0x00ff00, 1);
            }
        });
        
        // Drag end : placer ou remettre à l'emplacement d'origine
        tower.sprite.on('dragend', (pointer) => {
            isDragging = false;
            const nearestSpot = this.findNearestSpot(pointer.x, pointer.y, 50);
            
            if (nearestSpot && !nearestSpot.occupied) {
                // Placer sur le nouvel emplacement
                tower.sprite.x = nearestSpot.x;
                tower.sprite.y = nearestSpot.y;
                tower.rangeCircle.x = nearestSpot.x;
                tower.rangeCircle.y = nearestSpot.y;
                tower.x = nearestSpot.x;
                tower.y = nearestSpot.y;
                
                // Libérer l'ancien emplacement
                spot.occupied = false;
                spot.tower = null;
                
                // Occuper le nouvel emplacement
                nearestSpot.occupied = true;
                nearestSpot.tower = tower;
                nearestSpot.towerId = tower.towerId;
                nearestSpot.circle.setVisible(false);
                nearestSpot.icon.setVisible(false);
                
                // Reconfigurer les événements avec le nouveau spot
                this.setupTowerInteractions(tower, nearestSpot);
                
                this.scene.ui.showMessage('Tour déplacée !', 1500);
            } else {
                // Remettre à l'emplacement d'origine
                tower.sprite.x = spot.x;
                tower.sprite.y = spot.y;
                tower.rangeCircle.x = spot.x;
                tower.rangeCircle.y = spot.y;
                spot.occupied = true;
                spot.circle.setVisible(false);
                spot.icon.setVisible(false);
            }
            
            // Restaurer l'apparence et réactiver la tour
            tower.sprite.setAlpha(1);
            tower.rangeCircle.setAlpha(0);
            tower.rangeCircle.setVisible(false);
            tower.isBeingDragged = false;
            this.draggedTower = null;
            
            // Restaurer tous les emplacements
            this.placementSpots.forEach(s => {
                if (!s.occupied) {
                    s.circle.setFillStyle(0xffffff, 0.3);
                    s.circle.setStrokeStyle(3, 0xffd700, 0.7);
                }
            });
        });
        
        // Clic simple : rappeler la tour
        tower.sprite.on('pointerup', (pointer) => {
            const clickDuration = Date.now() - dragStartTime;
            
            // Si c'est un clic rapide (< 200ms) et qu'on n'a pas draggé
            if (!isDragging && clickDuration < 200 && !pointer.wasMoved) {
                this.recallTower(tower, spot);
            }
        });
        
        // Réactiver les événements de survol pour les stats
        tower.sprite.on('pointerover', () => {
            if (!isDragging) {
                tower.rangeCircle.setFillStyle(tower.color, 0.1);
                tower.rangeCircle.setStrokeStyle(2, tower.color, 0.4);
                tower.rangeCircle.setVisible(true);
                tower.showStats();
            }
        });
        
        tower.sprite.on('pointerout', () => {
            if (!isDragging) {
                tower.rangeCircle.setFillStyle(tower.color, 0);
                tower.rangeCircle.setStrokeStyle(2, tower.color, 0);
                tower.rangeCircle.setVisible(false);
                tower.hideStats();
            }
        });
    }
    
    recallTower(tower, spot) {
        // Rappeler la tour dans le menu
        const towerId = tower.towerId;
        const towerData = TOWER_CONFIG[towerId];
        
        // Rembourser le coût
        this.scene.player.gold += towerData.cost;
        
        // Détruire la tour
        tower.destroy();
        
        // Libérer l'emplacement
        spot.occupied = false;
        spot.tower = null;
        spot.towerId = null;
        spot.circle.setVisible(true);
        spot.icon.setVisible(true);
        
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
        spot.circle.setVisible(true);
        spot.icon.setVisible(true);
        
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
        spot.icon.setVisible(false);
        
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

