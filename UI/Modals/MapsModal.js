/**
 * Modal des maps - Style moderne One Piece
 */
class MapsModal extends BaseModal {
    constructor(scene, topMenu) {
        super(scene, topMenu, '🗺️ SÉLECTION DE MAP', 850, 580);
        this.createContent();
    }
    
    isMapUnlocked(mapId) {
        const unlockedMaps = this.scene.player.collection.unlockedMaps || ['arlong_park'];
        return unlockedMaps.includes(mapId);
    }
    
    unlockMap(mapId, cost) {
        const collection = this.scene.player.collection;
        const globalStars = collection.getStars();
        
        if (globalStars < cost) {
            this.scene.ui.showMessage('Pas assez d\'étoiles !', 1500);
            return false;
        }
        
        collection.spendStars(cost);
        
        if (!collection.unlockedMaps) {
            collection.unlockedMaps = ['arlong_park'];
        }
        collection.unlockedMaps.push(mapId);
        collection.save();
        
        this.scene.ui.showMessage('🎉 Map débloquée !', 1500);
        
        this.topMenu.closeModal();
        this.topMenu.openModal('maps');
        
        return true;
    }
    
    createContent() {
        const startY = this.contentY;
        const globalStars = this.scene.player.collection.getStars();
        
        // Barre d'étoiles
        const starsBar = this.createCard(this.x, startY + 20, 200, 40, true);
        
        const starsText = this.scene.add.text(
            this.x, startY + 20,
            `⭐ ${globalStars} étoiles`,
            {
                fontSize: '18px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        starsText.setOrigin(0.5);
        starsText.setDepth(2003);
        this.addElement(starsText);
        
        // Liste des maps
        const maps = [
            {
                id: 'arlong_park',
                name: 'Arlong Park',
                difficulty: 'Normal',
                description: 'Le repaire d\'Arlong et son équipage',
                starsCost: 0,
                color: 0x3498db,
                icon: '🏝️'
            },
            {
                id: 'baratie',
                name: 'Baratie',
                difficulty: 'Difficile',
                description: 'Le restaurant flottant de Zeff',
                starsCost: 15,
                color: 0xf39c12,
                icon: '🚢'
            },
            {
                id: 'alabasta',
                name: 'Alabasta',
                difficulty: 'Expert',
                description: 'Le royaume du désert',
                starsCost: 30,
                color: 0xe74c3c,
                icon: '🏜️'
            }
        ];
        
        const cardHeight = 120;
        const cardSpacing = 15;
        const cardWidth = this.width - 80;
        
        maps.forEach((map, index) => {
            const y = startY + 70 + index * (cardHeight + cardSpacing);
            const isUnlocked = this.isMapUnlocked(map.id);
            const canUnlock = globalStars >= map.starsCost;
            const isCurrent = map.id === 'arlong_park';
            
            // Carte de la map
            const card = this.scene.add.rectangle(
                this.x, y + cardHeight / 2,
                cardWidth, cardHeight,
                isUnlocked ? this.colors.secondary : 0x0a0a0a,
                isUnlocked ? 0.95 : 0.7
            );
            card.setDepth(2002);
            card.setStrokeStyle(2, isUnlocked ? map.color : 0x333333, isUnlocked ? 0.8 : 0.5);
            this.addElement(card);
            
            // Icône de la map
            const iconBg = this.scene.add.circle(
                this.x - cardWidth / 2 + 60, y + cardHeight / 2,
                35,
                isUnlocked ? map.color : 0x222222,
                isUnlocked ? 0.3 : 0.5
            );
            iconBg.setDepth(2003);
            iconBg.setStrokeStyle(2, isUnlocked ? map.color : 0x444444, 0.6);
            this.addElement(iconBg);
            
            const iconText = this.scene.add.text(
                this.x - cardWidth / 2 + 60, y + cardHeight / 2,
                isUnlocked ? map.icon : '🔒',
                { fontSize: '32px' }
                );
            iconText.setOrigin(0.5);
            iconText.setDepth(2004);
            this.addElement(iconText);
            
            // Nom de la map
            const name = this.scene.add.text(
                this.x - cardWidth / 2 + 120, y + 25,
                map.name,
                {
                    fontSize: '22px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: isUnlocked ? '#ffffff' : '#555555',
                    fontStyle: 'bold'
                }
            );
            name.setDepth(2003);
            this.addElement(name);
            
            // Difficulté
            const difficultyColors = {
                'Normal': '#2ecc71',
                'Difficile': '#f39c12',
                'Expert': '#e74c3c'
            };
            
            const diffBadge = this.scene.add.rectangle(
                this.x - cardWidth / 2 + 180, y + 55,
                80, 22,
                Phaser.Display.Color.HexStringToColor(difficultyColors[map.difficulty]).color,
                isUnlocked ? 0.3 : 0.1
            );
            diffBadge.setDepth(2003);
            this.addElement(diffBadge);
            
            const difficulty = this.scene.add.text(
                this.x - cardWidth / 2 + 180, y + 55,
                map.difficulty,
                {
                    fontSize: '12px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: isUnlocked ? difficultyColors[map.difficulty] : '#444444',
                    fontStyle: 'bold'
                }
            );
            difficulty.setOrigin(0.5);
            difficulty.setDepth(2004);
            this.addElement(difficulty);
            
            // Description
            const desc = this.scene.add.text(
                this.x - cardWidth / 2 + 120, y + 80,
                map.description,
                {
                    fontSize: '13px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: isUnlocked ? '#8892a0' : '#444444'
                }
            );
            desc.setDepth(2003);
            this.addElement(desc);
            
            // Bouton d'action (à droite)
            const btnX = this.x + cardWidth / 2 - 90;
            const btnY = y + cardHeight / 2;
            
            if (isCurrent) {
                // Map actuelle
                const currentBadge = this.scene.add.rectangle(btnX, btnY, 140, 40, map.color, 0.3);
                currentBadge.setDepth(2003);
                currentBadge.setStrokeStyle(2, map.color, 0.6);
                this.addElement(currentBadge);
                
                const currentText = this.scene.add.text(btnX, btnY, '▶ EN COURS', {
                    fontSize: '14px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#ffffff',
                    fontStyle: 'bold'
                });
                currentText.setOrigin(0.5);
                currentText.setDepth(2004);
                this.addElement(currentText);
            } else if (isUnlocked) {
                // Bouton Jouer
                const playBtn = this.scene.add.rectangle(btnX, btnY, 140, 40, this.colors.success, 0.9);
                playBtn.setDepth(2003);
                playBtn.setStrokeStyle(2, 0x27ae60, 0.6);
                playBtn.setInteractive({ useHandCursor: true });
                this.addElement(playBtn);
                
                const playText = this.scene.add.text(btnX, btnY, '▶ JOUER', {
                    fontSize: '15px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                        color: '#ffffff',
                        fontStyle: 'bold'
                });
                playText.setOrigin(0.5);
                playText.setDepth(2004);
                this.addElement(playText);
                
                playBtn.on('pointerover', () => playBtn.setFillStyle(0x27ae60, 1));
                playBtn.on('pointerout', () => playBtn.setFillStyle(this.colors.success, 0.9));
                playBtn.on('pointerdown', () => {
                    console.log('Charger map:', map.id);
                    this.scene.ui.showMessage('Map en cours de développement...', 2000);
                });
            } else {
                // Bouton Débloquer
                const unlockBtn = this.scene.add.rectangle(
                    btnX, btnY, 140, 40,
                    canUnlock ? this.colors.accent : 0x444444, 0.9
                );
                unlockBtn.setDepth(2003);
                unlockBtn.setStrokeStyle(2, canUnlock ? 0xffd700 : 0x555555, 0.6);
                this.addElement(unlockBtn);
                
                const unlockText = this.scene.add.text(
                    btnX, btnY,
                    `⭐ ${map.starsCost}`,
                    {
                        fontSize: '15px',
                        fontFamily: "'Segoe UI', Arial, sans-serif",
                        color: canUnlock ? '#1a1a2e' : '#666666',
                        fontStyle: 'bold'
                    }
                );
                unlockText.setOrigin(0.5);
                unlockText.setDepth(2004);
                this.addElement(unlockText);
                
                if (canUnlock) {
                    unlockBtn.setInteractive({ useHandCursor: true });
                    unlockBtn.on('pointerover', () => unlockBtn.setFillStyle(0xffd700, 1));
                    unlockBtn.on('pointerout', () => unlockBtn.setFillStyle(this.colors.accent, 0.9));
                    unlockBtn.on('pointerdown', () => this.unlockMap(map.id, map.starsCost));
                }
            }
        });
    }
}
