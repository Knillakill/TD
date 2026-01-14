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
        // Chew vague 25, Hachi vague 50, Kuroobi vague 75, Arlong vague 100
        this.miniBossWaves = {
            25: 'chew',         // Boss niveau 25
            50: 'hachi',        // Boss niveau 50 (Hachi - placeholder sprite gorilla)
            75: 'kuroobi',      // Boss niveau 75 (Kuroobi - placeholder sprite pterosaur)
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
        // Utiliser toujours la génération automatique pour garantir max 4 types et animaux dès vague 1
        // WAVE_ENEMY_DISTRIBUTION est conservée pour référence mais n'est plus utilisée
        this.currentWaveEnemies = this.generateWaveComposition(waveNumber);
        
        this.enemiesRemainingInWave = this.currentWaveEnemies.length;
    }
    
    /**
     * Génère la composition d'une vague automatiquement
     * Inclut les mini-boss débloqués des vagues précédentes
     * 
     * SYSTÈME AMÉLIORÉ : Maximum 4 types d'ennemis différents par vague
     * Progression équilibrée avec courbe exponentielle douce
     */
    generateWaveComposition(waveNumber) {
        const enemies = [];
        
        // Vérifier si c'est une vague de mini-boss
        const isMiniBossWave = !!this.miniBossWaves[waveNumber];
        
        // === PROGRESSION ÉQUILIBRÉE DU NOMBRE D'ENNEMIS ===
        // Courbe exponentielle douce : Vague 1=4, Vague 10=18, Vague 25=35, Vague 50=65, Vague 100=120
        // Formule : base * (1 + exponentiel doux)
        let baseCount;
        if (waveNumber <= 3) {
            // Vagues 1-3 : progression très douce (4, 5, 6)
            baseCount = 3 + waveNumber;
        } else if (waveNumber <= 10) {
            // Vagues 4-10 : progression linéaire douce (7 à 18)
            baseCount = Math.floor(4 + (waveNumber - 1) * 1.5);
        } else {
            // Vagues 11+ : progression exponentielle douce
            // Formule : 18 + (wave - 10) * 1.5 + (wave - 10)^1.3 * 0.15
            const waveOffset = waveNumber - 10;
            baseCount = Math.floor(18 + waveOffset * 1.5 + Math.pow(waveOffset, 1.3) * 0.15);
        }
        
        // Bonus pour les vagues de boss (x1.4)
        const bossBonus = isMiniBossWave ? Math.floor(baseCount * 0.4) : 0;
        
        // Bonus pour les vagues spéciales (multiples de 5, 10)
        let specialBonus = 0;
        if (waveNumber % 10 === 0) {
            // Multiples de 10 : bonus significatif
            specialBonus = Math.floor(baseCount * 0.25);
        } else if (waveNumber % 5 === 0) {
            // Multiples de 5 : bonus modéré
            specialBonus = Math.floor(baseCount * 0.15);
        }
        
        const totalCount = baseCount + bossBonus + specialBonus;
        
        // Sélectionner maximum 4 types d'ennemis différents avec garantie de diversité
        const selectedTypes = this.selectEnemyTypesForWave(waveNumber, 4);
        
        // Garantir au moins 2 types différents (sauf vague 1)
        if (waveNumber > 1 && selectedTypes.length < 2) {
            const additionalTypes = this.selectEnemyTypesForWave(waveNumber, 2);
            additionalTypes.forEach(type => {
                if (!selectedTypes.includes(type)) {
                    selectedTypes.push(type);
                }
            });
        }
        
        console.log(`[WaveManager] Vague ${waveNumber}: ${totalCount} ennemis avec ${selectedTypes.length} types (${selectedTypes.join(', ')})`);
        
        // Pour la vague 1 : un seul ennemi de chaque type
        if (waveNumber === 1) {
            selectedTypes.forEach((type) => {
                enemies.push(type);
            });
        } else {
            // Répartir les ennemis avec une distribution légèrement variée (pas strictement égale)
            // Cela crée des vagues plus intéressantes avec des "groupes" d'ennemis
            const distribution = this.calculateEnemyDistribution(totalCount, selectedTypes.length);
            
            selectedTypes.forEach((type, index) => {
                const count = distribution[index];
                for (let i = 0; i < count; i++) {
                    enemies.push(type);
                }
            });
        }
        
        // Ajouter des mini-boss des vagues précédentes (ils réapparaissent!)
        const unlockedMiniBosses = this.getUnlockedMiniBosses(waveNumber);
        
        // Chance d'ajouter un ancien mini-boss (augmente progressivement)
        // Probabilité : 8% à vague 30, 15% à vague 50, 20% à vague 75
        const baseReappearChance = Math.min(0.20, 0.05 + (waveNumber - 25) * 0.003);
        
        unlockedMiniBosses.forEach(miniBossId => {
            const config = ENEMY_CONFIG[miniBossId];
            if (!config || config.bossWave === waveNumber) return; // Pas celui de cette vague
            
            // Probabilité basée sur le poids de réapparition et la vague
            const reappearWeight = config.reappearWeight || 1;
            const chance = baseReappearChance * reappearWeight;
            
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
     * Calcule une distribution variée des ennemis (pas strictement égale)
     * Crée des vagues plus intéressantes avec des groupes d'ennemis
     */
    calculateEnemyDistribution(totalCount, typeCount) {
        const distribution = [];
        const basePerType = Math.floor(totalCount / typeCount);
        const remainder = totalCount % typeCount;
        
        // Distribution de base
        for (let i = 0; i < typeCount; i++) {
            distribution.push(basePerType);
        }
        
        // Répartir le reste
        for (let i = 0; i < remainder; i++) {
            distribution[i]++;
        }
        
        // Ajouter une légère variation aléatoire (±1) pour plus de variété
        // Mais garder le total constant
        let variation = 0;
        for (let i = 0; i < typeCount; i++) {
            if (Math.random() < 0.3 && distribution[i] > 1) {
                // 30% de chance de réduire de 1
                distribution[i]--;
                variation++;
            }
        }
        
        // Redistribuer la variation
        for (let i = 0; i < variation && i < typeCount; i++) {
            distribution[i]++;
        }
        
        return distribution;
    }
    
    /**
     * Sélectionne maximum N types d'ennemis pour une vague donnée
     * Système de poids amélioré avec transitions fluides et décroissance progressive
     */
    selectEnemyTypesForWave(waveNumber, maxTypes) {
        const availableEnemies = [];
        
        // Fonction helper pour calculer le poids avec décroissance progressive
        const calculateWeight = (baseWeight, waveStart, decayRate, maxWeight = 10) => {
            if (waveNumber < waveStart) return 0;
            const waveOffset = waveNumber - waveStart;
            // Décroissance exponentielle douce : commence fort, diminue progressivement
            const decay = Math.exp(-waveOffset * decayRate);
            return Math.min(maxWeight, baseWeight * decay);
        };
        
        // === TIER 1: Animaux faibles (vagues 1+) ===
        // Poids élevé au début, décroît progressivement mais reste présent longtemps
        const t1BaseWeight = calculateWeight(12, 1, 0.08, 12);
        if (t1BaseWeight > 0.5) {
            availableEnemies.push({ type: 'chauvesouris', weight: t1BaseWeight * 0.75 });
            availableEnemies.push({ type: 'spider', weight: t1BaseWeight * 1.0 });
            availableEnemies.push({ type: 'snake', weight: t1BaseWeight * 0.85 });
            availableEnemies.push({ type: 'crow', weight: t1BaseWeight * 0.95 });
        }
        
        // === TIER 2: Animaux moyens (vagues 4+) ===
        // Apparaît tôt, pic vers vague 8-12, puis décroît
        const t2BaseWeight = calculateWeight(8, 4, 0.06, 8);
        if (t2BaseWeight > 0.5) {
            availableEnemies.push({ type: 'wolf', weight: t2BaseWeight * 1.0 });
            availableEnemies.push({ type: 'shadowbat', weight: t2BaseWeight * 0.9 });
            availableEnemies.push({ type: 'raptor', weight: t2BaseWeight * 0.85 });
        }
        
        // === TIER 3: Animaux forts (vagues 8+) ===
        // Transition douce depuis les animaux moyens
        const t3AnimalWeight = calculateWeight(7, 8, 0.05, 7);
        if (t3AnimalWeight > 0.5) {
            availableEnemies.push({ type: 'golem', weight: t3AnimalWeight * 1.1 });
            availableEnemies.push({ type: 'kungfu', weight: t3AnimalWeight * 0.9 });
            availableEnemies.push({ type: 'prisoner', weight: t3AnimalWeight * 0.9 });
            availableEnemies.push({ type: 'pterosaur', weight: t3AnimalWeight * 1.0 });
        }
        
        // === TIER 3B: Pirates de base (vagues 10+) ===
        // Apparaît après les animaux, pic vers vague 15-20
        const t3PirateWeight = calculateWeight(8, 10, 0.04, 8);
        if (t3PirateWeight > 0.5) {
            availableEnemies.push({ type: 'pirate_recruit', weight: t3PirateWeight * 0.75 });
            availableEnemies.push({ type: 'pirate_basic', weight: t3PirateWeight * 1.0 });
            availableEnemies.push({ type: 'pirate_basic2', weight: t3PirateWeight * 1.15 });
        }
        
        // === TIER 4: Pirates avancés (vagues 14+) ===
        // Transition depuis les pirates de base
        const t4Weight = calculateWeight(7, 14, 0.04, 7);
        if (t4Weight > 0.5) {
            availableEnemies.push({ type: 'pirate_fast', weight: t4Weight * 1.0 });
            availableEnemies.push({ type: 'pirate_shield', weight: t4Weight * 1.1 });
            availableEnemies.push({ type: 'pirate_assassin', weight: t4Weight * 0.9 });
        }
        
        // === TIER 5: Hommes-poissons basiques (vagues 18+) ===
        // Apparaît progressivement, remplace les pirates
        const t5Weight = calculateWeight(9, 18, 0.035, 9);
        if (t5Weight > 0.5) {
            availableEnemies.push({ type: 'fishman_grunt', weight: t5Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_swimmer', weight: t5Weight * 0.9 });
            availableEnemies.push({ type: 'fishman_spear', weight: t5Weight * 0.95 });
            availableEnemies.push({ type: 'fishman_brawler', weight: t5Weight * 0.9 });
        }
        
        // === TIER 6: Hommes-poissons élites (vagues 28+) ===
        // Transition depuis les hommes-poissons basiques
        const t6Weight = calculateWeight(7, 28, 0.03, 7);
        if (t6Weight > 0.5) {
            availableEnemies.push({ type: 'fishman_elite', weight: t6Weight * 1.1 });
            availableEnemies.push({ type: 'fishman_berserker', weight: t6Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_officer', weight: t6Weight * 0.9 });
            availableEnemies.push({ type: 'fishman_merman', weight: t6Weight * 0.95 });
        }
        
        // === TIER 7: Hommes-poissons champions + Animaux puissants (vagues 38+) ===
        // Ennemis de fin de partie
        const t7Weight = calculateWeight(6, 38, 0.025, 6);
        if (t7Weight > 0.5) {
            availableEnemies.push({ type: 'fishman_champion', weight: t7Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_shaman', weight: t7Weight * 0.9 });
            availableEnemies.push({ type: 'octopus_warrior', weight: t7Weight * 0.95 });
            // Animaux puissants
            availableEnemies.push({ type: 'gorilla', weight: t7Weight * 1.1 });
            availableEnemies.push({ type: 'jellyfish', weight: t7Weight * 0.9 });
        }
        
        // Sélection pondérée améliorée avec garantie de diversité
        const selectedTypes = [];
        let remainingEnemies = [...availableEnemies];
        
        // Garantir au moins un ennemi de chaque tier disponible (si possible)
        const tierGroups = [
            ['chauvesouris', 'spider', 'snake', 'crow'],
            ['wolf', 'shadowbat', 'raptor'],
            ['golem', 'kungfu', 'prisoner', 'pterosaur'],
            ['pirate_recruit', 'pirate_basic', 'pirate_basic2'],
            ['pirate_fast', 'pirate_shield', 'pirate_assassin'],
            ['fishman_grunt', 'fishman_swimmer', 'fishman_spear', 'fishman_brawler'],
            ['fishman_elite', 'fishman_berserker', 'fishman_officer', 'fishman_merman'],
            ['fishman_champion', 'fishman_shaman', 'octopus_warrior', 'gorilla', 'jellyfish']
        ];
        
        // Sélectionner un ennemi de chaque tier disponible (si maxTypes le permet)
        const availableTiers = tierGroups.filter(tier => 
            tier.some(type => remainingEnemies.some(e => e.type === type))
        );
        
        // Si on a assez de slots, garantir un ennemi par tier
        if (maxTypes >= availableTiers.length && availableTiers.length > 0) {
            availableTiers.forEach(tier => {
                const tierEnemies = remainingEnemies.filter(e => tier.includes(e.type));
                if (tierEnemies.length > 0) {
                    const selected = this.selectWeightedRandom(tierEnemies);
                    selectedTypes.push(selected.type);
                    remainingEnemies = remainingEnemies.filter(e => e.type !== selected.type);
                }
            });
        }
        
        // Remplir les slots restants avec sélection pondérée
        while (selectedTypes.length < maxTypes && remainingEnemies.length > 0) {
            const selected = this.selectWeightedRandom(remainingEnemies);
            selectedTypes.push(selected.type);
            remainingEnemies = remainingEnemies.filter(e => e.type !== selected.type);
        }
        
        return selectedTypes;
    }
    
    /**
     * Sélectionne un ennemi aléatoirement selon un système de poids
     */
    selectWeightedRandom(enemies) {
        const totalWeight = enemies.reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const enemy of enemies) {
            random -= enemy.weight;
            if (random <= 0) {
                return enemy;
            }
        }
        
        return enemies[0]; // Fallback
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
        // Cette fonction n'est plus utilisée pour generateWaveComposition
        // mais peut être utilisée ailleurs, donc on la garde
        const availableEnemies = [];
        
        // === TIER 1: Animaux faibles (vagues 1+) ===
        if (waveNumber >= 1) {
            const t1Weight = Math.max(3, 10 - waveNumber * 0.15);
            // Animaux faibles
            availableEnemies.push({ type: 'chauvesouris', weight: t1Weight * 0.8 });
            availableEnemies.push({ type: 'spider', weight: t1Weight });
            availableEnemies.push({ type: 'snake', weight: t1Weight * 0.9 });
            availableEnemies.push({ type: 'crow', weight: t1Weight * 1.0 });
        }
        
        // === TIER 2: Animaux moyens (vagues 5-15) ===
        if (waveNumber >= 5) {
            const t2Weight = Math.min(8, 1 + (waveNumber - 5) * 0.15);
            // Garder quelques animaux faibles
            if (waveNumber < 15) {
                availableEnemies.push({ type: 'spider', weight: t2Weight * 0.5 });
                availableEnemies.push({ type: 'snake', weight: t2Weight * 0.4 });
            }
            // Animaux moyens
            availableEnemies.push({ type: 'wolf', weight: t2Weight * 1.0 });
            availableEnemies.push({ type: 'shadowbat', weight: t2Weight * 0.9 });
            availableEnemies.push({ type: 'raptor', weight: t2Weight * 0.8 });
        }
        
        // === TIER 3: Animaux forts + Pirates de base (vagues 10-20) ===
        if (waveNumber >= 10) {
            const t3Weight = Math.min(7, 2 + (waveNumber - 10) * 0.1);
            // Garder quelques animaux moyens
            if (waveNumber < 20) {
                availableEnemies.push({ type: 'wolf', weight: t3Weight * 0.5 });
                availableEnemies.push({ type: 'raptor', weight: t3Weight * 0.4 });
            }
            // Animaux forts
            availableEnemies.push({ type: 'golem', weight: t3Weight * 1.1 });
            availableEnemies.push({ type: 'kungfu', weight: t3Weight * 0.9 });
            availableEnemies.push({ type: 'prisoner', weight: t3Weight * 0.9 });
            availableEnemies.push({ type: 'pterosaur', weight: t3Weight * 1.0 });
            // Pirates de base
            availableEnemies.push({ type: 'pirate_recruit', weight: t3Weight * 0.8 });
            availableEnemies.push({ type: 'pirate_basic', weight: t3Weight * 1.0 });
            availableEnemies.push({ type: 'pirate_basic2', weight: t3Weight * 1.2 });
        }
        
        // === TIER 4: Pirates avancés (vagues 15-25) ===
        if (waveNumber >= 15) {
            const t4Weight = Math.min(6, 1.5 + (waveNumber - 15) * 0.12);
            // Garder quelques pirates de base
            if (waveNumber < 25) {
                availableEnemies.push({ type: 'pirate_basic', weight: t4Weight * 0.5 });
                availableEnemies.push({ type: 'pirate_basic2', weight: t4Weight * 0.4 });
            }
            // Pirates avancés
            availableEnemies.push({ type: 'pirate_fast', weight: t4Weight * 1.0 });
            availableEnemies.push({ type: 'pirate_shield', weight: t4Weight * 1.1 });
            availableEnemies.push({ type: 'pirate_assassin', weight: t4Weight * 0.9 });
        }
        
        // === TIER 5: Hommes-poissons basiques (vagues 20-30) ===
        if (waveNumber >= 20) {
            const t5Weight = Math.min(8, 2 + (waveNumber - 20) * 0.15);
            // Garder quelques pirates
            if (waveNumber < 30) {
                availableEnemies.push({ type: 'pirate_fast', weight: t5Weight * 0.4 });
                availableEnemies.push({ type: 'pirate_shield', weight: t5Weight * 0.5 });
            }
            // Hommes-poissons basiques
            availableEnemies.push({ type: 'fishman_grunt', weight: t5Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_swimmer', weight: t5Weight * 0.9 });
            availableEnemies.push({ type: 'fishman_spear', weight: t5Weight * 0.95 });
            availableEnemies.push({ type: 'fishman_brawler', weight: t5Weight * 0.9 });
        }
        
        // === TIER 6: Hommes-poissons élites (vagues 30-40) ===
        if (waveNumber >= 30) {
            const t6Weight = Math.min(6, 1.5 + (waveNumber - 30) * 0.12);
            // Garder quelques hommes-poissons basiques
            if (waveNumber < 40) {
                availableEnemies.push({ type: 'fishman_grunt', weight: t6Weight * 0.5 });
                availableEnemies.push({ type: 'fishman_spear', weight: t6Weight * 0.4 });
            }
            // Hommes-poissons élites
            availableEnemies.push({ type: 'fishman_elite', weight: t6Weight * 1.1 });
            availableEnemies.push({ type: 'fishman_berserker', weight: t6Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_officer', weight: t6Weight * 0.9 });
            availableEnemies.push({ type: 'fishman_merman', weight: t6Weight * 0.95 });
        }
        
        // === TIER 7: Hommes-poissons champions + Animaux puissants (vagues 40-50) ===
        if (waveNumber >= 40) {
            const t7Weight = Math.min(5, 1 + (waveNumber - 40) * 0.1);
            // Garder quelques hommes-poissons élites
            if (waveNumber < 50) {
                availableEnemies.push({ type: 'fishman_elite', weight: t7Weight * 0.4 });
                availableEnemies.push({ type: 'fishman_officer', weight: t7Weight * 0.3 });
            }
            // Hommes-poissons champions
            availableEnemies.push({ type: 'fishman_champion', weight: t7Weight * 1.0 });
            availableEnemies.push({ type: 'fishman_shaman', weight: t7Weight * 0.9 });
            availableEnemies.push({ type: 'octopus_warrior', weight: t7Weight * 0.95 });
            // Animaux puissants
            availableEnemies.push({ type: 'gorilla', weight: t7Weight * 1.1 });
            availableEnemies.push({ type: 'jellyfish', weight: t7Weight * 0.9 });
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
