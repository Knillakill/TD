class WaveManager {
    constructor(scene, path) {
        this.scene = scene;
        this.path = path;
        // Délai de spawn réduit pour le mode horde (était 800ms)
        this.spawnDelay = 500;
        this.lastSpawnTime = 0;
        
        this.currentWave = scene.waveNumber || 0;
        this.currentWaveEnemies = [];
        this.enemiesSpawnedInWave = 0;
        this.enemiesRemainingInWave = 0;
        this.waveInProgress = false;
        this.waveCompleted = false; // Vague passée (tous ennemis spawnés)
        this.waveDelay = 5000;
        this.nextWaveTime = 0;
        
        // Boss aux niveaux 25, 50, 75 (et 100 pour le boss final)
        this.miniBossWaves = {
            25: 'chew',
            50: 'hachi',
            75: 'kuroobi',
            100: 'arlong'
        };
        
        console.log(`[WaveManager] Initialisé avec scene.waveNumber=${scene.waveNumber}, currentWave=${this.currentWave}`);
        if (this.currentWave > 0) {
            console.log(`[WaveManager] Reprise à la vague ${this.currentWave}`);
            this.prepareWave(this.currentWave);
            this.scene.time.delayedCall(500, () => {
                this.updateCurrentWaveDisplay();
            });
        }
    }
    
    update(time) {
        if (this.canSpawn(time)) {
            this.lastSpawnTime = time;
            const enemyType = this.currentWaveEnemies[this.enemiesSpawnedInWave];
            this.enemiesSpawnedInWave++;
            
            const randomPath = getRandomPath();
            const enemy = new Enemy(this.scene, randomPath, enemyType, this.currentWave);
            
            // Vérifier si c'était le dernier ennemi à spawn
            if (this.enemiesSpawnedInWave >= this.currentWaveEnemies.length && !this.waveCompleted) {
                this.onAllEnemiesSpawned();
            }
            
            return enemy;
        }
        return null;
    }
    
    /**
     * Appelé quand tous les ennemis de la vague ont été spawnés
     */
    onAllEnemiesSpawned() {
        if (this.waveCompleted) return;
        this.waveCompleted = true;
        
        // Donner l'étoile et le bonus de complétion
        const newStar = this.scene.player.completeWave(this.currentWave - 1);
        const waveBonus = this.getWaveCompletionBonus(this.currentWave - 1);
        this.scene.player.addGold(waveBonus);
        
        // Message de victoire
        this.scene.ui.showMessage(`✓ Vague ${this.currentWave} passée ! +${waveBonus} 💰`, 2000);
        
        // Sauvegarder
        if (this.scene.saveManager) {
            this.scene.saveManager.autoSave();
        }
        
        console.log(`[WaveManager] Vague ${this.currentWave} passée ! Tous les ennemis spawnés.`);
    }
    
    canSpawn(time) {
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const adjustedDelay = this.spawnDelay / gameSpeed;
        
        return (
            this.waveInProgress &&
            this.enemiesSpawnedInWave < this.currentWaveEnemies.length &&
            time > this.lastSpawnTime + adjustedDelay
        );
    }
    
    prepareWave(waveNumber) {
        // Utiliser WAVE_ENEMY_DISTRIBUTION pour obtenir la composition manuelle
        this.currentWaveEnemies = this.getWaveCompositionFromTable(waveNumber);
        this.enemiesRemainingInWave = this.currentWaveEnemies.length;
        
        console.log(`[WaveManager] Vague ${waveNumber} préparée: ${this.currentWaveEnemies.length} ennemis`);
    }
    
    /**
     * Récupère la composition de la vague depuis WAVE_ENEMY_DISTRIBUTION
     * Si la vague n'est pas définie, génère une composition par défaut
     */
    getWaveCompositionFromTable(waveNumber) {
        const enemies = [];
        
        // Vérifier si WAVE_ENEMY_DISTRIBUTION existe
        if (typeof WAVE_ENEMY_DISTRIBUTION === 'undefined') {
            console.warn(`[WaveManager] WAVE_ENEMY_DISTRIBUTION non trouvé, utilisation d'une composition par défaut`);
            return this.getDefaultWaveComposition(waveNumber);
        }
        
        // Récupérer la configuration de la vague
        const waveConfig = WAVE_ENEMY_DISTRIBUTION[waveNumber];
        
        if (!waveConfig) {
            console.warn(`[WaveManager] Vague ${waveNumber} non définie dans WAVE_ENEMY_DISTRIBUTION, utilisation d'une composition par défaut`);
            return this.getDefaultWaveComposition(waveNumber);
        }
        
        // Construire le tableau d'ennemis basé sur la configuration
        for (const [enemyType, count] of Object.entries(waveConfig)) {
            for (let i = 0; i < count; i++) {
                enemies.push(enemyType);
            }
        }
        
        // Vérifier si c'est une vague de mini-boss et l'ajouter si nécessaire
        const isMiniBossWave = !!this.miniBossWaves[waveNumber];
        if (isMiniBossWave) {
            // Vérifier si le boss n'est pas déjà dans la composition
            const bossType = this.miniBossWaves[waveNumber];
            if (!enemies.includes(bossType)) {
                enemies.push(bossType);
            }
        }
        
        // Mélanger les ennemis (sauf le boss qui reste à la fin)
        if (isMiniBossWave) {
            const boss = enemies.pop();
            this.shuffleArray(enemies);
            enemies.push(boss);
        } else {
            this.shuffleArray(enemies);
        }
        
        console.log(`[WaveManager] Composition chargée depuis WAVE_ENEMY_DISTRIBUTION pour vague ${waveNumber}`);
        return enemies;
    }
    
    /**
     * Génère une composition par défaut si la vague n'est pas définie dans le tableau
     * Composition simple basée sur le numéro de vague
     */
    getDefaultWaveComposition(waveNumber) {
        const enemies = [];
        const baseCount = Math.min(5 + waveNumber * 2, 30);
        
        // Types d'ennemis de base
        const basicTypes = ['greenfhishmen', 'wolf', 'shadowbat'];
        
        for (let i = 0; i < baseCount; i++) {
            const randomType = basicTypes[Math.floor(Math.random() * basicTypes.length)];
            enemies.push(randomType);
        }
        
        // Ajouter le mini-boss si c'est une vague de boss
        const isMiniBossWave = !!this.miniBossWaves[waveNumber];
        if (isMiniBossWave) {
            enemies.push(this.miniBossWaves[waveNumber]);
        }
        
        console.log(`[WaveManager] Composition par défaut générée pour vague ${waveNumber}`);
        return enemies;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    enemyKilled() {
        this.enemiesRemainingInWave--;
        
        if (this.enemiesRemainingInWave === 0) {
            this.waveInProgress = false;
            this.nextWaveTime = this.scene.time.now + this.waveDelay;
            
            // Message de fin de vague
            const isMiniBossWave = !!this.miniBossWaves[this.currentWave];
            if (this.currentWave === 100) {
                this.scene.ui.showMessage(`🏆 ARLONG VAINCU! VICTOIRE TOTALE! 🏆`, 5000);
            } else if (isMiniBossWave) {
                const bossName = ENEMY_CONFIG[this.miniBossWaves[this.currentWave]]?.name || 'BOSS';
                this.scene.ui.showMessage(`🏆 ${bossName} éliminé!`, 2500);
            } else {
                this.scene.ui.showMessage(`✓ Tous les ennemis éliminés!`, 1500);
            }
            
            // Animation de victoire pour les tours
            this.scene.towers.forEach(tower => {
                if (tower.playVictory) tower.playVictory();
            });
            
            if (this.scene.enemyInfoPanel) {
                this.scene.enemyInfoPanel.updatePlayerStats(this.scene.player);
            }
        }
    }
    
    getWaveCompletionBonus(waveNumber) {
        let bonus = 10 + waveNumber * 2;
        
        // Bonus x2 pour les vagues de mini-boss
        if (this.miniBossWaves[waveNumber]) {
            bonus *= 2;
        }
        
        // Bonus supplémentaire tous les 10 niveaux
        if (waveNumber % 10 === 0) {
            bonus += waveNumber;
        }
        
        return Math.round(bonus);
    }
    
    enemyReachedEnd() {
        this.enemiesRemainingInWave--;
        
        if (this.enemiesRemainingInWave === 0) {
            this.waveInProgress = false;
            this.nextWaveTime = this.scene.time.now + this.waveDelay;
        }
    }
    
    startNextWave() {
        if (this.waveInProgress) return false;
        
        this.currentWave++;
        this.enemiesSpawnedInWave = 0;
        this.waveCompleted = false;
        this.prepareWave(this.currentWave);
        this.waveInProgress = true;
        
        this.scene.waveNumber = this.currentWave;
        
        // Réinitialiser les stats de combat
        this.resetTowerStats();
        
        // Ajuster le délai de spawn
        this.spawnDelay = Math.max(200, 500 - this.currentWave * 3);
        
        // Message selon le type de vague
        const isMiniBossWave = !!this.miniBossWaves[this.currentWave];
        if (this.currentWave === 100) {
            this.scene.ui.showMessage(`⚠️ BOSS FINAL: ARLONG! ⚠️`, 3000);
        } else if (isMiniBossWave) {
            const bossName = ENEMY_CONFIG[this.miniBossWaves[this.currentWave]]?.name || 'BOSS';
            this.scene.ui.showMessage(`⚠️ MINI-BOSS: ${bossName}! Vague ${this.currentWave} ⚠️`, 3000);
        } else {
            this.scene.ui.showMessage(`⚔️ Vague ${this.currentWave} ⚔️`, 2000);
        }
        
        this.updateCurrentWaveDisplay();
        
        return true;
    }
    
    resetTowerStats() {
        if (this.scene.towers) {
            this.scene.towers.forEach(tower => {
                tower.totalDamage = 0;
                tower.enemyKills = 0;
            });
        }
    }
    
    updateCurrentWaveDisplay() {
        if (this.scene.enemyInfoPanel) {
            this.scene.enemyInfoPanel.updateWaveEnemies(this.currentWaveEnemies, this.currentWave);
        }
    }
    
    getWaveInfo() {
        return {
            wave: this.currentWave,
            remaining: this.enemiesRemainingInWave,
            total: this.currentWaveEnemies.length,
            isMiniBossWave: !!this.miniBossWaves[this.currentWave],
            isFinalBoss: this.currentWave === 100
        };
    }
    
    getNextMiniBossInfo() {
        for (const [wave, bossId] of Object.entries(this.miniBossWaves)) {
            if (parseInt(wave) > this.currentWave) {
                const config = ENEMY_CONFIG[bossId];
                return {
                    wave: parseInt(wave),
                    bossId,
                    bossName: config?.name || bossId,
                    wavesUntil: parseInt(wave) - this.currentWave
                };
            }
        }
        return null;
    }
}