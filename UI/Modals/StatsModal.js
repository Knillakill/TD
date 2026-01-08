/**
 * Modal des statistiques de dommages en temps réel
 */
class StatsModal extends BaseModal {
    constructor(scene, topMenu) {
        super(scene, topMenu, '📊 STATISTIQUES DE COMBAT', 900, 600);
        
        this.updateInterval = null;
        this.createContent();
        
        // Mise à jour automatique
        this.updateInterval = setInterval(() => {
            this.updateStats();
        }, 1000);
    }
    
    createContent() {
        const startY = this.contentY + 20;
        
        // Message si aucune tour placée
        this.noTowersText = this.scene.add.text(
            this.x, startY + 100,
            'Aucune tour placée\nPlacez des tours pour voir leurs statistiques',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#888888',
                align: 'center'
            }
        );
        this.noTowersText.setOrigin(0.5);
        this.noTowersText.setDepth(2002);
        this.addElement(this.noTowersText);
        
        // Container pour les stats des tours
        this.statsContainer = [];
        
        this.updateStats();
    }
    
    updateStats() {
        // Nettoyer les anciens éléments
        this.statsContainer.forEach(el => {
            if (el && el.destroy) el.destroy();
        });
        this.statsContainer = [];
        
        // Récupérer les tours actives
        const towers = this.scene.towers || [];
        
        if (towers.length === 0) {
            this.noTowersText.setVisible(true);
            return;
        }
        
        this.noTowersText.setVisible(false);
        
        // Trier les tours par dommages totaux
        const towerStats = towers.map(tower => ({
            tower: tower,
            damage: tower.totalDamage || 0,
            kills: tower.enemyKills || 0
        })).sort((a, b) => b.damage - a.damage);
        
        // Afficher les stats
        const startY = this.contentY + 20;
        const itemHeight = 80;
        
        towerStats.forEach((stat, index) => {
            const y = startY + index * itemHeight;
            const config = TOWER_CONFIG[stat.tower.towerId];
            
            // Fond de la carte
            const card = this.scene.add.rectangle(
                this.x, y + 35,
                this.width - 60, itemHeight - 10,
                0x16213e, 0.8
            );
            card.setDepth(2002);
            card.setStrokeStyle(2, config.color, 0.6);
            this.statsContainer.push(card);
            
            // Nom de la tour
            const name = this.scene.add.text(
                this.x - this.width / 2 + 60, y + 20,
                `${config.name} (Lvl ${stat.tower.level})`,
                {
                    fontSize: '18px',
                    fontFamily: 'Arial',
                    color: '#ffd700',
                    fontStyle: 'bold'
                }
            );
            name.setDepth(2003);
            this.statsContainer.push(name);
            
            // Dommages
            const damage = this.scene.add.text(
                this.x - 100, y + 50,
                `💥 ${stat.damage.toFixed(0)} dégâts`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#ff6b6b'
                }
            );
            damage.setDepth(2003);
            this.statsContainer.push(damage);
            
            // Kills
            const kills = this.scene.add.text(
                this.x + 100, y + 50,
                `☠️ ${stat.kills} éliminations`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#51cf66'
                }
            );
            kills.setDepth(2003);
            this.statsContainer.push(kills);
        });
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.statsContainer.forEach(el => {
            if (el && el.destroy) el.destroy();
        });
        
        super.destroy();
    }
}

