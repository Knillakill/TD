class WaveManager {
    constructor(scene, path) {
        this.scene = scene;
        this.path = path;
        this.spawnDelay = 600; // 0.6 secondes entre chaque ennemi
        this.lastSpawnTime = 0;
        
        // Système de vagues
        // Reprendre à la vague sauvegardée si elle existe
        this.currentWave = scene.waveNumber || 0;
        this.currentWaveEnemies = []; // Liste des ennemis à spawner dans cette vague
        this.enemiesSpawnedInWave = 0;
        this.enemiesRemainingInWave = 0;
        this.waveInProgress = false; // Attendre que le joueur lance la première vague
        this.waveDelay = 5000; // 5 secondes entre les vagues
        this.nextWaveTime = 0;
        
        // Afficher un message si on reprend une vague > 0
        console.log(`[WaveManager] Initialisé avec scene.waveNumber=${scene.waveNumber}, currentWave=${this.currentWave}`);
        if (this.currentWave > 0) {
            console.log(`[WaveManager] Reprise à la vague ${this.currentWave}`);
            
            // Préparer la composition de la vague sauvegardée pour l'affichage
            this.prepareWave(this.currentWave);
            
            // Mettre à jour l'affichage de l'UI avec la vague sauvegardée
            // On le fait avec un délai pour que l'UI soit bien initialisée
            this.scene.time.delayedCall(500, () => {
                this.updateCurrentWaveDisplay();
            });
        }
    }
    
    update(time) {
        // Ne plus lancer automatiquement les vagues
        // Le joueur doit les lancer manuellement
        
        // Spawner un ennemi si possible
        if (this.canSpawn(time)) {
            this.lastSpawnTime = time;
            const enemyType = this.currentWaveEnemies[this.enemiesSpawnedInWave];
            this.enemiesSpawnedInWave++;
            // Choisir un chemin aléatoire pour chaque ennemi
            const randomPath = getRandomPath();
            return new Enemy(this.scene, randomPath, enemyType);
        }
        return null;
    }
    
    canSpawn(time) {
        // Appliquer le multiplicateur de vitesse au délai de spawn
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const adjustedDelay = this.spawnDelay / gameSpeed;
        
        return (
            this.waveInProgress &&
            this.enemiesSpawnedInWave < this.currentWaveEnemies.length &&
            time > this.lastSpawnTime + adjustedDelay
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
        const count = 15 + (waveNumber - 1) * 2;
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
            
            // Donner une étoile si première fois
            const newStar = this.scene.player.completeWave(this.currentWave);
            
            // Sauvegarder la progression
            if (this.scene.saveManager) {
                this.scene.saveManager.autoSave();
            }
            
            // Afficher message de fin de vague
            if (newStar) {
                this.scene.ui.showMessage(`Vague ${this.currentWave} terminée! ★ +1 étoile!`, 2500);
            } else {
                this.scene.ui.showMessage(`Vague ${this.currentWave} terminée!`, 2000);
            }
            
            // Jouer l'animation de victoire sur toutes les tours
            this.scene.towers.forEach(tower => {
                if (tower.playVictory) {
                    tower.playVictory();
                }
            });
            
            // Mettre à jour l'affichage des stats
            if (this.scene.enemyInfoPanel) {
                this.scene.enemyInfoPanel.updatePlayerStats(this.scene.player);
            }
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
        
        // Synchroniser avec scene.waveNumber
        this.scene.waveNumber = this.currentWave;
        
        // Délai constant entre les ennemis
        this.spawnDelay = 600;
        
        // Message de nouvelle vague
        this.scene.ui.showMessage(`⚔️ Vague ${this.currentWave} ⚔️`, 2000);
        
        // Mettre à jour l'affichage de la vague actuelle
        this.updateCurrentWaveDisplay();
        
        return true;
    }
    
    updateCurrentWaveDisplay() {
        // Afficher la vague actuelle
        if (this.scene.enemyInfoPanel) {
            this.scene.enemyInfoPanel.updateWaveEnemies(this.currentWaveEnemies, this.currentWave);
        }
    }
    
    getWaveInfo() {
        return {
            wave: this.currentWave,
            remaining: this.enemiesRemainingInWave,
            total: this.currentWaveEnemies.length
        };
    }
}

