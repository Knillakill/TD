/**
 * Modal du profil joueur avec ses statistiques
 */
class ProfileModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '👤 PROFIL JOUEUR', 800, 600);
        this.player = player;
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 20;
        
        // Avatar (grand cercle)
        const avatar = this.scene.add.circle(
            this.x, startY + 80,
            70,
            0x3d5a80, 1
        );
        avatar.setDepth(2002);
        avatar.setStrokeStyle(5, 0xffd700, 1);
        this.addElement(avatar);
        
        // Icône joueur
        const icon = this.scene.add.text(
            this.x, startY + 80,
            '👤',
            { fontSize: '80px' }
        );
        icon.setOrigin(0.5);
        icon.setDepth(2003);
        this.addElement(icon);
        
        // Nom du joueur
        const name = this.scene.add.text(
            this.x, startY + 170,
            'Capitaine',
            {
                fontSize: '28px',
                fontFamily: 'Arial',
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        name.setOrigin(0.5);
        name.setDepth(2002);
        this.addElement(name);
        
        // Statistiques
        const stats = this.player.collection.getStats();
        
        // Convertir le temps de jeu en format lisible
        const hours = Math.floor(stats.playTime / 3600);
        const minutes = Math.floor((stats.playTime % 3600) / 60);
        const playTimeStr = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
        
        const statsData = [
            { icon: '⏱️', label: 'Temps de jeu', value: playTimeStr },
            { icon: '🏗️', label: 'Tours placées', value: stats.towersPlaced },
            { icon: '☠️', label: 'Ennemis éliminés', value: stats.enemiesKilled },
            { icon: '🌊', label: 'Vagues complétées', value: stats.wavesCompleted },
            { icon: '💰', label: 'Or gagné', value: stats.goldEarned },
            { icon: '🛒', label: 'Or dépensé', value: stats.goldSpent },
            { icon: '💥', label: 'Dégâts infligés', value: Math.round(stats.damageDealt) },
            { icon: '⭐', label: 'Étoiles', value: this.player.stars }
        ];
        
        const statsStartY = startY + 220;
        const col1X = this.x - 180;
        const col2X = this.x + 180;
        const rowHeight = 45;
        
        statsData.forEach((stat, index) => {
            const isLeftColumn = index % 2 === 0;
            const x = isLeftColumn ? col1X : col2X;
            const y = statsStartY + Math.floor(index / 2) * rowHeight;
            
            // Label
            const label = this.scene.add.text(
                x - 60, y,
                `${stat.icon} ${stat.label}:`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#e0e0e0'
                }
            );
            label.setDepth(2002);
            this.addElement(label);
            
            // Valeur
            const value = this.scene.add.text(
                x + 120, y,
                stat.value.toString(),
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#ffd700',
                    fontStyle: 'bold'
                }
            );
            value.setOrigin(1, 0);
            value.setDepth(2002);
            this.addElement(value);
        });
        
        // Collection
        const unlockedCount = this.player.collection.getUnlockedTowers().length;
        const totalCount = TOWER_ORDER.length;
        
        const collectionText = this.scene.add.text(
            this.x, statsStartY + Math.ceil(statsData.length / 2) * rowHeight + 20,
            `📖 Collection: ${unlockedCount}/${totalCount} tours débloquées`,
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#51cf66',
                fontStyle: 'bold'
            }
        );
        collectionText.setOrigin(0.5);
        collectionText.setDepth(2002);
        this.addElement(collectionText);
        
        // Barre de progression
        const progressBarY = statsStartY + Math.ceil(statsData.length / 2) * rowHeight + 55;
        const progressBarWidth = 400;
        const progress = unlockedCount / totalCount;
        
        // Fond
        const progressBg = this.scene.add.rectangle(
            this.x, progressBarY,
            progressBarWidth, 20,
            0x333333, 1
        );
        progressBg.setDepth(2002);
        this.addElement(progressBg);
        
        // Progression
        const progressBar = this.scene.add.rectangle(
            this.x - progressBarWidth / 2 + (progressBarWidth * progress / 2), progressBarY,
            progressBarWidth * progress, 20,
            0x51cf66, 1
        );
        progressBar.setDepth(2003);
        this.addElement(progressBar);
        
        // Pourcentage
        const percentage = this.scene.add.text(
            this.x, progressBarY,
            Math.round(progress * 100) + '%',
            {
                fontSize: '14px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        percentage.setOrigin(0.5);
        percentage.setDepth(2004);
        this.addElement(percentage);
    }
}

