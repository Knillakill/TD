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

        // Sprite principal (cercle coloré pour l'instant)
        this.sprite = scene.add.circle(this.path[0].x, this.path[0].y, this.size, this.color);
        this.sprite.setDepth(5);
        this.sprite.setInteractive({ useHandCursor: true });
        
        // Texte du nom (caché par défaut)
        this.nameText = scene.add.text(
            this.sprite.x,
            this.sprite.y - this.size - 25,
            this.name,
            {
                fontSize: '12px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 5, y: 2 }
            }
        );
        this.nameText.setOrigin(0.5);
        this.nameText.setDepth(8);
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
        
        // Barre de vie (plus large pour les ennemis avec plus de HP)
        const barWidth = Math.max(20, this.maxHp * 2);
        this.hpBarBg = scene.add.rectangle(
            this.sprite.x, 
            this.sprite.y - this.size - 8, 
            barWidth, 
            4, 
            0x000000,
            0.5
        );
        this.hpBarBg.setDepth(6);
        
        this.hpBar = scene.add.rectangle(
            this.sprite.x, 
            this.sprite.y - this.size - 8, 
            barWidth, 
            4, 
            0x00ff00
        );
        this.hpBar.setDepth(7);
    }
    
    createVisualEffects() {
        // Ajouter des effets visuels selon le type
        if (this.type === 'pirate_shield') {
            // Cercle de bouclier
            this.shield = this.scene.add.circle(
                this.sprite.x, 
                this.sprite.y, 
                this.size + 4, 
                0xc0c0c0,
                0
            );
            this.shield.setStrokeStyle(2, 0xc0c0c0, 0.6);
            this.shield.setDepth(4);
        } else if (this.type === 'pirate_fast') {
            // Traînée de vitesse
            this.speedTrail = this.scene.add.circle(
                this.sprite.x - 5, 
                this.sprite.y, 
                this.size - 2, 
                this.color,
                0.3
            );
            this.speedTrail.setDepth(4);
        }
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
        
        // Mettre à jour les positions des éléments visuels
        const yOffset = this.size + 8;
        this.hpBar.x = this.sprite.x;
        this.hpBar.y = this.sprite.y - yOffset;
        this.hpBarBg.x = this.sprite.x;
        this.hpBarBg.y = this.sprite.y - yOffset;
        this.nameText.x = this.sprite.x;
        this.nameText.y = this.sprite.y - this.size - 25;
        
        // Mettre à jour les effets visuels
        if (this.shield) {
            this.shield.x = this.sprite.x;
            this.shield.y = this.sprite.y;
        }
        
        if (this.speedTrail) {
            // Traînée légèrement en retard
            this.speedTrail.x = this.sprite.x - vx * 0.5;
            this.speedTrail.y = this.sprite.y - vy * 0.5;
        }
    }

    takeDamage(damage) {
        this.hp -= damage;
        
        // Effet visuel de dégâts (flash rouge pour les cercles)
        const originalColor = this.color;
        this.sprite.setFillStyle(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.sprite) {
                this.sprite.setFillStyle(originalColor);
            }
        });
        
        // Mettre à jour la barre de vie
        const hpPercent = Math.max(0, this.hp / this.maxHp);
        const barWidth = Math.max(20, this.maxHp * 2);
        this.hpBar.width = barWidth * hpPercent;
        
        // Changer la couleur selon les HP
        if (hpPercent > 0.5) {
            this.hpBar.fillColor = 0x00ff00; // Vert
        } else if (hpPercent > 0.25) {
            this.hpBar.fillColor = 0xffff00; // Jaune
        } else {
            this.hpBar.fillColor = 0xff0000; // Rouge
        }
        
        if (this.hp <= 0) {
            this.alive = false;
            this.destroy();
        }
    }
    
    getReward() {
        return this.reward;
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

