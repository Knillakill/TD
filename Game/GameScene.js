class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }
    
    preload() {
        // Charger l'image de la map Arlong Park
        this.load.image('arlong_park', 'assets/map1.png');
        
        // Charger le spritesheet du pirate à l'épée (SwdPirate - pirate_basic)
        // 253x50 pixels - 6 frames de 42x50
        this.load.spritesheet('swd_pirate_walk', 'assets/SwdPirates.png', {
            frameWidth: 42,
            frameHeight: 50
        });
        
        // Charger le spritesheet de mort du pirate à l'épée
        // 100x60 pixels - 2 frames de 50x60
        this.load.spritesheet('swd_pirate_death', 'assets/SwdPiratesdeath.png', {
            frameWidth: 50,
            frameHeight: 60
        });
        
        // Charger le spritesheet du pirate au pistolet (GunPirate - pirate_fast)
        // 299x58 pixels - 6 frames de 49x58
        this.load.spritesheet('gun_pirate_walk', 'assets/GunPirate.png', {
            frameWidth: 49,
            frameHeight: 58
        });
        
        // Charger le spritesheet de mort du pirate au pistolet
        // 279x51 pixels - 5 frames de 55x51
        this.load.spritesheet('gun_pirate_death', 'assets/GunPiratedeath.png', {
            frameWidth: 55,
            frameHeight: 51
        });
        
        // Charger le spritesheet du pirate tank (knife_pirate - pirate_shield)
        // 140x53 pixels - 4 frames de 35x53 (31px contenu + 4px espacement)
        this.load.spritesheet('knife_pirate_walk', 'assets/knife_pirate_walk.png', {
            frameWidth: 35,
            frameHeight: 53
        });
        
        // Charger le mug de Luffy (fond de carte)
        this.load.image('luffymug', 'assets/luffymug.png');
        
        // Charger la spritesheet de Luffy idle
        // Charger la spritesheet de Luffy idle (9 frames équidistants)
        // 396x68 pixels - 9 frames de 44x68 (équidistant, centré)
        this.load.spritesheet('luffy', 'assets/luffysprite_normalized.png', {
            frameWidth: 44,
            frameHeight: 68
        });
        
        // Charger la spritesheet de Luffy attaque (12 frames uniformes)
        // 768x73 pixels - 12 frames de 64x73 (uniforme, centré)
        this.load.spritesheet('luffy_attack_sheet', 'assets/luffyspritecb_uniform.png', {
            frameWidth: 64,
            frameHeight: 73
        });
        
        // Charger la spritesheet des projectiles de Luffy (poings)
        // 120x71 pixels - 5 frames de 24x71 (uniforme)
        this.load.spritesheet('luffy_projectile', 'assets/luffyspriteproject_uniform.png', {
            frameWidth: 24,
            frameHeight: 71
        });
        
        // Charger la spritesheet de Zoro idle
        // 156x85 pixels - 4 frames de 39x85
        this.load.spritesheet('zoro', 'assets/zorrosprite.png', {
            frameWidth: 39,
            frameHeight: 85
        });
        
        // Charger la spritesheet de Zoro attaque
        // 923x84 pixels - 13 frames uniformes de 71x84
        this.load.spritesheet('zoro_attack_sheet', 'assets/zorrospritecb_uniform.png', {
            frameWidth: 71,
            frameHeight: 84
        });
        
        // Charger la spritesheet d'Usopp idle
        // 236x65 pixels - 4 frames de 59x65
        this.load.spritesheet('usopp', 'assets/usoppsprite.png', {
            frameWidth: 59,
            frameHeight: 65
        });
        
        // Charger la spritesheet d'Usopp attaque (position de tir)
        // 176x58 pixels - 4 frames de 44x58
        this.load.spritesheet('usopp_attack_sheet', 'assets/usoppspritecb.png', {
            frameWidth: 44,
            frameHeight: 58
        });
        
        // Charger la spritesheet de Chopper idle (4 frames équidistants)
        // 4 frames de 28x39 (équidistant, centré)
        this.load.spritesheet('chopper', 'assets/choppersprite_normalized.png', {
            frameWidth: 28,
            frameHeight: 39
        });
        
        // Charger la spritesheet de Chopper attaque
        // 7 frames de 28x36 (équidistant)
        this.load.spritesheet('chopper_attack_sheet', 'assets/chopperspritecb_normalized.png', {
            frameWidth: 28,
            frameHeight: 36
        });
        
        // Charger la spritesheet de Franky idle
        // 327x102 pixels - 4 frames de 81x102
        this.load.spritesheet('franky', 'assets/frankysprite.png', {
            frameWidth: 81,
            frameHeight: 102
        });
        
        // Charger la spritesheet de Sanji idle
        // 111x77 pixels - 4 frames de 27x77
        this.load.spritesheet('sanji', 'assets/sanjisprite_normalized.png', {
            frameWidth: 27,
            frameHeight: 77
        });
        
        // Charger la spritesheet de Sanji attaque
        // 1545x106 pixels - 15 frames de 103x106
        this.load.spritesheet('sanji_attack_sheet', 'assets/sanjispritecb_uniform.png', {
            frameWidth: 103,
            frameHeight: 106
        });
        
        // Charger la spritesheet de Nami idle (espacement 10px à droite)
        // 150x86 pixels - 3 frames de 50x86 (40px contenu + 10px espacement)
        this.load.spritesheet('nami', 'assets/namisprite_spaced.png', {
            frameWidth: 50,
            frameHeight: 86
        });
        
        // Charger la spritesheet de Nami attaque (espacement 10px à droite)
        // 912x104 pixels - 12 frames de 76x104 (66px contenu + 10px espacement)
        this.load.spritesheet('nami_attack_sheet', 'assets/namispritecb_spaced.png', {
            frameWidth: 76,
            frameHeight: 104
        });
        
        // Charger la spritesheet du nuage de Nami (espacement 10px à droite)
        // 1054x176 pixels - 5 frames de ~210x176 (200px contenu + 10px espacement)
        this.load.spritesheet('nami_cloud', 'assets/namispriteproject_spaced.png', {
            frameWidth: 210,
            frameHeight: 176
        });
        
        // À ajouter : robin, brook
        
        // Charger l'icône berry (monnaie)
        this.load.image('berry', 'assets/berry.webp');
    }

    create() {
        // Ajouter l'image de fond au centre (x=300 pour laisser l'espace à gauche)
        const map = this.add.image(300, 0, 'arlong_park');
        map.setOrigin(0, 0);
        map.setDisplaySize(1100, 800);
        map.setDepth(0);
        
        // Créer les animations pour Luffy et Zoro
        this.createAnimations();
        
        // Vérifier si on doit forcer un reset (paramètre URL ?reset=1)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reset') === '1') {
            console.log('[GameScene] FORCE RESET détecté - Suppression de toutes les sauvegardes');
            localStorage.clear();
            sessionStorage.clear();
            // Supprimer le paramètre reset de l'URL et recharger
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        this.player = new Player();
        this.enemies = [];
        this.projectiles = [];
        this.towers = [];
        
        // Initialiser la vague de départ
        this.waveNumber = 0; // Par défaut, commence à 0
        
        // Gestionnaire de sauvegarde
        this.saveManager = new SaveManager(this);
        
        // Charger la sauvegarde si elle existe
        const saveData = this.saveManager.loadSave();
        if (saveData) {
            this.saveManager.applySaveData(saveData);
            // applySaveData définit this.waveNumber
            
            // Afficher un message de bienvenue avec la vague actuelle
            if (this.waveNumber > 0) {
                const checkpoints = [1, 25, 50, 75, 100];
                const isCheckpoint = checkpoints.includes(this.waveNumber);
                const message = isCheckpoint 
                    ? `🎯 Checkpoint atteint - Vague ${this.waveNumber}`
                    : `📍 Reprise à la vague ${this.waveNumber}`;
                
                this.time.delayedCall(1000, () => {
                    if (this.ui) {
                        this.ui.showMessage(message, 3000);
                    }
                });
            }
        }
        
        // Ne pas dessiner le chemin par-dessus l'image (commenté)
        // MapRenderer.drawPath(this, PATH);
        
        // Créer le gestionnaire de vagues
        this.waveManager = new WaveManager(this, PATH);
        
        // Créer l'interface utilisateur
        this.ui = new UI(this, this.player);
        
        // Créer le menu de sélection des tours
        this.towerMenu = new TowerMenu(this);
        
        // Créer le système de placement des tours
        this.placementSystem = new TowerPlacement(this);
        
        // Restaurer les tours placées depuis la sauvegarde
        if (this.saveManager) {
            this.saveManager.restorePlacedTowers();
        }
        
        // Créer les contrôles de vagues
        this.waveControl = new WaveControl(this);
        
        // Restaurer l'autoPlay depuis la sauvegarde
        if (this.savedAutoPlay && this.waveControl) {
            this.waveControl.autoPlay = this.savedAutoPlay;
            if (this.savedAutoPlay) {
                this.waveControl.autoPlayButton.setFillStyle(0x3498db);
                this.waveControl.autoPlayText.setText('AUTO ✓');
            }
        }
        
        // Créer le panneau d'informations des ennemis
        this.enemyInfoPanel = new EnemyInfoPanel(this);
        
        // Créer le menu horizontal en haut
        this.topMenu = new TopMenu(this, this.player);
        
        // Afficher "Vague 1" avec les ennemis de la première vague (avant de lancer)
        if (WAVE_ENEMY_DISTRIBUTION[1]) {
            this.enemyInfoPanel.updateWaveEnemies(WAVE_ENEMY_DISTRIBUTION[1], 1);
        }
    }

    update(time, delta) {
        // Mettre à jour le gestionnaire de vagues
        const newEnemy = this.waveManager.update(time);
        if (newEnemy) {
            this.enemies.push(newEnemy);
        }
        
        // Mettre à jour les ennemis
        this.updateEnemies(delta);
        
        // Mettre à jour les tours
        this.updateTowers(time);
        
        // Mettre à jour les projectiles
        this.updateProjectiles(delta);
        
        // Mettre à jour l'interface avec les infos de vague
        const waveInfo = this.waveManager.getWaveInfo();
        this.ui.update(waveInfo);
        
        // Mettre à jour les contrôles de vagues
        this.waveControl.update();
        
        // Mettre à jour le menu des tours (stats joueur)
        this.towerMenu.update();
        
        // Mettre à jour les stats du joueur dans le panneau
        this.enemyInfoPanel.updatePlayerStats(this.player);
    }
    
    updateEnemies(delta) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (!enemy.alive) {
                // Donner la récompense spécifique à l'ennemi
                this.player.gold += enemy.getReward();
                this.enemies.splice(i, 1);
                this.waveManager.enemyKilled();
                continue;
            }
            
            enemy.update(delta);

            if(enemy.pathIndex >= PATH.length - 1) {
                enemy.reachEnd(this.player);
                this.enemies.splice(i, 1);
                this.waveManager.enemyReachedEnd();
                
                if (this.player.hp <= 0) {
                    this.gameOver();
                }
            }
        }
    }
    
    updateTowers(time) {
        this.towers.forEach(tower => {
            const closestEnemy = this.findClosestEnemy(tower);
            const projectile = tower.update(time, closestEnemy);
            
            if (projectile) {
                this.projectiles.push(projectile);
            }
        });
    }
    
    updateProjectiles(delta) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            const active = projectile.update(delta);
            
            if (!active) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    findClosestEnemy(tower) {
        // Trouver l'ennemi le plus avancé sur le chemin (premier ennemi)
        let firstEnemy = null;
        let maxProgress = -1;
        
        this.enemies.forEach(enemy => {
            // Calculer la distance à la tour
            const dist = Phaser.Math.Distance.Between(
                tower.sprite.x,
                tower.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y
            );
            
            // Si l'ennemi est dans la portée
            if (dist <= tower.range) {
                // L'ennemi avec le pathIndex le plus élevé est le plus avancé
                if (enemy.pathIndex > maxProgress) {
                    maxProgress = enemy.pathIndex;
                    firstEnemy = enemy;
                }
            }
        });
        
        return firstEnemy;
    }
    
    gameOver() {
        // Sauvegarder avec le flag game over
        if (this.saveManager) {
            this.saveManager.autoSave();
        }
        
        // Déterminer le checkpoint de respawn
        const checkpoint = this.saveManager.getLastCheckpoint();
        
        // Afficher le message de game over
        this.ui.showMessage('GAME OVER!', 5000);
        
        // Créer un overlay de game over avec option de redémarrer
        this.createGameOverScreen(checkpoint);
        
        this.scene.pause();
    }
    
    createGameOverScreen(checkpoint) {
        // Overlay sombre
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.8
        );
        overlay.setDepth(3000);
        overlay.setScrollFactor(0);
        
        // Texte GAME OVER
        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 120,
            '☠️ GAME OVER ☠️',
            {
                fontSize: '64px',
                fontFamily: 'Arial',
                color: '#ff6b6b',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(3001);
        gameOverText.setScrollFactor(0);
        
        // Calculer les boutons à afficher
        const hasCheckpoint = checkpoint > 1;
        const buttonY = hasCheckpoint ? this.cameras.main.centerY + 20 : this.cameras.main.centerY + 50;
        
        // Bouton "Recommencer à la vague 1"
        const restartBtn = this.add.rectangle(
            this.cameras.main.centerX,
            buttonY,
            280, 55,
            0x51cf66,
            0.9
        );
        restartBtn.setDepth(3001);
        restartBtn.setScrollFactor(0);
        restartBtn.setStrokeStyle(3, 0xffffff, 0.8);
        restartBtn.setInteractive({ useHandCursor: true });
        
        const restartText = this.add.text(
            this.cameras.main.centerX,
            buttonY,
            '🔄 Recommencer (Vague 1)',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        );
        restartText.setOrigin(0.5);
        restartText.setDepth(3002);
        restartText.setScrollFactor(0);
        
        restartBtn.on('pointerover', () => {
            restartBtn.setFillStyle(0x8ce99a, 0.9);
        });
        
        restartBtn.on('pointerout', () => {
            restartBtn.setFillStyle(0x51cf66, 0.9);
        });
        
        restartBtn.on('pointerdown', () => {
            // Sauvegarder avec vague 0 pour recommencer à la vague 1
            if (this.saveManager) {
                this.saveManager.saveAtWave(0);
            }
            window.location.reload();
        });
        
        // Bouton "Reprendre au checkpoint" (seulement si checkpoint > 1)
        if (hasCheckpoint) {
            const checkpointBtn = this.add.rectangle(
                this.cameras.main.centerX,
                buttonY + 70,
                280, 55,
                0x3b82f6,
                0.9
            );
            checkpointBtn.setDepth(3001);
            checkpointBtn.setScrollFactor(0);
            checkpointBtn.setStrokeStyle(3, 0xffffff, 0.8);
            checkpointBtn.setInteractive({ useHandCursor: true });
            
            const checkpointText = this.add.text(
                this.cameras.main.centerX,
                buttonY + 70,
                `🎯 Reprendre (Vague ${checkpoint})`,
                {
                    fontSize: '20px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            );
            checkpointText.setOrigin(0.5);
            checkpointText.setDepth(3002);
            checkpointText.setScrollFactor(0);
            
            checkpointBtn.on('pointerover', () => {
                checkpointBtn.setFillStyle(0x60a5fa, 0.9);
            });
            
            checkpointBtn.on('pointerout', () => {
                checkpointBtn.setFillStyle(0x3b82f6, 0.9);
            });
            
            checkpointBtn.on('pointerdown', () => {
                // Sauvegarder avec le checkpoint pour reprendre à cette vague
                if (this.saveManager) {
                    this.saveManager.saveAtWave(checkpoint);
                }
                window.location.reload();
            });
            
            // Info sur le checkpoint
            const infoText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 40,
                `Checkpoints atteints: ${this.getCheckpointsReached().join(', ') || 'Aucun'}`,
                {
                    fontSize: '16px',
                    fontFamily: 'Arial',
                    color: '#94a3b8'
                }
            );
            infoText.setOrigin(0.5);
            infoText.setDepth(3001);
            infoText.setScrollFactor(0);
        }
    }
    
    getCheckpointsReached() {
        const checkpoints = [25, 50, 75, 100];
        const reached = [];
        const completedWaves = this.player.completedWaves || {};
        
        checkpoints.forEach(cp => {
            // Vérifier si on a complété au moins une vague >= checkpoint
            const hasReached = Object.keys(completedWaves).some(wave => parseInt(wave) >= cp);
            if (hasReached) {
                reached.push(cp);
            }
        });
        
        return reached;
    }
    
    createAnimations() {
        // Animation idle/stance de Luffy (spritesheet principale)
        // 369x83 - 9 frames de 41x83
        this.anims.create({
            key: 'luffy_idle',
            frames: this.anims.generateFrameNumbers('luffy', { start: 0, end: 8 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Animation d'attaque de Luffy (spritesheet séparée - coups de poings)
        // luffyspritecb_uniform.png : 768x73, 12 frames uniformes de 64x73
        this.anims.create({
            key: 'luffy_attack',
            frames: this.anims.generateFrameNumbers('luffy_attack_sheet', { start: 0, end: 11 }),
            frameRate: 14,
            repeat: 0
        });
        
        // Animation du projectile de Luffy (poing qui vole)
        // luffyspriteproject_uniform.png : 120x71, 5 frames de 24x71
        this.anims.create({
            key: 'luffy_projectile',
            frames: this.anims.generateFrameNumbers('luffy_projectile', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        
        // Animation idle de Zoro
        // 156x85 - 4 frames de 39x85
        this.anims.create({
            key: 'zoro_idle',
            frames: this.anims.generateFrameNumbers('zoro', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation d'attaque de Zoro
        // 923x84 - 13 frames uniformes de 71x84
        this.anims.create({
            key: 'zoro_attack',
            frames: this.anims.generateFrameNumbers('zoro_attack_sheet', { start: 0, end: 12 }),
            frameRate: 14,
            repeat: 0
        });
        
        // Animation idle d'Usopp
        // 4 frames de 59x65
        this.anims.create({
            key: 'usopp_idle',
            frames: this.anims.generateFrameNumbers('usopp', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation d'attaque d'Usopp (position de tir)
        // 4 frames de 44x58
        this.anims.create({
            key: 'usopp_attack',
            frames: this.anims.generateFrameNumbers('usopp_attack_sheet', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: 0
        });
        
        // Animation idle de Chopper
        // 4 frames de 28x39 (équidistant)
        this.anims.create({
            key: 'chopper_idle',
            frames: this.anims.generateFrameNumbers('chopper', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation d'attaque de Chopper
        // 7 frames de 28x36 (équidistant)
        this.anims.create({
            key: 'chopper_attack',
            frames: this.anims.generateFrameNumbers('chopper_attack_sheet', { start: 0, end: 6 }),
            frameRate: 14,
            repeat: 0
        });
        
        // Animation idle de Franky
        // 327x102 - 4 frames de 81x102
        this.anims.create({
            key: 'franky_idle',
            frames: this.anims.generateFrameNumbers('franky', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation idle de Sanji
        // 111x77 - 4 frames de 27x77
        this.anims.create({
            key: 'sanji_idle',
            frames: this.anims.generateFrameNumbers('sanji', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation d'attaque de Sanji
        // 1545x106 - 15 frames de 103x106
        this.anims.create({
            key: 'sanji_attack',
            frames: this.anims.generateFrameNumbers('sanji_attack_sheet', { start: 0, end: 14 }),
            frameRate: 18,
            repeat: 0
        });
        
        // Animation idle de Nami - légère animation de respiration
        // 3 frames de 44x86 (avec espacement)
        this.anims.create({
            key: 'nami_idle',
            frames: [
                { key: 'nami', frame: 0 },
                { key: 'nami', frame: 1 },
                { key: 'nami', frame: 0 }
            ],
            frameRate: 3, // Très lent pour un effet subtil
            repeat: -1
        });
        
        // Animation d'attaque de Nami - coup de bâton climatique
        // 12 frames de 70x104 (avec espacement)
        this.anims.create({
            key: 'nami_attack',
            frames: this.anims.generateFrameNumbers('nami_attack_sheet', { start: 0, end: 11 }),
            frameRate: 16,
            repeat: 0
        });
        
        // Animation du nuage de foudre de Nami - éclair qui frappe
        // 5 frames de 208x176 (avec espacement)
        this.anims.create({
            key: 'nami_cloud',
            frames: this.anims.generateFrameNumbers('nami_cloud', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: 0
        });
        
        // Animation du pirate à l'épée (pirate_basic)
        // 253x50 - 6 frames de 42x50
        this.anims.create({
            key: 'swd_pirate_walk',
            frames: this.anims.generateFrameNumbers('swd_pirate_walk', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Animation de mort du pirate à l'épée
        // 100x60 - 2 frames de 50x60
        // frameRate: 2 = 2 frames par seconde = 1 seconde pour toute l'animation
        this.anims.create({
            key: 'swd_pirate_death_anim',
            frames: this.anims.generateFrameNumbers('swd_pirate_death', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: 0
        });
        
        // Animation du pirate au pistolet (pirate_fast)
        // 299x58 - 6 frames de 49x58
        this.anims.create({
            key: 'gun_pirate_walk',
            frames: this.anims.generateFrameNumbers('gun_pirate_walk', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
        
        // Animation de mort du pirate au pistolet
        // 279x51 - 5 frames de 55x51
        // frameRate: 5 = 5 frames par seconde = 1 seconde pour toute l'animation
        this.anims.create({
            key: 'gun_pirate_death_anim',
            frames: this.anims.generateFrameNumbers('gun_pirate_death', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: 0
        });
        
        // Animation du pirate tank (knife_pirate - pirate_shield)
        // 140x53 - 4 frames de 35x53
        this.anims.create({
            key: 'knife_pirate_walk',
            frames: this.anims.generateFrameNumbers('knife_pirate_walk', { start: 0, end: 3 }),
            frameRate: 6, // Plus lent car c'est un tank
            repeat: -1
        });
    }
}

