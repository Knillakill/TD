class UI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        
        const panelX = 320;  // En haut à gauche de la map (300 offset + 20)
        const panelY = 20;
        
        // Fond pour l'interface (en haut à droite)
        this.panel = scene.add.rectangle(panelX, panelY, 200, 80, 0x000000, 0.7);
        this.panel.setOrigin(0, 0);
        this.panel.setDepth(100);
        
        // Texte pour les HP du joueur
        this.hpText = scene.add.text(panelX + 10, panelY + 10, '', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold'
        });
        this.hpText.setDepth(101);
        
        // Texte pour l'or du joueur
        this.goldText = scene.add.text(panelX + 10, panelY + 35, '', {
            fontSize: '18px',
            fill: '#ffff00',
            fontStyle: 'bold'
        });
        this.goldText.setDepth(101);
        
        // Texte pour la vague
        this.waveText = scene.add.text(panelX + 10, panelY + 60, '', {
            fontSize: '14px',
            fill: '#ffffff'
        });
        this.waveText.setDepth(101);
        
        this.update();
    }
    
    update(waveInfo = null) {
        // Mettre à jour les textes
        this.hpText.setText('❤️ HP: ' + this.player.hp);
        this.goldText.setText('💰 Gold: ' + this.player.gold);
        
        if (waveInfo) {
            this.waveText.setText(`Vague ${waveInfo.wave}: ${waveInfo.remaining} restants`);
        } else {
            this.waveText.setText('Vague 1: 5 restants');
        }
        
        // Changer la couleur des HP selon le niveau
        if (this.player.hp > 7) {
            this.hpText.setColor('#00ff00');
        } else if (this.player.hp > 3) {
            this.hpText.setColor('#ffff00');
        } else {
            this.hpText.setColor('#ff0000');
        }
    }
    
    showMessage(message, duration = 2000) {
        const msg = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            message,
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            }
        );
        msg.setOrigin(0.5);
        msg.setDepth(200);
        
        // Faire disparaître le message
        this.scene.time.delayedCall(duration, () => {
            msg.destroy();
        });
    }
}

