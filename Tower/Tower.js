class Tower {
    constructor(scene, x = 300, y = 300, type = 'basic', towerData = null) {
        this.scene = scene;
        this.type = type;
        this.towerId = type;
        this.level = 1;
        
        // Utiliser les stats calculées pour le niveau du joueur
        if (towerData) {
            const playerLevel = scene.player ? scene.player.getTowerLevel(type) : 1;
            this.level = playerLevel;
            const stats = getTowerStats(type, playerLevel);
            this.range = stats.range;
            this.damage = stats.damage;
            // fireRate est en secondes, convertir en millisecondes
            this.fireRate = stats.fireRate * 1000;
            this.color = stats.color;
            this.critChance = stats.critChance || 0;
            this.towerData = towerData;
        } else {
            this.level = 1;
            this.range = 100;
            this.damage = 1;
            this.fireRate = 1000;
            this.color = 0x00ff00;
            this.critChance = 0;
            this.towerData = null;
        }
        
        this.lastShot = 0;
        this.x = x;
        this.y = y;
        this.isAnimated = false;

        // Sprite de la tour (animé pour Luffy/Zoro, image pour les autres, sinon rectangle)
        if (this.type === 'luffy' && scene.textures.exists('luffy')) {
            // Créer un sprite animé pour Luffy
            this.sprite = scene.add.sprite(x, y, 'luffy');
            this.sprite.setDisplaySize(45, 90); // Ratio 41:83
            this.sprite.play('luffy_idle');
            this.isAnimated = true;
        } else if (this.type === 'zoro' && scene.textures.exists('zoro')) {
            // Créer un sprite animé pour Zoro
            this.sprite = scene.add.sprite(x, y, 'zoro');
            this.sprite.setDisplaySize(45, 95); // Ratio 39:85
            this.sprite.play('zoro_idle');
            this.isAnimated = true;
        } else if (scene.textures.exists(this.type)) {
            this.sprite = scene.add.image(x, y, this.type);
            this.sprite.setDisplaySize(50, 50);
        } else {
            this.sprite = scene.add.rectangle(x, y, 40, 40, this.color);
        }
        this.sprite.setDepth(10);
        this.sprite.setInteractive({ useHandCursor: true });
        
        // Cercle de portée (invisible par défaut, visible au survol)
        this.rangeCircle = scene.add.circle(
            x, 
            y, 
            this.range, 
            this.color, 
            0
        );
        this.rangeCircle.setStrokeStyle(2, this.color, 0);
        this.rangeCircle.setDepth(0);
        
        // Afficher la portée au survol
        this.sprite.on('pointerover', () => {
            this.rangeCircle.setFillStyle(this.color, 0.1);
            this.rangeCircle.setStrokeStyle(2, this.color, 0.4);
            this.showStats();
        });
        
        this.sprite.on('pointerout', () => {
            this.rangeCircle.setFillStyle(this.color, 0);
            this.rangeCircle.setStrokeStyle(2, this.color, 0);
            this.hideStats();
        });
        
        // Clic pour améliorer
        this.sprite.on('pointerdown', () => {
            this.upgrade();
        });
        
        // Texte des stats (caché par défaut)
        this.statsText = null;
    }
    
    showStats() {
        if (this.statsText) return;
        
        // Synchroniser d'abord avec le niveau du joueur
        this.syncWithPlayerLevel();
        
        const config = TOWER_CONFIG[this.towerId];
        const upgradeCost = this.getUpgradeCost();
        const canUpgrade = this.level < config.maxLevel && this.scene.player.gold >= upgradeCost;
        
        let text = `${config.name} Nv.${this.level}/${config.maxLevel}\n`;
        text += `DMG: ${this.damage} | Crit: ${this.critChance.toFixed(1)}%\n`;
        text += `Portée: ${Math.round(this.range)} | Vitesse: ${(this.fireRate/1000).toFixed(2)}s\n`;
        if (this.level >= config.maxLevel) {
            text += `[Niveau MAX]`;
        } else if (canUpgrade) {
            text += `[Clic] +1 Nv: ${upgradeCost}💰`;
        } else {
            text += `Coût +1 Nv: ${upgradeCost}💰 (pas assez)`;
        }
        
        this.statsText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 70,
            text,
            { 
                fontSize: '11px', 
                fill: '#ffffff', 
                backgroundColor: '#000000aa',
                padding: { x: 6, y: 4 },
                align: 'center'
            }
        );
        this.statsText.setOrigin(0.5, 1);
        this.statsText.setDepth(200);
    }
    
    hideStats() {
        if (this.statsText) {
            this.statsText.destroy();
            this.statsText = null;
        }
    }

    update(time, enemy) {
        if(!enemy || !enemy.alive) return null;

        const dist = Phaser.Math.Distance.Between(
            this.sprite.x,
            this.sprite.y,
            enemy.sprite.x,
            enemy.sprite.y
        );

        if (dist <= this.range && time > this.lastShot) {
            this.lastShot = time + this.fireRate;
            
            // Luffy tape en cône vers l'ennemi ciblé
            if (this.type === 'luffy' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi ciblé
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite si l'ennemi est à gauche
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Changer la texture pour l'animation d'attaque
                this.sprite.setTexture('luffy_attack_sheet');
                this.sprite.setDisplaySize(70, 65);
                this.sprite.play('luffy_attack');
                
                // Effet visuel du cône
                const coneAngle = Math.PI / 3; // 60 degrés (30° de chaque côté)
                const graphics = this.scene.add.graphics();
                graphics.setDepth(5);
                graphics.fillStyle(0xff0000, 0.3);
                graphics.beginPath();
                graphics.moveTo(this.sprite.x, this.sprite.y);
                graphics.arc(
                    this.sprite.x,
                    this.sprite.y,
                    this.range,
                    angleToEnemy - coneAngle / 2,
                    angleToEnemy + coneAngle / 2,
                    false
                );
                graphics.closePath();
                graphics.fillPath();
                
                // Faire disparaître l'effet
                this.scene.tweens.add({
                    targets: graphics,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        graphics.destroy();
                    }
                });
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle
                    this.sprite.setTexture('luffy');
                    this.sprite.setDisplaySize(45, 90);
                    this.sprite.play('luffy_idle');
                    this.sprite.setFlipX(false);
                });
                
                // Calculer les dégâts (avec critique possible)
                let damage = this.damage;
                const isCrit = Math.random() * 100 < this.critChance;
                if (isCrit) {
                    damage *= 2; // Critique = double dégâts
                }
                
                // Infliger les dégâts à tous les ennemis dans le cône
                this.scene.enemies.forEach(e => {
                    if (e.alive) {
                        const d = Phaser.Math.Distance.Between(
                            this.sprite.x,
                            this.sprite.y,
                            e.sprite.x,
                            e.sprite.y
                        );
                        // Vérifier si dans la portée
                        if (d <= this.range) {
                            // Calculer l'angle vers cet ennemi
                            const angleToE = Phaser.Math.Angle.Between(
                                this.sprite.x,
                                this.sprite.y,
                                e.sprite.x,
                                e.sprite.y
                            );
                            // Vérifier si dans le cône (60°)
                            let angleDiff = Math.abs(angleToE - angleToEnemy);
                            if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
                            if (angleDiff <= coneAngle / 2) {
                                e.takeDamage(damage);
                            }
                        }
                    }
                });
                return null; // Pas de projectile
            }
            
            // Zoro attaque en zone avec ses sabres (tous les ennemis dans sa portée)
            if (this.type === 'zoro' && this.isAnimated) {
                // Changer la texture pour l'animation d'attaque
                this.sprite.setTexture('zoro_attack_sheet');
                this.sprite.setDisplaySize(75, 90); // Ratio 71:84
                this.sprite.play('zoro_attack');
                
                // Effet lumineux de zone
                const flashCircle = this.scene.add.circle(
                    this.sprite.x,
                    this.sprite.y,
                    10,
                    0x00ff00,
                    0.4
                );
                flashCircle.setDepth(5);
                flashCircle.setStrokeStyle(3, 0x00ff00, 0.8);
                
                // Animation de l'effet : expansion jusqu'à la portée puis disparition
                this.scene.tweens.add({
                    targets: flashCircle,
                    radius: this.range,
                    alpha: 0,
                    duration: 300,
                    ease: 'Power2',
                    onUpdate: () => {
                        // Redessiner le cercle avec le nouveau rayon
                        flashCircle.setRadius(flashCircle.radius);
                    },
                    onComplete: () => {
                        flashCircle.destroy();
                    }
                });
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle
                    this.sprite.setTexture('zoro');
                    this.sprite.setDisplaySize(45, 95);
                    this.sprite.play('zoro_idle');
                });
                
                // Calculer les dégâts (avec critique possible)
                let damage = this.damage;
                const isCrit = Math.random() * 100 < this.critChance;
                if (isCrit) {
                    damage *= 2; // Critique = double dégâts
                }
                
                // Infliger les dégâts à TOUS les ennemis dans la portée
                this.scene.enemies.forEach(e => {
                    if (e.alive) {
                        const d = Phaser.Math.Distance.Between(
                            this.sprite.x,
                            this.sprite.y,
                            e.sprite.x,
                            e.sprite.y
                        );
                        if (d <= this.range) {
                            e.takeDamage(damage);
                        }
                    }
                });
                return null; // Pas de projectile
            }
            
            // Les autres tours lancent des projectiles
            const projectile = new Projectile(
                this.scene, 
                this.sprite.x, 
                this.sprite.y, 
                enemy, 
                this.damage,
                this.color
            );
            return projectile;
        }
        return null;
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.rangeCircle) this.rangeCircle.destroy();
        if (this.statsText) this.statsText.destroy();
    }
    
    // Améliorer la tour via le joueur (global pour toutes les tours du même type)
    upgrade() {
        if (!this.scene.player.upgradeTower(this.towerId)) {
            return false;
        }
        
        // Mettre à jour le niveau local
        this.level = this.scene.player.getTowerLevel(this.towerId);
        
        // Mettre à jour les stats
        const stats = getTowerStats(this.towerId, this.level);
        this.damage = stats.damage;
        this.fireRate = stats.fireRate * 1000;
        this.critChance = stats.critChance;
        this.range = stats.range;
        
        // Mettre à jour le cercle de portée
        this.rangeCircle.setRadius(this.range);
        
        // Effet visuel de level up
        const levelUpText = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - 40,
            `Nv.${this.level}!`,
            { fontSize: '16px', fill: '#ffff00', fontStyle: 'bold' }
        );
        levelUpText.setOrigin(0.5);
        levelUpText.setDepth(100);
        
        this.scene.tweens.add({
            targets: levelUpText,
            y: levelUpText.y - 30,
            alpha: 0,
            duration: 1000,
            onComplete: () => levelUpText.destroy()
        });
        
        // Mettre à jour les stats du joueur
        if (this.scene.enemyInfoPanel) {
            this.scene.enemyInfoPanel.updatePlayerStats(this.scene.player);
        }
        
        return true;
    }
    
    // Obtenir le coût du prochain level up
    getUpgradeCost() {
        return getUpgradeCost(this.towerId, this.scene.player.getTowerLevel(this.towerId));
    }
    
    // Synchroniser les stats avec le niveau du joueur (pour les tours déjà placées)
    syncWithPlayerLevel() {
        const playerLevel = this.scene.player.getTowerLevel(this.towerId);
        if (playerLevel !== this.level) {
            this.level = playerLevel;
            const stats = getTowerStats(this.towerId, this.level);
            this.damage = stats.damage;
            this.fireRate = stats.fireRate * 1000;
            this.critChance = stats.critChance;
            this.range = stats.range;
            this.rangeCircle.setRadius(this.range);
        }
    }
    
    // Jouer l'animation de victoire (quand une vague est gagnée)
    playVictory() {
        // Animation désactivée pour l'instant - spritesheet complexe
    }
}

