class WaveControl {
    constructor(scene) {
        this.scene = scene;
        this.autoPlay = false;
        
        // Position juste au-dessus du trait noir (séparateur avant les stats vie)
        const panelX = 10;
        const panelY = 680;  // Sous le TopMenu
        const panelWidth = 280;
        
        // Bouton "Lancer Vague"
        this.startWaveButton = scene.add.rectangle(
            panelX + 10,
            panelY,
            125,
            35,
            0x2ecc71
        );
        this.startWaveButton.setOrigin(0, 0);
        this.startWaveButton.setDepth(101);
        this.startWaveButton.setInteractive({ useHandCursor: true });
        this.startWaveButton.setScrollFactor(0);
        
        this.startWaveText = scene.add.text(
            panelX + 72,
            panelY + 17,
            '▶ VAGUE',
            {
                fontSize: '14px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.startWaveText.setOrigin(0.5);
        this.startWaveText.setDepth(102);
        this.startWaveText.setScrollFactor(0);
        
        // Bouton "Auto-Play"
        this.autoPlayButton = scene.add.rectangle(
            panelX + 145,
            panelY,
            125,
            35,
            0x95a5a6
        );
        this.autoPlayButton.setOrigin(0, 0);
        this.autoPlayButton.setDepth(101);
        this.autoPlayButton.setInteractive({ useHandCursor: true });
        this.autoPlayButton.setScrollFactor(0);
        
        this.autoPlayText = scene.add.text(
            panelX + 207,
            panelY + 17,
            'AUTO',
            {
                fontSize: '14px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        );
        this.autoPlayText.setOrigin(0.5);
        this.autoPlayText.setDepth(102);
        this.autoPlayText.setScrollFactor(0);
        
        // Événements
        this.startWaveButton.on('pointerdown', () => {
            this.startNextWave();
        });
        
        this.startWaveButton.on('pointerover', () => {
            this.startWaveButton.setFillStyle(0x27ae60);
        });
        
        this.startWaveButton.on('pointerout', () => {
            this.startWaveButton.setFillStyle(0x2ecc71);
        });
        
        this.autoPlayButton.on('pointerdown', () => {
            this.toggleAutoPlay();
        });
        
        this.autoPlayButton.on('pointerover', () => {
            const color = this.autoPlay ? 0x2980b9 : 0x7f8c8d;
            this.autoPlayButton.setFillStyle(color);
        });
        
        this.autoPlayButton.on('pointerout', () => {
            const color = this.autoPlay ? 0x3498db : 0x95a5a6;
            this.autoPlayButton.setFillStyle(color);
        });
    }
    
    startNextWave() {
        if (this.scene.waveManager) {
            // Vérifier si on peut lancer la vague
            if (!this.scene.waveManager.waveInProgress && 
                this.scene.waveManager.enemiesRemainingInWave === 0) {
                this.scene.waveManager.startNextWave();
            } else if (this.scene.waveManager.waveInProgress) {
                this.scene.ui.showMessage('Vague en cours!', 1000);
            } else {
                this.scene.ui.showMessage('Terminez la vague actuelle!', 1000);
            }
        }
    }
    
    toggleAutoPlay() {
        this.autoPlay = !this.autoPlay;
        
        if (this.autoPlay) {
            this.autoPlayButton.setFillStyle(0x3498db);
            this.autoPlayText.setText('AUTO ✓');
            this.scene.ui.showMessage('Auto-Play activé', 1000);
        } else {
            this.autoPlayButton.setFillStyle(0x95a5a6);
            this.autoPlayText.setText('AUTO');
            this.scene.ui.showMessage('Auto-Play désactivé', 1000);
        }
    }
    
    update() {
        // Si auto-play est activé et qu'on peut lancer la vague
        if (this.autoPlay && 
            this.scene.waveManager &&
            !this.scene.waveManager.waveInProgress && 
            this.scene.waveManager.enemiesRemainingInWave === 0 &&
            this.scene.enemies.length === 0) {
            
            // Lancer automatiquement la prochaine vague après un court délai
            if (!this.autoPlayTimer) {
                this.autoPlayTimer = this.scene.time.now;
            }
            
            if (this.scene.time.now > this.autoPlayTimer + 2000) {
                this.scene.waveManager.startNextWave();
                this.autoPlayTimer = null;
            }
        } else {
            this.autoPlayTimer = null;
        }
        
        // Désactiver le bouton pendant la vague
        if (this.scene.waveManager && this.scene.waveManager.waveInProgress) {
            this.startWaveButton.setAlpha(0.5);
            this.startWaveButton.disableInteractive();
        } else {
            this.startWaveButton.setAlpha(1);
            this.startWaveButton.setInteractive({ useHandCursor: true });
        }
    }
}

