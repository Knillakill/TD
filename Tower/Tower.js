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
            this.sprite.setDisplaySize(28, 56); // Ratio 41:83, réduit
            this.sprite.play('luffy_idle');
            this.isAnimated = true;
        } else if (this.type === 'zoro' && scene.textures.exists('zoro')) {
            // Créer un sprite animé pour Zoro
            this.sprite = scene.add.sprite(x, y, 'zoro');
            this.sprite.setDisplaySize(28, 60); // Ratio 39:85, réduit
            this.sprite.play('zoro_idle');
            this.isAnimated = true;
        } else if (this.type === 'usopp' && scene.textures.exists('usopp')) {
            // Créer un sprite animé pour Usopp
            this.sprite = scene.add.sprite(x, y, 'usopp');
            this.sprite.setDisplaySize(27, 50); // Analyse précise: 35x63 → 27x50
            this.sprite.setOrigin(0.5, 0.889); // Pieds à Y=56/63 = 0.889
            this.sprite.play('usopp_idle');
            this.isAnimated = true;
        } else if (scene.textures.exists(this.type)) {
            this.sprite = scene.add.image(x, y, this.type);
            this.sprite.setDisplaySize(35, 35); // Réduit
        } else {
            this.sprite = scene.add.rectangle(x, y, 30, 30, this.color); // Réduit
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
        this.rangeCircle.setVisible(false); // Invisible par défaut
        
        // Les événements de survol et drag sont gérés par TowerPlacement.js
        
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
                
                // Retourner le sprite si l'ennemi est à droite (inverser pour que Luffy regarde le cône)
                this.sprite.setFlipX(Math.cos(angleToEnemy) >= 0);
                
                // Changer la texture pour l'animation d'attaque
                this.sprite.setTexture('luffy_attack_sheet');
                this.sprite.setDisplaySize(50, 46); // Réduit proportionnellement
                this.sprite.play('luffy_attack');
                
                // Effet visuel du cône ULTRA QUALI
                const coneAngle = Math.PI / 3; // 60 degrés (30° de chaque côté)
                
                // 1. Onde de choc principale (dégradé rouge/orange)
                const shockwave1 = this.scene.add.graphics();
                shockwave1.setDepth(5);
                shockwave1.fillGradientStyle(0xff0000, 0xff0000, 0xff6600, 0xff6600, 0.6, 0.6, 0.3, 0.3);
                shockwave1.beginPath();
                shockwave1.moveTo(this.sprite.x, this.sprite.y);
                shockwave1.arc(
                    this.sprite.x,
                    this.sprite.y,
                    this.range,
                    angleToEnemy - coneAngle / 2,
                    angleToEnemy + coneAngle / 2,
                    false
                );
                shockwave1.closePath();
                shockwave1.fillPath();
                
                // 2. Bordures du cône avec effet électrique
                const border1 = this.scene.add.graphics();
                border1.setDepth(6);
                border1.lineStyle(3, 0xffff00, 0.9);
                border1.beginPath();
                border1.arc(
                    this.sprite.x,
                    this.sprite.y,
                    this.range,
                    angleToEnemy - coneAngle / 2,
                    angleToEnemy + coneAngle / 2,
                    false
                );
                border1.strokePath();
                
                const border2 = this.scene.add.graphics();
                border2.setDepth(6);
                border2.lineStyle(3, 0xffff00, 0.9);
                border2.beginPath();
                border2.moveTo(this.sprite.x, this.sprite.y);
                border2.lineTo(
                    this.sprite.x + Math.cos(angleToEnemy - coneAngle / 2) * this.range,
                    this.sprite.y + Math.sin(angleToEnemy - coneAngle / 2) * this.range
                );
                border2.strokePath();
                
                const border3 = this.scene.add.graphics();
                border3.setDepth(6);
                border3.lineStyle(3, 0xffff00, 0.9);
                border3.beginPath();
                border3.moveTo(this.sprite.x, this.sprite.y);
                border3.lineTo(
                    this.sprite.x + Math.cos(angleToEnemy + coneAngle / 2) * this.range,
                    this.sprite.y + Math.sin(angleToEnemy + coneAngle / 2) * this.range
                );
                border3.strokePath();
                
                // 3. Particules d'impact le long du cône
                for (let i = 0; i < 20; i++) {
                    const particleAngle = angleToEnemy - coneAngle / 2 + (Math.random() * coneAngle);
                    const particleDist = Math.random() * this.range;
                    const px = this.sprite.x + Math.cos(particleAngle) * particleDist;
                    const py = this.sprite.y + Math.sin(particleAngle) * particleDist;
                    
                    const particle = this.scene.add.circle(px, py, 3 + Math.random() * 3, 0xffff00, 1);
                    particle.setDepth(7);
                    
                    this.scene.tweens.add({
                        targets: particle,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        duration: 200 + Math.random() * 150,
                        ease: 'Power2',
                        onComplete: () => particle.destroy()
                    });
                }
                
                // 4. Flash d'impact au bout du cône
                const impactX = this.sprite.x + Math.cos(angleToEnemy) * this.range * 0.8;
                const impactY = this.sprite.y + Math.sin(angleToEnemy) * this.range * 0.8;
                const impactFlash = this.scene.add.circle(impactX, impactY, 15, 0xffffff, 0.9);
                impactFlash.setDepth(8);
                
                this.scene.tweens.add({
                    targets: impactFlash,
                    scaleX: 3,
                    scaleY: 3,
                    alpha: 0,
                    duration: 250,
                    ease: 'Cubic.easeOut',
                    onComplete: () => impactFlash.destroy()
                });
                
                // 5. Lignes d'énergie (effet de vitesse)
                for (let i = 0; i < 5; i++) {
                    const lineAngle = angleToEnemy - coneAngle / 4 + (Math.random() * coneAngle / 2);
                    const line = this.scene.add.graphics();
                    line.setDepth(6);
                    line.lineStyle(2, 0xff3300, 0.8);
                    line.beginPath();
                    line.moveTo(this.sprite.x, this.sprite.y);
                    line.lineTo(
                        this.sprite.x + Math.cos(lineAngle) * this.range * 0.6,
                        this.sprite.y + Math.sin(lineAngle) * this.range * 0.6
                    );
                    line.strokePath();
                    
                    this.scene.tweens.add({
                        targets: line,
                        alpha: 0,
                        duration: 150,
                        delay: i * 20,
                        onComplete: () => line.destroy()
                    });
                }
                
                // 6. Faire disparaître l'effet principal avec pulsation
                this.scene.tweens.add({
                    targets: shockwave1,
                    alpha: 0,
                    duration: 250,
                    ease: 'Power2',
                    onComplete: () => shockwave1.destroy()
                });
                
                this.scene.tweens.add({
                    targets: [border1, border2, border3],
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        border1.destroy();
                        border2.destroy();
                        border3.destroy();
                    }
                });
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle
                    this.sprite.setTexture('luffy');
                    this.sprite.setDisplaySize(28, 56); // Réduit
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
                this.sprite.setDisplaySize(52, 62); // Ratio 71:84, réduit
                this.sprite.play('zoro_attack');
                
                // EFFET ULTRA QUALI : Attaque des 3 sabres
                
                // 1. Onde de choc circulaire principale (vert émeraude)
                const shockwave = this.scene.add.graphics();
                shockwave.setDepth(5);
                shockwave.fillGradientStyle(0x00ff00, 0x00ff00, 0x00ff88, 0x00ffff, 0.5, 0.5, 0.2, 0.2);
                shockwave.fillCircle(this.sprite.x, this.sprite.y, 10);
                
                this.scene.tweens.add({
                    targets: shockwave,
                    alpha: 0,
                    duration: 350,
                    ease: 'Power2',
                    onUpdate: () => {
                        shockwave.clear();
                        const progress = 1 - shockwave.alpha;
                        const currentRadius = 10 + (this.range - 10) * progress;
                        shockwave.fillGradientStyle(0x00ff00, 0x00ff00, 0x00ff88, 0x00ffff, 0.5, 0.5, 0.2, 0.2);
                        shockwave.fillCircle(this.sprite.x, this.sprite.y, currentRadius);
                    },
                    onComplete: () => shockwave.destroy()
                });
                
                // 2. Les 3 lames d'énergie tournantes (technique des 3 sabres)
                for (let i = 0; i < 3; i++) {
                    const bladeAngle = (i * Math.PI * 2 / 3); // 120° entre chaque lame
                    const blade = this.scene.add.graphics();
                    blade.setDepth(6);
                    
                    // Dessiner une lame avec dégradé
                    blade.lineStyle(4, 0x00ff00, 1);
                    blade.lineGradientStyle(4, 0xffffff, 0x00ff00, 0x00ff88, 0x00ffff, 1, 1, 0.8, 0.5);
                    blade.beginPath();
                    blade.moveTo(this.sprite.x, this.sprite.y);
                    blade.lineTo(
                        this.sprite.x + Math.cos(bladeAngle) * this.range,
                        this.sprite.y + Math.sin(bladeAngle) * this.range
                    );
                    blade.strokePath();
                    
                    // Animation de rotation et disparition
                    this.scene.tweens.add({
                        targets: blade,
                        alpha: 0,
                        duration: 300,
                        delay: i * 30,
                        onUpdate: () => {
                            const rotation = (1 - blade.alpha) * Math.PI / 4; // 45° de rotation
                            blade.clear();
                            blade.lineStyle(4, 0x00ff00, blade.alpha);
                            blade.beginPath();
                            blade.moveTo(this.sprite.x, this.sprite.y);
                            blade.lineTo(
                                this.sprite.x + Math.cos(bladeAngle + rotation) * this.range,
                                this.sprite.y + Math.sin(bladeAngle + rotation) * this.range
                            );
                            blade.strokePath();
                        },
                        onComplete: () => blade.destroy()
                    });
                }
                
                // 3. Cercles d'énergie concentriques (effet de puissance)
                for (let i = 1; i <= 3; i++) {
                    const ring = this.scene.add.circle(
                        this.sprite.x,
                        this.sprite.y,
                        this.range * 0.3 * i,
                        0x00ff00,
                        0
                    );
                    ring.setDepth(5);
                    ring.setStrokeStyle(2, 0x00ff00, 0.8);
                    
                    this.scene.tweens.add({
                        targets: ring,
                        scaleX: 1.2,
                        scaleY: 1.2,
                        alpha: 0,
                        duration: 300,
                        delay: i * 40,
                        ease: 'Cubic.easeOut',
                        onComplete: () => ring.destroy()
                    });
                }
                
                // 4. Particules de tranchage (×30 pour plus d'impact)
                for (let i = 0; i < 30; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const dist = Math.random() * this.range;
                    const px = this.sprite.x + Math.cos(angle) * dist;
                    const py = this.sprite.y + Math.sin(angle) * dist;
                    
                    // Particules en forme de petites lames
                    const particle = this.scene.add.graphics();
                    particle.setDepth(7);
                    particle.lineStyle(2, 0x00ff00, 1);
                    particle.beginPath();
                    particle.moveTo(px - 3, py);
                    particle.lineTo(px + 3, py);
                    particle.strokePath();
                    
                    this.scene.tweens.add({
                        targets: particle,
                        alpha: 0,
                        duration: 200 + Math.random() * 100,
                        delay: Math.random() * 50,
                        onUpdate: () => {
                            const vel = (1 - particle.alpha) * 15;
                            particle.x += Math.cos(angle) * vel * 0.016;
                            particle.y += Math.sin(angle) * vel * 0.016;
                        },
                        onComplete: () => particle.destroy()
                    });
                }
                
                // 5. Flash central blanc (impact des 3 sabres)
                const centerFlash = this.scene.add.circle(
                    this.sprite.x,
                    this.sprite.y,
                    20,
                    0xffffff,
                    0.9
                );
                centerFlash.setDepth(8);
                
                this.scene.tweens.add({
                    targets: centerFlash,
                    scaleX: 4,
                    scaleY: 4,
                    alpha: 0,
                    duration: 200,
                    ease: 'Cubic.easeOut',
                    onComplete: () => centerFlash.destroy()
                });
                
                // 6. Étoiles d'impact aux bords (effet de tranchage)
                for (let i = 0; i < 8; i++) {
                    const starAngle = (i * Math.PI * 2 / 8);
                    const sx = this.sprite.x + Math.cos(starAngle) * this.range * 0.9;
                    const sy = this.sprite.y + Math.sin(starAngle) * this.range * 0.9;
                    
                    const star = this.scene.add.circle(sx, sy, 5, 0xffff00, 0.9);
                    star.setDepth(7);
                    
                    this.scene.tweens.add({
                        targets: star,
                        scaleX: 0,
                        scaleY: 0,
                        alpha: 0,
                        duration: 250,
                        delay: i * 20,
                        ease: 'Back.easeIn',
                        onComplete: () => star.destroy()
                    });
                }
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle
                    this.sprite.setTexture('zoro');
                    this.sprite.setDisplaySize(28, 60); // Réduit
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
            
            // Usopp tire avec son lance-pierre (animation d'attaque)
            if (this.type === 'usopp' && this.isAnimated) {
                // Jouer l'animation de tir
                this.sprite.setTexture('usopp_attack_sheet');
                this.sprite.setDisplaySize(55, 50); // Analyse précise: 51x46 → 55x50
                this.sprite.setOrigin(0.5, 0.891); // Pieds à Y=41/46 = 0.891
                this.sprite.play('usopp_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle
                    this.sprite.setTexture('usopp');
                    this.sprite.setDisplaySize(27, 50);
                    this.sprite.setOrigin(0.5, 0.889);
                    this.sprite.play('usopp_idle');
                });
            }
            
            // Les autres tours (et Usopp) lancent des projectiles
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

