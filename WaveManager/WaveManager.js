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
            25: 'hatchan',      // Boss niveau 25
            50: 'mohmoo',       // Boss niveau 50
            75: 'sea_king_alpha', // Boss niveau 75
            100: 'arlong'       // Boss final niveau 100
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
            // La vague est complétée quand tous les ennemis sont spawnés (pas besoin qu'ils meurent)
            if (this.enemiesSpawnedInWave >= this.currentWaveEnemies.length && !this.waveCompleted) {
                this.onAllEnemiesSpawned();
            }
            
            return enemy;
        }
        return null;
    }
    
    /**
     * Appelé quand tous les ennemis de la vague ont été spawnés
     * La vague est considérée comme passée (étoile gagnée) sans attendre leur mort
     */
    onAllEnemiesSpawned() {
        if (this.waveCompleted) return;
        this.waveCompleted = true;
        
        // Donner l'étoile et le bonus de complétion
        const newStar = this.scene.player.completeWave(this.currentWave);
        const waveBonus = this.getWaveCompletionBonus(this.currentWave);
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
        if (WAVE_ENEMY_DISTRIBUTION[waveNumber]) {
            this.currentWaveEnemies = [...WAVE_ENEMY_DISTRIBUTION[waveNumber]];
        } else {
            this.currentWaveEnemies = this.generateWaveComposition(waveNumber);
        }
        
        this.enemiesRemainingInWave = this.currentWaveEnemies.length;
    }
    
    /**
     * Génère la composition d'une vague automatiquement
     * Inclut les mini-boss débloqués des vagues précédentes
     * 
     * SYSTÈME DE HORDES : Beaucoup d'ennemis avec stats réduites
     */
    generateWaveComposition(waveNumber) {
        const enemies = [];
        
        // Vérifier si c'est une vague de mini-boss
        const isMiniBossWave = !!this.miniBossWaves[waveNumber];
        
        // === NOUVEAU SYSTÈME : HORDES ===
        // Vague 1: 10 ennemis, Vague 50: 50 ennemis, Vague 100: 100 ennemis
        // Formule: 10 + (wave - 1) * 0.9 ≈ 10 à 100 ennemis
        const baseCount = Math.floor(10 + (waveNumber - 1) * 0.9);
        
        // Bonus pour les vagues de boss (x1.5)
        const bossBonus = isMiniBossWave ? Math.floor(baseCount * 0.5) : 0;
        
        // Bonus pour les vagues intermédiaires (x5, x15, etc.)
        const midTierBonus = (waveNumber % 10 === 5) ? Math.floor(baseCount * 0.3) : 0;
        
        const totalCount = baseCount + bossBonus + midTierBonus;
        
        console.log(`[WaveManager] Vague ${waveNumber}: ${totalCount} ennemis (base: ${baseCount}, bonus boss: ${bossBonus}, bonus mid: ${midTierBonus})`);
        
        // Ajouter des ennemis normaux
        for (let i = 0; i < totalCount; i++) {
            enemies.push(this.getRandomEnemyForWave(waveNumber));
        }
        
        // Ajouter des mini-boss des vagues précédentes (ils réapparaissent!)
        const unlockedMiniBosses = this.getUnlockedMiniBosses(waveNumber);
        
        // Chance d'ajouter un ancien mini-boss (plus on avance, plus il y en a)
        unlockedMiniBosses.forEach(miniBossId => {
            const config = ENEMY_CONFIG[miniBossId];
            if (!config || config.bossWave === waveNumber) return; // Pas celui de cette vague
            
            // Probabilité basée sur le poids de réapparition
            const reappearWeight = config.reappearWeight || 1;
            const chance = reappearWeight * 0.12; // 12% de base * poids
            
            if (Math.random() < chance) {
                enemies.push(miniBossId);
            }
        });
        
        // Si c'est une vague de mini-boss, l'ajouter à la fin
        if (isMiniBossWave) {
            enemies.push(this.miniBossWaves[waveNumber]);
        }
        
        // Mélanger (sauf le boss qui reste à la fin si présent)
        if (isMiniBossWave) {
            const boss = enemies.pop();
            this.shuffleArray(enemies);
            enemies.push(boss);
        } else {
            this.shuffleArray(enemies);
        }
        
        return enemies;
    }
    
    /**
     * Retourne les mini-boss débloqués
     */
    getUnlockedMiniBosses(currentWave) {
        const unlocked = [];
        for (const [wave, bossId] of Object.entries(this.miniBossWaves)) {
            if (parseInt(wave) < currentWave && parseInt(wave) < 100) {
                unlocked.push(bossId);
            }
        }
        return unlocked;
    }
    
    /**
     * Sélectionne un type d'ennemi aléatoire approprié pour la vague
     * Basé sur les tiers définis dans ENEMY_CONFIG
     */
    getRandomEnemyForWave(waveNumber) {
        const availableEnemies = [];
        
        // === TIER 1: Pirates de base (toujours disponibles, poids décroissant) ===
        if (waveNumber >= 1) {
            const t1Weight = Math.max(1, 8 - waveNumber * 0.15);
            availableEnemies.push({ type: 'pirate_recruit', weight: t1Weight * 0.8 });
            availableEnemies.push({ type: 'pirate_basic', weight: t1Weight });
            availableEnemies.push({ type: 'pirate_basic2', weight: t1Weight * 1.2 });
        }
        
        // === TIER 2: Hommes-poissons basiques (vague 10+) ===
        if (waveNumber >= 10) {
            const t2Weight = Math.min(8, 2 + (waveNumber - 10) * 0.1);
            availableEnemies.push({ type: 'fishman_grunt', weight: t2Weight });
            availableEnemies.push({ type: 'fishman_swimmer', weight: t2Weight * 0.8 });
        }
        
        // === TIER 3: Spécialistes (vague 20+) ===
        if (waveNumber >= 20) {
            const t3Weight = Math.min(6, 1 + (waveNumber - 20) * 0.08);
            availableEnemies.push({ type: 'pirate_fast', weight: t3Weight });
            availableEnemies.push({ type: 'fishman_spear', weight: t3Weight * 0.9 });
            availableEnemies.push({ type: 'fishman_brawler', weight: t3Weight * 0.8 });
        }
        
        // === TIER 4: Élites (vague 30+) ===
        if (waveNumber >= 30) {
            const t4Weight = Math.min(5, 0.5 + (waveNumber - 30) * 0.06);
            availableEnemies.push({ type: 'pirate_shield', weight: t4Weight });
            availableEnemies.push({ type: 'fishman_elite', weight: t4Weight * 1.1 });
            availableEnemies.push({ type: 'fishman_berserker', weight: t4Weight * 0.9 });
        }
        
        // === TIER 5: Officiers (vague 40+) ===
        if (waveNumber >= 40) {
            const t5Weight = Math.min(4, 0.3 + (waveNumber - 40) * 0.05);
            availableEnemies.push({ type: 'fishman_officer', weight: t5Weight });
            availableEnemies.push({ type: 'fishman_merman', weight: t5Weight * 0.9 });
            availableEnemies.push({ type: 'pirate_assassin', weight: t5Weight * 0.8 });
        }
        
        // === TIER 6: Champions (vague 50+) ===
        if (waveNumber >= 50) {
            const t6Weight = Math.min(3.5, 0.2 + (waveNumber - 50) * 0.04);
            availableEnemies.push({ type: 'fishman_champion', weight: t6Weight });
            availableEnemies.push({ type: 'fishman_shaman', weight: t6Weight * 0.8 });
            availableEnemies.push({ type: 'octopus_warrior', weight: t6Weight * 0.7 });
        }
        
        // === TIER 7: Monstres marins (vague 60+) ===
        if (waveNumber >= 60) {
            const t7Weight = Math.min(3, 0.15 + (waveNumber - 60) * 0.03);
            availableEnemies.push({ type: 'sea_beast', weight: t7Weight });
            availableEnemies.push({ type: 'mohmoo_calf', weight: t7Weight * 0.8 });
            availableEnemies.push({ type: 'shark_hunter', weight: t7Weight * 0.9 });
        }
        
        // === TIER 8: Généraux (vague 70+) ===
        if (waveNumber >= 70) {
            const t8Weight = Math.min(2.5, 0.1 + (waveNumber - 70) * 0.02);
            availableEnemies.push({ type: 'fishman_general', weight: t8Weight });
            availableEnemies.push({ type: 'sea_king_spawn', weight: t8Weight * 0.7 });
        }
        
        // === TIER 9: Légendes (vague 80+) ===
        if (waveNumber >= 80) {
            const t9Weight = Math.min(2, 0.05 + (waveNumber - 80) * 0.015);
            availableEnemies.push({ type: 'ancient_fishman', weight: t9Weight });
            availableEnemies.push({ type: 'sea_king', weight: t9Weight * 0.6 });
        }
        
        // Sélection pondérée
        const totalWeight = availableEnemies.reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const enemy of availableEnemies) {
            random -= enemy.weight;
            if (random <= 0) {
                return enemy.type;
            }
        }
        
        return 'pirate_basic';
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    enemyKilled() {
        this.enemiesRemainingInWave--;
        
        // Quand tous les ennemis sont morts, la vague est vraiment terminée
        // (mais l'étoile a déjà été donnée quand tous ont été spawnés)
        if (this.enemiesRemainingInWave === 0) {
            this.waveInProgress = false;
            this.nextWaveTime = this.scene.time.now + this.waveDelay;
            
            // Message de fin de vague (tous ennemis éliminés)
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
        this.waveCompleted = false; // Réinitialiser le flag de complétion
        this.prepareWave(this.currentWave);
        this.waveInProgress = true;
        
        this.scene.waveNumber = this.currentWave;
        
        // Réinitialiser les stats de combat de toutes les tours pour cette vague
        this.resetTowerStats();
        
        // Ajuster le délai de spawn - Plus rapide pour le mode horde
        // Vague 1: 500ms, Vague 50: 300ms, Vague 100: 200ms
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
    
    /**
     * Réinitialise les stats de combat de toutes les tours (dégâts, kills)
     */
    resetTowerStats() {
        if (this.scene.towers) {
            this.scene.towers.forEach(tower => {
                tower.totalDamage = 0;
                tower.enemyKills = 0;
            });
            console.log(`[WaveManager] Stats de combat réinitialisées pour ${this.scene.towers.length} tours`);
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
