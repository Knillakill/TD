class UI {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        // Plus de panneau HP/Gold en haut - tout est dans EnemyInfoPanel maintenant
    }
    
    update(waveInfo = null) {
        // Les stats sont maintenant dans EnemyInfoPanel
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

