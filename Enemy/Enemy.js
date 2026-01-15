class Enemy {
    constructor(scene, path, enemyType = 'pirate_basic', waveNumber = 1) {
        this.scene = scene;
        this.type = enemyType;
        this.waveNumber = waveNumber;
        
        // Récupérer la configuration de l'ennemi avec scaling de vague
        const baseConfig = ENEMY_CONFIG[enemyType] || ENEMY_CONFIG.pirate_basic;
        
        // Appliquer le scaling de vague si la fonction existe
        let config;
        if (typeof getEnemyStats === 'function') {
            config = getEnemyStats(enemyType, waveNumber) || baseConfig;
        } else {
            config = baseConfig;
        }
        
        this.maxHp = config.hp;
        this.hp = config.hp;
        this.speed = config.speed;
        this.color = config.color;
        this.size = config.size;
        this.reward = config.reward;
        this.name = config.name;
        this.regen = config.regen || 0;
        this.isBoss = config.isBoss || false;
        this.isMiniBoss = config.isMiniBoss || false;
        
        // Système de bouclier (pour les tanks)
        this.maxShield = config.shield || 0;
        this.shield = this.maxShield;
        
        this.pathIndex = 0;
        this.path = path;
        this.alive = true;
        this.isDying = false; // Flag pour éviter les appels multiples à playDeathAnimation
        this.destroyed = false; // Flag pour éviter les appels multiples à destroy

        // === TAILLES HARMONISÉES POUR LES ENNEMIS ===
        // Ennemis normaux : hauteur ~36px
        // Tanks/Élites : hauteur ~40px  
        // Mini-boss : hauteur ~48px
        // Boss : hauteur ~56px
        const ENEMY_HEIGHT_NORMAL = 42;
        const ENEMY_HEIGHT_ELITE = 48;
        const ENEMY_HEIGHT_MINIBOSS = 56;
        const ENEMY_HEIGHT_BOSS = 64;

        // Sprite principal (sprites différents selon le type)
        let spriteHeight;
        
        // Déterminer la hauteur selon le type d'ennemi
        let targetHeight = ENEMY_HEIGHT_NORMAL;
        if (this.isBoss) {
            targetHeight = ENEMY_HEIGHT_BOSS;
        } else if (this.isMiniBoss) {
            targetHeight = ENEMY_HEIGHT_MINIBOSS;
        } else if (config.tier >= 4) {
            targetHeight = ENEMY_HEIGHT_ELITE;
        }
        
        if (this.type === 'greenfhishmen' && scene.textures.exists('greenfhishmen')) {
            // Pirate à l'épée (ratio ~0.84)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'greenfhishmen');
            this.sprite.setDisplaySize(50, 50 );
            this.sprite.setFlipX(false);
            this.sprite.play('greenfhishmen');
            
        } else if ((this.type === 'pirate_basic2' || this.type === 'pirate_recruit') && scene.textures.exists('swd_pirate_walk')) {
            // Vétéran/Recrue - même sprite avec tint
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'swd_pirate_walk');
            this.sprite.setDisplaySize(35, ENEMY_HEIGHT_NORMAL);
            this.sprite.setOrigin(0.5, 0.85);
            this.sprite.setFlipX(false);
            this.sprite.play('swd_pirate_walk');
            // Tint pour différencier
            if (this.type === 'pirate_basic2') {
                this.sprite.setTint(0x654321);
            } else {
                this.sprite.setTint(0xA0522D);
            }
            spriteHeight = Math.round(ENEMY_HEIGHT_NORMAL * 0.85);
            
        } else if (this.type === 'pirate_fast' && scene.textures.exists('gun_pirate_walk')) {
            // Éclaireur rapide (ratio ~0.84)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'gun_pirate_walk');
            this.sprite.setDisplaySize(34, ENEMY_HEIGHT_NORMAL);
            this.sprite.setOrigin(0.5, 0.82);
            this.sprite.setFlipX(true);
            this.sprite.play('gun_pirate_walk');
            spriteHeight = Math.round(ENEMY_HEIGHT_NORMAL * 0.82);
            
        } else if ((this.type === 'pirate_shield' || this.type === 'pirate_assassin') && scene.textures.exists('knife_pirate_walk')) {
            // Bouclier/Assassin avec couteau
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'knife_pirate_walk');
            this.sprite.setDisplaySize(38, ENEMY_HEIGHT_ELITE);
            this.sprite.setOrigin(0.5, 0.85);
            this.sprite.setFlipX(true);
            this.sprite.play('knife_pirate_walk');
            if (this.type === 'pirate_assassin') {
                this.sprite.setTint(0x2F4F4F);
            }
            spriteHeight = Math.round(ENEMY_HEIGHT_ELITE * 0.85);
            
        } else if (this.type === 'chew' && scene.textures.exists('chew_walk')) {
            // Mini-boss Chew
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'chew_walk');
            this.sprite.setDisplaySize(48, ENEMY_HEIGHT_MINIBOSS);
            this.sprite.setOrigin(0.5, 0.85);
            this.sprite.setFlipX(false);
            this.sprite.play('chew_walk');
            spriteHeight = Math.round(ENEMY_HEIGHT_MINIBOSS * 0.85);
            
        } else if (this.type === 'fishman_brawler' && scene.textures.exists('fishman2')) {
            // Homme-poisson costaud - sprite animé dédié (plus grand)
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'fishman2');
            this.sprite.setDisplaySize(52, 54);
            this.sprite.setOrigin(0.5, 0.85);
            this.sprite.play('fishman2');
            spriteHeight = Math.round(54 * 0.85);
            
        } else if (config.sprite && scene.textures.exists(config.sprite)) {
            // Nouveaux ennemis avec sprites dédiés
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, config.sprite);
            let spriteWidth = targetHeight * 0.9;
            spriteHeight = targetHeight; // Utiliser la variable du constructeur, pas créer une nouvelle
            
            // Ajustements spécifiques par type (largeur et hauteur)
            if (this.type === 'spider') {
                spriteWidth = targetHeight * 1.2;
                spriteHeight = targetHeight * 0.6; // Spider est plus large et moins haut
            } else if (this.type === 'snake') {
                spriteWidth = targetHeight * 1.1;
                spriteHeight = targetHeight * 0.7;
            } else if (this.type === 'wolf') {
                spriteWidth = targetHeight * 1.3;
                spriteHeight = targetHeight * 0.85;
            } else if (this.type === 'crow') {
                spriteWidth = targetHeight * 0.8;
                spriteHeight = targetHeight * 0.7;
            } else if (this.type === 'greenfhishmen') {
                spriteWidth = targetHeight * 1.0;
                spriteHeight = targetHeight * 0.6;
            } else if (this.type === 'shadowbat') {
                spriteWidth = targetHeight * 1.0;
                spriteHeight = targetHeight * 0.65;
            } else if (this.type === 'raptor') {
                spriteWidth = targetHeight * 2.0; // Bien plus grand
                spriteHeight = targetHeight * 1.4; // Bien plus grand
            } else if (this.type === 'pterosaur') {
                spriteWidth = targetHeight * 2.5; // Bien plus grand
                spriteHeight = targetHeight * 1.5; // Bien plus grand
            } else if (this.type === 'golem') {
                spriteWidth = targetHeight * 1.8; // Bien plus grand
                spriteHeight = targetHeight * 1.8; // Bien plus grand
            } else if (this.type === 'gorilla') {
                spriteWidth = targetHeight * 1.1;
                spriteHeight = targetHeight * 1.1;
            } else if (this.type === 'jellyfish') {
                spriteWidth = targetHeight * 0.8;
                spriteHeight = targetHeight * 0.9;
            } else if (this.type === 'kungfu') {
                spriteWidth = targetHeight * 0.9;
                spriteHeight = targetHeight * 0.95;
            } else if (this.type === 'prisoner') {
                spriteWidth = targetHeight * 1.7; // Bien plus grand
                spriteHeight = targetHeight * 1.7; // Bien plus grand
            }
            
            this.sprite.setDisplaySize(spriteWidth, spriteHeight);
            this.sprite.setOrigin(0.5, 0.85);
            
            // Retourner horizontalement wolf, spider, golem et prisoner
            if (this.type === 'wolf' || this.type === 'spider' || this.type === 'golem' || this.type === 'prisoner') {
                this.sprite.setFlipX(true);
            } else {
                this.sprite.setFlipX(false);
            }
            
            // Jouer l'animation si elle existe
            // Attendre que les animations soient chargées
            if (scene.anims && scene.anims.exists(config.sprite)) {
                this.sprite.play(config.sprite);
            } else {
                // Essayer de jouer quand même - l'animation pourrait être créée après
                try {
                    if (this.sprite.anims && this.sprite.anims.animationManager.exists(config.sprite)) {
                        this.sprite.play(config.sprite);
                    } else {
                        // Si l'animation n'existe pas encore, attendre un peu
                        scene.time.delayedCall(100, () => {
                            if (this.sprite && this.sprite.scene && this.sprite.scene.anims && this.sprite.scene.anims.exists(config.sprite)) {
                                this.sprite.play(config.sprite);
                            }
                        });
                    }
                } catch (e) {
                    console.warn(`[Enemy] Animation '${config.sprite}' non trouvée pour ${this.type}, utilisation de la première frame`);
                }
            }
            
            // Utiliser la hauteur ajustée (déjà définie dans les conditions ci-dessus)
            spriteHeight = Math.round(spriteHeight * 0.85);
            
        } else if (this.type.startsWith('fishman_') && scene.textures.exists('fishman')) {
            // Hommes-poissons - sprite animé avec tint selon le type
            this.sprite = scene.add.sprite(this.path[0].x, this.path[0].y, 'fishman');
            
            // Taille selon le tier (augmentée)
            let fishmanHeight = 48; // Normal (était ENEMY_HEIGHT_NORMAL = 42)
            let fishmanWidth = 46;
            if (config.tier >= 8) {
                fishmanHeight = 64; // Boss
                fishmanWidth = 62;
            } else if (config.tier >= 6) {
                fishmanHeight = 58; // Champion
                fishmanWidth = 56;
            } else if (config.tier >= 4) {
                fishmanHeight = 54; // Elite
                fishmanWidth = 52;
            }
            
            this.sprite.setDisplaySize(fishmanWidth, fishmanHeight);
            this.sprite.setOrigin(0.5, 0.85);
            this.sprite.play('fishman');
            
            // Tint selon le type de fishman
            const fishmanTints = {
                'fishman_grunt': null, // Pas de tint, couleur d'origine
                'fishman_swimmer': 0x00CED1,
                'fishman_spear': 0x2F4F4F,
                'fishman_elite': 0x191970,
                'fishman_berserker': 0xDC143C,
                'fishman_officer': 0x4B0082,
                'fishman_merman': 0x00BFFF,
                'fishman_champion': 0x800080,
                'fishman_shaman': 0x98FB98,
                'fishman_general': 0x4A0080
            };
            
            if (fishmanTints[this.type]) {
                this.sprite.setTint(fishmanTints[this.type]);
            }
            
            spriteHeight = Math.round(fishmanHeight * 0.85);
            
        } else {
            // Cercle pour les autres types (pas encore de sprite)
            // Taille du cercle basée sur le tier
            let circleRadius = 10; // Normal (agrandi)
            if (this.isBoss) {
                circleRadius = 20;
            } else if (this.isMiniBoss) {
                circleRadius = 15;
            } else if (config.tier >= 6) {
                circleRadius = 14;
            } else if (config.tier >= 4) {
                circleRadius = 12;
            }
            
            this.sprite = scene.add.circle(this.path[0].x, this.path[0].y, circleRadius, this.color);
            
            // Bordure dorée pour les boss/mini-boss
            if (this.isBoss) {
                this.sprite.setStrokeStyle(4, 0xffd700);
            } else if (this.isMiniBoss) {
                this.sprite.setStrokeStyle(3, 0xffa500);
            }
            
            spriteHeight = circleRadius * 2;
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
        
        // === BARRES DE VIE ET SHIELD AMÉLIORÉES ===
        this.barWidth = 40; // Légèrement plus large
        this.barHeight = 5; // Plus haute pour meilleure visibilité
        const barY = this.sprite.y - spriteHeight - 8;
        
        // Conteneur graphique pour les barres avec coins arrondis
        this.hpBarContainer = scene.add.graphics();
        this.hpBarContainer.setDepth(this.sprite.depth + 1);
        
        // Fond de la barre de vie (avec ombre)
        this.hpBarBg = scene.add.graphics();
        this.hpBarBg.setDepth(this.sprite.depth + 1);
        this.drawRoundedBar(this.hpBarBg, this.sprite.x - this.barWidth/2, barY, this.barWidth, this.barHeight, 0x0a0a0a, 0.8);
        // Bordure extérieure
        this.hpBarBg.lineStyle(1, 0x333333, 1);
        this.hpBarBg.strokeRoundedRect(this.sprite.x - this.barWidth/2 - 1, barY - 1, this.barWidth + 2, this.barHeight + 2, 2);
        
        // Barre de vie principale (avec effet de dégradé simulé)
        this.hpBar = scene.add.graphics();
        this.hpBar.setDepth(this.sprite.depth + 2);
        
        // Effet de brillance en haut de la barre
        this.hpBarShine = scene.add.graphics();
        this.hpBarShine.setDepth(this.sprite.depth + 3);
        
        // Stocker les positions pour la mise à jour
        this.hpBarY = barY;
        
        // Dessiner la barre initiale
        const initialHpPercent = this.hp / this.maxHp;
        this.updateHpBarVisual(initialHpPercent);
        
        // S'assurer que les barres sont visibles
        this.hpBar.setVisible(true);
        this.hpBarBg.setVisible(true);
        this.hpBarShine.setVisible(true);
        this.hpBarContainer.setVisible(true);
        
        // Barre de bouclier (pour les tanks) - style cristal/énergie
        if (this.maxShield > 0) {
            const shieldY = barY - this.barHeight - 3;
            this.shieldBarY = shieldY;
            
            // Fond du shield avec effet lumineux
            this.shieldBarBg = scene.add.graphics();
            this.shieldBarBg.setDepth(this.sprite.depth + 1);
            this.drawRoundedBar(this.shieldBarBg, this.sprite.x - this.barWidth/2, shieldY, this.barWidth, this.barHeight, 0x0a1628, 0.9);
            this.shieldBarBg.lineStyle(1, 0x1e40af, 0.8);
            this.shieldBarBg.strokeRoundedRect(this.sprite.x - this.barWidth/2 - 1, shieldY - 1, this.barWidth + 2, this.barHeight + 2, 2);
            
            // Barre de shield avec effet cristal
            this.shieldBar = scene.add.graphics();
            this.shieldBar.setDepth(this.sprite.depth + 2);
            
            // Effet de brillance du shield
            this.shieldBarShine = scene.add.graphics();
            this.shieldBarShine.setDepth(this.sprite.depth + 3);
            
            this.updateShieldBarVisual(1);
        }
        
        // Système de brûlure (DOT)
        this.isBurning = false;
        this.burnDamage = 0;
        this.burnDuration = 0;
        this.burnTimer = null;
        this.burnEffect = null;
        
        // Système de poison (DOT)
        this.isPoisoned = false;
        this.poisonDamage = 0;
        this.poisonDuration = 0;
        this.poisonTimer = null;
        this.poisonEffect = null;
        
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
        
        // Mettre à jour les positions des barres (graphiques)
        const yOffset = this.spriteHeight + 8;
        this.hpBarY = this.sprite.y - yOffset;
        
        // Repositionner les graphiques de la barre de vie
        this.hpBarBg.clear();
        this.drawRoundedBar(this.hpBarBg, this.sprite.x - this.barWidth/2, this.hpBarY, this.barWidth, this.barHeight, 0x0a0a0a, 0.8);
        this.hpBarBg.lineStyle(1, 0x333333, 1);
        this.hpBarBg.strokeRoundedRect(this.sprite.x - this.barWidth/2 - 1, this.hpBarY - 1, this.barWidth + 2, this.barHeight + 2, 2);
        this.hpBarBg.setDepth(this.sprite.depth + 1);
        
        // Redessiner la barre de vie à la nouvelle position
        if (this.hpBar && this.hpBarBg) {
            const hpPercent = Math.max(0, this.hp / this.maxHp);
            this.updateHpBarVisual(hpPercent);
            this.hpBar.setDepth(this.sprite.depth + 2);
            this.hpBarShine.setDepth(this.sprite.depth + 3);
            
            // S'assurer que les barres sont visibles
            this.hpBar.setVisible(true);
            this.hpBarBg.setVisible(true);
            if (this.hpBarShine) this.hpBarShine.setVisible(true);
            if (this.hpBarContainer) this.hpBarContainer.setVisible(true);
        }
        
        // Mettre à jour la barre de shield si elle existe
        if (this.shieldBar && this.shield > 0) {
            const shieldYOffset = this.spriteHeight + 8 + this.barHeight + 3;
            this.shieldBarY = this.sprite.y - shieldYOffset;
            
            // Repositionner le fond du shield
            this.shieldBarBg.clear();
            this.drawRoundedBar(this.shieldBarBg, this.sprite.x - this.barWidth/2, this.shieldBarY, this.barWidth, this.barHeight, 0x0a1628, 0.9);
            this.shieldBarBg.lineStyle(1, 0x1e40af, 0.8);
            this.shieldBarBg.strokeRoundedRect(this.sprite.x - this.barWidth/2 - 1, this.shieldBarY - 1, this.barWidth + 2, this.barHeight + 2, 2);
            this.shieldBarBg.setDepth(this.sprite.depth + 1);
            
            // Redessiner la barre de shield
            const shieldPercent = Math.max(0, this.shield / this.maxShield);
            this.updateShieldBarVisual(shieldPercent);
            this.shieldBar.setDepth(this.sprite.depth + 2);
            if (this.shieldBarShine) this.shieldBarShine.setDepth(this.sprite.depth + 3);
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
        
        // Régénération de HP (si regen > 0)
        if (this.regen > 0 && this.hp < this.maxHp) {
            // Regen par seconde, donc on divise par 1000 et multiplie par delta
            const regenAmount = this.regen * (delta / 1000) * gameSpeed;
            this.hp = Math.min(this.maxHp, this.hp + regenAmount);
            this.updateHpBar();
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
        
        // Mettre à jour l'effet de poison
        if (this.poisonEffect) {
            this.poisonEffect.x = this.sprite.x;
            this.poisonEffect.y = this.sprite.y;
            this.poisonEffect.setDepth(this.sprite.depth - 0.5);
        }
        
        // Mettre à jour l'effet de stun
        if (this.stunEffect) {
            this.stunEffect.x = this.sprite.x;
            this.stunEffect.y = this.sprite.y - this.spriteHeight - 15;
            this.stunEffect.setDepth(this.sprite.depth + 4);
        }
    }

    takeDamage(damage) {
        // Les dégâts sont appliqués directement (système d'armure supprimé)
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
        // Vérifier si le sprite a la méthode setTint (= c'est un sprite, pas un cercle)
        if (this.sprite && typeof this.sprite.setTint === 'function') {
            // Pour les sprites : utiliser tint (sauf si brûlé)
            if (!this.isBurning) {
                // Tint bleu si shield, rouge sinon
                const tintColor = (this.shield > 0) ? 0x00aaff : 0xff0000;
                this.sprite.setTint(tintColor);
                this.scene.time.delayedCall(100, () => {
                    if (this.sprite && typeof this.sprite.clearTint === 'function' && !this.isBurning) {
                        this.sprite.clearTint();
                    }
                });
            }
        } else if (this.sprite && typeof this.sprite.setFillStyle === 'function') {
            // Pour les cercles : utiliser fillStyle
            const originalColor = this.color;
            this.sprite.setFillStyle(0xff0000);
            this.scene.time.delayedCall(100, () => {
                if (this.sprite && typeof this.sprite.setFillStyle === 'function') {
                    this.sprite.setFillStyle(originalColor);
                }
            });
        }
        
        this.updateHpBar();
        
        if (this.hp <= 0 && !this.isDying) {
            this.alive = false;
            this.isDying = true; // Marquer comme en train de mourir
            this.stopBurn();
            this.stopPoison();
            this.stopStun();
            this.playDeathAnimation();
        }
    }
    
    updateHpBar() {
        // Mettre à jour la barre de vie avec le nouveau visuel
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        this.updateHpBarVisual(hpPercent);
    }
    
    updateShieldBar() {
        if (!this.shieldBar || this.maxShield <= 0) return;
        
        const shieldPercent = Math.max(0, this.shield / this.maxShield);
        this.updateShieldBarVisual(shieldPercent);
        
        // Cacher la barre si le shield est à 0
        if (this.shield <= 0) {
            this.shieldBar.setVisible(false);
            this.shieldBarBg.setVisible(false);
            if (this.shieldBarShine) this.shieldBarShine.setVisible(false);
        }
    }
    
    // === MÉTHODES DE DESSIN DES BARRES AMÉLIORÉES ===
    
    /**
     * Dessine un rectangle arrondi rempli
     */
    drawRoundedBar(graphics, x, y, width, height, color, alpha = 1) {
        graphics.fillStyle(color, alpha);
        graphics.fillRoundedRect(x, y, width, height, 2);
    }
    
    /**
     * Met à jour le visuel de la barre de vie avec dégradé et brillance
     */
    updateHpBarVisual(percent) {
        const barX = this.sprite.x - this.barWidth / 2;
        const barY = this.hpBarY;
        const currentWidth = Math.max(1, this.barWidth * percent);
        
        // Choisir les couleurs selon le pourcentage
        let mainColor, darkColor, shineColor;
        if (percent > 0.6) {
            mainColor = 0x22c55e;    // Vert
            darkColor = 0x166534;    // Vert foncé
            shineColor = 0x4ade80;   // Vert clair
        } else if (percent > 0.3) {
            mainColor = 0xf59e0b;    // Orange
            darkColor = 0xb45309;    // Orange foncé
            shineColor = 0xfbbf24;   // Jaune
        } else {
            mainColor = 0xef4444;    // Rouge
            darkColor = 0xb91c1c;    // Rouge foncé
            shineColor = 0xf87171;   // Rouge clair
        }
        
        // Effacer et redessiner la barre
        this.hpBar.clear();
        
        // Partie basse (plus sombre)
        this.hpBar.fillStyle(darkColor, 1);
        this.hpBar.fillRoundedRect(barX, barY + this.barHeight * 0.5, currentWidth, this.barHeight * 0.5, 2);
        
        // Partie haute (couleur principale)
        this.hpBar.fillStyle(mainColor, 1);
        this.hpBar.fillRoundedRect(barX, barY, currentWidth, this.barHeight * 0.6, 2);
        
        // Effet de brillance en haut
        this.hpBarShine.clear();
        if (currentWidth > 4) {
            this.hpBarShine.fillStyle(shineColor, 0.5);
            this.hpBarShine.fillRoundedRect(barX + 1, barY + 1, currentWidth - 2, 2, 1);
        }
    }
    
    /**
     * Met à jour le visuel de la barre de shield avec effet cristal
     */
    updateShieldBarVisual(percent) {
        if (!this.shieldBar) return;
        
        const barX = this.sprite.x - this.barWidth / 2;
        const barY = this.shieldBarY;
        const currentWidth = Math.max(1, this.barWidth * percent);
        
        // Couleurs du shield (bleu cristal)
        const mainColor = 0x3b82f6;
        const darkColor = 0x1e40af;
        const shineColor = 0x93c5fd;
        
        // Effacer et redessiner
        this.shieldBar.clear();
        
        // Partie basse
        this.shieldBar.fillStyle(darkColor, 1);
        this.shieldBar.fillRoundedRect(barX, barY + this.barHeight * 0.5, currentWidth, this.barHeight * 0.5, 2);
        
        // Partie haute
        this.shieldBar.fillStyle(mainColor, 1);
        this.shieldBar.fillRoundedRect(barX, barY, currentWidth, this.barHeight * 0.6, 2);
        
        // Brillance
        if (this.shieldBarShine) {
            this.shieldBarShine.clear();
            if (currentWidth > 4) {
                this.shieldBarShine.fillStyle(shineColor, 0.6);
                this.shieldBarShine.fillRoundedRect(barX + 1, barY + 1, currentWidth - 2, 2, 1);
            }
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
        // Calculer les dégâts de brûlure : 1% des PV max par tick
        this.burnDamage = Math.max(1, Math.floor(this.maxHp * 0.01));
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
        const enemy = this; // Capturer la référence explicitement
        this.burnTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: function() {
                if (!enemy.alive || !enemy.isBurning) {
                    enemy.stopBurn();
                    return;
                }
                
                // Appliquer les dégâts de brûlure (1% des PV max)
                // Recalculer à chaque tick au cas où maxHp change (peu probable mais sécurisé)
                const burnDamage = Math.max(1, Math.floor(enemy.maxHp * 0.01));
                enemy.burnDamage = burnDamage; // Mettre à jour pour l'affichage visuel
                enemy.hp -= burnDamage;
                
                // Mettre à jour les stats de la tour source
                if (enemy.burnSourceTower) {
                    enemy.burnSourceTower.totalDamage += burnDamage;
                }
                
                // Effet visuel de tick de brûlure
                enemy.showBurnDamageTick();
                
                enemy.updateHpBar();
                
                // Réduire le temps restant
                enemy.burnTimeRemaining -= 1;
                
                if (enemy.hp <= 0) {
                    enemy.alive = false;
                    if (enemy.burnSourceTower) {
                        enemy.burnSourceTower.enemyKills++;
                    }
                    enemy.stopBurn();
                    enemy.playDeathAnimation();
                } else if (enemy.burnTimeRemaining <= 0) {
                    enemy.stopBurn();
                }
            },
            callbackScope: this,
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
        if (this.sprite && this.sprite.clearTint && !this.isStunned && !this.isPoisoned) {
            this.sprite.clearTint();
        }
    }
    
    // ==================== SYSTÈME DE POISON ====================
    
    /**
     * Applique un effet de poison sur l'ennemi
     * @param {number} damagePerTick - Dégâts par seconde
     * @param {number} duration - Durée en secondes
     * @param {Tower} sourceTower - Tour source (pour les stats)
     */
    applyPoison(damagePerTick, duration, sourceTower = null) {
        this.poisonDamage = damagePerTick;
        this.poisonDuration = duration;
        this.poisonSourceTower = sourceTower;
        
        // Si déjà empoisonné, rafraîchir la durée
        if (this.isPoisoned) {
            this.poisonTimeRemaining = duration;
            return;
        }
        
        this.isPoisoned = true;
        this.poisonTimeRemaining = duration;
        
        // Créer l'effet visuel
        this.createPoisonEffect();
        
        // Appliquer un tint vert
        if (this.sprite && typeof this.sprite.setTint === 'function') {
            this.sprite.setTint(0x00ff00);
        }
        
        // Timer pour les dégâts de poison (chaque seconde)
        const enemy = this; // Capturer la référence explicitement
        this.poisonTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: function() {
                if (!enemy.alive || !enemy.isPoisoned) {
                    enemy.stopPoison();
                    return;
                }
                
                // Appliquer les dégâts
                enemy.hp -= enemy.poisonDamage;
                
                // Mettre à jour les stats de la tour source
                if (enemy.poisonSourceTower) {
                    enemy.poisonSourceTower.totalDamage += enemy.poisonDamage;
                }
                
                // Afficher le tick de dégât
                enemy.showPoisonDamageTick();
                
                // Mettre à jour la barre de vie
                enemy.updateHpBar();
                
                // Décrémenter le temps restant
                enemy.poisonTimeRemaining -= 1;
                
                // Vérifier si l'ennemi meurt
                if (enemy.hp <= 0) {
                    enemy.alive = false;
                    if (enemy.poisonSourceTower) {
                        enemy.poisonSourceTower.enemyKills++;
                    }
                    enemy.stopPoison();
                    enemy.playDeathAnimation();
                } else if (enemy.poisonTimeRemaining <= 0) {
                    enemy.stopPoison();
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    
    createPoisonEffect() {
        // Supprimer l'ancien effet s'il existe
        if (this.poisonEffect) {
            this.poisonEffect.destroy();
        }
        
        // Créer un cercle vert pulsant autour de l'ennemi
        this.poisonEffect = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            this.sprite.displayWidth / 2 + 8,
            0x00ff00,
            0.2
        );
        this.poisonEffect.setDepth(this.sprite.depth - 0.5);
        this.poisonEffect.setStrokeStyle(2, 0x00ff00, 0.6);
        
        // Animation pulsante
        this.scene.tweens.add({
            targets: this.poisonEffect,
            alpha: 0.4,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    showPoisonDamageTick() {
        if (!this.sprite || !this.sprite.active) return;
        
        // Afficher un petit texte de dégât vert
        const damageText = this.scene.add.text(
            this.sprite.x + Phaser.Math.Between(-10, 10),
            this.sprite.y - 20,
            `-${this.poisonDamage} ☠️`,
            {
                fontSize: '12px',
                color: '#00ff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        damageText.setOrigin(0.5);
        damageText.setDepth(100);
        
        // Animation de montée et disparition
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 25,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => {
                damageText.destroy();
            }
        });
    }
    
    stopPoison() {
        this.isPoisoned = false;
        
        // Arrêter le timer
        if (this.poisonTimer) {
            this.poisonTimer.destroy();
            this.poisonTimer = null;
        }
        
        // Supprimer l'effet visuel
        if (this.poisonEffect) {
            this.poisonEffect.destroy();
            this.poisonEffect = null;
        }
        
        // Enlever le tint si le sprite existe encore et pas d'autres effets
        if (this.sprite && this.sprite.clearTint && !this.isStunned && !this.isBurning) {
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
        // Éviter les appels multiples
        if (this.isDying && !this.alive) {
            return;
        }
        
        // Vérifier que le sprite et la scène existent toujours
        if (!this.sprite || !this.scene || !this.sprite.scene) {
            // Si le sprite ou la scène n'existent plus, détruire directement
            this.destroy();
            return;
        }
        
        // Masquer toutes les barres et éléments visuels immédiatement
        if (this.hpBar) this.hpBar.setVisible(false);
        if (this.hpBarBg) this.hpBarBg.setVisible(false);
        if (this.hpBarShine) this.hpBarShine.setVisible(false);
        if (this.hpBarContainer) this.hpBarContainer.setVisible(false);
        if (this.shieldBar) this.shieldBar.setVisible(false);
        if (this.shieldBarBg) this.shieldBarBg.setVisible(false);
        if (this.shieldBarShine) this.shieldBarShine.setVisible(false);
        if (this.nameText) this.nameText.setVisible(false);
        if (this.shieldVisual) this.shieldVisual.setVisible(false);
        if (this.speedTrail) this.speedTrail.setVisible(false);
        
        // Animation de mort pour pirate_basic (épée)
        if (this.type === 'pirate_basic' && this.scene && this.scene.textures && this.scene.textures.exists('swd_pirate_death')) {
            try {
            // Arrêter l'animation actuelle
            if (this.sprite.anims) {
                this.sprite.stop();
            }
            
            // Remplacer par le sprite de mort
            this.sprite.setTexture('swd_pirate_death', 0);
                this.sprite.setDisplaySize(30, 36); // Taille harmonisée avec la vie
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
                if (typeof this.sprite.clearTint === 'function') {
            this.sprite.clearTint();
                }
            
            // Jouer l'animation de mort (2 frames en 1 seconde)
            this.sprite.play('swd_pirate_death_anim');
            
            // Détruire après la fin de l'animation
            this.sprite.once('animationcomplete', () => {
                    if (this.destroy) {
                this.destroy();
                    }
                });
                // Sécurité : détruire après un délai maximum si l'animation ne se termine pas
                this.scene.time.delayedCall(2000, () => {
                    if (this.sprite && this.sprite.scene && !this.destroyed) {
                        if (this.destroy) {
                            this.destroy();
                        }
                    }
                });
            } catch (e) {
                console.error('[Enemy] Erreur lors de l\'animation de mort pirate_basic:', e);
                // En cas d'erreur, détruire directement
                this.destroy();
            }
        } 
        // Animation de mort pour pirate_fast (pistolet)
        else if (this.type === 'pirate_fast' && this.scene && this.scene.textures && this.scene.textures.exists('gun_pirate_death')) {
            try {
            // Arrêter l'animation actuelle
            if (this.sprite.anims) {
                this.sprite.stop();
            }
            
            // Remplacer par le sprite de mort
            this.sprite.setTexture('gun_pirate_death', 0);
                this.sprite.setDisplaySize(30, 34); // Taille harmonisée avec la vie
            this.sprite.setOrigin(0.5, 0.85); // Ancrer aux pieds
                if (typeof this.sprite.clearTint === 'function') {
            this.sprite.clearTint(); // Enlever le tint orange
                }
            
            // Jouer l'animation de mort (5 frames en 1 seconde)
            this.sprite.play('gun_pirate_death_anim');
            
            // Détruire après la fin de l'animation
            this.sprite.once('animationcomplete', () => {
                    if (this.destroy) {
                this.destroy();
                    }
                });
                // Sécurité : détruire après un délai maximum si l'animation ne se termine pas
                this.scene.time.delayedCall(2000, () => {
                    if (this.sprite && this.sprite.scene && !this.destroyed) {
                        if (this.destroy) {
                    this.destroy();
                        }
                    }
                });
            } catch (e) {
                console.error('[Enemy] Erreur lors de l\'animation de mort pirate_fast:', e);
                // En cas d'erreur, détruire directement
                this.destroy();
            }
        } else {
            // Pour les autres ennemis : destruction immédiate (pas de fade out pour éviter les problèmes)
            // Détruire directement pour que l'ennemi disparaisse immédiatement
            if (this.destroy) {
                this.destroy();
            }
        }
    }

    destroy() {
        // Éviter les appels multiples
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        
        this.stopBurn(); // Arrêter la brûlure avant de détruire
        this.stopPoison(); // Arrêter le poison avant de détruire
        this.stopStun(); // Arrêter le stun avant de détruire
        if (this.sprite) this.sprite.destroy();
        // Barres de vie (graphiques)
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.hpBarShine) this.hpBarShine.destroy();
        if (this.hpBarContainer) this.hpBarContainer.destroy();
        // Barres de shield (graphiques)
        if (this.shieldBar) this.shieldBar.destroy();
        if (this.shieldBarBg) this.shieldBarBg.destroy();
        if (this.shieldBarShine) this.shieldBarShine.destroy();
        // Autres éléments
        if (this.nameText) this.nameText.destroy();
        if (this.shieldVisual) this.shieldVisual.destroy();
        if (this.speedTrail) this.speedTrail.destroy();
    }

    reachEnd(player) {
        this.destroy();
        player.loseHp();
    }
}

