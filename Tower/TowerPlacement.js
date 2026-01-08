class TowerPlacement {
    constructor(scene) {
        this.scene = scene;
        this.selectedTowerType = null;
        this.placementSpots = [];
        this.previewTower = null;
        this.isDragging = false;
        
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
            
            // Croix bas-gauche (près des plantes bleues, sur le sable)
            { x: 0.145, y: 0.74 },
            
            // Croix bas-centre (entre les arbres orange du bas)
            { x: 0.24, y: 0.70 },
            
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
        
        // Événements pour le placement (pendant le drag)
        spotCircle.on('pointerover', () => {
            if (!spot.occupied && this.isDragging) {
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
        
        this.placementSpots.push(spot);
    }
    
    selectTowerType(type) {
        this.selectedTowerType = type;
    }
    
    startDragging(type) {
        this.isDragging = true;
        this.selectedTowerType = type;
    }
    
    checkValidPlacement(x, y) {
        // Vérifier si on est proche d'un emplacement disponible
        const spot = this.findNearestSpot(x, y, 30); // 30 pixels de tolérance
        return spot && !spot.occupied;
    }
    
    findNearestSpot(x, y, maxDistance = 30) {
        let nearestSpot = null;
        let minDist = maxDistance;
        
        this.placementSpots.forEach(spot => {
            if (spot.occupied) return;
            
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
        
        // Vérifier si le joueur a assez d'argent
        if (this.scene.player.gold < towerData.cost) {
            this.scene.ui.showMessage('Pas assez d\'or!', 1500);
            this.isDragging = false;
            this.selectedTowerType = null;
            return false;
        }
        
        // Déduire le coût
        this.scene.player.gold -= towerData.cost;
        
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
    
    
    removeTower(spot) {
        if (!spot.occupied) return;
        
        // Détruire la tour
        if (spot.tower && spot.tower.destroy) {
            spot.tower.destroy();
        }
        
        // Libérer l'emplacement
        spot.occupied = false;
        spot.tower = null;
        spot.circle.setVisible(true);
        spot.icon.setVisible(true);
        
        // Retirer du tableau des tours
        const index = this.scene.towers.indexOf(spot.tower);
        if (index > -1) {
            this.scene.towers.splice(index, 1);
        }
    }
}

