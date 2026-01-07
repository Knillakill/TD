class EnemyInfoPanel {
    constructor(scene) {
        this.scene = scene;
        
        // Position du panneau (GAUCHE de l'écran)
        const panelX = 10;
        const panelY = 20;
        const panelWidth = 280;
        const panelHeight = 760;
        
        // Fond du panneau
        this.background = scene.add.rectangle(
            panelX,
            panelY,
            panelWidth,
            panelHeight,
            0x1a1a1a,
            0.9
        );
        this.background.setOrigin(0, 0);
        this.background.setDepth(100);
        this.background.setScrollFactor(0);
        
        // Titre
        this.title = scene.add.text(
            panelX + panelWidth / 2,
            panelY + 15,
            '🏴‍☠️ ENNEMIS 🏴‍☠️',
            {
                fontSize: '14px',
                fill: '#ffd700',
                fontStyle: 'bold'
            }
        );
        this.title.setOrigin(0.5);
        this.title.setDepth(101);
        this.title.setScrollFactor(0);
        
        // Créer les cartes d'ennemis
        this.createEnemyCards(panelX + 10, panelY + 40);
    }
    
    createEnemyCards(startX, startY) {
        const enemyTypes = ['pirate_basic', 'pirate_shield', 'pirate_fast'];
        const cardWidth = 260;
        const cardHeight = 85;
        const spacing = 15;
        
        enemyTypes.forEach((type, index) => {
            const config = ENEMY_CONFIG[type];
            const yPos = startY + index * (cardHeight + spacing);
            
            // Fond de la carte
            const cardBg = this.scene.add.rectangle(
                startX,
                yPos,
                cardWidth,
                cardHeight,
                0x2a2a2a,
                0.8
            );
            cardBg.setOrigin(0, 0);
            cardBg.setDepth(101);
            cardBg.setScrollFactor(0);
            
            // Bordure colorée
            const border = this.scene.add.rectangle(
                startX,
                yPos,
                cardWidth,
                cardHeight,
                0x000000,
                0
            );
            border.setOrigin(0, 0);
            border.setStrokeStyle(2, config.color, 0.8);
            border.setDepth(101);
            border.setScrollFactor(0);
            
            // Icône de l'ennemi
            const icon = this.scene.add.circle(
                startX + 25,
                yPos + cardHeight / 2,
                config.size,
                config.color
            );
            icon.setDepth(102);
            icon.setScrollFactor(0);
            
            // Nom
            const name = this.scene.add.text(
                startX + 50,
                yPos + 10,
                config.name,
                {
                    fontSize: '13px',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }
            );
            name.setDepth(102);
            name.setScrollFactor(0);
            
            // Stats (3 colonnes)
            const statsY = yPos + 30;
            
            // HP
            const hpIcon = this.scene.add.text(
                startX + 50,
                statsY,
                '❤️',
                { fontSize: '12px' }
            );
            hpIcon.setDepth(102);
            hpIcon.setScrollFactor(0);
            
            const hpText = this.scene.add.text(
                startX + 68,
                statsY,
                `${config.hp}`,
                {
                    fontSize: '12px',
                    fill: '#ff6b6b'
                }
            );
            hpText.setDepth(102);
            hpText.setScrollFactor(0);
            
            // Vitesse
            const speedIcon = this.scene.add.text(
                startX + 105,
                statsY,
                '⚡',
                { fontSize: '12px' }
            );
            speedIcon.setDepth(102);
            speedIcon.setScrollFactor(0);
            
            const speedText = this.scene.add.text(
                startX + 123,
                statsY,
                `${config.speed}`,
                {
                    fontSize: '12px',
                    fill: '#4ecdc4'
                }
            );
            speedText.setDepth(102);
            speedText.setScrollFactor(0);
            
            // Récompense
            const rewardIcon = this.scene.add.text(
                startX + 160,
                statsY,
                '💰',
                { fontSize: '12px' }
            );
            rewardIcon.setDepth(102);
            rewardIcon.setScrollFactor(0);
            
            const rewardText = this.scene.add.text(
                startX + 178,
                statsY,
                `+${config.reward}`,
                {
                    fontSize: '12px',
                    fill: '#f1c40f'
                }
            );
            rewardText.setDepth(102);
            rewardText.setScrollFactor(0);
            
            // Description
            const desc = this.scene.add.text(
                startX + 50,
                statsY + 20,
                config.description,
                {
                    fontSize: '10px',
                    fill: '#95a5a6',
                    wordWrap: { width: 170 }
                }
            );
            desc.setDepth(102);
            desc.setScrollFactor(0);
        });
    }
}

