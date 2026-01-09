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
        
        // Stats de combat pour l'onglet Stats
        this.totalDamage = 0;
        this.enemyKills = 0;

        // Mémoriser la dernière direction pour conserver l'orientation après l'attaque
        this.lastFlipX = true; // Par défaut, tous regardent à gauche
        
        // Sprite de la tour (animé pour Luffy/Zoro, image pour les autres, sinon rectangle)
        if (this.type === 'luffy' && scene.textures.exists('luffy')) {
            // Créer un sprite animé pour Luffy (44x68 original, ratio 1:1.545)
            this.sprite = scene.add.sprite(x, y, 'luffy');
            this.sprite.setDisplaySize(28, 43); // Largeur fixe 28, ratio respecté
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('luffy_idle');
            this.isAnimated = true;
        } else if (this.type === 'zoro' && scene.textures.exists('zoro')) {
            // Créer un sprite animé pour Zoro (39x85 original, ratio 1:2.179)
            this.sprite = scene.add.sprite(x, y, 'zoro');
            this.sprite.setDisplaySize(28, 61); // Largeur fixe 28, ratio respecté
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('zoro_idle');
            this.isAnimated = true;
        } else if (this.type === 'ussop' && scene.textures.exists('ussop')) {
            // Créer un sprite animé pour ussop
            this.sprite = scene.add.sprite(x, y, 'ussop');
            this.sprite.setDisplaySize(28, 50); // Taille ajustée pour équilibrer
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('ussop_idle');
            this.isAnimated = true;
        } else if (this.type === 'chopper' && scene.textures.exists('chopper')) {
            // Créer un sprite animé pour Chopper (28x39 original, ratio 1:1.393)
            this.sprite = scene.add.sprite(x, y, 'chopper');
            this.sprite.setDisplaySize(28, 39); // Dimensions originales parfaites
            this.sprite.setOrigin(0.5, 1.0); // Pieds en bas
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('chopper_idle');
            this.isAnimated = true;
        } else if (this.type === 'franky' && scene.textures.exists('franky')) {
            // Créer un sprite animé pour Franky (118x102 original, ratio 1:0.864)
            this.sprite = scene.add.sprite(x, y, 'franky');
            this.sprite.setDisplaySize(58, 50); // Ratio 118:102 maintenu avec hauteur 50
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('franky_idle');
            this.isAnimated = true;
        } else if (this.type === 'robin' && scene.textures.exists('robin')) {
            // Créer un sprite animé pour Robin (66x74 original, ratio 1:1.12)
            this.sprite = scene.add.sprite(x, y, 'robin');
            this.sprite.setDisplaySize(44, 50); // Ratio 66:74 avec hauteur 50
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('robin_idle');
            this.isAnimated = true;
        } else if (this.type === 'brook' && scene.textures.exists('brook')) {
            // Créer un sprite animé pour Brook (94x107 original, ratio 1:1.14)
            this.sprite = scene.add.sprite(x, y, 'brook');
            this.sprite.setDisplaySize(44, 50); // Ratio 94:107 avec hauteur 50
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('brook_idle');
            this.isAnimated = true;
        } else if (this.type === 'sanji' && scene.textures.exists('sanji')) {
            // Créer un sprite animé pour Sanji
            this.sprite = scene.add.sprite(x, y, 'sanji');
            this.sprite.setDisplaySize(28, 58); // Taille ajustée pour équilibrer
            this.sprite.setFlipX(true); // Tourné vers la gauche par défaut
            this.sprite.play('sanji_idle');
            this.isAnimated = true;
        } else if (this.type === 'nami' && scene.textures.exists('nami')) {
            // Créer un sprite pour Nami
            this.sprite = scene.add.sprite(x, y, 'nami');
            this.sprite.setDisplaySize(28, 58); // Taille ajustée pour équilibrer
            this.sprite.setFlipX(true); // Retourner horizontalement à 180°
            this.sprite.play('nami_idle');
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

        // Ne pas attaquer si la tour est en train d'être déplacée
        // Appliquer le multiplicateur de vitesse du jeu au cooldown
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const adjustedFireRate = this.fireRate / gameSpeed;
        
        if (dist <= this.range && time > this.lastShot && !this.isBeingDragged) {
            this.lastShot = time + adjustedFireRate;
            
            // Luffy tape en cône vers l'ennemi ciblé
            if (this.type === 'luffy' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi ciblé
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                // Si l'ennemi est à gauche (cos < 0), flip true (regarde à gauche)
                // Si l'ennemi est à droite (cos >= 0), flip false (regarde à droite)
                this.lastFlipX = Math.cos(angleToEnemy) < 0;
                this.sprite.setFlipX(this.lastFlipX);
                
                // Changer la texture pour l'animation d'attaque
                // 1212x73 - 12 frames de 101x73
                this.sprite.setTexture('luffy_attack_sheet');
                this.sprite.setDisplaySize(69, 50); // Ratio 101:73 (1.38:1) - Hauteur fixe 50
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
                
                // 3. Poings animés qui volent dans le cône
                for (let i = 0; i < 5; i++) {
                    const fistAngle = angleToEnemy - coneAngle / 3 + (Math.random() * coneAngle * 2 / 3);
                    const startDist = 20 + Math.random() * 30;
                    const startX = this.sprite.x + Math.cos(fistAngle) * startDist;
                    const startY = this.sprite.y + Math.sin(fistAngle) * startDist;
                    
                    // Créer un sprite de poing animé
                    let fist;
                    if (this.scene.textures.exists('luffy_projectile')) {
                        fist = this.scene.add.sprite(startX, startY, 'luffy_projectile');
                        fist.setDisplaySize(18, 50);
                        fist.play('luffy_projectile');
                        fist.setRotation(fistAngle + Math.PI / 2);
                    } else {
                        fist = this.scene.add.circle(startX, startY, 5, 0xffcc99, 1);
                    }
                    fist.setDepth(7);
                    
                    // Animation du poing qui vole vers l'extérieur
                    const endX = this.sprite.x + Math.cos(fistAngle) * this.range * 0.95;
                    const endY = this.sprite.y + Math.sin(fistAngle) * this.range * 0.95;
                    
                    this.scene.tweens.add({
                        targets: fist,
                        x: endX,
                        y: endY,
                        alpha: 0,
                        duration: 200 + i * 30,
                        delay: i * 25,
                        ease: 'Power1',
                        onComplete: () => fist.destroy()
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
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('luffy');
                    this.sprite.setDisplaySize(28, 43); // Proportions respectées
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('luffy_idle');
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
                                const wasAlive = e.alive;
                                e.takeDamage(damage);
                                this.totalDamage += damage;
                                if (wasAlive && !e.alive) {
                                    this.enemyKills++;
                                }
                            }
                        }
                    }
                });
                return null; // Pas de projectile
            }
            
            // Zoro attaque en zone avec ses sabres (tous les ennemis dans sa portée)
            if (this.type === 'zoro' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi pour se tourner vers lui
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.lastFlipX = Math.cos(angleToEnemy) < 0;
                this.sprite.setFlipX(this.lastFlipX);
                
                // Changer la texture pour l'animation d'attaque
                this.sprite.setTexture('zoro_attack_sheet');
                this.sprite.setDisplaySize(42, 50); // TAILLE COMBAT harmonisée (ratio 71:84)
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
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('zoro');
                    this.sprite.setDisplaySize(28, 61); // Proportions respectées
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
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
                            const wasAlive = e.alive;
                            e.takeDamage(damage);
                            this.totalDamage += damage;
                            if (wasAlive && !e.alive) {
                                this.enemyKills++;
                            }
                        }
                    }
                });
                return null; // Pas de projectile
            }
            
            // ussop tire avec son lance-pierre (sniper - longue portée, rapide, faibles dégâts + poison)
            if (this.type === 'ussop' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi ciblé
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.lastFlipX = Math.cos(angleToEnemy) < 0;
                this.sprite.setFlipX(this.lastFlipX);
                
                // Jouer l'animation de tir
                this.sprite.setTexture('ussop_attack_sheet');
                this.sprite.play('ussop_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('ussop');
                    this.sprite.setDisplaySize(35, 50); // Taille équilibrée
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('ussop_idle');
                });
                
                // Créer un projectile spécial empoisonné avec sprite animé
                const poisonProjectile = this.createussopPoisonProjectile(enemy);
                return poisonProjectile;
            }
            
            // Attaque projectile pour Chopper
            if (this.type === 'chopper' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi pour se tourner vers lui
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.lastFlipX = Math.cos(angleToEnemy) < 0;
                this.sprite.setFlipX(this.lastFlipX);
                
                // Jouer l'animation d'attaque
                this.sprite.setTexture('chopper_attack_sheet');
                this.sprite.setDisplaySize(28, 50); // TAILLE COMBAT harmonisée
                this.sprite.setOrigin(0.5, 1.0); // Pieds en bas
                this.sprite.play('chopper_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('chopper');
                    this.sprite.setDisplaySize(28, 39); // Proportions respectées
                    this.sprite.setOrigin(0.5, 1.0);
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('chopper_idle');
                });
            }
            
            // Sanji attaque avec ses coups de pied enflammés (DOT de feu)
            if (this.type === 'sanji' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Jouer l'animation d'attaque
                this.sprite.setTexture('sanji_attack_sheet');
                this.sprite.setDisplaySize(49, 50); // TAILLE COMBAT harmonisée (ratio 103:106)
                this.sprite.play('sanji_attack');
                
                // Effet visuel de feu 🔥
                const fireEffect = this.scene.add.graphics();
                fireEffect.setDepth(6);
                
                // Cercle de feu qui s'étend
                fireEffect.fillGradientStyle(0xff6600, 0xff0000, 0xffaa00, 0xff4400, 0.6, 0.6, 0.3, 0.3);
                fireEffect.fillCircle(this.sprite.x, this.sprite.y, 20);
                
                this.scene.tweens.add({
                    targets: fireEffect,
                    alpha: 0,
                    duration: 400,
                    ease: 'Power2',
                    onUpdate: () => {
                        const progress = 1 - fireEffect.alpha;
                        const currentRadius = 20 + (this.range - 20) * progress;
                        fireEffect.clear();
                        fireEffect.fillGradientStyle(0xff6600, 0xff0000, 0xffaa00, 0xff4400, 
                            0.6 * fireEffect.alpha, 0.6 * fireEffect.alpha, 
                            0.3 * fireEffect.alpha, 0.3 * fireEffect.alpha);
                        fireEffect.fillCircle(this.sprite.x, this.sprite.y, currentRadius);
                    },
                    onComplete: () => fireEffect.destroy()
                });
                
                // Particules de feu
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const flame = this.scene.add.circle(
                        this.sprite.x + Math.cos(angle) * 15,
                        this.sprite.y + Math.sin(angle) * 15,
                        6,
                        0xff6600,
                        0.8
                    );
                    flame.setDepth(7);
                    
                    this.scene.tweens.add({
                        targets: flame,
                        x: this.sprite.x + Math.cos(angle) * this.range,
                        y: this.sprite.y + Math.sin(angle) * this.range,
                        alpha: 0,
                        scale: 0.3,
                        duration: 350,
                        ease: 'Power2',
                        onComplete: () => flame.destroy()
                    });
                }
                
                // Revenir à l'animation idle après l'attaque
                this.sprite.once('animationcomplete', () => {
                    this.sprite.setTexture('sanji');
                    this.sprite.setDisplaySize(28, 58); // Taille équilibrée
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('sanji_idle');
                });
                
                // Calculer les dégâts avec critique
                let damage = this.damage;
                if (Math.random() < this.critChance) {
                    damage = Math.floor(damage * 1.5);
                }
                
                // Dégâts de brûlure : 10% des dégâts par seconde pendant 10 secondes
                const burnDamagePerTick = Math.max(1, Math.floor(damage * 0.1));
                const burnDuration = 10; // 10 secondes
                
                // Appliquer les dégâts directs et la brûlure à l'ennemi ciblé
                const wasAlive = enemy.alive;
                enemy.takeDamage(damage);
                this.totalDamage += damage;
                
                // Appliquer la brûlure si l'ennemi est encore vivant
                if (enemy.alive && enemy.applyBurn) {
                    enemy.applyBurn(burnDamagePerTick, burnDuration, this);
                }
                
                if (wasAlive && !enemy.alive) {
                    this.enemyKills++;
                }
                
                return null; // Pas de projectile
            }
            
            // Nami attaque UN ennemi dans sa portée, le nuage crée une zone d'effet
            if (this.type === 'nami' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Jouer l'animation d'attaque (4 frames : coup de bâton)
                // Vérifier que le spritesheet et l'animation existent
                if (this.scene.textures.exists('nami_attack_sheet') && this.scene.anims.exists('nami_attack')) {
                    this.sprite.setTexture('nami_attack_sheet');
                    this.sprite.setDisplaySize(62, 50); // TAILLE COMBAT harmonisée (ratio 122:99)
                    this.sprite.play('nami_attack');
                    
                    // Revenir à l'image idle après l'attaque
                    this.sprite.once('animationcomplete', () => {
                        this.sprite.setTexture('nami');
                        this.sprite.setDisplaySize(28, 58); // Taille équilibrée
                        this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                        this.sprite.play('nami_idle');
                    });
                } else {
                    console.error('❌ Nami attack animation not loaded!');
                    console.error('   - Texture nami_attack_sheet exists:', this.scene.textures.exists('nami_attack_sheet'));
                    console.error('   - Animation nami_attack exists:', this.scene.anims.exists('nami_attack'));
                    
                    // Fallback: rester en idle
                    this.sprite.setTexture('nami');
                    this.sprite.setDisplaySize(28, 58); // Taille équilibrée
                }
                
                // Calculer les dégâts avec critique
                let damage = this.damage;
                const isCrit = Math.random() < this.critChance;
                if (isCrit) {
                    damage = Math.floor(damage * 1.5);
                }
                
                // Attaquer l'ennemi ciblé (celui dans la portée)
                const wasAlive = enemy.alive;
                enemy.takeDamage(damage);
                this.totalDamage += damage;
                if (wasAlive && !enemy.alive) {
                    this.enemyKills++;
                }
                
                // Créer le nuage de foudre au-dessus de l'ennemi ciblé
                // Le nuage fait des dégâts en zone et peut stun les ennemis proches
                this.createThunderCloud(enemy, damage);
                
                return null; // Pas de projectile
            }
            
            // Franky tire des lasers puissants (gros dégâts, lent, perçant)
            if (this.type === 'franky' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Jouer l'animation d'attaque
                this.sprite.setTexture('franky_attack_sheet');
                this.sprite.setDisplaySize(87, 50); // Ratio 208:120 (1.73:1) - Hauteur fixe 50
                this.sprite.play('franky_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('franky');
                    this.sprite.setDisplaySize(58, 50); // Taille idle
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('franky_idle');
                });
            }
            
            // Robin utilise ses mains pour immobiliser les ennemis en zone
            if (this.type === 'robin' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Jouer l'animation d'attaque
                this.sprite.setTexture('robin_attack_sheet');
                this.sprite.setDisplaySize(46, 50); // Ratio 84:92 (0.91:1) - Hauteur fixe 50
                this.sprite.play('robin_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('robin');
                    this.sprite.setDisplaySize(44, 50); // Taille idle
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('robin_idle');
                });
                
                // Créer l'effet des mains de Robin sur l'ennemi ciblé
                this.createRobinHandsEffect(enemy);
                
                // Calculer les dégâts et appliquer le ralentissement
                let damage = this.damage;
                const isCrit = Math.random() < this.critChance;
                if (isCrit) {
                    damage = Math.floor(damage * 1.5);
                }
                
                // Attaquer l'ennemi principal
                const wasAlive = enemy.alive;
                enemy.takeDamage(damage);
                this.totalDamage += damage;
                if (wasAlive && !enemy.alive) {
                    this.enemyKills++;
                }
                
                // Appliquer le ralentissement à l'ennemi principal (50% de réduction de vitesse pendant 2s)
                this.applySlowEffect(enemy, 0.5, 2000);
                
                // Trouver et ralentir les ennemis dans la zone autour de l'ennemi ciblé
                const slowRadius = 60; // Rayon de ralentissement autour de l'ennemi
                this.scene.enemies.forEach(otherEnemy => {
                    if (otherEnemy === enemy || !otherEnemy.alive) return;
                    
                    const dist = Phaser.Math.Distance.Between(
                        enemy.sprite.x,
                        enemy.sprite.y,
                        otherEnemy.sprite.x,
                        otherEnemy.sprite.y
                    );
                    
                    if (dist <= slowRadius) {
                        // Appliquer un ralentissement moins fort aux ennemis proches (30%)
                        this.applySlowEffect(otherEnemy, 0.3, 1500);
                        // Petit dégât aux ennemis proches
                        otherEnemy.takeDamage(Math.floor(damage * 0.3));
                        this.totalDamage += Math.floor(damage * 0.3);
                    }
                });
                
                // Effet visuel du cercle de ralentissement
                const slowCircle = this.scene.add.circle(
                    enemy.sprite.x,
                    enemy.sprite.y,
                    slowRadius,
                    0xa855f7, // Violet
                    0.2
                );
                slowCircle.setDepth(99);
                slowCircle.setStrokeStyle(2, 0xa855f7, 0.6);
                
                this.scene.tweens.add({
                    targets: slowCircle,
                    alpha: 0,
                    scale: 1.2,
                    duration: 600,
                    ease: 'Power2',
                    onComplete: () => slowCircle.destroy()
                });
                
                return null; // Pas de projectile
            }
            
            // Brook attaque avec vitesse extrême (attaque ultra rapide, faibles dégâts)
            if (this.type === 'brook' && this.isAnimated) {
                // Calculer l'angle vers l'ennemi
                const angleToEnemy = Phaser.Math.Angle.Between(
                    this.sprite.x,
                    this.sprite.y,
                    enemy.sprite.x,
                    enemy.sprite.y
                );
                
                // Retourner le sprite vers l'ennemi
                this.sprite.setFlipX(Math.cos(angleToEnemy) < 0);
                
                // Jouer l'animation d'attaque
                this.sprite.setTexture('brook_attack_sheet');
                this.sprite.setDisplaySize(94, 50); // Ratio 190:101 (1.88:1) - Hauteur fixe 50
                this.sprite.play('brook_attack');
                
                this.sprite.once('animationcomplete', () => {
                    // Revenir à la texture idle en conservant la direction
                    this.sprite.setTexture('brook');
                    this.sprite.setDisplaySize(44, 50); // Taille idle
                    this.sprite.setFlipX(this.lastFlipX); // Conserver la dernière direction
                    this.sprite.play('brook_idle');
                });
                
                // Effet visuel rapide (éclairs blancs)
                for (let i = 0; i < 3; i++) {
                    const flashLine = this.scene.add.graphics();
                    flashLine.setDepth(6);
                    flashLine.lineStyle(2, 0xe2e8f0, 0.8);
                    
                    const randomOffset = (Math.random() - 0.5) * 20;
                    flashLine.beginPath();
                    flashLine.moveTo(this.sprite.x, this.sprite.y);
                    flashLine.lineTo(
                        enemy.sprite.x + randomOffset,
                        enemy.sprite.y + randomOffset
                    );
                    flashLine.strokePath();
                    
                    this.scene.tweens.add({
                        targets: flashLine,
                        alpha: 0,
                        duration: 150,
                        delay: i * 20,
                        onComplete: () => flashLine.destroy()
                    });
                }
            }
            
            // Les autres tours (et ussop, Chopper, Brook) lancent des projectiles
            const projectile = new Projectile(
                this.scene, 
                this.sprite.x, 
                this.sprite.y, 
                enemy, 
                this.damage,
                this.color,
                this // Passer la référence de la tour pour les stats
            );
            return projectile;
        }
        return null;
    }
    
    /**
     * Crée un nuage de foudre au-dessus d'un ennemi (attaque de Nami)
     * Le nuage fait des dégâts en zone et peut stun les ennemis proches
     * @param {Enemy} targetEnemy - L'ennemi ciblé principal
     * @param {number} damage - Les dégâts de base
     */
    createThunderCloud(targetEnemy, damage) {
        // Position FIXE du nuage (au-dessus de l'ennemi au moment de l'invocation)
        // Le nuage reste sur place et ne suit pas l'ennemi
        const cloudX = targetEnemy.sprite.x;
        const cloudY = targetEnemy.sprite.y - targetEnemy.spriteHeight - 40;
        
        // Position de l'impact au sol (fixe)
        const impactX = cloudX;
        const impactY = targetEnemy.sprite.y;
        
        // Créer le sprite du nuage - position fixe, centré sur l'éclair
        const cloudSprite = this.scene.add.sprite(cloudX, cloudY, 'nami_cloud');
        cloudSprite.setDisplaySize(120, 85); // 250x176 réduit proportionnellement (ratio 1.42:1)
        cloudSprite.setDepth(100);
        cloudSprite.setOrigin(0.5, 0.3); // Centré sur le nuage, pas sur l'éclair
        
        // Jouer l'animation du nuage (reste sur place) - 4 frames maintenant
        cloudSprite.play('nami_cloud');
        
        // Rayon de la zone d'effet (autour du point d'impact)
        const aoeRadius = 60;
        
        // Effet visuel amélioré - Cercles concentriques électriques
        const circles = [];
        
        // Créer 3 cercles concentriques pour un effet plus visuel
        for (let i = 0; i < 3; i++) {
            const circle = this.scene.add.circle(
                impactX,
                impactY,
                aoeRadius - (i * 15),
                0x00ffff,
                0.15 + (i * 0.05)
            );
            circle.setDepth(99 + i);
            circle.setStrokeStyle(2 + i, 0xffff00, 0.7 - (i * 0.15));
            circles.push(circle);
            
            // Animation de pulsation décalée pour chaque cercle
            this.scene.tweens.add({
                targets: circle,
                alpha: 0,
                scale: 1.5 - (i * 0.1),
                duration: 500 + (i * 100),
                delay: i * 50,
                ease: 'Power2',
                onComplete: () => circle.destroy()
            });
        }
        
        // Ajouter des éclairs électriques autour du cercle
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const x = impactX + Math.cos(angle) * aoeRadius;
            const y = impactY + Math.sin(angle) * aoeRadius;
            
            const spark = this.scene.add.circle(x, y, 3, 0xffff00, 0.8);
            spark.setDepth(100);
            
            this.scene.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 0,
                duration: 400,
                delay: i * 30,
                ease: 'Power2',
                onComplete: () => spark.destroy()
            });
        }
        
        // Appliquer les dégâts et le stun après un délai (quand l'éclair frappe)
        this.scene.time.delayedCall(250, () => {
            // Trouver tous les ennemis dans la zone d'effet (position fixe)
            this.scene.enemies.forEach(e => {
                if (e.alive) {
                    const dist = Phaser.Math.Distance.Between(
                        impactX,
                        impactY,
                        e.sprite.x,
                        e.sprite.y
                    );
                    
                    if (dist <= aoeRadius) {
                        // Dégâts réduits pour les ennemis secondaires (50%)
                        const aoeDamage = (e === targetEnemy) ? 0 : Math.floor(damage * 0.5);
                        
                        if (aoeDamage > 0) {
                            const wasAlive = e.alive;
                            e.takeDamage(aoeDamage);
                            this.totalDamage += aoeDamage;
                            if (wasAlive && !e.alive) {
                                this.enemyKills++;
                            }
                        }
                        
                        // 30% de chance de stun pour chaque ennemi dans la zone
                        if (e.alive && e.applyStun && Math.random() < 0.30) {
                            e.applyStun(2); // 2 secondes de stun
                            
                            // Effet visuel de stun réussi
                            const stunText = this.scene.add.text(
                                e.sprite.x,
                                e.sprite.y - e.spriteHeight - 30,
                                'STUN!',
                                {
                                    fontSize: '14px',
                                    color: '#00ffff',
                                    fontStyle: 'bold',
                                    stroke: '#000000',
                                    strokeThickness: 3
                                }
                            );
                            stunText.setOrigin(0.5);
                            stunText.setDepth(1000);
                            
                            this.scene.tweens.add({
                                targets: stunText,
                                y: stunText.y - 25,
                                alpha: 0,
                                duration: 1000,
                                ease: 'Power2',
                                onComplete: () => stunText.destroy()
                            });
                        }
                    }
                }
            });
            
            // Effet d'éclair au sol (position fixe)
            const lightning = this.scene.add.graphics();
            lightning.setDepth(98);
            lightning.fillStyle(0xffff00, 0.8);
            lightning.fillCircle(impactX, impactY, 15);
            
            this.scene.tweens.add({
                targets: lightning,
                alpha: 0,
                duration: 200,
                onComplete: () => lightning.destroy()
            });
        });
        
        // Détruire le nuage après l'animation
        cloudSprite.once('animationcomplete', () => {
            cloudSprite.destroy();
        });
    }
    
    /**
     * Crée l'effet visuel des mains de Robin qui apparaissent sur un ennemi
     * @param {Enemy} targetEnemy - L'ennemi ciblé
     */
    createRobinHandsEffect(targetEnemy) {
        if (!this.scene.textures.exists('robin_hands')) return;
        
        // Créer le sprite des mains sur l'ennemi
        const handsSprite = this.scene.add.sprite(
            targetEnemy.sprite.x,
            targetEnemy.sprite.y,
            'robin_hands'
        );
        handsSprite.setDisplaySize(70, 40);
        handsSprite.setDepth(100);
        handsSprite.setAlpha(0.9);
        
        // Jouer l'animation
        handsSprite.play('robin_hands');
        
        // Détruire après l'animation
        handsSprite.once('animationcomplete', () => {
            handsSprite.destroy();
        });
        
        // Particules violettes autour de l'ennemi
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30;
            const particleX = targetEnemy.sprite.x + Math.cos(angle) * distance;
            const particleY = targetEnemy.sprite.y + Math.sin(angle) * distance;
            
            const particle = this.scene.add.circle(particleX, particleY, 3, 0xa855f7, 0.8);
            particle.setDepth(99);
            
            this.scene.tweens.add({
                targets: particle,
                x: targetEnemy.sprite.x,
                y: targetEnemy.sprite.y,
                alpha: 0,
                duration: 400,
                delay: i * 30,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    /**
     * Applique un effet de ralentissement à un ennemi
     * @param {Enemy} enemy - L'ennemi à ralentir
     * @param {number} slowAmount - Pourcentage de ralentissement (0.5 = 50%)
     * @param {number} duration - Durée en millisecondes
     */
    applySlowEffect(enemy, slowAmount, duration) {
        if (!enemy || !enemy.alive) return;
        
        // Sauvegarder la vitesse originale si ce n'est pas déjà fait
        if (!enemy.originalSpeed) {
            enemy.originalSpeed = enemy.speed;
        }
        
        // Appliquer le ralentissement (ne pas cumuler, prendre le plus fort)
        const newSpeed = enemy.originalSpeed * (1 - slowAmount);
        if (!enemy.currentSlowAmount || slowAmount > enemy.currentSlowAmount) {
            enemy.speed = newSpeed;
            enemy.currentSlowAmount = slowAmount;
            
            // Effet visuel : teinte violette sur l'ennemi
            enemy.sprite.setTint(0xaa55ff);
            
            // Supprimer le ralentissement après la durée
            if (enemy.slowTimer) {
                enemy.slowTimer.remove();
            }
            
            enemy.slowTimer = this.scene.time.delayedCall(duration, () => {
                if (enemy && enemy.alive) {
                    enemy.speed = enemy.originalSpeed;
                    enemy.currentSlowAmount = 0;
                    enemy.sprite.clearTint();
                }
            });
        }
    }
    
    /**
     * Crée un projectile empoisonné spécial pour ussop
     * @param {Enemy} targetEnemy - L'ennemi ciblé
     * @returns {Object} Projectile personnalisé
     */
    createussopPoisonProjectile(targetEnemy) {
        // Créer un sprite animé pour le projectile au lieu d'un cercle
        let projectileSprite;
        
        if (this.scene.textures.exists('ussop_projectile') && this.scene.anims.exists('ussop_projectile')) {
            projectileSprite = this.scene.add.sprite(this.sprite.x, this.sprite.y, 'ussop_projectile');
            projectileSprite.play('ussop_projectile');
        } else {
            // Fallback: cercle vert
            projectileSprite = this.scene.add.circle(this.sprite.x, this.sprite.y, 5, 0x00ff00, 1);
        }
        
        projectileSprite.setDepth(5);
        
        // Retourner un objet projectile personnalisé avec logique de poison
        return {
            sprite: projectileSprite,
            target: targetEnemy,
            active: true,
            speed: 300,
            damage: this.damage,
            tower: this,
            
            update: function(delta) {
                if (!this.active || !this.target || !this.target.sprite) {
                    this.destroy();
                    return false;
                }
                
                const dx = this.target.sprite.x - this.sprite.x;
                const dy = this.target.sprite.y - this.sprite.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                // Si le projectile touche l'ennemi
                if (dist < 10) {
                    const wasAlive = this.target.alive;
                    
                    // Calculer les dégâts avec critique
                    let damage = this.damage;
                    const isCrit = Math.random() < (this.tower.critChance || 0);
                    if (isCrit) {
                        damage = Math.floor(damage * 1.5);
                    }
                    
                    // Appliquer les dégâts directs
                    this.target.takeDamage(damage);
                    
                    // Mettre à jour les stats de la tour
                    if (this.tower) {
                        this.tower.totalDamage += damage;
                        if (wasAlive && !this.target.alive) {
                            this.tower.enemyKills++;
                        }
                    }
                    
                    // Appliquer le poison : 15% des dégâts par seconde pendant 8 secondes
                    if (this.target.alive && this.target.applyPoison) {
                        const poisonDamagePerTick = Math.max(1, Math.floor(damage * 0.15));
                        const poisonDuration = 8; // 8 secondes
                        this.target.applyPoison(poisonDamagePerTick, poisonDuration, this.tower);
                    }
                    
                    this.destroy();
                    return false;
                }
                
                // Déplacement vers la cible
                const gameSpeed = this.tower.scene.waveControl ? this.tower.scene.waveControl.gameSpeed : 1;
                const vx = (dx / dist) * this.speed * (delta / 1000) * gameSpeed;
                const vy = (dy / dist) * this.speed * (delta / 1000) * gameSpeed;
                
                this.sprite.x += vx;
                this.sprite.y += vy;
                
                return true;
            },
            
            destroy: function() {
                this.active = false;
                if (this.sprite) this.sprite.destroy();
            }
        };
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

