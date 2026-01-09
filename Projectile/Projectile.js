class Projectile {
    constructor(scene, x, y, target, damage, color = 0xffff00, tower = null) {
        this.scene = scene;
        this.target = target;
        this.damage = damage;
        this.speed = 200;
        this.active = true;
        this.tower = tower; // Référence à la tour pour les stats
        this.towerType = tower ? tower.type : null;

        // Utiliser un sprite animé pour Luffy (poing qui vole)
        if (this.towerType === 'luffy' && scene.textures.exists('luffy_projectile')) {
            this.sprite = scene.add.sprite(x, y, 'luffy_projectile');
            this.sprite.setDisplaySize(20, 60); // Ratio 24:71, réduit
            this.sprite.play('luffy_projectile');
            
            // Orienter le poing vers la cible
            const angle = Phaser.Math.Angle.Between(x, y, target.sprite.x, target.sprite.y);
            this.sprite.setRotation(angle + Math.PI / 2); // +90° car le sprite pointe vers le haut
        } else {
            this.sprite = scene.add.circle(x, y, 5, color);
        }
        this.sprite.setDepth(5);
    }

    update(delta) {
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
            this.target.takeDamage(this.damage);
            
            // Mettre à jour les stats de la tour
            if (this.tower) {
                this.tower.totalDamage += this.damage;
                if (wasAlive && !this.target.alive) {
                    this.tower.enemyKills++;
                }
            }
            
            this.destroy();
            return false;
        }

        // Déplacement vers la cible (avec multiplicateur de vitesse)
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const vx = (dx / dist) * this.speed * (delta / 1000) * gameSpeed;
        const vy = (dy / dist) * this.speed * (delta / 1000) * gameSpeed;

        this.sprite.x += vx;
        this.sprite.y += vy;

        return true;
    }

    destroy() {
        this.active = false;
        if (this.sprite) {
            this.sprite.destroy();
        }
    }
}

