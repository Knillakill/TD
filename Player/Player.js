class Player {
    constructor() {
        this.hp = 10;
        this.gold = 100;
        this.stars = 0;  // Étoiles gagnées
        this.completedWaves = {};  // Vagues déjà complétées (pour éviter de donner plusieurs étoiles)
        
        // Niveaux des personnages (par défaut niveau 1)
        this.towerLevels = {};
        TOWER_ORDER.forEach(towerId => {
            this.towerLevels[towerId] = 1;
        });
    }
    
    // Obtenir le niveau d'un personnage
    getTowerLevel(towerId) {
        return this.towerLevels[towerId] || 1;
    }
    
    // Améliorer un personnage
    upgradeTower(towerId) {
        const config = TOWER_CONFIG[towerId];
        if (!config) return false;
        
        const currentLevel = this.getTowerLevel(towerId);
        if (currentLevel >= config.maxLevel) return false;
        
        const cost = getUpgradeCost(towerId, currentLevel);
        if (this.gold < cost) return false;
        
        this.gold -= cost;
        this.towerLevels[towerId] = currentLevel + 1;
        return true;
    }
    
    loseHp() {
        this.hp--;
        console.log("Base HP:", this.hp);
    }
    
    // Appelé quand une vague est terminée
    completeWave(waveNumber) {
        // Si la vague n'a jamais été complétée, gagner une étoile
        if (!this.completedWaves[waveNumber]) {
            this.completedWaves[waveNumber] = true;
            this.stars++;
            console.log(`★ Étoile gagnée ! Total: ${this.stars}`);
            return true;  // Nouvelle étoile gagnée
        }
        return false;  // Vague déjà complétée
    }
    
    addGold(amount) {
        this.gold += amount;
    }
}

