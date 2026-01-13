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
        } else if (this.towerType === 'jimbe' && scene.textures.exists('jimbe_projectile')) {
            // Utiliser un sprite animé pour Jimbe (projectile aquatique)
            this.sprite = scene.add.sprite(x, y, 'jimbe_projectile');
            this.sprite.setDisplaySize(30, 45); // Ratio 104x103, réduit
            this.sprite.play('jimbe_projectile');
            
            // Orienter le projectile vers la cible
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
            
            // Pour Usopp, appliquer le poison (15% DPS pendant 8s)
            if (this.towerType === 'ussop' && this.target.alive && this.target.applyPoison) {
                const poisonDamage = Math.max(1, Math.floor(this.damage * 0.15)); // 15% des dégâts par tick
                this.target.applyPoison(poisonDamage, 8, this.tower); // 8 secondes
            }
            
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

// Projectile perçant pour Franky - traverse tous les ennemis sur sa trajectoire
class PiercingProjectile {
    constructor(scene, x, y, target, damage, color = 0x06b6d4, tower = null, maxRange = 1000) {
        this.scene = scene;
        this.target = target;
        this.baseDamage = damage;
        this.speed = 300; // Plus rapide que les projectiles normaux
        this.active = true;
        this.tower = tower;
        this.maxRange = maxRange;
        this.traveledDistance = 0;
        this.hitEnemies = new Set(); // Pour éviter de toucher le même ennemi plusieurs fois
        
        // Calculer l'angle initial vers la cible
        this.angle = Phaser.Math.Angle.Between(x, y, target.sprite.x, target.sprite.y);
        this.startX = x;
        this.startY = y;
        
        // Créer un sprite de laser (ligne épaisse)
        this.sprite = scene.add.graphics();
        this.sprite.lineStyle(8, color, 1);
        this.sprite.beginPath();
        this.sprite.moveTo(x, y);
        this.sprite.lineTo(x + Math.cos(this.angle) * 30, y + Math.sin(this.angle) * 30);
        this.sprite.strokePath();
        this.sprite.setDepth(5);
        
        // Ajouter un cercle lumineux à l'avant
        this.glow = scene.add.circle(x, y, 6, color, 0.9);
        this.glow.setDepth(6);
    }
    
    update(delta) {
        if (!this.active) {
            return false;
        }
        
        // Déplacement en ligne droite
        const gameSpeed = this.scene.waveControl ? this.scene.waveControl.gameSpeed : 1;
        const distance = this.speed * (delta / 1000) * gameSpeed;
        this.traveledDistance += distance;
        
        const dx = Math.cos(this.angle) * distance;
        const dy = Math.sin(this.angle) * distance;
        
        this.sprite.x += dx;
        this.sprite.y += dy;
        this.glow.x += dx;
        this.glow.y += dy;
        
        // Vérifier si on a dépassé la portée maximale
        const totalDist = Phaser.Math.Distance.Between(this.startX, this.startY, this.sprite.x, this.sprite.y);
        if (totalDist >= this.maxRange) {
            this.destroy();
            return false;
        }
        
        // Vérifier les collisions avec tous les ennemis sur la trajectoire
        this.scene.enemies.forEach(enemy => {
            if (!enemy.alive || this.hitEnemies.has(enemy)) return;
            
            const dist = Phaser.Math.Distance.Between(
                this.sprite.x,
                this.sprite.y,
                enemy.sprite.x,
                enemy.sprite.y
            );
            
            // Si on touche un ennemi
            if (dist < 15) {
                this.hitEnemies.add(enemy);
                
                // Calculer les dégâts (doubler si l'ennemi a un bouclier)
                let damage = this.baseDamage;
                if (enemy.shield > 0 || enemy.maxShield > 0) {
                    damage = damage * 2; // Double dégâts sur les ennemis avec bouclier
                }
                
                const wasAlive = enemy.alive;
                enemy.takeDamage(damage);
                
                // Mettre à jour les stats de la tour
                if (this.tower) {
                    this.tower.totalDamage += damage;
                    if (wasAlive && !enemy.alive) {
                        this.tower.enemyKills++;
                    }
                }
                
                // Le projectile continue (perçant)
            }
        });
        
        // Mettre à jour l'affichage du laser
        this.sprite.clear();
        this.sprite.lineStyle(8, 0x06b6d4, 1);
        this.sprite.beginPath();
        this.sprite.moveTo(this.sprite.x - Math.cos(this.angle) * 30, this.sprite.y - Math.sin(this.angle) * 30);
        this.sprite.lineTo(this.sprite.x, this.sprite.y);
        this.sprite.strokePath();
        
        return true;
    }
    
    destroy() {
        this.active = false;
        if (this.sprite) {
            this.sprite.destroy();
        }
        if (this.glow) {
            this.glow.destroy();
        }
    }
}
