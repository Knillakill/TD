class Tower {
    constructor(scene, x = 300, y = 300, type = 'basic', towerData = null) {
        this.scene = scene;
        this.type = type;
        
        // Utiliser les données fournies ou les valeurs par défaut
        if (towerData) {
            this.range = towerData.range;
            this.damage = towerData.damage;
            this.fireRate = towerData.fireRate;
            this.color = towerData.color;
        } else {
            this.range = 100;
            this.damage = 1;
            this.fireRate = 1000;
            this.color = 0x00ff00;
        }
        
        this.lastShot = 0;
        this.x = x;
        this.y = y;

        // Sprite de la tour (image si disponible, sinon rectangle)
        if (scene.textures.exists(this.type)) {
            this.sprite = scene.add.image(x, y, this.type);
            this.sprite.setDisplaySize(50, 50); // Taille du sprite
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
        });
        
        this.sprite.on('pointerout', () => {
            this.rangeCircle.setFillStyle(this.color, 0);
            this.rangeCircle.setStrokeStyle(2, this.color, 0);
        });
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
            // Créer un projectile
            const projectile = new Projectile(
                this.scene, 
                this.sprite.x, 
                this.sprite.y, 
                enemy, 
                this.damage,
                this.color
            );
            this.lastShot = time + this.fireRate;
            return projectile;
        }
        return null;
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.rangeCircle) this.rangeCircle.destroy();
    }
}

