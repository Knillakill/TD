class WaveManager {
    constructor(scene, path) {
        this.scene = scene;
        this.path = path;
        this.spawnDelay = 2000; // 2 secondes entre chaque ennemi
        this.lastSpawnTime = 0;
        
        // Système de vagues
        this.currentWave = 0; // Commence à 0, la première vague sera lancée manuellement
        this.currentWaveEnemies = []; // Liste des ennemis à spawner dans cette vague
        this.enemiesSpawnedInWave = 0;
        this.enemiesRemainingInWave = 0;
        this.waveInProgress = false; // Attendre que le joueur lance la première vague
        this.waveDelay = 5000; // 5 secondes entre les vagues
        this.nextWaveTime = 0;
    }
    
    update(time) {
        // Ne plus lancer automatiquement les vagues
        // Le joueur doit les lancer manuellement
        
        // Spawner un ennemi si possible
        if (this.canSpawn(time)) {
            this.lastSpawnTime = time;
            const enemyType = this.currentWaveEnemies[this.enemiesSpawnedInWave];
            this.enemiesSpawnedInWave++;
            return new Enemy(this.scene, this.path, enemyType);
        }
        return null;
    }
    
    canSpawn(time) {
        return (
            this.waveInProgress &&
            this.enemiesSpawnedInWave < this.currentWaveEnemies.length &&
            time > this.lastSpawnTime + this.spawnDelay
        );
    }
    
    prepareWave(waveNumber) {
        // Utiliser la distribution prédéfinie si elle existe
        if (WAVE_ENEMY_DISTRIBUTION[waveNumber]) {
            this.currentWaveEnemies = [...WAVE_ENEMY_DISTRIBUTION[waveNumber]];
        } else {
            // Génération automatique pour les vagues après la 5
            this.currentWaveEnemies = this.generateWaveComposition(waveNumber);
        }
        
        this.enemiesRemainingInWave = this.currentWaveEnemies.length;
    }
    
    generateWaveComposition(waveNumber) {
        // Génération dynamique avec plus de variété selon la vague
        const count = 5 + (waveNumber - 1) * 2;
        const enemies = [];
        
        for (let i = 0; i < count; i++) {
            const rand = Math.random();
            
            if (waveNumber < 8) {
                // Vagues 6-7 : Mix équilibré
                if (rand < 0.5) {
                    enemies.push('pirate_basic');
                } else if (rand < 0.75) {
                    enemies.push('pirate_fast');
                } else {
                    enemies.push('pirate_shield');
                }
            } else {
                // Vagues 8+ : Plus difficile
                if (rand < 0.3) {
                    enemies.push('pirate_basic');
                } else if (rand < 0.65) {
                    enemies.push('pirate_fast');
                } else {
                    enemies.push('pirate_shield');
                }
            }
        }
        
        return enemies;
    }
    
    enemyKilled() {
        this.enemiesRemainingInWave--;
        
        // Si tous les ennemis de la vague sont éliminés
        if (this.enemiesRemainingInWave === 0) {
            this.waveInProgress = false;
            this.nextWaveTime = this.scene.time.now + this.waveDelay;
            
            // Afficher message de fin de vague
            this.scene.ui.showMessage(`Vague ${this.currentWave} terminée!`, 2000);
        }
    }
    
    enemyReachedEnd() {
        this.enemiesRemainingInWave--;
        
        // Vérifier si la vague est terminée
        if (this.enemiesRemainingInWave === 0) {
            this.waveInProgress = false;
            this.nextWaveTime = this.scene.time.now + this.waveDelay;
        }
    }
    
    startNextWave() {
        // Ne pas lancer si une vague est déjà en cours
        if (this.waveInProgress) return false;
        
        this.currentWave++;
        this.enemiesSpawnedInWave = 0;
        this.prepareWave(this.currentWave);
        this.waveInProgress = true;
        
        // Augmenter la difficulté (spawn plus rapide)
        this.spawnDelay = Math.max(800, 2000 - (this.currentWave - 1) * 150);
        
        // Message de nouvelle vague
        this.scene.ui.showMessage(`⚔️ Vague ${this.currentWave} ⚔️`, 2000);
        
        return true;
    }
    
    getWaveInfo() {
        return {
            wave: this.currentWave,
            remaining: this.enemiesRemainingInWave,
            total: this.currentWaveEnemies.length
        };
    }
}

