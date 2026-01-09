class Enemy {
    constructor(scene, path, enemyType = 'pirate_basic') {
        this.scene = scene;
        this.type = enemyType;
        
        // Récupérer la configuration de l'ennemi
        const config = ENEMY_CONFIG[enemyType] || ENEMY_CONFIG.pirate_basic;
        
        this.maxHp = config.hp;
        this.hp = config.hp;
        this.speed = config.speed;
        this.color = config.color;
        this.size = config.size;
        this.reward = config.reward;
        this.name = config.name;
        
        // Système de bouclier (pour les tanks)
        this.maxShield = config.shield || 0;
        this.shield = this.maxShield;
        
        this.pathIndex = 0;
        this.path = path;
        this.alive = true;

        // Sprite principal (sprites différents selon le type)
        let spriteHeight;
        if (this.type === 'pirate_basic' && scene.textures.exists('swd_pirate_walk')) {
            // Pirate à l'épée (SwdPirate)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'swd_pirate_walk');
            this.sprite.setDisplaySize(42, 50); // Dimensions originales
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
            this.sprite.setFlipX(false); // Ne pas retourner le sprite (orientation d'origine)
            this.sprite.play('swd_pirate_walk');
            spriteHeight = 42; // 0.85 * 50 = 42.5 ≈ 42
        } else if (this.type === 'pirate_fast' && scene.textures.exists('gun_pirate_walk')) {
            // Pirate au pistolet (GunPirate)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'gun_pirate_walk');
            this.sprite.setDisplaySize(42, 50); // Proportions similaires
            this.sprite.setOrigin(0.5, 0.82); // Ancrer aux pieds
            this.sprite.setFlipX(true); // Retourner le sprite
            this.sprite.play('gun_pirate_walk');
            // Pas de tint - couleurs originales du sprite
            spriteHeight = 41; // 0.82 * 50 = 41
        } else if (this.type === 'pirate_shield' && scene.textures.exists('knife_pirate_walk')) {
            // Pirate tank avec couteau (knife_pirate)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'knife_pirate_walk');
            this.sprite.setDisplaySize(38, 58); // Un peu plus grand car c'est un tank
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
            this.sprite.setFlipX(true); // Retourner le sprite
            this.sprite.play('knife_pirate_walk');
            spriteHeight = 49; // 0.85 * 58 = ~49
        } else {
            // Cercle pour les autres types
            this.sprite = scene.add.circle(this.path[0].x, this.path[0].y, this.size, this.color);
            spriteHeight = this.size;
        }
        // Depth dynamique basée sur la position Y pour un rendu en pseudo-3D
        // Plus l'ennemi est bas sur l'écran, plus il est "devant"
        this.sprite.setDepth(5 + this.sprite.y / 10);
        this.sprite.setInteractive({ useHandCursor: true });
        this.spriteHeight = spriteHeight; // Stocker pour les mises à jour
        
        // Texte du nom (caché par défaut)
        this.nameText = scene.add.text(
            this.sprite.x,
            this.sprite.y - spriteHeight - 25,
            this.name,
            {
                fontSize: '12px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 }
            }
        );
        this.nameText.setOrigin(0.5);
        this.nameText.setDepth(this.sprite.depth + 3);
        this.nameText.setVisible(false);
        
        // Événements de survol
        this.sprite.on('pointerover', () => {
            this.nameText.setVisible(true);
        });
        
        this.sprite.on('pointerout', () => {
            this.nameText.setVisible(false);
        });
        
        // Effet visuel selon le type
        this.createVisualEffects();
        
        // Barre de vie (taille fixe, juste au-dessus du sprite)
        this.barWidth = 35; // Largeur fixe pour tous les ennemis
        this.barHeight = 3; // Hauteur réduite
        
        this.hpBarBg = scene.add.rectangle(
            this.sprite.x, 
            this.sprite.y - spriteHeight - 6, // Au-dessus de la tête avec un petit écart
            this.barWidth, 
            this.barHeight, 
            0x1e293b, // Gris foncé au lieu du noir
            0.9
        );
        this.hpBarBg.setDepth(this.sprite.depth + 1);
        this.hpBarBg.setStrokeStyle(1, 0x334155, 0.8); // Bordure subtile
        
        this.hpBar = scene.add.rectangle(
            this.sprite.x, 
            this.sprite.y - spriteHeight - 6, // Au-dessus de la tête 
            this.barWidth, 
            this.barHeight, 
            0x22c55e // Vert doux (sera mis à jour selon les HP)
        );
        this.hpBar.setDepth(this.sprite.depth + 2);
        
        // Mettre à jour la couleur initiale selon les HP actuels
        const initialHpPercent = this.hp / this.maxHp;
        if (initialHpPercent > 0.6) {
            this.hpBar.fillColor = 0x22c55e;
        } else if (initialHpPercent > 0.3) {
            this.hpBar.fillColor = 0xf59e0b;
        } else {
            this.hpBar.fillColor = 0xef4444;
        }
        
        // Barre de bouclier bleue (pour les tanks)
        if (this.maxShield > 0) {
            this.shieldBarBg = scene.add.rectangle(
                this.sprite.x, 
                this.sprite.y - spriteHeight - 11, // Au-dessus de la barre de vie
                this.barWidth, 
                this.barHeight, 
                0x1e3a5f, // Bleu foncé
                0.9
            );
            this.shieldBarBg.setDepth(this.sprite.depth + 1);
            this.shieldBarBg.setStrokeStyle(1, 0x2563eb, 0.8); // Bordure bleue
            
            this.shieldBar = scene.add.rectangle(
                this.sprite.x, 
                this.sprite.y - spriteHeight - 11,
                this.barWidth, 
                this.barHeight, 
                0x3b82f6 // Bleu vif
            );
            this.shieldBar.setDepth(this.sprite.depth + 2);
        }
        
        // Système de brûlure (DOT)
        this.isBurning = false;
        this.burnDamage = 0;
        this.burnDuration = 0;
        this.burnTimer = null;
        this.burnEffect = null;
        
        // Système de stun
        this.isStunned = false;
        this.stunTimeRemaining = 0;
        this.stunTimer = null;
        this.stunEffect = null;
        this.originalSpeed = this.speed;
    }
    
    createVisualEffects() {
        // Ajouter des effets visuels selon le type
        if (this.type === 'pirate_shield' && this.maxShield > 0) {
            // Cercle de bouclier bleu autour du tank
            this.shieldVisual = this.scene.add.circle(
                this.sprite.x, 
                this.sprite.y, 
                this.spriteHeight * 0.7, 
                0x3b82f6,
                0.15
            );
            this.shieldVisual.setStrokeStyle(2, 0x60a5fa, 0.5);
            this.shieldVisual.setDepth(this.sprite.depth - 1);
        }
        // Pas d'effet visuel pour pirate_fast (il a déjà un tint orange)
    }
    
    update(delta) {
        if(this.pathIndex >= this.path.length - 1) return;

        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.sprite.x;
        const dy = target.y - this.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 2) {
            this.pathIndex++;
            return;
        }

        // Appliquer le multiplicateur de vitesse du jeu
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const vx = (dx / dist) * this.speed * (delta / 1000) * gameSpeed;
        const vy = (dy / dist) * this.speed * (delta / 1000) * gameSpeed;

        this.sprite.x += vx;
        this.sprite.y += vy;
        
        // Mettre à jour la depth pour le rendu en pseudo-3D
        // Plus l'ennemi est bas sur l'écran (Y grand), plus il est "devant"
        this.sprite.setDepth(5 + this.sprite.y / 10);
        
        // Mettre à jour les positions des éléments visuels
        const yOffset = this.spriteHeight + 6; // Au-dessus de la tête
        this.hpBar.x = this.sprite.x;
        this.hpBar.y = this.sprite.y - yOffset;
        this.hpBarBg.x = this.sprite.x;
        this.hpBarBg.y = this.sprite.y - yOffset;
        
        // Mettre à jour la barre de shield si elle existe
        if (this.shieldBar) {
            const shieldYOffset = this.spriteHeight + 11; // Au-dessus de la barre de vie
            this.shieldBar.x = this.sprite.x;
            this.shieldBar.y = this.sprite.y - shieldYOffset;
            this.shieldBarBg.x = this.sprite.x;
            this.shieldBarBg.y = this.sprite.y - shieldYOffset;
            this.shieldBar.setDepth(this.sprite.depth + 2);
            this.shieldBarBg.setDepth(this.sprite.depth + 1);
        }
        
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - this.spriteHeight - (this.maxShield > 0 ? 23 : 18); // Plus haut si shield
        
        // Mettre à jour les effets visuels
        if (this.shieldVisual) {
            this.shieldVisual.x = this.sprite.x;
            this.shieldVisual.y = this.sprite.y;
            this.shieldVisual.setDepth(this.sprite.depth - 1);
            // Cacher le cercle si le shield est épuisé
            if (this.shield <= 0) {
                this.shieldVisual.setVisible(false);
            }
        }
        
        if (this.speedTrail) {
            // Traînée légèrement en retard
            this.speedTrail.x = this.sprite.x - vx * 0.5;
            this.speedTrail.y = this.sprite.y - vy * 0.5;
            this.speedTrail.setDepth(this.sprite.depth - 1);
        }
        
        // Mettre à jour les depths des barres de vie et du nom
        this.hpBar.setDepth(this.sprite.depth + 2);
        this.hpBarBg.setDepth(this.sprite.depth + 1);
        this.nameText.setDepth(this.sprite.depth + 3);
        
        // Mettre à jour l'effet de brûlure
        if (this.burnEffect) {
            this.burnEffect.x = this.sprite.x;
            this.burnEffect.y = this.sprite.y;
            this.burnEffect.setDepth(this.sprite.depth - 0.5);
        }
        
        // Mettre à jour l'effet de stun
        if (this.stunEffect) {
            this.stunEffect.x = this.sprite.x;
            this.stunEffect.y = this.sprite.y - this.spriteHeight - 15;
            this.stunEffect.setDepth(this.sprite.depth + 4);
        }
    }

    takeDamage(damage) {
        let remainingDamage = damage;
        
        // Le bouclier absorbe les dégâts en premier
        if (this.shield > 0) {
            if (this.shield >= remainingDamage) {
                this.shield -= remainingDamage;
                remainingDamage = 0;
            } else {
                remainingDamage -= this.shield;
                this.shield = 0;
            }
            this.updateShieldBar();
        }
        
        // Les dégâts restants vont sur les HP
        if (remainingDamage > 0) {
            this.hp -= remainingDamage;
        }
        
        // Effet visuel de dégâts (différent pour sprites et cercles)
        if (this.type === 'pirate_basic' || this.type === 'pirate_fast' || this.type === 'pirate_shield') {
            // Pour les sprites : utiliser tint (sauf si brûlé)
            if (!this.isBurning) {
                // Tint bleu si shield, rouge sinon
                const tintColor = (this.shield > 0) ? 0x00aaff : 0xff0000;
                this.sprite.setTint(tintColor);
                this.scene.time.delayedCall(100, () => {
                    if (this.sprite && !this.isBurning) {
                        this.sprite.clearTint();
                    }
                });
            }
        } else {
            // Pour les cercles : utiliser fillStyle
            const originalColor = this.color;
            this.sprite.setFillStyle(0xff0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite) {
                    this.sprite.setFillStyle(originalColor);
                }
            });
        }
        
        this.updateHpBar();
        
        if (this.hp <= 0) {
            this.alive = false;
            this.stopBurn();
            this.playDeathAnimation();
        }
    }
    
    updateHpBar() {
        // Mettre à jour la barre de vie (largeur fixe)
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        this.hpBar.width = this.barWidth * hpPercent;
        
        // Changer la couleur selon les HP
        if (hpPercent > 0.6) {
            this.hpBar.fillColor = 0x22c55e;
        } else if (hpPercent > 0.3) {
            this.hpBar.fillColor = 0xf59e0b;
        } else {
            this.hpBar.fillColor = 0xef4444;
        }
    }
    
    updateShieldBar() {
        if (!this.shieldBar || this.maxShield <= 0) return;
        
        const shieldPercent = Math.max(0, this.shield / this.maxShield);
        this.shieldBar.width = this.barWidth * shieldPercent;
        
        // Cacher la barre si le shield est à 0
        if (this.shield <= 0) {
            this.shieldBar.setVisible(false);
            this.shieldBarBg.setVisible(false);
        }
    }
    
    /**
     * Applique un effet de brûlure (DOT) sur l'ennemi
     * @param {number} damagePerTick - Dégâts par tick (chaque seconde)
     * @param {number} duration - Durée totale en secondes
     * @param {Tower} sourceTower - Tour source pour les stats
     */
    applyBurn(damagePerTick, duration, sourceTower = null) {
        // Rafraîchir la brûlure si déjà en cours (reset la durée)
        this.burnDamage = damagePerTick;
        this.burnDuration = duration;
        this.burnSourceTower = sourceTower;
        
        // Si déjà en train de brûler, juste reset la durée
        if (this.isBurning) {
            this.burnTimeRemaining = duration;
            return;
        }
        
        this.isBurning = true;
        this.burnTimeRemaining = duration;
        
        // Créer l'effet visuel de feu
        this.createBurnEffect();
        
        // Appliquer le tint orange/feu sur le sprite
        if (this.sprite && this.sprite.setTint) {
            this.sprite.setTint(0xff6600);
        }
        
        // Timer pour les dégâts de brûlure (chaque seconde)
        this.burnTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.alive || !this.isBurning) {
                    this.stopBurn();
                    return;
                }
                
                // Appliquer les dégâts de brûlure
                this.hp -= this.burnDamage;
                
                // Mettre à jour les stats de la tour source
                if (this.burnSourceTower) {
                    this.burnSourceTower.totalDamage += this.burnDamage;
                }
                
                // Effet visuel de tick de brûlure
                this.showBurnDamageTick();
                
                this.updateHpBar();
                
                // Réduire le temps restant
                this.burnTimeRemaining -= 1;
                
                if (this.hp <= 0) {
                    this.alive = false;
                    if (this.burnSourceTower) {
                        this.burnSourceTower.enemyKills++;
                    }
                    this.stopBurn();
                    this.playDeathAnimation();
                } else if (this.burnTimeRemaining <= 0) {
                    this.stopBurn();
                }
            },
            loop: true
        });
    }
    
    createBurnEffect() {
        // Créer des particules de feu autour de l'ennemi
        if (this.burnEffect) {
            this.burnEffect.destroy();
        }
        
        // Cercle de feu animé
        this.burnEffect = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            this.spriteHeight * 0.6,
            0xff4500,
            0.3
        );
        this.burnEffect.setDepth(this.sprite.depth - 0.5);
        this.burnEffect.setStrokeStyle(2, 0xff6600, 0.6);
        
        // Animation de pulsation du feu
        this.scene.tweens.add({
            targets: this.burnEffect,
            alpha: { from: 0.3, to: 0.5 },
            scale: { from: 1, to: 1.2 },
            duration: 300,
            yoyo: true,
            repeat: -1
        });
    }
    
    showBurnDamageTick() {
        // Petit effet visuel quand le DOT fait des dégâts
        const damageText = this.scene.add.text(
            this.sprite.x + Phaser.Math.Between(-10, 10),
            this.sprite.y - this.spriteHeight - 20,
            `-${this.burnDamage} 🔥`,
            {
                fontSize: '12px',
                color: '#ff6600',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        damageText.setOrigin(0.5);
        damageText.setDepth(1000);
        
        // Animation du texte qui monte et disparaît
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 20,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    stopBurn() {
        this.isBurning = false;
        
        // Arrêter le timer
        if (this.burnTimer) {
            this.burnTimer.destroy();
            this.burnTimer = null;
        }
        
        // Supprimer l'effet visuel
        if (this.burnEffect) {
            this.burnEffect.destroy();
            this.burnEffect = null;
        }
        
        // Enlever le tint si le sprite existe encore
        if (this.sprite && this.sprite.clearTint && !this.isStunned) {
            this.sprite.clearTint();
        }
    }
    
    /**
     * Applique un effet de stun sur l'ennemi
     * @param {number} duration - Durée du stun en secondes
     */
    applyStun(duration) {
        // Si déjà stun, juste rafraîchir la durée
        if (this.isStunned) {
            this.stunTimeRemaining = Math.max(this.stunTimeRemaining, duration);
            return;
        }
        
        this.isStunned = true;
        this.stunTimeRemaining = duration;
        this.originalSpeed = this.speed;
        this.speed = 0; // Arrêter l'ennemi
        
        // Effet visuel de stun (bleu électrique)
        if (this.sprite && this.sprite.setTint) {
            this.sprite.setTint(0x00ffff);
        }
        
        // Créer l'effet visuel d'électricité
        this.createStunEffect();
        
        // Timer pour le stun
        this.stunTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.alive || !this.isStunned) {
                    this.stopStun();
                    return;
                }
                
                this.stunTimeRemaining -= 1;
                
                if (this.stunTimeRemaining <= 0) {
                    this.stopStun();
                }
            },
            loop: true
        });
    }
    
    createStunEffect() {
        if (this.stunEffect) {
            this.stunEffect.destroy();
        }
        
        // Étoiles de stun au-dessus de la tête
        this.stunEffect = this.scene.add.text(
            this.sprite.x,
            this.sprite.y - this.spriteHeight - 15,
            '⚡💫⚡',
            { fontSize: '14px' }
        );
        this.stunEffect.setOrigin(0.5);
        this.stunEffect.setDepth(this.sprite.depth + 4);
        
        // Animation de rotation
        this.scene.tweens.add({
            targets: this.stunEffect,
            angle: { from: -5, to: 5 },
            duration: 200,
            yoyo: true,
            repeat: -1
        });
    }
    
    stopStun() {
        this.isStunned = false;
        
        // Restaurer la vitesse
        if (this.originalSpeed !== undefined) {
            this.speed = this.originalSpeed;
        }
        
        // Arrêter le timer
        if (this.stunTimer) {
            this.stunTimer.destroy();
            this.stunTimer = null;
        }
        
        // Supprimer l'effet visuel
        if (this.stunEffect) {
            this.stunEffect.destroy();
            this.stunEffect = null;
        }
        
        // Enlever le tint si pas brûlé (seulement pour les sprites, pas les cercles)
        if (this.sprite && this.sprite.clearTint && !this.isBurning) {
            this.sprite.clearTint();
        } else if (this.sprite && this.sprite.setTint && this.isBurning) {
            this.sprite.setTint(0xff6600); // Remettre le tint de brûlure
        }
    }
    
    getReward() {
        return this.reward;
    }
    
    playDeathAnimation() {
        // Masquer la barre de vie, shield et le nom immédiatement
        if (this.hpBar) this.hpBar.setVisible(false);
        if (this.hpBarBg) this.hpBarBg.setVisible(false);
        if (this.shieldBar) this.shieldBar.setVisible(false);
        if (this.shieldBarBg) this.shieldBarBg.setVisible(false);
        if (this.nameText) this.nameText.setVisible(false);
        if (this.shieldVisual) this.shieldVisual.setVisible(false);
        if (this.speedTrail) this.speedTrail.setVisible(false);
        
        // Animation de mort pour pirate_basic (épée)
        if (this.type === 'pirate_basic' && this.scene.textures.exists('swd_pirate_death')) {
            // Arrêter l'animation actuelle
            if (this.sprite.anims) {
                this.sprite.stop();
            }
            
            // Remplacer par le sprite de mort
            this.sprite.setTexture('swd_pirate_death', 0);
            // Chaque frame fait 50x60
            this.sprite.setDisplaySize(50, 60);
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
            this.sprite.clearTint();
            
            // Jouer l'animation de mort (2 frames en 1 seconde)
            this.sprite.play('swd_pirate_death_anim');
            
            // Détruire après la fin de l'animation
            this.sprite.once('animationcomplete', () => {
                this.destroy();
            });
        } 
        // Animation de mort pour pirate_fast (pistolet)
        else if (this.type === 'pirate_fast' && this.scene.textures.exists('gun_pirate_death')) {
            // Arrêter l'animation actuelle
            if (this.sprite.anims) {
                this.sprite.stop();
            }
            
            // Remplacer par le sprite de mort
            this.sprite.setTexture('gun_pirate_death', 0);
            // Chaque frame fait 55x51
            this.sprite.setDisplaySize(55, 51);
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
            this.sprite.clearTint(); // Enlever le tint orange
            
            // Jouer l'animation de mort (5 frames en 1 seconde)
            this.sprite.play('gun_pirate_death_anim');
            
            // Détruire après la fin de l'animation
            this.sprite.once('animationcomplete', () => {
                this.destroy();
            });
        } else {
            // Pour les autres ennemis : fade out discret
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {
                    this.destroy();
                }
            });
        }
    }

    destroy() {
        this.stopBurn(); // Arrêter la brûlure avant de détruire
        this.stopStun(); // Arrêter le stun avant de détruire
        if (this.sprite) this.sprite.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.shieldBar) this.shieldBar.destroy();
        if (this.shieldBarBg) this.shieldBarBg.destroy();
        if (this.nameText) this.nameText.destroy();
        if (this.shieldVisual) this.shieldVisual.destroy();
        if (this.speedTrail) this.speedTrail.destroy();
    }

    reachEnd(player) {
        this.destroy();
        player.loseHp();
    }
}

