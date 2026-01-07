class Projectile {
    constructor(scene, x, y, target, damage, color = 0xffff00) {
        this.scene = scene;
        this.target = target;
        this.damage = damage;
        this.speed = 200;
        this.active = true;

        this.sprite = scene.add.circle(x, y, 5, color);
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
            this.target.takeDamage(this.damage);
            this.destroy();
            return false;
        }

        // Déplacement vers la cible
        const vx = (dx / dist) * this.speed * (delta / 1000);
        const vy = (dy / dist) * this.speed * (delta / 1000);

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

