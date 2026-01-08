/**
 * Modal des maps disponibles
 */
class MapsModal extends BaseModal {
    constructor(scene, topMenu) {
        super(scene, topMenu, '🗺️ MAPS DISPONIBLES', 900, 600);
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 40;
        
        // Liste des maps (pour l'instant juste une)
        const maps = [
            {
                id: 'arlong_park',
                name: 'Arlong Park',
                difficulty: 'Normal',
                description: 'Le parc d\'Arlong, premier défi de l\'équipage',
                locked: false
            },
            {
                id: 'baratie',
                name: 'Baratie',
                difficulty: 'Difficile',
                description: 'Le restaurant flottant',
                locked: true
            },
            {
                id: 'alabasta',
                name: 'Alabasta',
                difficulty: 'Expert',
                description: 'Le désert d\'Alabasta',
                locked: true
            }
        ];
        
        maps.forEach((map, index) => {
            const y = startY + index * 140;
            
            // Carte
            const card = this.scene.add.rectangle(
                this.x, y + 60,
                this.width - 80, 120,
                map.locked ? 0x0a0a0a : 0x16213e,
                map.locked ? 0.5 : 0.9
            );
            card.setDepth(2002);
            card.setStrokeStyle(2, map.locked ? 0x333333 : 0x3d5a80, 0.8);
            this.addElement(card);
            
            if (map.locked) {
                // Cadenas
                const lock = this.scene.add.text(
                    this.x - this.width / 2 + 100, y + 60,
                    '🔒',
                    { fontSize: '48px' }
                );
                lock.setOrigin(0.5);
                lock.setDepth(2003);
                this.addElement(lock);
            }
            
            // Nom
            const name = this.scene.add.text(
                this.x - this.width / 2 + 200, y + 30,
                map.name,
                {
                    fontSize: '24px',
                    fontFamily: 'Arial',
                    color: map.locked ? '#666666' : '#ffd700',
                    fontStyle: 'bold'
                }
            );
            name.setDepth(2003);
            this.addElement(name);
            
            // Difficulté
            const difficultyColors = {
                'Normal': '#51cf66',
                'Difficile': '#ffa94d',
                'Expert': '#ff6b6b'
            };
            
            const difficulty = this.scene.add.text(
                this.x - this.width / 2 + 200, y + 60,
                `Difficulté: ${map.difficulty}`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: map.locked ? '#666666' : difficultyColors[map.difficulty]
                }
            );
            difficulty.setDepth(2003);
            this.addElement(difficulty);
            
            // Description
            const desc = this.scene.add.text(
                this.x - this.width / 2 + 200, y + 85,
                map.description,
                {
                    fontSize: '14px',
                    fontFamily: 'Arial',
                    color: map.locked ? '#444444' : '#cccccc'
                }
            );
            desc.setDepth(2003);
            this.addElement(desc);
            
            if (!map.locked && map.id !== 'arlong_park') {
                // Bouton Jouer (seulement si débloqué et pas la map actuelle)
                const playBtn = this.scene.add.rectangle(
                    this.x + this.width / 2 - 120, y + 60,
                    150, 40,
                    0x51cf66, 0.9
                );
                playBtn.setDepth(2002);
                playBtn.setStrokeStyle(2, 0xffffff, 0.5);
                playBtn.setInteractive({ useHandCursor: true });
                this.addElement(playBtn);
                
                const playText = this.scene.add.text(
                    this.x + this.width / 2 - 120, y + 60,
                    'JOUER',
                    {
                        fontSize: '16px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }
                );
                playText.setOrigin(0.5);
                playText.setDepth(2003);
                this.addElement(playText);
                
                playBtn.on('pointerover', () => playBtn.setFillStyle(0x69db7c, 0.9));
                playBtn.on('pointerout', () => playBtn.setFillStyle(0x51cf66, 0.9));
                playBtn.on('pointerdown', () => {
                    // TODO: Charger la map sélectionnée
                    console.log('Charger map:', map.id);
                });
            } else if (map.id === 'arlong_park') {
                // Map actuelle
                const current = this.scene.add.text(
                    this.x + this.width / 2 - 120, y + 60,
                    '▶ EN COURS',
                    {
                        fontSize: '16px',
                        fontFamily: 'Arial',
                        color: '#ffd700',
                        fontStyle: 'bold'
                    }
                );
                current.setOrigin(0.5);
                current.setDepth(2003);
                this.addElement(current);
            }
        });
    }
}

