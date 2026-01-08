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
        } else {
            // Cercle pour les autres types (pirate_shield, etc.)
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
    }
    
    createVisualEffects() {
        // Ajouter des effets visuels selon le type
        if (this.type === 'pirate_shield') {
            // Cercle de bouclier
            this.shield = this.scene.add.circle(
                this.sprite.x, 
                this.sprite.y, 
                this.spriteHeight + 4, 
                0xc0c0c0,
                0
            );
            this.shield.setStrokeStyle(2, 0xc0c0c0, 0.6);
            this.shield.setDepth(this.sprite.depth - 1);
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

        const vx = (dx / dist) * this.speed * (delta / 1000);
        const vy = (dy / dist) * this.speed * (delta / 1000);

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
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - this.spriteHeight - 18; // Encore au-dessus de la barre
        
        // Mettre à jour les effets visuels
        if (this.shield) {
            this.shield.x = this.sprite.x;
            this.shield.y = this.sprite.y;
            this.shield.setDepth(this.sprite.depth - 1);
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
    }

    takeDamage(damage) {
        this.hp -= damage;
        
        // Effet visuel de dégâts (différent pour sprites et cercles)
        if (this.type === 'pirate_basic' || this.type === 'pirate_fast') {
            // Pour les sprites : utiliser tint
            this.sprite.setTint(0xff0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite) {
                    this.sprite.clearTint(); // Retour à la couleur normale pour tous
                }
            });
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
        
        // Mettre à jour la barre de vie (largeur fixe)
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        this.hpBar.width = this.barWidth * hpPercent; // Utilise la largeur fixe
        
        // Changer la couleur selon les HP (couleurs plus douces)
        if (hpPercent > 0.6) {
            this.hpBar.fillColor = 0x22c55e; // Vert doux (Tailwind green-500)
        } else if (hpPercent > 0.3) {
            this.hpBar.fillColor = 0xf59e0b; // Orange (Tailwind amber-500)
        } else {
            this.hpBar.fillColor = 0xef4444; // Rouge doux (Tailwind red-500)
        }
        
        if (this.hp <= 0) {
            this.alive = false;
            this.playDeathAnimation();
        }
    }
    
    getReward() {
        return this.reward;
    }
    
    playDeathAnimation() {
        // Masquer la barre de vie et le nom immédiatement
        if (this.hpBar) this.hpBar.setVisible(false);
        if (this.hpBarBg) this.hpBarBg.setVisible(false);
        if (this.nameText) this.nameText.setVisible(false);
        if (this.shield) this.shield.setVisible(false);
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
        if (this.sprite) this.sprite.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.nameText) this.nameText.destroy();
        if (this.shield) this.shield.destroy();
        if (this.speedTrail) this.speedTrail.destroy();
    }

    reachEnd(player) {
        this.destroy();
        player.loseHp();
    }
}

