/**
 * Modal du profil joueur - Style moderne One Piece
 */
class ProfileModal extends BaseModal {
    constructor(scene, topMenu, player) {
        super(scene, topMenu, '👤 PROFIL CAPITAINE', 750, 600);
        this.player = player;
        this.createContent();
    }
    
    createContent() {
        const startY = this.contentY + 10;
        
        // Carte du profil (section supérieure)
        const profileCard = this.createCard(this.x, startY + 80, this.width - 60, 140, true);
        
        // Avatar avec effet de lueur
        const avatarGlow = this.scene.add.circle(this.x - 200, startY + 80, 55, this.colors.accent, 0.2);
        avatarGlow.setDepth(2002);
        this.addElement(avatarGlow);
        
        const avatarBg = this.scene.add.circle(this.x - 200, startY + 80, 50, this.colors.secondary, 1);
        avatarBg.setDepth(2003);
        avatarBg.setStrokeStyle(3, this.colors.accent, 1);
        this.addElement(avatarBg);
        
        // Image Luffy ou icône
        if (this.scene.textures.exists('luffy')) {
            const avatar = this.scene.add.sprite(this.x - 200, startY + 80, 'luffy');
            avatar.setDisplaySize(70, 70);
            avatar.setDepth(2004);
            if (this.scene.anims.exists('luffy_idle')) {
                avatar.play('luffy_idle');
            }
        this.addElement(avatar);
        } else {
            const icon = this.scene.add.text(this.x - 200, startY + 80, '🏴‍☠️', { fontSize: '50px' });
        icon.setOrigin(0.5);
            icon.setDepth(2004);
        this.addElement(icon);
        }
        
        // Infos du joueur
        const nameLabel = this.scene.add.text(
            this.x - 100, startY + 50,
            'CAPITAINE',
            {
                fontSize: '12px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#8892a0',
                letterSpacing: 2
            }
        );
        nameLabel.setDepth(2003);
        this.addElement(nameLabel);
        
        const name = this.scene.add.text(
            this.x - 100, startY + 70,
            'MONKEY D. LUFFY',
            {
                fontSize: '22px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#d4af37',
                fontStyle: 'bold'
            }
        );
        name.setDepth(2003);
        this.addElement(name);
        
        // Étoiles globales
        const starsBox = this.scene.add.rectangle(this.x + 180, startY + 70, 120, 40, this.colors.secondary, 0.9);
        starsBox.setDepth(2003);
        starsBox.setStrokeStyle(2, this.colors.accent, 0.6);
        this.addElement(starsBox);
        
        const starsText = this.scene.add.text(
            this.x + 180, startY + 70,
            `⭐ ${this.player.collection.getStars()}`,
            {
                fontSize: '20px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#ffd700',
                fontStyle: 'bold'
            }
        );
        starsText.setOrigin(0.5);
        starsText.setDepth(2004);
        this.addElement(starsText);
        
        // Barre de progression collection
        const unlockedCount = this.player.collection.getUnlockedTowers().length;
        const totalCount = TOWER_ORDER.length;
        const progress = unlockedCount / totalCount;
        
        const progressLabel = this.scene.add.text(
            this.x - 100, startY + 105,
            `Collection: ${unlockedCount}/${totalCount}`,
            {
                fontSize: '14px',
                fontFamily: "'Segoe UI', Arial, sans-serif",
                color: '#b0b0b0'
            }
        );
        progressLabel.setDepth(2003);
        this.addElement(progressLabel);
        
        const progressBg = this.scene.add.rectangle(this.x + 50, startY + 110, 200, 12, 0x2a2a3a, 1);
        progressBg.setDepth(2003);
        this.addElement(progressBg);
        
        const progressBar = this.scene.add.rectangle(
            this.x + 50 - 100 + (200 * progress / 2), startY + 110,
            200 * progress, 12,
            this.colors.success, 1
        );
        progressBar.setDepth(2004);
        this.addElement(progressBar);
        
        // Section Statistiques
        const statsY = this.createSection(startY + 155, 'STATISTIQUES', '📊');
        
        const stats = this.player.collection.getStats();
        const hours = Math.floor(stats.playTime / 3600);
        const minutes = Math.floor((stats.playTime % 3600) / 60);
        const playTimeStr = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
        
        const statsData = [
            { icon: '⏱️', label: 'Temps de jeu', value: playTimeStr, color: '#74b9ff' },
            { icon: '☠️', label: 'Ennemis éliminés', value: stats.enemiesKilled.toLocaleString(), color: '#e74c3c' },
            { icon: '🌊', label: 'Vagues complétées', value: stats.wavesCompleted, color: '#0891b2' },
            { icon: '💰', label: 'Or total gagné', value: stats.goldEarned.toLocaleString(), color: '#ffd700' },
            { icon: '💥', label: 'Dégâts infligés', value: Math.round(stats.damageDealt).toLocaleString(), color: '#ff6b6b' },
            { icon: '🏗️', label: 'Tours placées', value: stats.towersPlaced, color: '#2ecc71' }
        ];
        
        const gridStartY = statsY + 15;
        const colWidth = (this.width - 100) / 2;
        
        statsData.forEach((stat, index) => {
            const col = index % 2;
            const row = Math.floor(index / 2);
            const x = this.x - this.width / 2 + 70 + col * colWidth;
            const y = gridStartY + row * 55;
            
            // Carte de stat
            const statCard = this.scene.add.rectangle(
                x + colWidth / 2 - 20, y + 20,
                colWidth - 30, 45,
                this.colors.secondary, 0.7
            );
            statCard.setDepth(2002);
            this.addElement(statCard);
            
            // Icône
            const iconText = this.scene.add.text(x, y + 20, stat.icon, { fontSize: '22px' });
            iconText.setOrigin(0, 0.5);
            iconText.setDepth(2003);
            this.addElement(iconText);
            
            // Label
            const label = this.scene.add.text(
                x + 35, y + 10,
                stat.label,
                {
                    fontSize: '12px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: '#8892a0'
                }
            );
            label.setDepth(2003);
            this.addElement(label);
            
            // Valeur
            const value = this.scene.add.text(
                x + 35, y + 28,
                stat.value.toString(),
                {
                    fontSize: '18px',
                    fontFamily: "'Segoe UI', Arial, sans-serif",
                    color: stat.color,
                    fontStyle: 'bold'
                }
            );
            value.setDepth(2003);
            this.addElement(value);
        });
    }
}
