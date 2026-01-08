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
        
        // Charger la spritesheet de Luffy idle
        // 369x83 pixels - 9 frames de 41x83
        this.load.spritesheet('luffy', 'assets/luffysprite.png', {
            frameWidth: 41,
            frameHeight: 83
        });
        
        // Charger la spritesheet de Luffy attaque (coups de poings)
        // 1088x73 pixels - 17 frames uniformes de 64x73
        this.load.spritesheet('luffy_attack_sheet', 'assets/luffyspritecb_uniform.png', {
            frameWidth: 64,
            frameHeight: 73
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
        // 140x63 pixels - 4 frames de 35x63
        this.load.spritesheet('usopp', 'assets/ussopsprite.png', {
            frameWidth: 35,
            frameHeight: 63
        });
        
        // Charger la spritesheet d'Usopp attaque
        // 412x46 pixels - 8 frames de 51x46
        this.load.spritesheet('usopp_attack_sheet', 'assets/ussopspritecb.png', {
            frameWidth: 51,
            frameHeight: 46
        });
        
        // Charger les sprites des autres personnages
        this.load.image('nami', 'assets/nami.png');
        // À ajouter : sanji, robin, franky, chopper, brook
    }

    create() {
        // Ajouter l'image de fond au centre (x=300 pour laisser l'espace à gauche)
        const map = this.add.image(300, 0, 'arlong_park');
        map.setOrigin(0, 0);
        map.setDisplaySize(1100, 800);
        map.setDepth(0);
        
        // Créer les animations pour Luffy et Zoro
        this.createAnimations();
        
        this.player = new Player();
        this.enemies = [];
        this.projectiles = [];
        this.towers = [];
        
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
        
        // Créer les contrôles de vagues
        this.waveControl = new WaveControl(this);
        
        // Créer le panneau d'informations des ennemis
        this.enemyInfoPanel = new EnemyInfoPanel(this);
        
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
        this.ui.showMessage('GAME OVER!', 5000);
        this.scene.pause();
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
        // luffyspritecb_uniform.png : 1088x73, 17 frames uniformes de 64x73
        this.anims.create({
            key: 'luffy_attack',
            frames: this.anims.generateFrameNumbers('luffy_attack_sheet', { start: 0, end: 16 }),
            frameRate: 12,
            repeat: 0
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
        // 140x63 - 4 frames de 35x63
        this.anims.create({
            key: 'usopp_idle',
            frames: this.anims.generateFrameNumbers('usopp', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });
        
        // Animation d'attaque d'Usopp
        // 412x46 - 8 frames de 51x46
        this.anims.create({
            key: 'usopp_attack',
            frames: this.anims.generateFrameNumbers('usopp_attack_sheet', { start: 0, end: 7 }),
            frameRate: 12,
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
    }
}

